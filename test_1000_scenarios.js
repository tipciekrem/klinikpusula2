/**
 * Massive 1,000-Scenario Quality, Citation & Relevance Test Suite for Consensus Academic Platform
 * 
 * Modules:
 * 1. Citation Engine & Bibliographic Standards (Scenarios 1 - 250)
 * 2. Thesis Literature Review, Translation Quality & Topic Refinement (Scenarios 251 - 500)
 * 3. Study Comparison Matrix & Medical Variable Extraction (Scenarios 501 - 700)
 * 4. Manuscript Claim Auditor & Pseudoscientific Filtering (Scenarios 701 - 850)
 * 5. Citation Snowballing, Research Gaps & Multi-turn Continuity (Scenarios 851 - 1000)
 */

import { formatCitations, generateRIS, generateBatchRIS } from './server/services/citationEngine.js';
import { generateLiteratureReview, refineThesisTopic, getThesisData, saveThesisData } from './server/services/thesisTools.js';
import { buildStudyMatrix, findResearchGaps, ingestPrivateDocument } from './server/services/proAgentEngine.js';
import { translateTextToTurkish } from './server/services/translationEngine.js';

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

async function run1000Scenarios() {
  console.log('================================================================================');
  console.log('🔬 CONSENSUS PRO: 1,000-SCENARIO COMPREHENSIVE CITATION, TRANSLATION & RELEVANCE SUITE');
  console.log('================================================================================\n');

  let passed = 0;
  let failed = 0;
  const failures = [];

  function record(id, module, name, ok, details = '') {
    if (ok) {
      passed++;
      if (id % 50 === 0 || id === 1 || id === 1000) {
        console.log(`[PASS] #${id} [${module}] ${name}`);
      }
    } else {
      failed++;
      console.error(`[FAIL] #${id} [${module}] ${name} -> ${details}`);
      failures.push({ id, module, name, details });
    }
  }

  // ===========================================================================
  // MODULE 1: CITATION ENGINE & BIBLIOGRAPHIC STANDARDS (Scenarios 1 - 250)
  // ===========================================================================
  console.log('--- STARTING MODULE 1: CITATION STANDARDS & AUTHOR PARSING (1 - 250) ---');

  const FIRST_NAMES = ['John', 'Mehmet', 'Ayşe', 'David', 'Fatma', 'Maria', 'Ali', 'Elena', 'Jean-Luc', 'Zeynep', 'Ahmed', 'Claire', 'Burak', 'Sarah', 'Klaus', 'Canan', 'Paolo', 'Elif', 'Chen', 'Seda'];
  const LAST_NAMES = ['Smith', 'Yılmaz', 'Kaya', 'O\'Connor', 'Demir', 'García', 'Öztürk', 'van der Berg', 'Çelik', 'Müller', 'Şahin', 'Dubois', 'Aydın', 'Rossi', 'İncesu', 'Al-Mansoor', 'Koç', 'MacDonald', 'Erdoğan', 'Zhang'];
  const JOURNALS = ['New England Journal of Medicine', 'The Lancet', 'JAMA', 'BMJ', 'Nature Medicine', 'Türk Pediatri Arşivi', 'Circulation', 'Annals of Internal Medicine', 'Cell', 'European Heart Journal'];

  for (let i = 1; i <= 250; i++) {
    const fn = FIRST_NAMES[(i * 3) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    const yr = 1970 + (i % 55);
    const jn = JOURNALS[i % JOURNALS.length];
    const doi = i % 3 === 0 ? `10.1056/NEJMoa${2000000 + i}` : (i % 3 === 1 ? `https://doi.org/10.1016/j.jacc.${yr}.${i}` : null);

    let authors = [];
    if (i % 5 === 1) {
      // 1 author string
      authors = [`${ln} ${fn[0]}`];
    } else if (i % 5 === 2) {
      // 2 author objects
      authors = [{ lastName: ln, firstName: fn }, { lastName: LAST_NAMES[(i + 1) % LAST_NAMES.length], firstName: 'Alex' }];
    } else if (i % 5 === 3) {
      // 3-6 author objects with name
      authors = Array.from({ length: 4 }, (_, idx) => ({ name: `${FIRST_NAMES[(i + idx) % FIRST_NAMES.length]} ${LAST_NAMES[(i + idx) % LAST_NAMES.length]}` }));
    } else if (i % 5 === 4) {
      // >20 authors (testing APA ellipsis)
      authors = Array.from({ length: 24 }, (_, idx) => ({ name: `Author${idx} Lastname${idx}` }));
    } else {
      // Turkish special characters
      authors = [{ name: 'Mustafa Çavuşoğlu' }, { name: 'Hülya Şengör' }];
    }

    const testPaper = {
      id: `paper_cit_${i}`,
      title: `Clinical Efficacy and Long-Term Safety Investigation of Study Protocol #${i}`,
      year: yr,
      journal: jn,
      authors,
      doi,
      citationCount: i * 15
    };

    const cit = formatCitations(testPaper);
    const ris = generateRIS(testPaper);

    let ok = true;
    let err = '';

    // Check APA format
    if (!cit.apa || typeof cit.apa !== 'string' || cit.apa.length < 15) {
      ok = false; err = 'APA empty or invalid';
    }
    // Check BibTeX format
    if (!cit.bibtex || !cit.bibtex.includes('@article{') || !cit.bibtex.includes('title   =')) {
      ok = false; err = 'BibTeX syntax error';
    }
    // Check RIS format
    if (!ris || !ris.includes('TY  - JOUR') || !ris.includes('ER  -')) {
      ok = false; err = 'RIS format invalid';
    }
    // Check in-text format
    if (!cit.inText || !cit.inText.startsWith('(') || !cit.inText.endsWith(')')) {
      ok = false; err = 'In-text citation malformed';
    }
    // Check >20 authors ellipsis
    if (authors.length > 20 && !cit.apa.includes('...')) {
      ok = false; err = 'APA >20 authors did not include ellipsis (...)';
    }

    record(i, 'CitationStandards', `Citation format & parsing scenario #${i}`, ok, err);
  }

  // ===========================================================================
  // MODULE 2: THESIS REVIEW, TRANSLATION QUALITY & RELEVANCE (Scenarios 251 - 500)
  // ===========================================================================
  console.log('\n--- STARTING MODULE 2: THESIS REVIEW, TRANSLATION & TOPIC RELEVANCE (251 - 500) ---');

  const THESIS_TOPICS = [
    { topic: 'Tip 2 diyabette SGLT2 inhibitörleri ve kardiyorenal koruma', specialty: 'Endokrinoloji', keywords: ['sglt2', 'diyabet', 'böbrek', 'kardiyo', 'koruma'] },
    { topic: 'Kalp yetersizliğinde empagliflozin ve ejeksiyon fraksiyonu', specialty: 'Kardiyoloji', keywords: ['kalp', 'empagliflozin', 'ejeksiyon', 'yetersizlik'] },
    { topic: 'Obezite tedavisinde haftalık semaglutid ve tirzepatid karşılaştırması', specialty: 'Endokrinoloji', keywords: ['obezite', 'semaglutid', 'tirzepatid', 'kilo'] },
    { topic: 'Pediatrik viral enfeksiyonlarda aspirin kullanımı ve Reye sendromu', specialty: 'Pediatri', keywords: ['aspirin', 'reye', 'çocuk', 'pediatrik'] },
    { topic: 'Erken evre Alzheimer hastalığında lekanemab ve amiloid klirensi', specialty: 'Nöroloji', keywords: ['alzheimer', 'lekanemab', 'amiloid', 'bilişsel'] },
    { topic: 'MASH ve karaciğer fibrozisinde resmetirom etkinliği', specialty: 'Gastroenteroloji', keywords: ['mash', 'resmetirom', 'karaciğer', 'fibrozis'] },
    { topic: 'Prematüre bebeklerde anne sütü ve nekrotizan enterokolit profilaksisi', specialty: 'Neonatoloji', keywords: ['prematüre', 'anne sütü', 'bebek', 'enterokolit'] },
    { topic: 'Romatoid artritte anti-TNF biyolojik tedaviler ve radyolojik progresyon', specialty: 'Romatoloji', keywords: ['romatoid', 'artrit', 'anti-tnf', 'biyolojik'] },
    { topic: 'Metastatik küçük hücreli dışı akciğer kanserinde pembrolizumab immünoterapisi', specialty: 'Onkoloji', keywords: ['kanser', 'pembrolizumab', 'immünoterapi', 'akciğer'] },
    { topic: 'Akut iskemik inmede ilk 4.5 saatte intravenöz alteplaz trombolizi', specialty: 'Nöroloji', keywords: ['inme', 'alteplaz', 'tromboliz', 'iskemik'] },
    { topic: 'Kronik gut artritinde allopurinol ve ürik asit hedef seviyeleri', specialty: 'Romatoloji', keywords: ['gut', 'allopurinol', 'ürik asit', 'artrit'] },
    { topic: 'Aralıklı oruç protokollerinin insülin duyarlılığı ve lipid profiline etkisi', specialty: 'Beslenme', keywords: ['aralıklı oruç', 'insülin', 'açlık', 'glukoz'] },
    { topic: 'Kreatin monohidrat takviyesi ve uyku yoksunluğunda bilişsel hafıza', specialty: 'Nörobilim', keywords: ['kreatin', 'hafıza', 'bilişsel', 'bellek'] },
    { topic: 'Polikistik over sendromunda metformin ve ovülasyon indüksiyonu', specialty: 'Kadın Doğum', keywords: ['pcos', 'metformin', 'polikistik', 'ovülasyon'] },
    { topic: 'Dirençli çocukluk çağı epilepsisinde ketojenik diyet protokolü', specialty: 'Pediatrik Nöroloji', keywords: ['epilepsi', 'ketojenik', 'diyet', 'çocuk'] },
    { topic: 'Ağır aort darlığı olan yaşlı hastalarda TAVI yöntemi ve sağkalım', specialty: 'Kardiyoloji', keywords: ['tavi', 'aort', 'kapak', 'yaşlı'] },
    { topic: 'Sjögren sendromunda pilokarpin ile kserostomi ve kseroftalmi tedavisi', specialty: 'Romatoloji', keywords: ['sjögren', 'pilokarpin', 'ağız kuruluğu', 'tükürük'] },
    { topic: 'Astım hastalarında düzenli inhale kortikosteroid kullanımı ve alevlenmeler', specialty: 'Göğüs Hastalıkları', keywords: ['astım', 'kortikosteroid', 'inhale', 'solunum'] },
    { topic: 'HIV enfeksiyonu risk grubunda tenofovir bazlı PrEP profilaksisi', specialty: 'Enfeksiyon', keywords: ['hiv', 'prep', 'tenofovir', 'profilaksi'] },
    { topic: 'Büyük depresif bozuklukta bilişsel davranışçı terapi ve remisyon oranları', specialty: 'Psikiyatri', keywords: ['depresyon', 'bilişsel davranışçı', 'terapi', 'remisyon'] }
  ];

  for (let i = 251; i <= 500; i++) {
    const baseObj = THESIS_TOPICS[(i - 251) % THESIS_TOPICS.length];
    const isEnglish = (i % 2 === 0);
    const lang = isEnglish ? 'en' : 'tr';
    const topicText = isEnglish 
      ? `Evaluation of ${baseObj.topic} clinical outcomes` 
      : `${baseObj.topic} klinik incelemesi ve tez analizi`;

    // 1. Test refineThesisTopic
    const refined = refineThesisTopic(topicText);
    const hasHypotheses = refined.hypotheses?.length === 3 && refined.subQuestions?.length === 4 && refined.thesisChapterStructure?.length === 6;

    // 2. Test generateLiteratureReview
    const samplePaper = {
      id: `paper_lit_${i}`,
      title: `${baseObj.keywords[0].toUpperCase()} clinical trial in ${baseObj.specialty}`,
      keyTakeaway: `${baseObj.keywords[0]} tedavisi klinik grupta anlamlı ve pozitif sonuçlar sağlamıştır.`,
      trTakeaway: `${baseObj.keywords[0]} tedavisi klinik grupta anlamlı ve pozitif sonuçlar sağlamıştır.`,
      year: 2023,
      studyType: i % 3 === 0 ? 'Meta-Analysis' : (i % 3 === 1 ? 'Randomized Controlled Trial' : 'Cohort Study'),
      authors: [{ name: 'Kasapoğlu E' }, { name: 'Demir A' }],
      sampleSize: 'n = 850'
    };

    let litOk = true;
    let litErr = '';

    try {
      const review = await generateLiteratureReview({
        papers: [samplePaper],
        thesisTopic: topicText,
        language: lang
      });

      if (!review.content || review.content.length < 200) {
        litOk = false; litErr = 'Review content too short';
      }

      // Check Translation Quality: Zero English Leakage in Turkish reviews
      if (!isEnglish) {
        const forbiddenEnglish = ['results showed that', 'in this study', 'we investigated', 'conclusion:', 'background:'];
        const lowerContent = review.content.toLowerCase();
        for (const bad of forbiddenEnglish) {
          if (lowerContent.includes(bad)) {
            litOk = false; litErr = `English leakage detected: "${bad}"`;
            break;
          }
        }
        // Check topic relevance: Must mention at least 1 core topic keyword
        const mentionsCore = baseObj.keywords.some(kw => lowerContent.includes(kw.toLowerCase()));
        if (!mentionsCore) {
          litOk = false; litErr = `Off-topic drift: review does not mention core keywords of "${baseObj.topic}"`;
        }
      }
    } catch (e) {
      litOk = false;
      litErr = e.message;
    }

    record(i, 'ThesisReviewAndRelevance', `Thesis review synthesis & relevance #${i} (${baseObj.specialty})`, hasHypotheses && litOk, litErr);
  }

  // ===========================================================================
  // MODULE 3: STUDY COMPARISON MATRIX & VARIABLE EXTRACTION (Scenarios 501 - 700)
  // ===========================================================================
  console.log('\n--- STARTING MODULE 3: STUDY COMPARISON MATRIX & EXTRACTION (501 - 700) ---');

  const CLINICAL_SPECIALTIES = [
    { name: 'Kardiyovasküler', pop: 'Kardiyovasküler', intKey: 'sglt2', intLabel: 'SGLT2', text: 'Heart failure patients with preserved ejection fraction received empagliflozin SGLT2 inhibitor.' },
    { name: 'Endokrinoloji', pop: 'Diyabet', intKey: 'metformin', intLabel: 'Metformin', text: 'Diabetic patients with insulin resistance treated with metformin pharmacotherapy.' },
    { name: 'Obezite', pop: 'Obezite', intKey: 'semaglutide', intLabel: 'Semaglutid', text: 'Obese adults received weekly semaglutide 2.4 mg with substantial weight loss.' },
    { name: 'Nöroloji', pop: 'Nörolojik', intKey: 'lecanemab', intLabel: 'Lekanemab', text: 'Early Alzheimer disease patients treated with lecanemab amyloid monoclonal antibody.' },
    { name: 'Pediatri', pop: 'Çocuk', intKey: 'aspirin', intLabel: 'Aspirin', text: 'Pediatric children with varicella treated with aspirin developed Reye syndrome.' },
    { name: 'Gastroenteroloji', pop: 'Gastroenteroloji', intKey: 'resmetirom', intLabel: 'Resmetirom', text: 'Patients with NASH and liver fibrosis treated with resmetirom.' },
    { name: 'Neonatoloji', pop: 'Yenidoğan', intKey: 'breast milk', intLabel: 'Anne Sütü', text: 'Premature newborn infants fed maternal breast milk to prevent necrotizing enterocolitis.' },
    { name: 'Romatoloji', pop: 'Romatolojik', intKey: 'anti-tnf', intLabel: 'Anti-TNF', text: 'Rheumatoid arthritis patients received infliximab anti-TNF biologics.' },
    { name: 'Onkoloji', pop: 'Onkolojik', intKey: 'pembrolizumab', intLabel: 'Pembrolizumab', text: 'Lung cancer oncology patients received pembrolizumab checkpoint immunotherapy.' },
    { name: 'Nefroloji', pop: 'Böbrek', intKey: 'sglt2', intLabel: 'SGLT2', text: 'Chronic kidney disease CKD patients treated with dapagliflozin SGLT2 inhibitor.' }
  ];

  for (let i = 501; i <= 700; i++) {
    const spec = CLINICAL_SPECIALTIES[(i - 501) % CLINICAL_SPECIALTIES.length];
    const testPaper = {
      id: `matrix_p_${i}`,
      title: `${spec.name} Clinical Trial Study #${i}`,
      abstract: spec.text + ` Large effect size observed in sample n = ${100 + i}.`,
      year: 2020 + (i % 5),
      journal: 'Academic Clinical Journal',
      authors: [{ name: 'Kasapoğlu E' }],
      keyTakeaway: 'Klinik parametrelerde belirgin iyileşme kaydedildi.'
    };

    const matrix = buildStudyMatrix([testPaper]);
    const row = matrix[0];

    let ok = true;
    let err = '';

    if (!row) {
      ok = false; err = 'Matrix row was empty';
    } else {
      if (!row.population.includes(spec.pop)) {
        ok = false; err = `Population mismatch: expected ${spec.pop}, got ${row.population}`;
      }
      if (!row.intervention.includes(spec.intLabel)) {
        ok = false; err = `Intervention mismatch: expected ${spec.intLabel}, got ${row.intervention}`;
      }
      if (!row.studyName.includes('Kasapoğlu')) {
        ok = false; err = `Author studyName malformed: ${row.studyName}`;
      }
    }

    record(i, 'StudyMatrix', `Matrix extraction #${i} (${spec.name})`, ok, err);
  }

  // ===========================================================================
  // MODULE 4: MANUSCRIPT CLAIM AUDITOR & VERIFICATION (Scenarios 701 - 850)
  // ===========================================================================
  console.log('\n--- STARTING MODULE 4: MANUSCRIPT CLAIM AUDITOR (701 - 850) ---');

  const VALID_MEDICAL_CLAIMS = [
    'Aralıklı oruç protokolleri insülin duyarlılığını artırmakta ve açlık kan şekerini düşürmektedir.',
    'Semaglutid haftalık 2.4 mg dozda obezite hastalarında anlamlı kilo kaybı sağlamaktadır.',
    'SGLT2 inhibitörleri kalp yetersizliği hastalarında kardiyovasküler mortaliteyi ve hospitalizasyonu azaltır.',
    'Aspirin viral enfeksiyon geçiren çocuklarda Reye sendromu riski nedeniyle kontrendikedir.',
    'Kızamık-kabakulak-kızamıkçık (KKK) aşısı ile otizm spektrum bozukluğu arasında nedensel ilişki yoktur.',
    'Kreatin monohidrat takviyesi nöronal biyomarkerları ve kısa vadeli hafıza performansını destekler.',
    'Metformin polikistik over sendromlu kadınlarda ovülasyon oranlarını ve insülin duyarlılığını artırır.',
    'Trastuzumab HER2-pozitif meme kanserli hastalarda progresyonsuz sağkalımı uzatır.',
    'Lekanemab erken evre Alzheimer hastalarında amiloid plaklarını temizleyerek bilişsel gerilemeyi yavaşlatır.',
    'Alteplaz tPA akut iskemik inmede ilk 4.5 saat içinde uygulandığında nörolojik morbiditeyi azaltır.'
  ];

  const BOGUS_CLAIMS = [
    'Ay taşlarının tozunu koklamak tip 2 diyabeti anında yok eder.',
    'Manyetik bakır bileklik takmak Alzheimer amiloid plaklarını 24 saatte eritir.',
    'Tebeşir tozu yemek kemik kırıklarını dakikalar içinde tamamen kaynatır.',
    'Gözlere limon sıkmak miyop ve astigmatı tamamen sıfırlar.',
    'Altın suyu içmek koroner arter plaklarını bir günde tamamen temizler.'
  ];

  for (let i = 701; i <= 850; i++) {
    const isBogus = (i % 3 === 0);
    const claimSentence = isBogus 
      ? BOGUS_CLAIMS[(i - 701) % BOGUS_CLAIMS.length] 
      : VALID_MEDICAL_CLAIMS[(i - 701) % VALID_MEDICAL_CLAIMS.length];

    try {
      const res = await request('/api/pro/audit-manuscript', {
        method: 'POST',
        body: JSON.stringify({ text: claimSentence })
      });

      const claim = res.data?.claims?.[0];
      let ok = true;
      let err = '';

      if (!claim) {
        ok = false; err = 'No claim returned from auditor';
      } else if (isBogus) {
        // Bogus claim MUST NOT be verified!
        if (claim.status === 'verified') {
          ok = false; err = `False positive: Bogus claim was verified (${claimSentence})`;
        }
      } else {
        // Legitimate medical claim must be handled gracefully without 500
        if (!claim.status || !['verified', 'needs_citation'].includes(claim.status)) {
          ok = false; err = `Invalid claim status: ${claim.status}`;
        }
      }

      record(i, 'ManuscriptAuditor', `Claim audit #${i} (${isBogus ? 'Bogus/Unsubstantiated' : 'Valid Medical'})`, ok, err);
    } catch (e) {
      record(i, 'ManuscriptAuditor', `Claim audit #${i}`, false, e.message);
    }
  }

  // ===========================================================================
  // MODULE 5: CITATION SNOWBALLING, GAPS & MULTI-TURN CONTINUITY (851 - 1000)
  // ===========================================================================
  console.log('\n--- STARTING MODULE 5: CITATION SNOWBALLING, GAPS & CONTINUITY (851 - 1000) ---');

  for (let i = 851; i <= 1000; i++) {
    let ok = true;
    let err = '';
    const subType = (i - 851) % 5;

    try {
      if (subType === 0) {
        // Research gaps analysis
        const gaps = findResearchGaps({
          papers: [
            { title: 'Short term study', abstract: '3 month follow-up in adults.' },
            { title: 'Second cohort', abstract: 'Cross-sectional survey in clinic.' }
          ],
          thesisTopic: `Araştırma Alanı #${i}`
        });
        ok = gaps.identifiedGaps?.length > 0 && gaps.suggestedContributions?.length > 0;
      } else if (subType === 1) {
        // Private document ingestion & retrieval
        const doc = ingestPrivateDocument({
          filename: `klinik_tez_verisi_${i}.txt`,
          title: `Özel Tez Notu #${i}`,
          content: 'Klinik biyobelirteç takip notları.',
          chapterId: 'chap-2'
        });
        ok = doc && doc.id.startsWith('priv_') && doc.chapterId === 'chap-2';
      } else if (subType === 2) {
        // Medical terminology translation
        const tr = await translateTextToTurkish('Randomized double-blind placebo-controlled trial evaluating safety and clinical efficacy.');
        ok = tr && (tr.includes('randomize') || tr.includes('etkinlik') || tr.includes('güvenlik') || tr.includes('çift kör'));
      } else if (subType === 3) {
        // Citation snowballing with plain OpenAlex ID
        const res = await request('/api/pro/snowball?paperId=W2741809807');
        ok = res.ok && res.data.basePaper !== undefined && Array.isArray(res.data.backwardCitations);
      } else {
        // Batch RIS export integration
        const batchPapers = [
          { title: `Landmark Trial Alpha #${i}`, year: 2022, authors: ['Demir M'], journal: 'NEJM' },
          { title: `Landmark Trial Beta #${i}`, year: 2023, authors: ['Kaya S'], journal: 'Lancet' }
        ];
        const risContent = generateBatchRIS(batchPapers);
        ok = risContent.includes('TY  - JOUR') && risContent.includes('ER  -') && (risContent.match(/TY  - JOUR/g) || []).length === 2;
      }
    } catch (e) {
      ok = false;
      err = e.message;
    }

    record(i, 'SnowballingGapsContinuity', `Snowballing, gaps & continuity scenario #${i}`, ok, err);
  }

  console.log('\n================================================================================');
  console.log(`🎯 1,000-SCENARIO SUITE COMPLETE: ${passed}/1000 PASSED (${((passed / 1000) * 100).toFixed(1)}%) | ${failed} FAILED`);
  console.log('================================================================================\n');

  if (failures.length > 0) {
    console.log(`⚠️ Summary of ${failures.length} Failures:`);
    failures.slice(0, 10).forEach(f => console.log(` - #${f.id} [${f.module}]: ${f.details}`));
  }

  return { passed, failed, failures };
}

run1000Scenarios().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
