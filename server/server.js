import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { searchOpenAlex } from './services/academicSearch.js';
import { calculateConsensusMeter, generateSynthesis, generateFollowUpSynthesis } from './services/consensusEngine.js';
import { assessPaperRiskOfBias, generateGradeSummary, generateDetailedMethodologicalReport } from './services/gradeRiskEngine.js';
import { formatCitations, generateRIS, generateBatchRIS, generateBibTeX, generateBatchBibTeX } from './services/citationEngine.js';
import { translateTextToTurkish } from './services/translationEngine.js';
import { 
  initStorage, 
  getThesisData, 
  saveThesisData, 
  generateLiteratureReview, 
  refineThesisTopic 
} from './services/thesisTools.js';
import {
  buildStudyMatrix,
  performCitationSnowballing,
  auditManuscript,
  auditChecklistCONSORT_STROBE,
  findResearchGaps,
  ingestPrivateDocument
} from './services/proAgentEngine.js';
import { generateThesisWordDocument, generatePrismaWordDocument } from './services/thesisDocxExporter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve frontend build if available
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Initialize persistent storage
initStorage();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Consensus Academic API', timestamp: new Date() });
});

// Search academic papers across federated indexes
app.get('/api/search', async (req, res) => {
  try {
    const { 
      q, 
      page = 1, 
      perPage = 50, 
      yearFrom, 
      yearTo, 
      studyType, 
      minCitations,
      mode = 'all',
      specialty,
      evidenceLevel,
      sourceFilter = 'all'
    } = req.query;

    const cleanQ = (q && typeof q === 'string') ? q.trim() : '';
    if (!cleanQ) {
      return res.status(400).json({ error: 'Search query parameter (q) is required' });
    }

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safePerPage = Math.min(100, Math.max(1, parseInt(perPage, 10) || 50));

    const searchResult = await searchOpenAlex({
      query: cleanQ,
      page: safePage,
      perPage: safePerPage,
      yearFrom,
      yearTo,
      studyType,
      minCitations,
      mode,
      medicalSpecialty: specialty,
      evidenceLevel,
      sourceFilter
    });

    // Compute instant consensus meter & synthesis on the top papers
    const consensus = calculateConsensusMeter(searchResult.papers, q);
    const synthesis = await generateSynthesis(searchResult.papers, q, consensus);
    const gradeSummary = searchResult.gradeSummary || generateGradeSummary(searchResult.papers);

    res.json({
      query: q,
      total: searchResult.total,
      page: searchResult.page,
      perPage: searchResult.perPage,
      federation: searchResult.federation,
      consensus,
      gradeSummary,
      synthesis,
      papers: searchResult.papers,
      optimization: searchResult.optimization
    });
  } catch (err) {
    console.error('Error handling /api/search:', err);
    res.status(500).json({ error: 'Academic search failed', message: err.message });
  }
});

// Follow-up question synthesis within the existing thread context
app.post('/api/thread/follow-up', async (req, res) => {
  try {
    const body = req.body || {};
    const {
      followUpQuery,
      threadTitle,
      originalQuery,
      previousPapers = [],
      previousSynthesis = null,
      mode = 'all'
    } = body;

    if (!followUpQuery || typeof followUpQuery !== 'string' || !followUpQuery.trim()) {
      return res.status(400).json({ error: 'followUpQuery parameter is required' });
    }

    const cleanFollowUp = followUpQuery.trim();
    const contextSubject = originalQuery || threadTitle || '';
    const contextualSearchQuery = `${contextSubject} ${cleanFollowUp}`.trim();

    // Search academic papers for the follow-up question
    const searchResult = await searchOpenAlex({
      query: contextualSearchQuery,
      page: 1,
      perPage: 30,
      mode
    });

    // Merge previous papers (landmark trials) with new papers (deduplicated by clean title)
    const seenTitles = new Set();
    const mergedPapers = [];

    // Prioritize relevant previous papers
    const safePrevPapers = (Array.isArray(previousPapers) ? previousPapers : []).filter(p => p && typeof p === 'object');
    for (const p of safePrevPapers) {
      const cleanTitle = (p.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanTitle && !seenTitles.has(cleanTitle)) {
        seenTitles.add(cleanTitle);
        mergedPapers.push(p);
      }
    }

    // Add newly retrieved papers
    for (const p of (searchResult.papers || [])) {
      if (!p) continue;
      const cleanTitle = (p.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanTitle && !seenTitles.has(cleanTitle)) {
        seenTitles.add(cleanTitle);
        mergedPapers.push(p);
      }
    }

    // Compute consensus for follow-up query
    const consensus = calculateConsensusMeter(mergedPapers, cleanFollowUp);

    // Generate context-aware follow-up synthesis
    const synthesis = await generateFollowUpSynthesis({
      followUpQuery: cleanFollowUp,
      threadTitle,
      originalQuery,
      previousSynthesis,
      papers: mergedPapers,
      consensus
    });

    res.json({
      followUpQuery: cleanFollowUp,
      threadTitle,
      searchSteps: synthesis.searchSteps,
      consensus,
      synthesis,
      papers: mergedPapers
    });
  } catch (err) {
    console.error('Error in /api/thread/follow-up:', err);
    res.status(500).json({ error: 'Follow-up synthesis failed', message: err.message });
  }
});

