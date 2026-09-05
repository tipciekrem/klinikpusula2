/**
 * Semantic Scholar (S2) Search Engine
 * Connects to Allen Institute for AI's Semantic Scholar Graph API (210,000,000+ papers).
 * Features native neural TLDRs, citation counts, and open access links.
 */

import { detectStudyType, extractSampleSize } from './academicSearch.js';

export async function searchSemanticScholar(query, limit = 25, offset = 0) {
  try {
    const encoded = encodeURIComponent(query);
    const fields = 'paperId,title,abstract,authors,year,citationCount,isOpenAccess,openAccessPdf,tldr,fieldsOfStudy,publicationTypes';
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encoded}&offset=${offset}&limit=${limit}&fields=${fields}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'ConsensusAcademic/1.0 (academic research thesis assistant)'
      },
      signal: AbortSignal.timeout(6000)
    });

    if (!res.ok) {
      console.warn(`[Semantic Scholar] API responded with ${res.status}`);
      return { papers: [], total: 0 };
    }

    const data = await res.json();
    const total = data.total || 0;
    const rawPapers = data.data || [];

    const papers = rawPapers.map(item => {
      const title = item.title || 'Untitled';
      const abstract = item.abstract || '';
      const authors = (item.authors || []).map(a => a?.name || (typeof a === 'string' ? a : '')).filter(Boolean);
      const year = item.year || new Date().getFullYear();
      const citations = item.citationCount || 0;
      const isOpenAccess = Boolean(item.isOpenAccess || item.openAccessPdf?.url);
      const pdfUrl = item.openAccessPdf?.url || null;
      const tldr = item.tldr?.text || null;

      const studyType = (Array.isArray(item.publicationTypes) && item.publicationTypes[0]) || detectStudyType(title, abstract);
      const sampleSize = extractSampleSize(abstract);

      return {
        id: `s2_${item.paperId}`,
        paperId: item.paperId,
        title,
        authors,
        year,
        journal: (Array.isArray(item.fieldsOfStudy) && item.fieldsOfStudy.join(', ')) || 'Semantic Scholar Index',
        citations,
        citationCount: citations,
        abstract,
        keyTakeaway: tldr || (abstract ? abstract.slice(0, 200) + '...' : title),
        studyType,
        sampleSize,
        isOpenAccess,
        pdfUrl,
        doi: null,
        pmid: null,
        source: 'Semantic Scholar (210M+)',
        sourceBadge: 'S2'
      };
    });

    return { papers, total };
  } catch (err) {
    console.error('[Semantic Scholar] Search error:', err.message);
    return { papers: [], total: 0 };
  }
}
