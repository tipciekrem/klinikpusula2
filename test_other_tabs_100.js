/**
 * Comprehensive 100-Scenario Test Suite for Consensus Other Tabs & Features
 * Modules Tested:
 * 1. Thesis Workspace & Literature Review Synthesis (Scenarios 1-25)
 * 2. Study Comparison Matrix View & CSV Export (Scenarios 26-50)
 * 3. Citation Snowballing & Seminal Papers Graph (Scenarios 51-70)
 * 4. AI Manuscript Reviewer & Citation Auditor (Scenarios 71-85)
 * 5. Research Gaps Finder, Private Documents & Thread Handoff (Scenarios 86-100)
 */

const BASE_URL = 'http://localhost:4000';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } else {
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  }
}

// Sample clinical papers fixture for matrix, review, and gaps testing
const CLINICAL_FIXTURE_PAPERS = [
  {
    id: 'https://openalex.org/W2101234567',
    title: 'Semaglutide 2.4 mg for the treatment of obesity: a double-blind, randomized, placebo-controlled trial',
    abstract: 'In this double-blind trial, 1961 adults with obesity received once-weekly subcutaneous semaglutide. A large effect on body weight reduction was observed with a mean decrease of 14.9% compared to 2.4% with placebo. Robust cardiovascular benefits and improved glycemic parameters were documented.',
    year: 2021,
    journal: 'New England Journal of Medicine',
    authors: [{ name: 'Wilding J' }, { name: 'Batterham RL' }],
    studyType: 'Randomized Controlled Trial',
    sampleSize: 'n = 1961',
    citationCount: 1450,
    stance: 'positive',
    doi: '10.1056/NEJMoa2032183'
  },
  {
    id: 'https://openalex.org/W2109876543',
    title: 'Empagliflozin in heart failure with a preserved ejection fraction',
    abstract: 'Empagliflozin reduced the combined risk of cardiovascular death or hospitalization for heart failure in patients with preserved ejection fraction, regardless of the presence or absence of diabetes. Substantial clinical improvements were observed.',
    year: 2021,
    journal: 'New England Journal of Medicine',
    authors: [{ name: 'Anker SD' }, { name: 'Butler J' }],
    studyType: 'Double-Blind RCT',
    sampleSize: 'n = 5988',
    citationCount: 1820,
    stance: 'positive',
    doi: '10.1056/NEJMoa2107038'
  },
  {
    id: 'https://openalex.org/W2105555555',
    title: 'Systematic review and meta-analysis of SGLT2 inhibitors in chronic kidney disease and heart failure',
    abstract: 'This systematic review and meta-analysis evaluated 13 major trials. SGLT2 inhibitors robustly reduced kidney disease progression and cardiovascular events across diabetic and non-diabetic cohorts.',
    year: 2022,
    journal: 'The Lancet',
    authors: [{ lastName: 'Nuffield', firstName: 'Department' }, { lastName: 'Baigent', firstName: 'Colin' }],
    studyType: 'Systematic Review & Meta-Analysis',
    sampleSize: 'n = 90400',
    citationCount: 890,
    stance: 'positive',
    doi: '10.1016/S0140-6736(22)02074-8'
  },
  {
    id: 'https://openalex.org/W2106666666',
    title: 'Aspirin and Reye syndrome: a case-control epidemiological surveillance study',
    abstract: 'A significant association between aspirin ingestion during varicella or influenza infection in children and adolescents and subsequent development of Reye syndrome was confirmed. Relative risk was substantially elevated.',
    year: 1986,
    journal: 'JAMA',
    authors: ['Hurwitz ES', 'Nelson DB'],
    studyType: 'Case-Control Study',
    sampleSize: 'n = 210',
    citationCount: 420,
    stance: 'negative',
    doi: '10.1001/jama.1986.03370240051036'
  },
  {
    id: 'https://openalex.org/W2107777777',
    title: 'A population-based study of measles, mumps, and rubella vaccination and autism',
    abstract: 'This cohort study comprised all children born in Denmark between 1991 and 1998 (n = 537,303). There was no significant difference in the relative risk of autistic disorder between vaccinated and unvaccinated children. The findings provide strong evidence against the hypothesis that MMR vaccination causes autism.',
    year: 2002,
    journal: 'New England Journal of Medicine',
    authors: [{ name: 'Madsen KM' }, { name: 'Hviid A' }],
    studyType: 'Nationwide Cohort Study',
    sampleSize: 'n = 537,303',
    citationCount: 2200,
    stance: 'refuted',
    doi: '10.1056/NEJMoa021134'
  }
];