// Format citations for a paper
app.post('/api/cite', (req, res) => {
  try {
    const { paper } = req.body;
    if (!paper) {
      return res.status(400).json({ error: 'Paper object is required' });
    }
    const citations = formatCitations(paper);
    res.json(citations);
  } catch (err) {
    res.status(500).json({ error: 'Citation formatting failed', message: err.message });
  }
});

// Translate text to Turkish
app.post('/api/translate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const translatedText = await translateTextToTurkish(text);
    res.json({ translatedText });
  } catch (err) {
    res.status(500).json({ error: 'Translation failed', message: err.message });
  }
});

// Export RIS format for Zotero / EndNote / Mendeley
app.post('/api/export-ris', (req, res) => {
  try {
    const { paper, papers } = req.body;
    let risContent = '';
    if (paper) {
      risContent = generateRIS(paper);
    } else if (papers && Array.isArray(papers)) {
      risContent = generateBatchRIS(papers);
    } else {
      return res.status(400).json({ error: 'paper or papers array is required' });
    }
    res.setHeader('Content-Type', 'application/x-research-info-systems; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="consensus_references.ris"');
    res.send(risContent);
  } catch (err) {
    res.status(500).json({ error: 'RIS export failed', message: err.message });
  }
});

// Export formatted Thesis Word Document (.doc / .docx)
app.post('/api/export-thesis-word', (req, res) => {
  try {
    const { title, topic, pico, papers, synthesis, consensus, gradeSummary, citationStyle } = req.body;
    const docHtml = generateThesisWordDocument({
      title,
      topic,
      pico,
      papers: Array.isArray(papers) ? papers : [],
      synthesis,
      consensus,
      gradeSummary,
      citationStyle: citationStyle || 'vancouver'
    });

    const safeFilename = (title || topic || 'KlinikPusula_Tez_Bolumu')
      .replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ_-]/g, '_')
      .slice(0, 50);

    res.setHeader('Content-Type', 'application/msword; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeFilename)}.doc"`);
    res.send(docHtml);
  } catch (err) {
    res.status(500).json({ error: 'Thesis Word export failed', message: err.message });
  }
});

// Export BibTeX (.bib) format for LaTeX / Overleaf / Zotero
app.post('/api/export-bib', (req, res) => {
  try {
    const { paper, papers } = req.body;
    let bibContent = '';
    if (paper) {
      bibContent = generateBibTeX(paper);
    } else if (papers && Array.isArray(papers)) {
      bibContent = generateBatchBibTeX(papers);
    } else {
      return res.status(400).json({ error: 'paper or papers array is required' });
    }
    res.setHeader('Content-Type', 'application/x-bibtex; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="consensus_references.bib"');
    res.send(bibContent);
  } catch (err) {
    res.status(500).json({ error: 'BibTeX export failed', message: err.message });
  }
});

