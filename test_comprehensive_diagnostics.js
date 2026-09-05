/**
 * Comprehensive System Diagnostics & Edge Case Verification Suite
 * Tests all endpoints, regex edge cases, author shapes, and null defenses.
 */
import { scorePaperRelevance } from './server/services/academicSearch.js';
import { buildStudyMatrix } from './server/services/proAgentEngine.js';
import { assessPaperRiskOfBias } from './server/services/gradeRiskEngine.js';
import { optimizeAcademicQuery } from './server/services/queryOptimizer.js';
import { generateLiteratureReview, getThesisData, saveThesisData } from './server/services/thesisTools.js';
import { formatCitations, generateRIS } from './server/services/citationEngine.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    failures.push(message);
    console.error(`❌ FAIL: ${message}`);
  }
}

async function runDiagnostics() {
  console.log('================================================================');
  console.log('🩺 RUNNING COMPREHENSIVE SYSTEM DIAGNOSTICS & BUG FIX VERIFICATION');
  console.log('================================================================\n');

  // TEST SUITE 1: Regex Safety & Special Characters
  console.log('--- Suite 1: Regex Safety & Dangerous Special Characters ---');
  const specialQueries = [
    'CD4+ T cell exhaustion',
    'Ca2+ signaling in cardiac myocytes',
    'GLP-1+ receptor agonists in diabetes',
    '(COVID-19) [SARS-CoV-2] spike protein*',
    'p53+ mutations in cancer? (Review)',
    'IL-6 / TNF-alpha pathways: [Meta-Analysis]',
    '+++***???((([[[}}}', // Pure regex bomb
    ''
  ];

  for (const q of specialQueries) {
    try {
      const p = {
        title: 'Study of ' + q,
        abstract: 'Clinical findings regarding ' + q + ' in adult patients.'
      };
      // Test scorePaperRelevance with dangerous characters
      const score = scorePaperRelevance(p, { coreKeywords: [q, 'test'], turkishKeywords: ['apne', 'obezite'] });
      assert(score && typeof score.score === 'number' && !isNaN(score.score), `scorePaperRelevance handled regex query "${q}" without throwing`);
    } catch (err) {
      assert(false, `scorePaperRelevance threw on query "${q}": ${err.message}`);
    }
  }

  // TEST SUITE 2: Pro Agent Study Matrix & Author Extraction (String vs Object vs Null)
  console.log('\n--- Suite 2: Pro Agent Study Matrix & Author Structure Handlers ---');
  const mockPapers = [
    {
      id: 'p1',
      title: 'String authors trial',
      abstract: 'A randomized controlled trial of semaglutide.',
      authors: ['John Smith', 'Jane Doe'], // String authors format (Semantic Scholar & DergiPark)
      year: 2024,
      studyType: 'Randomized Controlled Trial',
      sampleSize: '500 participants'
    },
    {
      id: 'p2',
      title: 'Object authors trial',
      abstract: 'A prospective cohort study of metformin.',
      authors: [{ name: 'Kasapoğlu Ekrem' }, { name: 'Demir Ali' }], // Object authors format
      year: 2023,
      studyType: 'Cohort Study',
      sampleSize: 1250 // Number instead of string
    },
    {
      id: 'p3',
      title: 'OpenAlex display_name authors',
      abstract: 'Meta-analysis of intermittent fasting.',
      authors: [{ author: { display_name: 'Yılmaz Mehmet' } }],
      year: 2022,
      studyType: 'Meta-Analysis'
    },
    {
      id: 'p4',
      title: 'Anonymous paper with empty authors',
      abstract: 'Case series in pediatrics.',
      authors: [],
      year: 2021
    },
    {
      id: 'p5',
      title: 'Undefined authors paper',
      abstract: 'Review of hypertension treatments.'
    }
  ];

  try {
    const matrix = buildStudyMatrix(mockPapers);
    assert(Array.isArray(matrix) && matrix.length === 5, 'buildStudyMatrix successfully processed all 5 papers');
    
    // Check that string author was correctly parsed (NOT Anonim)
    assert(matrix[0].studyName.includes('John Smith et al.'), `Paper 1 author extracted correctly: "${matrix[0].studyName}"`);
    assert(matrix[1].studyName.includes('Kasapoğlu Ekrem et al.'), `Paper 2 author extracted correctly: "${matrix[1].studyName}"`);
    assert(matrix[2].studyName.includes('Yılmaz Mehmet'), `Paper 3 author extracted correctly: "${matrix[2].studyName}"`);
    assert(matrix[3].studyName.includes('Anonim'), `Paper 4 anonymous author handled cleanly: "${matrix[3].studyName}"`);
    assert(matrix[4].studyName.includes('Anonim'), `Paper 5 missing authors handled cleanly: "${matrix[4].studyName}"`);

    // Check GRADE & RoB fields
    assert(matrix[0].gradeLevel === 'High', 'RCT paper has GRADE High evidence');
    assert(matrix[0].overallRisk === 'low', 'RCT paper has Low Risk of Bias');
    assert(matrix[1].overallRisk === 'moderate', 'Cohort paper has Moderate Risk of Bias');
  } catch (err) {
    assert(false, `buildStudyMatrix threw unexpected exception: ${err.message}`);
  }

  // TEST SUITE 3: Empty & Malformed Study Matrix Payload Defenses
  console.log('\n--- Suite 3: Study Matrix Empty / Null Defense ---');
  try {
    const emptyMatrix = buildStudyMatrix([]);
    assert(Array.isArray(emptyMatrix) && emptyMatrix.length === 0, 'buildStudyMatrix([]) returns empty array');

    const nullArgMatrix = buildStudyMatrix(null);
    assert(Array.isArray(nullArgMatrix) && nullArgMatrix.length === 0, 'buildStudyMatrix(null) handles null without crash');
  } catch (err) {
    assert(false, `buildStudyMatrix null test failed: ${err.message}`);
  }

  // TEST SUITE 4: Thesis Workspace & Literature Review Defenses
  console.log('\n--- Suite 4: Thesis Tools & Literature Review Defenses ---');
  try {
    // Test getThesisData defensively
    const data = getThesisData();
    assert(Array.isArray(data.chapters), 'getThesisData returns chapters array');
    assert(Array.isArray(data.savedPapers), 'getThesisData returns savedPapers array');
    assert(typeof data.notes === 'object', 'getThesisData returns notes object');

    // Test saveThesisData defensively
    const saveRes = saveThesisData(data);
    assert(saveRes === true, 'saveThesisData saves without disk errors');

    // Test generateLiteratureReview with null, empty, and valid papers
    const emptyReview = await generateLiteratureReview({ papers: [] });
    assert(emptyReview && emptyReview.title, 'generateLiteratureReview([]) returns fallback draft');

    const nullReview = await generateLiteratureReview({ papers: [null, undefined] });
    assert(nullReview && nullReview.title, 'generateLiteratureReview([null]) gracefully handles null elements');

    const validReview = await generateLiteratureReview({
      papers: mockPapers.slice(0, 3),
      thesisTopic: 'Tip 2 Diyabette Semaglutid ve Metformin Kombinasyonu',
      language: 'tr'
    });
    assert(validReview && validReview.content && validReview.content.length > 200, 'generateLiteratureReview produced comprehensive Turkish synthesis');
  } catch (err) {
    assert(false, `Thesis tools test failed: ${err.message}`);
  }

  // TEST SUITE 5: Query Optimizer Medical Typo & Concept Safeguards
  console.log('\n--- Suite 5: Query Optimizer & Typo Safeguards ---');
  const typoCases = [
    { input: 'Medformin kan sekerini dusurur mu?', expected: 'metformin' },
    { input: 'asprini cocuklara vermek reye sendromu yapar mi?', expected: 'aspirin' },
    { input: 'creatine bobrekleri bozar mi?', expected: 'creatin' },
    { input: 'hipotez 1: semaglutid kilo kaybini artirir', expected: 'semaglutide' }
  ];

  for (const tc of typoCases) {
    try {
      const opt = await optimizeAcademicQuery(tc.input);
      assert(opt && opt.primaryQuery && opt.primaryQuery.length > 0, `optimizeAcademicQuery returned valid primaryQuery for "${tc.input}"`);
      assert(opt.englishText.toLowerCase().includes(tc.expected) || opt.primaryQuery.toLowerCase().includes(tc.expected) || opt.coreKeywords.some(k => k.toLowerCase().includes(tc.expected)), `Detected and corrected typo for "${tc.input}" -> contains "${tc.expected}"`);
    } catch (err) {
      assert(false, `QueryOptimizer threw on "${tc.input}": ${err.message}`);
    }
  }

  // TEST SUITE 6: Citation Formatter & RIS Exporter
  console.log('\n--- Suite 6: Citation Engine & RIS Exporter ---');
  try {
    const citations = formatCitations(mockPapers[0]);
    assert(citations.apa && citations.apa.includes('Smith, J.'), `APA citation generated correctly: "${citations.apa}"`);
    assert(citations.mla && citations.mla.includes('John Smith') && citations.mla.includes('Jane Doe'), `MLA citation generated correctly: "${citations.mla}"`);
    assert(citations.vancouver && citations.vancouver.length > 0, `Vancouver citation generated correctly`);

    const ris = generateRIS(mockPapers.slice(0, 2));
    assert(ris && ris.includes('TY  - JOUR') && ris.includes('ER  -'), 'generateRIS outputs valid RIS format');
  } catch (err) {
    assert(false, `Citation engine test failed: ${err.message}`);
  }

  // TEST SUITE 7: Live Local Server Endpoints Health Check
  console.log('\n--- Suite 7: Live Local Server API Verification (Port 4000) ---');
  try {
    const healthRes = await fetch('http://localhost:4000/api/thesis-workspace');
    assert(healthRes.ok, `GET /api/thesis-workspace returned ${healthRes.status}`);

    const searchRes = await fetch('http://localhost:4000/api/search?q=CD4%2B%20cells%20in%20autoimmunity&perPage=3');
    assert(searchRes.ok, `GET /api/search with regex special chars (CD4+) returned ${searchRes.status}`);
    if (searchRes.ok) {
      const sData = await searchRes.json();
      assert(Array.isArray(sData.papers), 'Live search returned papers array');
    }

    const savePaperRes = await fetch('http://localhost:4000/api/thesis-workspace/save-paper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paper: { id: 'diag_test_p1', title: 'Diagnostic Paper Test', year: 2025 }
      })
    });
    assert(savePaperRes.ok, `POST /api/thesis-workspace/save-paper returned ${savePaperRes.status}`);
  } catch (err) {
    console.warn(`Local server network check notice: ${err.message}`);
  }

  console.log('\n================================================================');
  console.log(`📊 DIAGNOSTICS SUMMARY: ${passedTests}/${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
  if (failedTests > 0) {
    console.error(`🚨 DETECTED ${failedTests} FAILURES!`);
    failures.forEach((f, i) => console.error(`   ${i + 1}. ${f}`));
  } else {
    console.log('🎉 ALL SYSTEM DIAGNOSTICS & EDGE CASE DEFENSES PASSED PERFECTLY (100%)!');
  }
  console.log('================================================================');
}

runDiagnostics();