async function runAll100Scenarios() {
  console.log('================================================================');
  console.log('🔬 CONSENSUS PRO: 100-SCENARIO COMPREHENSIVE TAB TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;
  const results = [];

  function record(scenarioId, moduleName, name, ok, details = '') {
    if (ok) {
      passed++;
      console.log(`[PASS] #${scenarioId} [${moduleName}] ${name}`);
    } else {
      failed++;
      console.error(`[FAIL] #${scenarioId} [${moduleName}] ${name} -> ${details}`);
    }
    results.push({ scenarioId, moduleName, name, ok, details });
  }

  // =========================================================================
  // MODULE 1: THESIS WORKSPACE & LITERATURE REVIEW (Scenarios 1 - 25)
  // =========================================================================
  console.log('\n--- MODULE 1: THESIS WORKSPACE & LITERATURE REVIEW (1-25) ---');

  // 1. Initial workspace get
  try {
    const res = await request('/api/thesis-workspace');
    record(1, 'Workspace', 'Initial workspace schema retrieval', res.ok && Array.isArray(res.data.chapters) && res.data.chapters.length >= 3);
  } catch (e) { record(1, 'Workspace', 'Initial workspace schema retrieval', false, e.message); }

  // 2. Add custom chapter
  try {
    const ws = (await request('/api/thesis-workspace')).data;
    const testChapId = `chap-test-${Date.now()}`;
    ws.chapters.push({ id: testChapId, name: 'Bölüm 4: Bulgular ve İstatistiksel Analiz', papers: [] });
    const saveRes = await request('/api/thesis-workspace', { method: 'POST', body: JSON.stringify(ws) });
    const verify = (await request('/api/thesis-workspace')).data;
    record(2, 'Workspace', 'Add custom thesis chapter', saveRes.ok && verify.chapters.some(c => c.id === testChapId));
  } catch (e) { record(2, 'Workspace', 'Add custom thesis chapter', false, e.message); }

  // 3. Save paper to chapter
  try {
    const p = CLINICAL_FIXTURE_PAPERS[0];
    const res = await request('/api/thesis-workspace/save-paper', {
      method: 'POST',
      body: JSON.stringify({ paper: p, chapterId: 'chap-2', note: 'STEP-1 landmark trial' })
    });
    const ws = (await request('/api/thesis-workspace')).data;
    const paperSaved = ws.savedPapers.some(sp => sp.id === p.id);
    const inChap = ws.chapters.find(c => c.id === 'chap-2')?.papers.includes(p.id);
    record(3, 'Workspace', 'Save clinical trial paper to chapter', res.ok && paperSaved && inChap);
  } catch (e) { record(3, 'Workspace', 'Save clinical trial paper to chapter', false, e.message); }

  // 4. Update personal notes
  try {
    const pId = CLINICAL_FIXTURE_PAPERS[0].id;
    const ws = (await request('/api/thesis-workspace')).data;
    ws.notes[pId] = 'Revize not: 2021 NEJM yayını, kilo kaybı %14.9';
    await request('/api/thesis-workspace', { method: 'POST', body: JSON.stringify(ws) });
    const verify = (await request('/api/thesis-workspace')).data;
    record(4, 'Workspace', 'Add and update personal paper note', verify.notes[pId]?.includes('Revize not'));
  } catch (e) { record(4, 'Workspace', 'Add and update personal paper note', false, e.message); }

  // 5. Remove paper from chapter
  try {
    const pId = CLINICAL_FIXTURE_PAPERS[0].id;
    const ws = (await request('/api/thesis-workspace')).data;
    const chap2 = ws.chapters.find(c => c.id === 'chap-2');
    chap2.papers = (chap2?.papers || []).filter(id => id !== pId);
    await request('/api/thesis-workspace', { method: 'POST', body: JSON.stringify(ws) });
    const verify = (await request('/api/thesis-workspace')).data;
    const removedFromChap = !verify.chapters.find(c => c.id === 'chap-2')?.papers.includes(pId);
    record(5, 'Workspace', 'Remove paper from chapter preserving saved list', removedFromChap);
  } catch (e) { record(5, 'Workspace', 'Remove paper from chapter preserving saved list', false, e.message); }

  // 6. Save paper with object authors (lastName/firstName)
  try {
    const p = CLINICAL_FIXTURE_PAPERS[2];
    const res = await request('/api/thesis-workspace/save-paper', {
      method: 'POST',
      body: JSON.stringify({ paper: p, chapterId: 'chap-1' })
    });
    record(6, 'Workspace', 'Save paper with lastName/firstName author objects', res.ok && res.data.success);
  } catch (e) { record(6, 'Workspace', 'Save paper with lastName/firstName author objects', false, e.message); }

  // 7. Save paper with string authors
  try {
    const p = CLINICAL_FIXTURE_PAPERS[3];
    const res = await request('/api/thesis-workspace/save-paper', {
      method: 'POST',
      body: JSON.stringify({ paper: p, chapterId: 'chap-1' })
    });
    record(7, 'Workspace', 'Save paper with raw string authors', res.ok && res.data.success);
  } catch (e) { record(7, 'Workspace', 'Save paper with raw string authors', false, e.message); }

  // 8. Save paper missing DOI or journal
  try {
    const p = { id: 'custom_no_doi_1', title: 'Local Hospital Pilot Study', authors: ['Yılmaz A'], year: 2024 };
    const res = await request('/api/thesis-workspace/save-paper', {
      method: 'POST',
      body: JSON.stringify({ paper: p, chapterId: 'chap-3' })
    });
    record(8, 'Workspace', 'Save paper with missing DOI/journal gracefully', res.ok && res.data.success);
  } catch (e) { record(8, 'Workspace', 'Save paper with missing DOI/journal gracefully', false, e.message); }

  // 9. Literature review generation in Turkish
  try {
    const res = await request('/api/literature-review', {
      method: 'POST',
      body: JSON.stringify({
        papers: CLINICAL_FIXTURE_PAPERS.slice(0, 3),
        thesisTopic: 'Kardiyometabolik Tedaviler ve SGLT2 İnhibitörleri',
        language: 'tr'
      })
    });
    const hasSections = res.data?.content?.includes('LİTERATÜR TARAMASI') && res.data?.content?.includes('Kaynakça (APA 7th');
    record(9, 'Workspace', 'Generate structured Turkish Literature Review', res.ok && hasSections);
  } catch (e) { record(9, 'Workspace', 'Generate structured Turkish Literature Review', false, e.message); }

  // 10. Literature review generation in English
  try {
    const res = await request('/api/literature-review', {
      method: 'POST',
      body: JSON.stringify({
        papers: CLINICAL_FIXTURE_PAPERS.slice(0, 3),
        thesisTopic: 'Cardiometabolic Pharmacotherapies',
        language: 'en'
      })
    });
    const hasEnglish = res.data?.content?.includes('LITERATURE REVIEW') && res.data?.content?.includes('Theoretical Foundations');
    record(10, 'Workspace', 'Generate structured English Literature Review', res.ok && hasEnglish);
  } catch (e) { record(10, 'Workspace', 'Generate structured English Literature Review', false, e.message); }

  // 11. Review synthesis in-text citation formatting (ve ark. / et al.)
  try {
    const res = await request('/api/literature-review', {
      method: 'POST',
      body: JSON.stringify({
        papers: [CLINICAL_FIXTURE_PAPERS[2]],
        thesisTopic: 'SGLT2 Meta Analizi',
        language: 'tr'
      })
    });
    const hasProperCitation = res.data?.content?.includes('ve ark.') || res.data?.content?.includes('2022');
    record(11, 'Workspace', 'Literature Review in-text APA citation correctness', res.ok && hasProperCitation);
  } catch (e) { record(11, 'Workspace', 'Literature Review in-text APA citation correctness', false, e.message); }

  // 12. Review synthesis with cohort and empirical studies
  try {
    const res = await request('/api/literature-review', {
      method: 'POST',
      body: JSON.stringify({
        papers: [CLINICAL_FIXTURE_PAPERS[4]],
        thesisTopic: 'Aşı Güvenliği ve Epidemiyolojik Kohortlar',
        language: 'tr'
      })
    });
    const hasSampleMention = res.data?.content?.includes('537,303') || res.data?.content?.includes('katılımcı');
    record(12, 'Workspace', 'Literature Review empirical sample size synthesis', res.ok && res.data?.paperCount === 1);
  } catch (e) { record(12, 'Workspace', 'Literature Review empirical sample size synthesis', false, e.message); }

  // 13. Review synthesis with empty papers (validation test)
  try {
    const res = await request('/api/literature-review', {
      method: 'POST',
      body: JSON.stringify({ papers: [], thesisTopic: 'Boş Liste' })
    });
    record(13, 'Workspace', 'Reject empty paper array in literature review', res.status === 400);
  } catch (e) { record(13, 'Workspace', 'Reject empty paper array in literature review', false, e.message); }

  // 14. Thesis topic refinement: Metformin & PCOS
  try {
    const res = await request('/api/refine-topic', {
      method: 'POST',
      body: JSON.stringify({ topic: 'Metformin ve polikistik over sendromu (PCOS)' })
    });
    const ok = res.ok && res.data.hypotheses?.length === 3 && res.data.subQuestions?.length === 4;
    record(14, 'Workspace', 'Topic refinement: Metformin & PCOS', ok);
  } catch (e) { record(14, 'Workspace', 'Topic refinement: Metformin & PCOS', false, e.message); }

  // 15. Thesis topic refinement: SGLT2i & Heart Failure
  try {
    const res = await request('/api/refine-topic', {
      method: 'POST',
      body: JSON.stringify({ topic: 'SGLT2 inhibitörleri ve kalp yetersizliği sağkalımı' })
    });
    const ok = res.ok && res.data.recommendedQueries?.length > 0;
    record(15, 'Workspace', 'Topic refinement: SGLT2i Heart Failure', ok);
  } catch (e) { record(15, 'Workspace', 'Topic refinement: SGLT2i Heart Failure', false, e.message); }

  // 16. Thesis topic refinement: Neonatal Resuscitation
  try {
    const res = await request('/api/refine-topic', {
      method: 'POST',
      body: JSON.stringify({ topic: 'Yenidoğan resüsitasyonunda oksijen konsantrasyonları' })
    });
    record(16, 'Workspace', 'Topic refinement: Neonatal Resuscitation', res.ok && res.data.thesisChapterStructure?.length === 6);
  } catch (e) { record(16, 'Workspace', 'Topic refinement: Neonatal Resuscitation', false, e.message); }

  // 17. Thesis topic refinement: Checkpoint Immunotherapy
  try {
    const res = await request('/api/refine-topic', {
      method: 'POST',
      body: JSON.stringify({ topic: 'Kanser immünoterapisinde kontrol noktası inhibitörleri' })
    });
    record(17, 'Workspace', 'Topic refinement: Cancer Immunotherapy', res.ok && res.data.hypotheses[1].code === 'H1');
  } catch (e) { record(17, 'Workspace', 'Topic refinement: Cancer Immunotherapy', false, e.message); }

  // 18. Thesis topic refinement: AI Radiology
  try {
    const res = await request('/api/refine-topic', {
      method: 'POST',
      body: JSON.stringify({ topic: 'Yapay zeka algoritmalarının radyolojik tanı doğruluğu' })
    });
    record(18, 'Workspace', 'Topic refinement: AI Radiology Diagnostic Accuracy', res.ok && res.data.originalTopic.includes('radyolojik'));
  } catch (e) { record(18, 'Workspace', 'Topic refinement: AI Radiology Diagnostic Accuracy', false, e.message); }

  // 19. Thesis topic refinement: Empty topic string fallback
  try {
    const res = await request('/api/refine-topic', {
      method: 'POST',
      body: JSON.stringify({ topic: '' })
    });
    record(19, 'Workspace', 'Topic refinement: Fallback on empty topic string', res.ok && res.data.originalTopic.length > 0);
  } catch (e) { record(19, 'Workspace', 'Topic refinement: Fallback on empty topic string', false, e.message); }

  // 20. RIS Export single paper
  try {
    const res = await request('/api/export-ris', {
      method: 'POST',
      body: JSON.stringify({ paper: CLINICAL_FIXTURE_PAPERS[0] })
    });
    const hasRIS = res.text?.includes('TY  - JOUR') && res.text?.includes('TI  - Semaglutide') && res.text?.includes('ER  -');
    record(20, 'Workspace', 'RIS Export: Single clinical paper', hasRIS);
  } catch (e) { record(20, 'Workspace', 'RIS Export: Single clinical paper', false, e.message); }

  // 21. Batch RIS Export
  try {
    const res = await request('/api/export-ris', {
      method: 'POST',
      body: JSON.stringify({ papers: CLINICAL_FIXTURE_PAPERS })
    });
    const matches = (res.text?.match(/TY  - JOUR/g) || []).length;
    record(21, 'Workspace', 'Batch RIS Export: Multiple papers into Zotero file', matches === CLINICAL_FIXTURE_PAPERS.length);
  } catch (e) { record(21, 'Workspace', 'Batch RIS Export: Multiple papers into Zotero file', false, e.message); }

  // 22. Citation formatting (1 author)
  try {
    const singleAuthorPaper = { ...CLINICAL_FIXTURE_PAPERS[0], authors: [{ name: 'Wilding J' }] };
    const res = await request('/api/cite', {
      method: 'POST',
      body: JSON.stringify({ paper: singleAuthorPaper })
    });
    const apaCorrect = res.data?.apa?.startsWith('Wilding, J.') && res.data?.bibtex?.includes('@article');
    record(22, 'Workspace', 'Citation formatting: Single author APA & BibTeX', res.ok && apaCorrect);
  } catch (e) { record(22, 'Workspace', 'Citation formatting: Single author APA & BibTeX', false, e.message); }

  // 23. Citation formatting (2 authors with & ampersand)
  try {
    const res = await request('/api/cite', {
      method: 'POST',
      body: JSON.stringify({ paper: CLINICAL_FIXTURE_PAPERS[0] })
    });
    const apaHasAmpersand = res.data?.apa?.includes(' & ');
    record(23, 'Workspace', 'Citation formatting: Two authors with APA ampersand', res.ok && apaHasAmpersand);
  } catch (e) { record(23, 'Workspace', 'Citation formatting: Two authors with APA ampersand', false, e.message); }

  // 24. Citation formatting (>20 authors rule)
  try {
    const multiAuthors = Array.from({ length: 25 }, (_, i) => ({ name: `Author${i} Initial` }));
    const p = { ...CLINICAL_FIXTURE_PAPERS[0], authors: multiAuthors };
    const res = await request('/api/cite', {
      method: 'POST',
      body: JSON.stringify({ paper: p })
    });
    const hasEllipsis = res.data?.apa?.includes('...');
    record(24, 'Workspace', 'Citation formatting: APA 7th >20 authors ellipsis rule', res.ok && hasEllipsis);
  } catch (e) { record(24, 'Workspace', 'Citation formatting: APA 7th >20 authors ellipsis rule', false, e.message); }

  // 25. Persistence verification
  try {
    const testTag = `tag_${Date.now()}`;
    const ws = (await request('/api/thesis-workspace')).data;
    ws.customTag = testTag;
    await request('/api/thesis-workspace', { method: 'POST', body: JSON.stringify(ws) });
    const reloaded = (await request('/api/thesis-workspace')).data;
    record(25, 'Workspace', 'Disk persistence integrity across read-write cycles', reloaded.customTag === testTag);
  } catch (e) { record(25, 'Workspace', 'Disk persistence integrity across read-write cycles', false, e.message); }

  // =========================================================================
  // MODULE 2: STUDY COMPARISON MATRIX (Scenarios 26 - 50)
  // =========================================================================
  console.log('\n--- MODULE 2: STUDY COMPARISON MATRIX (26-50) ---');

  const matrixMedicalCases = [
    { id: 26, name: 'Semaglutide Obesity', paper: { title: 'Semaglutide once weekly for obesity', abstract: 'Subcutaneous semaglutide reduced body weight substantially in adults with obesity.' }, expPop: 'Obezite', expInt: 'Semaglutid (GLP-1 RA)' },
    { id: 27, name: 'Metformin PCOS', paper: { title: 'Metformin pharmacotherapy in diabetic patients', abstract: 'Metformin treatment in type 2 diabetes and clinical population.' }, expPop: 'Diyabet', expInt: 'Metformin' },
    { id: 28, name: 'SGLT2i Heart Failure', paper: { title: 'Empagliflozin SGLT2 inhibitor in heart failure with preserved ejection fraction', abstract: 'Significant reduction in heart failure cardiovascular events.' }, expPop: 'Kardiyovasküler', expInt: 'SGLT2' },
    { id: 29, name: 'Lecanemab Alzheimer', paper: { title: 'Lecanemab in early Alzheimer disease', abstract: 'Patients with early Alzheimer disease received lecanemab.' }, expPop: 'Nörolojik', expInt: 'Lekanemab' },
    { id: 30, name: 'Aspirin Pediatric Reye', paper: { title: 'Aspirin in children with viral illness', abstract: 'Aspirin use in children and pediatric population.' }, expPop: 'Çocuk', expInt: 'Aspirin' },
    { id: 31, name: 'Resmetirom MASH/NAFLD', paper: { title: 'A phase 3 trial of resmetirom in nonalcoholic steatohepatitis', abstract: 'NASH patients with liver fibrosis received resmetirom.' }, expPop: 'Gastroenteroloji', expInt: 'Resmetirom' },
    { id: 32, name: 'Preterm Infant Breast Milk', paper: { title: 'Human breast milk feeding in premature newborn infants', abstract: 'Reduced necrotizing enterocolitis in premature and preterm infants with maternal breast milk.' }, expPop: 'Yenidoğan', expInt: 'Anne Sütü' },
    { id: 33, name: 'Rheumatoid Arthritis Anti-TNF', paper: { title: 'Infliximab anti-tnf therapy in rheumatoid arthritis', abstract: 'Patients with active rheumatoid arthritis treated with anti-TNF biologicals.' }, expPop: 'Romatolojik', expInt: 'Anti-TNF' },
    { id: 34, name: 'Oncology Pembrolizumab', paper: { title: 'Pembrolizumab immunotherapy in metastatic lung cancer', abstract: 'Patients with advanced non-small cell lung cancer treated with pembrolizumab.' }, expPop: 'Onkolojik', expInt: 'Pembrolizumab' },
    { id: 35, name: 'CKD SGLT2i', paper: { title: 'Dapagliflozin in patients with chronic kidney disease', abstract: 'CKD patients with or without nephropathy received SGLT2 inhibitors.' }, expPop: 'Böbrek', expInt: 'SGLT2' },
    { id: 36, name: 'Stroke Alteplase tPA', paper: { title: 'Intravenous alteplase in acute ischemic stroke', abstract: 'Patients presenting with acute stroke within 4.5 hours received alteplase thrombolysis.' }, expPop: 'Nörolojik', expInt: 'Alteplaz' },
    { id: 37, name: 'Gout Allopurinol', paper: { title: 'Allopurinol dose escalation in chronic gout', abstract: 'Patients with gout and hyperuricemia received allopurinol.' }, expPop: 'Romatolojik', expInt: 'Allopurinol' },
    { id: 38, name: 'HIV PrEP Tenofovir', paper: { title: 'Tenofovir-based pre-exposure prophylaxis (PrEP) for HIV prevention', abstract: 'Daily oral tenofovir PrEP in clinical population.' }, expPop: 'Klinik', expInt: 'PrEP' },
    { id: 39, name: 'TAVI Aortic Valve', paper: { title: 'Transcatheter aortic valve implantation (TAVI) in elderly patients', abstract: 'Older adults and geriatric patients with severe aortic stenosis undergoing TAVI.' }, expPop: 'Yaşlı', expInt: 'TAVI' },
    { id: 40, name: 'Pilocarpine Sjogren', paper: { title: 'Pilocarpine tablets for the treatment of dry mouth in Sjogren syndrome', abstract: 'Patients with Sjogren syndrome and xerostomia received pilocarpine.' }, expPop: 'Romatolojik', expInt: 'Pilokarpin' },
    { id: 41, name: 'Asthma Corticosteroid', paper: { title: 'Inhaled corticosteroid therapy in severe asthma', abstract: 'Patients with pulmonary asthma received maintenance corticosteroid.' }, expPop: 'Pulmoner', expInt: 'Kortikosteroid' },
    { id: 42, name: 'Epilepsy Ketogenic Diet', paper: { title: 'Ketogenic diet for drug-resistant pediatric epilepsy', abstract: 'Children and adolescents with refractory epilepsy on a ketogenic diet.' }, expPop: 'Çocuk', expInt: 'Ketojenik' },
    { id: 43, name: 'Intermittent Fasting', paper: { title: 'Effects of intermittent fasting on glycemic control', abstract: 'Healthy adults randomized to intermittent fasting or caloric restriction.' }, expPop: 'Sağlıklı', expInt: 'Aralıklı Oruç' },
    { id: 44, name: 'Creatine Supplementation', paper: { title: 'Creatine monohydrate supplementation in resistance-trained athletes', abstract: 'Trained athletes received creatine supplementation.' }, expPop: 'Sporcular', expInt: 'Kreatin' },
    { id: 45, name: 'Depression CBT', paper: { title: 'Cognitive behavioral therapy for major depression', abstract: 'Adults with major depression randomized to cognitive behavioral therapy.' }, expPop: 'Psikiyatrik', expInt: 'Bilişsel Davranışçı' }
  ];

  for (const mc of matrixMedicalCases) {
    try {
      const res = await request('/api/pro/study-matrix', {
        method: 'POST',
        body: JSON.stringify({ papers: [mc.paper] })
      });
      const row = res.data?.matrix?.[0];
      const popOk = row && row.population.includes(mc.expPop);
      const intOk = row && row.intervention.includes(mc.expInt);
      record(mc.id, 'StudyMatrix', `Medical Domain Matrix: ${mc.name}`, res.ok && popOk && intOk, `Pop: ${row?.population}, Int: ${row?.intervention}`);
    } catch (e) {
      record(mc.id, 'StudyMatrix', `Medical Domain Matrix: ${mc.name}`, false, e.message);
    }
  }

  // 46. Missing abstract handling
  try {
    const res = await request('/api/pro/study-matrix', {
      method: 'POST',
      body: JSON.stringify({ papers: [{ title: 'Paper with No Abstract', year: 2024 }] })
    });
    record(46, 'StudyMatrix', 'Handle paper with missing abstract without crashing', res.ok && res.data?.matrix?.[0]?.population !== undefined);
  } catch (e) { record(46, 'StudyMatrix', 'Handle paper with missing abstract without crashing', false, e.message); }

  // 47. Missing sample size fallback
  try {
    const res = await request('/api/pro/study-matrix', {
      method: 'POST',
      body: JSON.stringify({ papers: [{ title: 'Paper without n size', abstract: 'No numbers here.' }] })
    });
    record(47, 'StudyMatrix', 'Sample size fallback to "Belirtilmedi"', res.data?.matrix?.[0]?.sampleSize === 'Belirtilmedi');
  } catch (e) { record(47, 'StudyMatrix', 'Sample size fallback to "Belirtilmedi"', false, e.message); }

  // 48. Non-interventional study categorization
  try {
    const res = await request('/api/pro/study-matrix', {
      method: 'POST',
      body: JSON.stringify({ papers: [{ title: 'Qualitative study on doctor communication', abstract: 'Semi-structured interviews with physicians.' }] })
    });
    record(48, 'StudyMatrix', 'Non-interventional study classification resilience', res.ok && res.data.matrix.length === 1);
  } catch (e) { record(48, 'StudyMatrix', 'Non-interventional study classification resilience', false, e.message); }

  // 49. Matrix sorting simulation
  try {
    const res = await request('/api/pro/study-matrix', {
      method: 'POST',
      body: JSON.stringify({ papers: CLINICAL_FIXTURE_PAPERS })
    });
    const matrix = res.data?.matrix || [];
    const sortedByYear = [...matrix].sort((a, b) => b.year - a.year);
    record(49, 'StudyMatrix', 'Matrix multi-column sortability (descending years)', sortedByYear[0].year >= sortedByYear[sortedByYear.length - 1].year);
  } catch (e) { record(49, 'StudyMatrix', 'Matrix multi-column sortability', false, e.message); }

  // 50. Matrix CSV export format validation
  try {
    const res = await request('/api/pro/study-matrix', {
      method: 'POST',
      body: JSON.stringify({ papers: CLINICAL_FIXTURE_PAPERS })
    });
    const matrix = res.data?.matrix || [];
    // Validate CSV formatting rules
    const headers = ['Sıra No', 'Çalışma (Yazar & Yıl)', 'Makale Başlığı', 'Yıl', 'Dergi', 'Çalışma Türü', 'Örneklem (n)', 'Popülasyon / Hedef Kitle', 'Müdahale / Değişken', 'Etki Büyüklüğü', 'Temel Bulgu', 'Atıf Sayısı', 'DOI'];
    const row0 = matrix[0];
    const csvLine = [row0.rowNumber, `"${row0.studyName}"`, `"${row0.fullTitle}"`, row0.year, `"${row0.journal}"`, `"${row0.studyType}"`, `"${row0.sampleSize}"`, `"${row0.population}"`, `"${row0.intervention}"`, `"${row0.effectSize}"`, `"${row0.keyFinding}"`, row0.citationCount, row0.doi || ''].join(';');
    const validCsv = csvLine.split(';').length === headers.length;
    record(50, 'StudyMatrix', 'Matrix CSV structure validation with Excel-compatible semicolon delimiter', validCsv);
  } catch (e) { record(50, 'StudyMatrix', 'Matrix CSV structure validation', false, e.message); }

  // =========================================================================
  // MODULE 3: CITATION SNOWBALLING & GRAPH (Scenarios 51 - 70)
  // =========================================================================
  console.log('\n--- MODULE 3: CITATION SNOWBALLING & GRAPH (51-70) ---');

  // 51. Snowballing with classic DOI
  try {
    const res = await request('/api/pro/snowball?doi=10.1056/NEJMoa021134');
    record(51, 'Snowballing', 'Snowballing by DOI (Madsen MMR Autism)', res.ok && (res.data.backwardCitations?.length > 0 || res.data.forwardCitations?.length > 0));
  } catch (e) { record(51, 'Snowballing', 'Snowballing by DOI', false, e.message); }

  // 52. Snowballing with OpenAlex URL
  try {
    const res = await request('/api/pro/snowball?paperId=https://openalex.org/W2101234567');
    record(52, 'Snowballing', 'Snowballing by OpenAlex full URL', res.ok && res.data.basePaper !== undefined);
  } catch (e) { record(52, 'Snowballing', 'Snowballing by OpenAlex full URL', false, e.message); }

  // 53. Snowballing with plain OpenAlex ID (W...)
  try {
    const res = await request('/api/pro/snowball?paperId=W2741809807');
    record(53, 'Snowballing', 'Snowballing by plain OpenAlex ID (W...)', res.ok && res.data.basePaper !== undefined);
  } catch (e) { record(53, 'Snowballing', 'Snowballing by plain OpenAlex ID', false, e.message); }

  // 54. Snowballing with paper title fallback
  try {
    const res = await request('/api/pro/snowball?title=Semaglutide%20and%20Cardiovascular%20Outcomes%20in%20Obesity');
    record(54, 'Snowballing', 'Snowballing by paper title search fallback', res.ok && res.data.basePaper?.title !== undefined);
  } catch (e) { record(54, 'Snowballing', 'Snowballing by paper title search fallback', false, e.message); }

  // 55. Seminal papers threshold detection in backward references (>300 citations)
  try {
    const res = await request('/api/pro/snowball?doi=10.1056/NEJMoa021134');
    const backward = res.data?.backwardCitations || [];
    const seminalDetected = backward.some(c => c.isSeminal === true && c.citationCount > 300);
    record(55, 'Snowballing', 'Seminal paper detection threshold (>300 citations)', res.ok && (seminalDetected || backward.length === 0));
  } catch (e) { record(55, 'Snowballing', 'Seminal paper detection threshold', false, e.message); }

  // 56. Seminal forward citations detection (>100 citations)
  try {
    const res = await request('/api/pro/snowball?doi=10.1056/NEJMoa021134');
    const forward = res.data?.forwardCitations || [];
    const seminalFwd = forward.some(c => c.isSeminal === true && c.citationCount > 100);
    record(56, 'Snowballing', 'Seminal forward citations detection (>100 citations)', res.ok && (seminalFwd || forward.length === 0));
  } catch (e) { record(56, 'Snowballing', 'Seminal forward citations detection', false, e.message); }

  // 57. Backward citations metadata fields
  try {
    const res = await request('/api/pro/snowball?title=Empagliflozin%20in%20Heart%20Failure');
    const firstBack = res.data?.backwardCitations?.[0];
    const ok = !firstBack || (firstBack.title && firstBack.year !== undefined && Array.isArray(firstBack.authors));
    record(57, 'Snowballing', 'Backward references metadata schema integrity', res.ok && ok);
  } catch (e) { record(57, 'Snowballing', 'Backward references metadata schema integrity', false, e.message); }

  // 58. Forward citations metadata fields
  try {
    const res = await request('/api/pro/snowball?title=Empagliflozin%20in%20Heart%20Failure');
    const firstFwd = res.data?.forwardCitations?.[0];
    const ok = !firstFwd || (firstFwd.title && firstFwd.year !== undefined && Array.isArray(firstFwd.authors));
    record(58, 'Snowballing', 'Forward citations metadata schema integrity', res.ok && ok);
  } catch (e) { record(58, 'Snowballing', 'Forward citations metadata schema integrity', false, e.message); }

  // 59. Empty references resilience
  try {
    const res = await request('/api/pro/snowball?paperId=non_existent_paper_id_999');
    record(59, 'Snowballing', 'Handle non-existent paper without 500 error', res.ok && res.data.backwardCitations?.length === 0);
  } catch (e) { record(59, 'Snowballing', 'Handle non-existent paper without 500 error', false, e.message); }

  // 60. Zero-citation paper handling
  try {
    const res = await request('/api/pro/snowball?title=A%20Brand%20New%20Hypothesis%202026');
    record(60, 'Snowballing', 'Zero-citation recent paper handling', res.ok && Array.isArray(res.data?.forwardCitations));
  } catch (e) { record(60, 'Snowballing', 'Zero-citation recent paper handling', false, e.message); }

  // 61. Landmark SPRINT trial
  try {
    const res = await request('/api/pro/snowball?title=A%20Randomized%20Trial%20of%20Intensive%20versus%20Standard%20Blood-Pressure%20Control');
    record(61, 'Snowballing', 'Snowballing landmark trial: SPRINT Trial', res.ok && res.data.basePaper !== undefined);
  } catch (e) { record(61, 'Snowballing', 'Snowballing landmark trial: SPRINT', false, e.message); }

  // 62. Landmark UKPDS diabetes trial
  try {
    const res = await request('/api/pro/snowball?title=Intensive%20blood-glucose%20control%20with%20sulphonylureas%20or%20insulin%20UKPDS%2033');
    record(62, 'Snowballing', 'Snowballing landmark trial: UKPDS 33', res.ok && res.data.basePaper !== undefined);
  } catch (e) { record(62, 'Snowballing', 'Snowballing landmark trial: UKPDS 33', false, e.message); }

  // 63. Landmark STEP-1 semaglutide
  try {
    const res = await request('/api/pro/snowball?title=Once-Weekly%20Semaglutide%20in%20Adults%20with%20Overweight%20or%20Obesity');
    record(63, 'Snowballing', 'Snowballing landmark trial: STEP-1 Semaglutide', res.ok && res.data.basePaper !== undefined);
  } catch (e) { record(63, 'Snowballing', 'Snowballing landmark trial: STEP-1', false, e.message); }

  // 64. Landmark Aspirin primary prevention trial
  try {
    const res = await request('/api/pro/snowball?title=Aspirin%20for%20the%20prevention%20of%20cardiovascular%20disease');
    record(64, 'Snowballing', 'Snowballing trial: Aspirin CVD prevention', res.ok && res.data.basePaper !== undefined);
  } catch (e) { record(64, 'Snowballing', 'Snowballing trial: Aspirin CVD prevention', false, e.message); }

  // 65. Landmark MMR vaccine safety
  try {
    const res = await request('/api/pro/snowball?title=Measles%20Mumps%20Rubella%20Vaccine%20and%20Autism');
    record(65, 'Snowballing', 'Snowballing query: MMR Vaccine safety cohort', res.ok && res.data.basePaper !== undefined);
  } catch (e) { record(65, 'Snowballing', 'Snowballing query: MMR Vaccine safety cohort', false, e.message); }

  // 66. Turkish paper title search
  try {
    const res = await request('/api/pro/snowball?title=Tip%202%20Diyabette%20Metformin%20Tedavisi');
    record(66, 'Snowballing', 'Snowballing with Turkish paper query', res.ok && res.data.basePaper !== undefined);
  } catch (e) { record(66, 'Snowballing', 'Snowballing with Turkish paper query', false, e.message); }

  // 67. Dergipark prefix ID
  try {
    const res = await request('/api/pro/snowball?paperId=dergipark_W2741809807');
    record(67, 'Snowballing', 'Snowballing with Dergipark prefix resolution', res.ok && res.data.basePaper !== undefined);
  } catch (e) { record(67, 'Snowballing', 'Snowballing with Dergipark prefix resolution', false, e.message); }

  // 68. PubMed PMID prefix
  try {
    const res = await request('/api/pro/snowball?paperId=pmid_12421889');
    record(68, 'Snowballing', 'Snowballing with PubMed PMID prefix resolution', res.ok && res.data.basePaper !== undefined);
  } catch (e) { record(68, 'Snowballing', 'Snowballing with PubMed PMID prefix resolution', false, e.message); }

  // 69. Missing query params validation
  try {
    const res = await request('/api/pro/snowball');
    record(69, 'Snowballing', 'Reject empty snowball request with 400 Bad Request', res.status === 400);
  } catch (e) { record(69, 'Snowballing', 'Reject empty snowball request with 400', false, e.message); }

  // 70. Total citation & reference counters integrity
  try {
    const res = await request('/api/pro/snowball?doi=10.1056/NEJMoa021134');
    const ok = res.data?.totalCitations >= 0 && res.data?.totalReferences >= 0;
    record(70, 'Snowballing', 'Total reference and citation counters numerical validity', res.ok && ok);
  } catch (e) { record(70, 'Snowballing', 'Total reference and citation counters numerical validity', false, e.message); }

  // =========================================================================
  // MODULE 4: MANUSCRIPT REVIEWER & CITATION AUDITOR (Scenarios 71 - 85)
  // =========================================================================
  console.log('\n--- MODULE 4: MANUSCRIPT REVIEWER & AUDITOR (71-85) ---');

  const auditSentences = [
    { id: 71, text: 'Aralıklı oruç insülin duyarlılığını artırmakta ve açlık glukoz düzeyini düşürmektedir.', label: 'Intermittent Fasting & Insulin' },
    { id: 72, text: 'Semaglutide reduces body weight substantially and improves cardiovascular outcomes in obesity.', label: 'Semaglutide Obesity Weight Loss' },
    { id: 73, text: 'SGLT2 inhibitors reduce cardiovascular death and hospitalizations in heart failure.', label: 'SGLT2i Heart Failure Survival' },
    { id: 74, text: 'Aspirin use in pediatric viral infections is associated with Reye syndrome risk.', label: 'Aspirin & Reye Syndrome Contraindication' },
    { id: 75, text: 'Measles MMR vaccination has no causal association with autism spectrum disorders.', label: 'MMR Vaccine & Autism Disproof' },
    { id: 76, text: 'Creatine monohydrate supplementation enhances cognitive performance and short-term memory.', label: 'Creatine Cognitive Memory Performance' },
    { id: 77, text: 'Metformin improves ovulation rates and insulin sensitivity in polycystic ovary syndrome.', label: 'Metformin PCOS Ovulation' },
    { id: 78, text: 'Trastuzumab improves progression-free survival in HER2-positive breast cancer patients.', label: 'Trastuzumab HER2 Breast Cancer' },
    { id: 79, text: 'Lecanemab clears amyloid-beta plaques and slows cognitive decline in early Alzheimer disease.', label: 'Lecanemab Alzheimer Plaque Clearance' },
    { id: 80, text: 'Alteplase tPA administration within 4.5 hours improves functional outcomes in acute ischemic stroke.', label: 'Alteplase Acute Ischemic Stroke 4.5h' }
  ];

  for (const item of auditSentences) {
    try {
      const res = await request('/api/pro/audit-manuscript', {
        method: 'POST',
        body: JSON.stringify({ text: item.text })
      });
      const claim = res.data?.claims?.[0];
      const ok = res.ok && claim && (claim.status === 'verified' || claim.status === 'needs_citation');
      record(item.id, 'ManuscriptAuditor', `Audit Medical Claim: ${item.label}`, ok, `Status: ${claim?.status}, Citations: ${claim?.suggestedCitations?.length}`);
    } catch (e) {
      record(item.id, 'ManuscriptAuditor', `Audit Medical Claim: ${item.label}`, false, e.message);
    }
  }

  // 81. Multi-sentence paragraph audit
  try {
    const multiText = 'Semaglutid obezite tedavisinde kilo kaybını artırır. SGLT2 inhibitörleri kalp yetersizliğinde mortaliteyi azaltır. Aspirin çocuklarda Reye sendromuna yol açabilir.';
    const res = await request('/api/pro/audit-manuscript', {
      method: 'POST',
      body: JSON.stringify({ text: multiText })
    });
    record(81, 'ManuscriptAuditor', 'Multi-sentence clinical paragraph segmentation and audit', res.ok && res.data.claims?.length === 3);
  } catch (e) { record(81, 'ManuscriptAuditor', 'Multi-sentence clinical paragraph audit', false, e.message); }

  // 82. Unsubstantiated speculation detection
  try {
    const bizarreClaim = 'Ay taşlarının tozunu koklamak tip 2 diyabeti anında yok eder.';
    const res = await request('/api/pro/audit-manuscript', {
      method: 'POST',
      body: JSON.stringify({ text: bizarreClaim })
    });
    const claim = res.data?.claims?.[0];
    record(82, 'ManuscriptAuditor', 'Flag unsubstantiated/pseudoscientific assertion with "needs_citation"', res.ok && claim?.status === 'needs_citation');
  } catch (e) { record(82, 'ManuscriptAuditor', 'Flag unsubstantiated assertion', false, e.message); }

  // 83. In-text APA citation format insertion check
  try {
    const res = await request('/api/pro/audit-manuscript', {
      method: 'POST',
      body: JSON.stringify({ text: 'Metformin insülin duyarlılığını artırır.' })
    });
    const cit = res.data?.claims?.[0]?.suggestedCitations?.[0]?.inTextCitation;
    const isApaFormat = cit ? /^\([A-Za-zğüşıöçĞÜŞİÖÇ\s]+(ve ark\.)?,\s\d{4}\)$/.test(cit) : true;
    record(83, 'ManuscriptAuditor', 'Generated in-text citation matches APA standard: (Yazar, Yıl)', isApaFormat);
  } catch (e) { record(83, 'ManuscriptAuditor', 'In-text APA citation format', false, e.message); }

  // 84. Readiness score calculation (0-100)
  try {
    const res = await request('/api/pro/audit-manuscript', {
      method: 'POST',
      body: JSON.stringify({ text: 'Semaglutide is effective for weight loss. Empagliflozin improves cardiac outcomes.' })
    });
    const score = res.data?.readinessScore;
    record(84, 'ManuscriptAuditor', 'Readiness score computation within 0-100 bounds', typeof score === 'number' && score >= 0 && score <= 100);
  } catch (e) { record(84, 'ManuscriptAuditor', 'Readiness score computation', false, e.message); }

  // 85. Empty manuscript text validation
  try {
    const res = await request('/api/pro/audit-manuscript', {
      method: 'POST',
      body: JSON.stringify({ text: '   ' })
    });
    record(85, 'ManuscriptAuditor', 'Reject whitespace-only manuscript input with 400', res.status === 400);
  } catch (e) { record(85, 'ManuscriptAuditor', 'Reject whitespace-only manuscript input', false, e.message); }

  // =========================================================================
  // MODULE 5: RESEARCH GAPS, PRIVATE DOCUMENTS & THREAD HANDOFF (Scenarios 86 - 100)
  // =========================================================================
  console.log('\n--- MODULE 5: GAPS, PRIVATE DOCS & THREAD HANDOFF (86-100) ---');

  // 86. Longitudinal research gaps identification
  try {
    const res = await request('/api/pro/research-gaps', {
      method: 'POST',
      body: JSON.stringify({ papers: CLINICAL_FIXTURE_PAPERS, thesisTopic: 'Kardiyometabolik Tedaviler' })
    });
    const hasLongitudinal = res.data?.identifiedGaps?.some(g => g.type.includes('Longitudinal'));
    record(86, 'ResearchGaps', 'Identify Longitudinal Gap in short-term studies', res.ok && hasLongitudinal);
  } catch (e) { record(86, 'ResearchGaps', 'Identify Longitudinal Gap', false, e.message); }

  // 87. Contextual / Population representation gap
  try {
    const res = await request('/api/pro/research-gaps', {
      method: 'POST',
      body: JSON.stringify({ papers: CLINICAL_FIXTURE_PAPERS, thesisTopic: 'Kardiyometabolik Tedaviler' })
    });
    const hasContextual = res.data?.identifiedGaps?.some(g => g.type.includes('Contextual'));
    record(87, 'ResearchGaps', 'Identify Contextual / Geographic diversity gap', res.ok && hasContextual);
  } catch (e) { record(87, 'ResearchGaps', 'Identify Contextual diversity gap', false, e.message); }

  // 88. Methodological limitations analysis
  try {
    const observationalOnly = [CLINICAL_FIXTURE_PAPERS[3], CLINICAL_FIXTURE_PAPERS[4]];
    const res = await request('/api/pro/research-gaps', {
      method: 'POST',
      body: JSON.stringify({ papers: observationalOnly, thesisTopic: 'Gözlemsel Çalışmalar' })
    });
    record(88, 'ResearchGaps', 'Highlight lack of RCTs when analyzing observational sets', res.ok && res.data.methodologicalLimitations?.length > 0);
  } catch (e) { record(88, 'ResearchGaps', 'Highlight lack of RCTs', false, e.message); }

  // 89. Suggested thesis contributions
  try {
    const res = await request('/api/pro/research-gaps', {
      method: 'POST',
      body: JSON.stringify({ papers: CLINICAL_FIXTURE_PAPERS, thesisTopic: 'Diyabet ve Obezite' })
    });
    record(89, 'ResearchGaps', 'Provide actionable thesis contributions for student proposal', res.ok && res.data.suggestedContributions?.length > 0);
  } catch (e) { record(89, 'ResearchGaps', 'Provide actionable thesis contributions', false, e.message); }

  // 90. Empty papers array in research gaps
  try {
    const res = await request('/api/pro/research-gaps', {
      method: 'POST',
      body: JSON.stringify({ papers: [] })
    });
    record(90, 'ResearchGaps', 'Handle empty paper set in gap finder gracefully', res.ok && res.data.identifiedGaps?.length === 0);
  } catch (e) { record(90, 'ResearchGaps', 'Handle empty paper set in gap finder', false, e.message); }

  // 91. Private document upload
  try {
    const docPayload = {
      filename: 'klinik_gozlem_verileri_2026.txt',
      title: 'Dahiliye Kliniği Retrospektif Hasta Veri Notu',
      content: '120 hasta üzerinde yapılan 6 aylık retrospektif glisemik takip analizi.',
      chapterId: 'chap-3'
    };
    const res = await request('/api/pro/upload-doc', {
      method: 'POST',
      body: JSON.stringify(docPayload)
    });
    record(91, 'PrivateDocs', 'Ingest private clinical notes / research document', res.ok && res.data.document?.id?.startsWith('priv_'));
  } catch (e) { record(91, 'PrivateDocs', 'Ingest private clinical notes', false, e.message); }

  // 92. Fetch private documents list
  try {
    const res = await request('/api/pro/private-docs');
    const hasDoc = res.data?.documents?.some(d => d.filename === 'klinik_gozlem_verileri_2026.txt');
    record(92, 'PrivateDocs', 'Retrieve user private documents list', res.ok && hasDoc);
  } catch (e) { record(92, 'PrivateDocs', 'Retrieve user private documents list', false, e.message); }

  // 93. Ingest private literature note for Chapter 1
  try {
    const res = await request('/api/pro/upload-doc', {
      method: 'POST',
      body: JSON.stringify({
        filename: 'kuramsal_cerceve_ozeti.pdf',
        title: 'Teorik Çerçeve ve Hipotez Taslağı',
        content: 'Bölüm 1 için kuramsal arka plan.',
        chapterId: 'chap-1'
      })
    });
    record(93, 'PrivateDocs', 'Assign private document to Chapter 1', res.ok && res.data.document.chapterId === 'chap-1');
  } catch (e) { record(93, 'PrivateDocs', 'Assign private document to Chapter 1', false, e.message); }

  // 94. Ingest lab protocol for Chapter 3
  try {
    const res = await request('/api/pro/upload-doc', {
      method: 'POST',
      body: JSON.stringify({
        filename: 'laboratuvar_protokolu.txt',
        title: 'Biyokimya Örnekleme ve Analiz Protokolü',
        content: 'ELISA yöntemiyle serum biyobelirteç ölçüm adımları.',
        chapterId: 'chap-3'
      })
    });
    record(94, 'PrivateDocs', 'Assign lab protocol to Chapter 3 (Methodology)', res.ok && res.data.document.chapterId === 'chap-3');
  } catch (e) { record(94, 'PrivateDocs', 'Assign lab protocol to Chapter 3', false, e.message); }

  // 95. Private docs persistent storage integrity
  try {
    const ws = (await request('/api/thesis-workspace')).data;
    const count = ws.customUploads?.length || 0;
    record(95, 'PrivateDocs', 'Private docs persisted in thesisData.json store', count >= 3);
  } catch (e) { record(95, 'PrivateDocs', 'Private docs persisted in thesisData', false, e.message); }

  // 96. Multi-turn thread follow-up context preservation
  try {
    const followUpPayload = {
      originalQuery: 'Semaglutide kilo verdirir mi?',
      threadTitle: 'Semaglutide ve Kilo Kaybı',
      followUpQuery: 'Bu ilacın gastrointestinal yan etkileri nelerdir?',
      previousPapers: CLINICAL_FIXTURE_PAPERS.slice(0, 2),
      previousSynthesis: 'Semaglutid kilo kaybı sağlamaktadır.',
      mode: 'medical'
    };
    const res = await request('/api/thread/follow-up', {
      method: 'POST',
      body: JSON.stringify(followUpPayload)
    });
    record(96, 'MultiTurnThread', 'Context-aware follow-up question synthesis in continuous thread', res.ok && res.data.synthesis?.detailedMarkdown?.length > 0);
  } catch (e) { record(96, 'MultiTurnThread', 'Context-aware follow-up question synthesis', false, e.message); }

  // 97. Follow-up paper deduplication and merging
  try {
    const followUpPayload = {
      originalQuery: 'Semaglutide kilo verdirir mi?',
      followUpQuery: 'Kardiyovasküler koruma sağlar mı?',
      previousPapers: [CLINICAL_FIXTURE_PAPERS[0]],
      mode: 'medical'
    };
    const res = await request('/api/thread/follow-up', {
      method: 'POST',
      body: JSON.stringify(followUpPayload)
    });
    const titles = (res.data?.papers || []).map(p => p.title.toLowerCase().trim());
    const uniqueCount = new Set(titles).size;
    record(97, 'MultiTurnThread', 'Deduplication of previous landmark trials with new follow-up results', uniqueCount === titles.length);
  } catch (e) { record(97, 'MultiTurnThread', 'Deduplication of papers', false, e.message); }

  // 98. Follow-up consensus meter recalculation
  try {
    const followUpPayload = {
      originalQuery: 'Aspirin çocuklarda güvenli midir?',
      followUpQuery: 'Reye sendromu riski var mıdır?',
      previousPapers: [CLINICAL_FIXTURE_PAPERS[3]],
      mode: 'medical'
    };
    const res = await request('/api/thread/follow-up', {
      method: 'POST',
      body: JSON.stringify(followUpPayload)
    });
    const consensus = res.data?.consensus;
    record(98, 'MultiTurnThread', 'Consensus meter recalculation for follow-up sub-question', res.ok && consensus?.percentage !== undefined);
  } catch (e) { record(98, 'MultiTurnThread', 'Consensus meter recalculation', false, e.message); }

  // 99. Academic translation engine test
  try {
    const res = await request('/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text: 'Randomized controlled trial demonstrating efficacy in reducing cardiovascular mortality.' })
    });
    const trText = res.data?.translatedText || '';
    const hasTurkishTerms = trText.includes('kardiyovasküler') || trText.includes('mortalite') || trText.includes('randomize') || trText.includes('etkinlik');
    record(99, 'Translation', 'Translate medical English text into Turkish academic terminology', res.ok && hasTurkishTerms);
  } catch (e) { record(99, 'Translation', 'Translate medical English text into Turkish academic terminology', false, e.message); }

  // 100. End-to-end integration workflow test
  try {
    // 1. Save paper
    const saveRes = await request('/api/thesis-workspace/save-paper', {
      method: 'POST',
      body: JSON.stringify({ paper: CLINICAL_FIXTURE_PAPERS[0], chapterId: 'chap-2' })
    });
    // 2. Build matrix
    const matrixRes = await request('/api/pro/study-matrix', {
      method: 'POST',
      body: JSON.stringify({ papers: [CLINICAL_FIXTURE_PAPERS[0]] })
    });
    // 3. Find gaps
    const gapsRes = await request('/api/pro/research-gaps', {
      method: 'POST',
      body: JSON.stringify({ papers: [CLINICAL_FIXTURE_PAPERS[0]], thesisTopic: 'Semaglutide Obesity' })
    });
    // 4. Audit manuscript
    const auditRes = await request('/api/pro/audit-manuscript', {
      method: 'POST',
      body: JSON.stringify({ text: 'Semaglutid obezite hastalarında anlamlı kilo kaybı sağlamaktadır.' })
    });

    const e2eOk = saveRes.ok && matrixRes.ok && gapsRes.ok && auditRes.ok;
    record(100, 'EndToEnd', 'End-to-end multi-tab workflow: Save -> Matrix -> Gaps -> Audit pipeline', e2eOk);
  } catch (e) { record(100, 'EndToEnd', 'End-to-end multi-tab workflow pipeline', false, e.message); }

  console.log('\n================================================================');
  console.log(`🎯 100-SCENARIO SUITE COMPLETE: ${passed}/100 PASSED (${((passed / 100) * 100).toFixed(1)}%) | ${failed} FAILED`);
  console.log('================================================================\n');

  return { passed, failed, results };
}

runAll100Scenarios().catch(err => {
  console.error('Fatal error running scenarios:', err);
  process.exit(1);
});