// Export standalone PRISMA 2020 Flow Report (.doc)
app.post('/api/export-prisma-word', (req, res) => {
  try {
    const { query, stats } = req.body;
    const docHtml = generatePrismaWordDocument({
      query: query || 'Klinik_Arastirma',
      stats: stats || {}
    });

    const safeFilename = `PRISMA_2020_${(query || 'Akis_Semasi')
      .replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ_-]/g, '_')
      .slice(0, 45)}`;

    res.setHeader('Content-Type', 'application/msword; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeFilename)}.doc"`);
    res.send(docHtml);
  } catch (err) {
    res.status(500).json({ error: 'PRISMA Word export failed', message: err.message });
  }
});

// AI Peer-Review Checklist Auditor (CONSORT 2010 & STROBE)
app.post('/api/audit-checklist', (req, res) => {
  try {
    const { text, guideline = 'consort' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for checklist audit' });
    }
    const auditReport = auditChecklistCONSORT_STROBE({ text, guideline });
    res.json(auditReport);
  } catch (err) {
    res.status(500).json({ error: 'Checklist audit failed', message: err.message });
  }
});

// Generate Literature Review from selected papers
app.post('/api/literature-review', async (req, res) => {
  try {
    const { papers, thesisTopic, language = 'tr' } = req.body;
    if (!papers || !Array.isArray(papers) || papers.length === 0) {
      return res.status(400).json({ error: 'At least one paper is required' });
    }
    const review = await generateLiteratureReview({ papers, thesisTopic, language });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Literature review generation failed', message: err.message });
  }
});

// Refine thesis topic into research questions and hypotheses
app.post('/api/refine-topic', (req, res) => {
  try {
    const { topic } = req.body;
    const refined = refineThesisTopic(topic);
    res.json(refined);
  } catch (err) {
    res.status(500).json({ error: 'Topic refinement failed', message: err.message });
  }
});

// Get user's Thesis Workspace data
app.get('/api/thesis-workspace', (req, res) => {
  try {
    const data = getThesisData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve thesis data', message: err.message });
  }
});

// Update user's Thesis Workspace data
app.post('/api/thesis-workspace', (req, res) => {
  try {
    const success = saveThesisData(req.body);
    if (success) {
      res.json({ success: true, message: 'Thesis data saved' });
    } else {
      res.status(500).json({ error: 'Failed to save thesis data' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to save thesis data', message: err.message });
  }
});

// Save paper to thesis
app.post('/api/thesis-workspace/save-paper', (req, res) => {
  try {
    const { paper, chapterId = 'chap-2', note = '' } = req.body;
    if (!paper) return res.status(400).json({ error: 'Paper is required' });

    const current = getThesisData();
    current.savedPapers = Array.isArray(current?.savedPapers) ? current.savedPapers : [];
    current.chapters = Array.isArray(current?.chapters) ? current.chapters : [];
    current.notes = (current?.notes && typeof current.notes === 'object') ? current.notes : {};
    
    // Add to savedPapers if not exists
    const exists = current.savedPapers.some(p => p && p.id === paper.id);
    if (!exists) {
      current.savedPapers.push({
        ...paper,
        savedAt: new Date().toISOString()
      });
    }

    // Add to chapter
    const chapter = current.chapters.find(c => c.id === chapterId);
    if (chapter) {
      if (!chapter.papers.includes(paper.id)) {
        chapter.papers.push(paper.id);
      }
    }

    if (note) {
      current.notes[paper.id] = note;
    }

    saveThesisData(current);
    res.json({ success: true, savedPapersCount: current.savedPapers.length, workspace: current });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save paper to thesis', message: err.message });
  }
});

// ==========================================
// CONSENSUS PRO & SCHOLAR AGENT ENDPOINTS
// ==========================================

// 1. Build Study Comparison Matrix
app.post('/api/pro/study-matrix', (req, res) => {
  try {
    const { papers } = req.body;
    if (!papers || !Array.isArray(papers)) {
      return res.status(400).json({ error: 'Papers array is required' });
    }
    const matrix = buildStudyMatrix(papers);
    res.json({ matrix, count: matrix.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to build study matrix', message: err.message });
  }
});

// 2. Citation Snowballing & Seminal Papers Graph
app.get('/api/pro/snowball', async (req, res) => {
  try {
    const { paperId, title, doi } = req.query;
    if (!paperId && !title && !doi) {
      return res.status(400).json({ error: 'paperId, title or doi is required' });
    }
    const snowballResult = await performCitationSnowballing({ paperId, title, doi });
    res.json(snowballResult);
  } catch (err) {
    res.status(500).json({ error: 'Citation snowballing failed', message: err.message });
  }
});

// 3. AI Manuscript Reviewer & Citation Auditor
app.post('/api/pro/audit-manuscript', async (req, res) => {
  try {
    const text = req.body.text || req.body.manuscriptText;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: 'Manuscript text is required' });
    }
    const auditResult = await auditManuscript({ text });
    res.json(auditResult);
  } catch (err) {
    res.status(500).json({ error: 'Manuscript audit failed', message: err.message });
  }
});

// 4. Research Gap Finder
app.post('/api/pro/research-gaps', (req, res) => {
  try {
    const { papers, thesisTopic } = req.body;
    const gaps = findResearchGaps({ papers, thesisTopic });
    res.json(gaps);
  } catch (err) {
    res.status(500).json({ error: 'Research gap analysis failed', message: err.message });
  }
});

// 5. Ingest Private Documents
app.post('/api/pro/upload-doc', (req, res) => {
  try {
    const { filename, title, content, chapterId } = req.body;
    const doc = ingestPrivateDocument({ filename, title, content, chapterId });
    res.json({ success: true, document: doc });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ingest document', message: err.message });
  }
});

// 6. Get Private Documents
app.get('/api/pro/private-docs', (req, res) => {
  try {
    const data = getThesisData();
    res.json({ documents: data.customUploads || [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch private documents', message: err.message });
  }
});

// 7. GRADE Evidence Level & Cochrane RoB 2 / ROBINS-I Analysis
app.post('/api/pro/grade-analysis', (req, res) => {
  try {
    const { papers = [], paper = null } = req.body || {};
    if (paper) {
      const assessment = assessPaperRiskOfBias(paper);
      return res.json({ assessment });
    }
    const safePapers = (Array.isArray(papers) ? papers : []).filter(p => p && typeof p === 'object');
    const summary = generateGradeSummary(safePapers);
    const individual = safePapers.map(p => ({
      id: p.id,
      title: p.title,
      assessment: p.gradeRisk || assessPaperRiskOfBias(p)
    }));
    res.json({ summary, individual, total: safePapers.length });
  } catch (err) {
    res.status(500).json({ error: 'GRADE/RoB analysis failed', message: err.message });
  }
});

// 8. Detailed Methodological Evaluation Report & Cochrane RevMan Matrix
app.post('/api/pro/methodological-report', (req, res) => {
  try {
    const { papers = [], topic = '' } = req.body || {};
    const safePapers = (Array.isArray(papers) ? papers : []).filter(p => p && typeof p === 'object');
    const report = generateDetailedMethodologicalReport(safePapers, topic);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate methodological report', message: err.message });
  }
});

// 9. Export Thesis Section in Word (.doc) format with Vancouver / APA citations
app.post('/api/export-thesis-word', (req, res) => {
  try {
    const {
      title = 'Klinik Araştırma ve Tez Bölümü',
      topic = '',
      pico = null,
      papers = [],
      synthesis = null,
      consensus = null,
      gradeSummary = null,
      citationStyle = 'vancouver'
    } = req.body || {};

    const wordDocHtml = generateThesisWordDocument({
      title,
      topic,
      pico,
      papers,
      synthesis,
      consensus,
      gradeSummary,
      citationStyle
    });

    const safeFilename = encodeURIComponent((title || topic || 'KlinikPusula_Tez_Bolumu').replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ_-]/g, '_').slice(0, 45));

    res.setHeader('Content-Type', 'application/msword; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.doc"`);
    res.status(200).send(wordDocHtml);
  } catch (err) {
    console.error('Error generating Word thesis document:', err);
    res.status(500).json({ error: 'Word belgesi oluşturulamadı', message: err.message });
  }
});

// SPA Fallback for direct browser visits
if (fs.existsSync(clientDistPath)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Consensus Academic API] running on http://localhost:${PORT}`);
});

