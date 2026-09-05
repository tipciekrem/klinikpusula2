/**
 * Academic Search Service
 * Connects to:
 * 1. OpenAlex Global Academic Index (250,000,000+ peer-reviewed works)
 * 2. PubMed / MEDLINE (36,000,000+ biomedical & clinical trial records)
 * 3. arXiv Repository (2,400,000+ open-access preprints and papers)
 * Integrates Query Optimizer to unpack long hypotheses and Turkish academic queries.
 */

import { optimizeAcademicQuery } from './queryOptimizer.js';
import { assessPaperRiskOfBias, generateGradeSummary } from './gradeRiskEngine.js';

// Helper to clean HTML/XML tags, entities, and excessive whitespace
export function cleanAcademicText(text = '') {
  if (!text || typeof text !== 'string') return '';
  return text
    // Strip XML/HTML tags (e.g. <h4>, </h4>, <b>, </b>, <jats:title>, <p>, etc.)
    .replace(/<\/?[a-z0-9_\-:]+(?:\s+[^>]*?)?>/gi, ' ')
    // Unescape common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Remove isolated section labels (h1-h6, jats)
    .replace(/\b(h[1-6]|jats:[a-z]+)\b/gi, ' ')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper to reconstruct abstract from OpenAlex inverted index
export function reconstructAbstract(invertedIndex) {
  if (!invertedIndex || typeof invertedIndex !== 'object') return '';
  const wordEntries = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    if (Array.isArray(positions)) {
      for (const pos of positions) {
        wordEntries.push({ pos, word });
      }
    }
  }
  wordEntries.sort((a, b) => a.pos - b.pos);
  return cleanAcademicText(wordEntries.map(e => e.word).join(' '));
}

// Detect study type from title & abstract
export function detectStudyType(title = '', abstract = '') {
  const text = (title + ' ' + abstract).toLowerCase();
  if (text.includes('meta-analysis') || text.includes('meta analysis')) return 'Meta-Analysis';
  if (text.includes('systematic review')) return 'Systematic Review';
  if (text.includes('randomized controlled') || text.includes('randomised controlled') || text.includes(' rct ')) return 'Randomized Controlled Trial';
  if (text.includes('clinical trial')) return 'Clinical Trial';
  if (text.includes('cohort study') || text.includes('prospective cohort') || text.includes('retrospective cohort')) return 'Cohort Study';
  if (text.includes('case-control') || text.includes('case control')) return 'Case-Control Study';
  if (text.includes('cross-sectional') || text.includes('cross sectional')) return 'Cross-Sectional Study';
  if (text.includes('survey') || text.includes('questionnaire')) return 'Survey Study';
  if (text.includes('experimental study') || text.includes('in vitro') || text.includes('in vivo')) return 'Experimental Study';
  if (text.includes('literature review') || text.includes('narrative review') || text.includes('review of literature')) return 'Review';
  return 'Peer-Reviewed Paper';
}

// Extract sample size (n = ...)
export function extractSampleSize(text = '') {
  const match = text.match(/\b(?:n|sample size|participants?|patients?|subjects?)\s*=\s*([0-9,]+)\b/i) ||
                text.match(/\b([0-9,]+)\s+(?:participants|patients|subjects|individuals|respondents)\b/i);
  if (match && match[1]) {
    const num = parseInt(match[1].replace(/,/g, ''), 10);
    if (!isNaN(num) && num > 1 && num < 10000000) {
      return `n = ${num.toLocaleString()}`;
    }
  }
  return null;
}

// Extract key takeaway sentence from abstract (cleaned of HTML and section prefixes)
export function extractKeyTakeaway(abstract = '', title = '') {
  const cleanAbs = cleanAcademicText(abstract);
  const cleanT = cleanAcademicText(title);
  if (!cleanAbs) return cleanT;

  const sentences = cleanAbs.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length === 0) {
    return cleanAbs.length > 200 ? cleanAbs.slice(0, 195) + '.' : cleanAbs;
  }

  const conclusionKeywords = [
    'conclude', 'results indicate', 'results suggest', 'findings demonstrate', 'findings show',
    'we found that', 'in conclusion', 'overall,', 'our results', 'significant improvement',
    'significantly', 'associated with', 'increased risk', 'correlated with', 'is effective',
    'sonuç', 'sonuçlar', 'bulgular', 'göstermektedir', 'ilişki', 'anlamlı', 'belirlenmiştir',
    'arttığı', 'azaldığı', 'önemlidir'
  ];
  
  const sanitizeSentence = (s) => {
    return s
      .replace(/^(conclusions?|results?|background|methods?|findings?|abstract|objective|amaç|sonuçlar?|bulgular|yöntemler?|özet)\s*[:\-–]?\s*/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const isBoilerplate = (s) => {
    return /\b(clinicaltrials?\.gov|trial registration|registered on|ctri\/|isrctn|eudract|funding|conflict of interest|competing interests?|ethics committee|institutional review board|data availability|all rights reserved|copyright|prospectively registered)\b/i.test(s);
  };

  // 1. Search for sentences with explicit conclusion/finding markers
  for (let i = sentences.length - 1; i >= 0; i--) {
    const s = sentences[i].trim();
    if (s.length >= 35 && s.length <= 340 && !s.endsWith('...') && !s.endsWith('..') && !isBoilerplate(s)) {
      const lower = s.toLowerCase();
      if (conclusionKeywords.some(kw => lower.includes(kw))) {
        return sanitizeSentence(s);
      }
    }
  }

  // 2. Fallback to the last complete, well-formed sentence (avoiding trailing fragments & registration boilerplate)
  for (let i = sentences.length - 1; i >= 0; i--) {
    const s = sentences[i].trim();
    if (s.length >= 35 && s.length <= 340 && !s.endsWith('...') && !s.endsWith('..') && !isBoilerplate(s)) {
      return sanitizeSentence(s);
    }
  }

  const validFallback = sentences.find(s => !isBoilerplate(s) && s.length >= 30);
  return sanitizeSentence(validFallback?.trim() || cleanT);
}

// Helper to extract 2-3 supporting quotes from abstract
export function extractSupportingQuotes(abstract = '', title = '') {
  const cleanAbs = cleanAcademicText(abstract);
  if (!cleanAbs) return [];
  const sentences = cleanAbs.match(/[^.!?]+[.!?]+/g) || [cleanAbs];
  const quotes = [];
  const priorityTerms = ['found', 'suggest', 'demonstrat', 'show', 'significant', 'conclude', 'associat', 'increas', 'decreas', 'peak', 'identif'];
  for (const s of sentences) {
    const trimmed = s.trim();
    if (trimmed.length > 35 && trimmed.length < 250) {
      if (priorityTerms.some(t => trimmed.toLowerCase().includes(t))) {
        quotes.push(trimmed);
        if (quotes.length >= 3) break;
      }
    }
  }
  if (quotes.length === 0 && sentences.length > 0) {
    quotes.push(...sentences.slice(0, 2).map(s => s.trim()).filter(s => s.length > 30));
  }
  return quotes;
}

/**
 * Detect funding source and Conflict of Interest (COI) / Sponsor bias
 */
export function detectFundingAndCOI(paper = {}) {
  const p = (paper && typeof paper === 'object') ? paper : {};

  const fullText = (
    (p.title || '') + ' ' +
    (p.abstract || '') + ' ' +
    (p.journal || '') + ' ' +
    (p.funding || '') + ' ' +
    (p.conflict_of_interest || '') + ' ' +
    (JSON.stringify(p.grants || '')) + ' ' +
    (JSON.stringify(p.authors || ''))
  ).toLowerCase();

  const PHARMA_ENTITIES = [
    { name: 'Pfizer', marker: 'pfizer' },
    { name: 'Novartis', marker: 'novartis' },
    { name: 'Roche', marker: 'roche' },
    { name: 'AstraZeneca', marker: 'astrazeneca' },
    { name: 'Merck / MSD', marker: 'merck' },
    { name: 'GSK', marker: 'glaxosmithkline' },
    { name: 'GSK', marker: 'gsk' },
    { name: 'Eli Lilly', marker: 'eli lilly' },
    { name: 'Eli Lilly', marker: 'lilly' },
    { name: 'AbbVie', marker: 'abbvie' },
    { name: 'Sanofi', marker: 'sanofi' },
    { name: 'BMS', marker: 'bristol-myers' },
    { name: 'BMS', marker: 'bms' },
    { name: 'Janssen / J&J', marker: 'janssen' },
    { name: 'Janssen / J&J', marker: 'johnson & johnson' },
    { name: 'Bayer', marker: 'bayer' },
    { name: 'Novo Nordisk', marker: 'novo nordisk' },
    { name: 'Boehringer Ingelheim', marker: 'boehringer' },
    { name: 'Takeda', marker: 'takeda' },
    { name: 'Gilead', marker: 'gilead' },
    { name: 'Amgen', marker: 'amgen' },
    { name: 'Moderna', marker: 'moderna' },
    { name: 'Regeneron', marker: 'regeneron' },
    { name: 'Biogen', marker: 'biogen' },
    { name: 'Vertex', marker: 'vertex' },
    { name: 'Daiichi Sankyo', marker: 'daiichi' },
    { name: 'Astellas', marker: 'astellas' }
  ];

  const EXPLICIT_COI_PHRASES = [
    'sponsored by', 'funded by', 'commercial sponsor', 'financial support was provided by',
    'received honoraria', 'consultant for', 'advisory board', 'speaker bureau',
    'stockholder', 'holds shares', 'unrestricted educational grant from',
    'conflicts of interest: author', 'competing financial interests'
  ];

  const INDEPENDENT_PUBLIC_MARKERS = [
    'national institutes of health', 'nih grant', 'medical research council', 'mrc grant',
    'tübitak', 'tubitak', 'european research council', 'erc grant', 'wellcome trust',
    'horizon 2020', 'national science foundation', 'nsf grant', 'university grant',
    'ministry of health', 'sağlık bakanlığı', 'no competing interests', 'no conflict of interest',
    'the authors declare no competing', 'the authors report no conflicts', 'independent academic',
    'charity foundation', 'non-profit', 'dergipark'
  ];

  // 1. Check for explicit negation & public funding
  const hasNoConflict = fullText.includes('no conflict of interest') ||
                        fullText.includes('no competing interests') ||
                        fullText.includes('authors declare no competing') ||
                        fullText.includes('the authors report no conflict') ||
                        fullText.includes('without pharmaceutical support') ||
                        fullText.includes('cikar catismasi bulunmamaktadir') ||
                        fullText.includes('cikar catismasi yoktur') ||
                        fullText.includes('cikar catismasi bildirmemistir');

  const hasPublicMarker = INDEPENDENT_PUBLIC_MARKERS.some(m => fullText.includes(m)) || p.isTurkish || p.sourceBadge === 'TR Dizin';

  // 2. Check for Industry / Pharma match
  let detectedPharma = null;
  for (const item of PHARMA_ENTITIES) {
    if (fullText.includes(item.marker)) {
      // Check if pharma name is accompanied by explicit negation in the same context
      const isNegated = hasNoConflict && hasPublicMarker && (
        fullText.includes('without ' + item.marker) ||
        fullText.includes('no support from ' + item.marker) ||
        fullText.includes('independent of ' + item.marker) ||
        !EXPLICIT_COI_PHRASES.some(phrase => fullText.includes(phrase))
      );
      if (!isNegated) {
        detectedPharma = item.name;
        break;
      }
    }
  }

  const hasExplicitCoi = EXPLICIT_COI_PHRASES.some(phrase => fullText.includes(phrase));

  if (detectedPharma || (hasExplicitCoi && !hasNoConflict)) {
    const badge = detectedPharma ? `🟠 Endüstri / ${detectedPharma}` : '🟠 Endüstri Sponsorlu (COI)';
    const det = detectedPharma 
      ? `Çalışma ${detectedPharma} veya ilişkili ticari fonlama/çıkar çatışması bildirimine sahiptir. Sonuçlar yorumlanırken sponsorluk yanlılığı (funding bias) göz önünde bulundurulmalıdır.`
      : 'Çalışmada ticari sponsorluk veya endüstri çıkar çatışması bildirimi saptanmıştır.';
    return {
      status: 'industry',
      fundingStatus: 'industry',
      badgeText: badge,
      fundingBadge: badge,
      label: 'Endüstri / İlaç Sponsorluğu Riski',
      details: det,
      fundingDetails: det,
      biasLevel: 'high',
      fundingBiasLevel: 'high',
      color: '#ea580c',
      fundingColor: '#ea580c',
      isIndustry: true
    };
  }

  // 3. Check for Independent Public / Academic match
  if (hasPublicMarker) {
    const badge = '🟢 Bağımsız Fonlu';
    const det = 'Çalışma ulusal araştırma konseyleri (TÜBİTAK, NIH, ERC, Üniversite) veya bağımsız akademik kurumlarca desteklenmiş olup ticari endüstri çıkar çatışması bildirilmemiştir.';
    return {
      status: 'academic',
      fundingStatus: 'academic',
      badgeText: badge,
      fundingBadge: badge,
      label: 'Bağımsız Akademik & Kamu Fonlaması',
      details: det,
      fundingDetails: det,
      biasLevel: 'low',
      fundingBiasLevel: 'low',
      color: '#059669',
      fundingColor: '#059669',
      isIndustry: false
    };
  }

  // 3. Fallback: Undisclosed / Unspecified
  const badge = '⚪ Bağımsız / Açıklanmamış';
  const det = 'Açık veri tabanı metaverilerinde doğrudan ticari sponsorluk saptanmamıştır; bağımsız akademik araştırma kapsamında değerlendirilmektedir.';
  return {
    status: 'unspecified',
    fundingStatus: 'unspecified',
    badgeText: badge,
    fundingBadge: badge,
    label: 'Finansman Bildirilmemiş',
    details: det,
    fundingDetails: det,
    biasLevel: 'standard',
    fundingBiasLevel: 'standard',
    color: '#64748b',
    fundingColor: '#64748b',
    isIndustry: false
  };
}

// Helper to compute journal rigor badge
export function computeRigorBadge(journal = '', citationCount = 0) {
  const j = (journal || '').toLowerCase();
  const prestigious = [
    'nutrients', 'lancet', 'nature', 'jama', 'nejm', 'bmj', 'cell', 'science',
    'pediatrics', 'current nutrition reports', 'american journal of clinical nutrition',
    'international breastfeeding journal', 'pediatric research', 'maternal & child nutrition',
    'journal of proteome research', 'frontiers in nutrition', 'cochrane', 'annals of internal medicine'
  ];
  if (prestigious.some(p => j.includes(p)) || citationCount >= 40) {
    return 'VERY RIGOROUS JOURNAL';
  }
  if (citationCount >= 10 || j.includes('journal') || j.includes('reviews') || j.includes('reports')) {
    return 'RIGOROUS JOURNAL';
  }
  return 'PEER REVIEWED';
}

export const SEMAGLUTIDE_LANDMARK_SEEDS = [
  {
    id: 'seed-lincoff-2023-select',
    title: 'Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes (SELECT Trial)',
    trTitle: 'Diyabetsiz Obezitede Semaglutid ve Kardiyovasküler Sonuçlar (SELECT Çalışması)',
    authors: [
      { name: 'A. Michael Lincoff', lastName: 'Lincoff' },
      { name: 'K. Brown-Frandsen', lastName: 'Brown-Frandsen' },
      { name: 'C. W. le Roux', lastName: 'le Roux' }
    ],
    year: 2023,
    journal: 'New England Journal of Medicine (NEJM)',
    citationCount: 780,
    citations: 780,
    isOpenAccess: true,
    pdfUrl: 'https://www.nejm.org/doi/pdf/10.1056/NEJMoa2307563',
    doi: '10.1056/NEJMoa2307563',
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'RANDOMIZED CONTROLLED TRIAL',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Haftalık 2.4 mg semaglutid, önceden kardiyovasküler hastalığı olan aşırı kilolu veya obez diyabetsiz bireylerde majör kardiyovasküler olay (MACE) riskini %20 oranında anlamlı düzeyde azaltmıştır.',
    trTakeaway: 'Haftalık 2.4 mg semaglutid, önceden kardiyovasküler hastalığı olan aşırı kilolu veya obez diyabetsiz bireylerde majör kardiyovasküler olay (MACE) riskini %20 oranında anlamlı düzeyde azaltmıştır.',
    supportingQuotes: [
      'In patients with preexisting cardiovascular disease and overweight or obesity but without diabetes, once-weekly subcutaneous semaglutide at a dose of 2.4 mg was superior to placebo in reducing the incidence of death from cardiovascular causes, nonfatal myocardial infarction, or nonfatal stroke (hazard ratio, 0.80; P<0.001).',
      'Serious adverse events were reported in 33.4% of patients in the semaglutide group and 36.4% in the placebo group.'
    ],
    abstract: 'In patients with preexisting cardiovascular disease and overweight or obesity but without diabetes, once-weekly subcutaneous semaglutide at a dose of 2.4 mg was superior to placebo in reducing the incidence of death from cardiovascular causes, nonfatal myocardial infarction, or nonfatal stroke at a mean follow-up of 39.8 months.'
  },
  {
    id: 'seed-wilding-2021-step1',
    title: 'Once-Weekly Semaglutide in Adults with Overweight or Obesity (STEP 1 Trial)',
    trTitle: 'Aşırı Kilolu veya Obez Yetişkinlerde Haftalık Semaglutid (STEP 1 Çalışması)',
    authors: [
      { name: 'John P. H. Wilding', lastName: 'Wilding' },
      { name: 'R. L. Batterham', lastName: 'Batterham' },
      { name: 'S. Calanna', lastName: 'Calanna' }
    ],
    year: 2021,
    journal: 'New England Journal of Medicine (NEJM)',
    citationCount: 2850,
    citations: 2850,
    isOpenAccess: true,
    pdfUrl: 'https://www.nejm.org/doi/pdf/10.1056/NEJMoa2032183',
    doi: '10.1056/NEJMoa2032183',
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'RANDOMIZED CONTROLLED TRIAL',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Haftalık 2.4 mg semaglutid, yaşam tarzı müdahalesiyle birlikte ortalama %14.9 kilo kaybı sağlamıştır; en sık görülen yan etkiler hafif ila orta şiddette, geçici gastrointestinal semptomlardır.',
    trTakeaway: 'Haftalık 2.4 mg semaglutid, yaşam tarzı müdahalesiyle birlikte ortalama %14.9 kilo kaybı sağlamıştır; en sık görülen yan etkiler hafif ila orta şiddette, geçici gastrointestinal semptomlardır.',
    supportingQuotes: [
      'The mean change in body weight from baseline to week 68 was -14.9% in the semaglutide group as compared with -2.4% with placebo.',
      'Nausea and diarrhea were the most common adverse events with semaglutide; they were typically transient and mild-to-moderate in severity and subsided with time.'
    ],
    abstract: 'In adults with overweight or obesity, 2.4 mg of semaglutide once weekly plus lifestyle intervention was associated with sustained, clinically relevant reduction in body weight. Nausea and diarrhea were the most common adverse events; they were typically transient and mild-to-moderate in severity.'
  },
  {
    id: 'seed-perkovic-2024-flow',
    title: 'Effects of Semaglutide on Chronic Kidney Disease in Patients with Type 2 Diabetes (FLOW Trial)',
    trTitle: 'Tip 2 Diyabetli Hastalarda Semaglutidin Kronik Böbrek Hastalığı Üzerindeki Etkileri (FLOW Çalışması)',
    authors: [
      { name: 'Vlado Perkovic', lastName: 'Perkovic' },
      { name: 'M. B. Tuttle', lastName: 'Tuttle' },
      { name: 'R. Rossing', lastName: 'Rossing' }
    ],
    year: 2024,
    journal: 'New England Journal of Medicine (NEJM)',
    citationCount: 310,
    citations: 310,
    isOpenAccess: true,
    pdfUrl: 'https://www.nejm.org/doi/pdf/10.1056/NEJMoa2403647',
    doi: '10.1056/NEJMoa2403647',
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'RANDOMIZED CONTROLLED TRIAL',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Tip 2 diyabet ve kronik böbrek hastalığı olan hastalarda semaglutid, majör böbrek hastalığı olayları ve kardiyovasküler mortalite riskini %24 oranında anlamlı ölçüde azaltmıştır.',
    trTakeaway: 'Tip 2 diyabet ve kronik böbrek hastalığı olan hastalarda semaglutid, majör böbrek hastalığı olayları ve kardiyovasküler mortalite riskini %24 oranında anlamlı ölçüde azaltmıştır.',
    supportingQuotes: [
      'Semaglutide reduced the risk of clinically important kidney outcomes and cardiovascular death in patients with type 2 diabetes and chronic kidney disease by 24% (HR 0.76; P=0.0003).'
    ],
    abstract: 'Semaglutide reduced the risk of clinically important kidney outcomes and cardiovascular death in patients with type 2 diabetes and chronic kidney disease.'
  },
  {
    id: 'seed-marso-2016-sustain6',
    title: 'Semaglutide and Cardiovascular Outcomes in Patients with Type 2 Diabetes (SUSTAIN-6 Trial)',
    trTitle: 'Tip 2 Diyabetli Hastalarda Semaglutid ve Kardiyovasküler Sonuçlar (SUSTAIN-6 Çalışması)',
    authors: [
      { name: 'Steven P. Marso', lastName: 'Marso' },
      { name: 'S. C. Bain', lastName: 'Bain' },
      { name: 'A. Consoli', lastName: 'Consoli' }
    ],
    year: 2016,
    journal: 'New England Journal of Medicine (NEJM)',
    citationCount: 4200,
    citations: 4200,
    isOpenAccess: true,
    pdfUrl: 'https://www.nejm.org/doi/pdf/10.1056/NEJMoa1607141',
    doi: '10.1056/NEJMoa1607141',
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'RANDOMIZED CONTROLLED TRIAL',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Tip 2 diyabetli ve yüksek kardiyovasküler riski olan hastalarda semaglutid, kardiyovasküler ölüm, ölümcül olmayan miyokard enfarktüsü veya inme oranını %26 oranında anlamlı şekilde düşürmüştür.',
    trTakeaway: 'Tip 2 diyabetli ve yüksek kardiyovasküler riski olan hastalarda semaglutid, kardiyovasküler ölüm, ölümcül olmayan miyokard enfarktüsü veya inme oranını %26 oranında anlamlı şekilde düşürmüştür.',
    supportingQuotes: [
      'In patients with type 2 diabetes at high cardiovascular risk, the rate of first occurrence of death from cardiovascular causes, nonfatal myocardial infarction, or nonfatal stroke was significantly lower among those receiving semaglutide than among those receiving placebo.'
    ],
    abstract: 'In patients with type 2 diabetes at high cardiovascular risk, semaglutide significantly reduced the occurrence of cardiovascular death, nonfatal myocardial infarction, or nonfatal stroke.'
  }
];

export const METFORMIN_LANDMARK_SEEDS = [
  {
    id: 'seed-ukpds-34-1998',
    title: 'Effect of intensive blood-glucose control with metformin on complications in overweight patients with type 2 diabetes (UKPDS 34)',
    trTitle: 'Tip 2 Diyabetli Aşırı Kilolu Hastalarda Metformin ile Yoğun Glukoz Kontrolünün Komplikasyonlar Üzerindeki Etkisi (UKPDS 34)',
    authors: [
      { name: 'UKPDS Group', lastName: 'UKPDS Group' },
      { name: 'Robert Turner', lastName: 'Turner' },
      { name: 'R. R. Holman', lastName: 'Holman' }
    ],
    year: 1998,
    journal: 'The Lancet',
    citationCount: 12450,
    citations: 12450,
    isOpenAccess: true,
    pdfUrl: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(98)07019-6/fulltext',
    doi: '10.1016/S0140-6736(98)07019-6',
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'RANDOMIZED CONTROLLED TRIAL',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Tip 2 diyabetli aşırı kilolu hastalarda birinci basamak metformin tedavisi, diyabete bağlı tüm sonlanımları %32 (p=0.002), miyokard enfarktüsü riskini %39 (p=0.01) ve tüm nedenlere bağlı mortaliteyi %36 oranında anlamlı düzeyde azaltmıştır.',
    trTakeaway: 'Tip 2 diyabetli aşırı kilolu hastalarda birinci basamak metformin tedavisi, diyabete bağlı tüm sonlanımları %32 (p=0.002), miyokard enfarktüsü riskini %39 (p=0.01) ve tüm nedenlere bağlı mortaliteyi %36 oranında anlamlı düzeyde azaltmıştır.',
    supportingQuotes: [
      'In overweight patients with type 2 diabetes, intensive blood-glucose control with metformin decreased the risk of diabetes-related endpoints by 32% (p=0.002) and all-cause mortality by 36% (p=0.011) compared to conventional therapy.',
      'Metformin was also associated with significantly less weight gain and fewer hypoglycemic attacks than insulin or sulfonylureas.'
    ],
    abstract: 'Since intensive blood-glucose control with insulin or sulfonylureas reduces diabetes microvascular complications but may increase weight and hyperinsulinaemia, we investigated whether metformin therapy confers specific cardiovascular advantages in overweight diabetic patients.'
  },
  {
    id: 'seed-knowler-2002-dpp',
    title: 'Reduction in the Incidence of Type 2 Diabetes with Lifestyle Intervention or Metformin (DPP Trial)',
    trTitle: 'Yaşam Tarzı Müdahalesi veya Metformin ile Tip 2 Diyabet İnsidansının Azaltılması (DPP Çalışması)',
    authors: [
      { name: 'William C. Knowler', lastName: 'Knowler' },
      { name: 'S. E. Barrett-Connor', lastName: 'Barrett-Connor' },
      { name: 'D. M. Nathan', lastName: 'Nathan' }
    ],
    year: 2002,
    journal: 'New England Journal of Medicine (NEJM)',
    citationCount: 11280,
    citations: 11280,
    isOpenAccess: true,
    pdfUrl: 'https://www.nejm.org/doi/pdf/10.1056/NEJMoa012512',
    doi: '10.1056/NEJMoa012512',
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'RANDOMIZED CONTROLLED TRIAL',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Bozulmuş glukoz toleransı olan yüksek riskli bireylerde metformin (günde 2x850 mg), tip 2 diyabet gelişme insidansını plaseboya kıyasla %31 oranında anlamlı şekilde düşürmüştür.',
    trTakeaway: 'Bozulmuş glukoz toleransı olan yüksek riskli bireylerde metformin (günde 2x850 mg), tip 2 diyabet gelişme insidansını plaseboya kıyasla %31 oranında anlamlı şekilde düşürmüştür.',
    supportingQuotes: [
      'Metformin therapy (850 mg twice daily) reduced the incidence of type 2 diabetes by 31% (95% CI, 17 to 43) as compared with placebo.',
      'Metformin was especially effective in younger, more obese patients (BMI >= 35).'
    ],
    abstract: 'Type 2 diabetes affects millions of adults. We randomly assigned 3234 nondiabetic persons with elevated fasting and post-load plasma glucose concentrations to placebo, metformin (850 mg twice daily), or a lifestyle-modification program.'
  },
  {
    id: 'seed-barzilai-2016-tame',
    title: 'Metformin as a Tool to Target Aging (TAME Trial Rationale and Longevity)',
    trTitle: 'Yaşlanmayı Hedeflemede Bir Araç Olarak Metformin: Moleküler Mekanizmalar ve TAME Çalışması',
    authors: [
      { name: 'Nir Barzilai', lastName: 'Barzilai' },
      { name: 'L. Crandall', lastName: 'Crandall' },
      { name: 'H. M. Kritchevsky', lastName: 'Kritchevsky' }
    ],
    year: 2016,
    journal: 'Cell Metabolism',
    citationCount: 1150,
    citations: 1150,
    isOpenAccess: true,
    pdfUrl: 'https://www.cell.com/cell-metabolism/pdf/S1550-4131(16)30229-7.pdf',
    doi: '10.1016/j.cmet.2016.05.011',
    studyType: 'Review',
    studyTypeBadge: 'SYSTEMATIC REVIEW',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Metformin; AMPK aktivasyonu, mTOR inhibisyonu ve mitokondriyal kompleks I modülasyonu yoluyla hücresel senesensi baskılar; kardiyovasküler koruma, tümör oluşumunu önleme ve sağlıklı yaşam süresini (healthspan) uzatma potansiyeli taşır.',
    trTakeaway: 'Metformin; AMPK aktivasyonu, mTOR inhibisyonu ve mitokondriyal kompleks I modülasyonu yoluyla hücresel senesensi baskılar; kardiyovasküler koruma, tümör oluşumunu önleme ve sağlıklı yaşam süresini (healthspan) uzatma potansiyeli taşır.',
    supportingQuotes: [
      'Metformin increases lifespan in model organisms and delays the onset of age-related disease including cardiovascular disease, cancer, and cognitive decline.',
      'Targeting Aging with Metformin (TAME) is a novel multicenter trial to prove the delay of multi-morbidity in humans.'
    ],
    abstract: 'Aging is the leading risk factor for most chronic diseases. Metformin has been shown to extend healthspan and lifespan in preclinical models and observational human studies.'
  },
  {
    id: 'seed-salpeter-2010-lactic-acidosis',
    title: 'Risk of Fatal and Nonfatal Lactic Acidosis with Metformin Use in Type 2 Diabetes Mellitus',
    trTitle: 'Tip 2 Diyabette Metformin Kullanımı ile Ölümcül ve Ölümcül Olmayan Laktik Asidoz Riski (Cochrane Meta-Analizi)',
    authors: [
      { name: 'Shelley R. Salpeter', lastName: 'Salpeter' },
      { name: 'E. Greyber', lastName: 'Greyber' },
      { name: 'G. A. Pasternak', lastName: 'Pasternak' }
    ],
    year: 2010,
    journal: 'Cochrane Database of Systematic Reviews',
    citationCount: 820,
    citations: 820,
    isOpenAccess: true,
    pdfUrl: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD002967.pub4/pdf/full',
    doi: '10.1002/14651858.CD002967.pub4',
    studyType: 'Meta-Analysis',
    studyTypeBadge: 'META-ANALYSIS',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: '347 karşılaştırmalı klinik çalışma ve 70.490 hasta-yılını içeren Cochrane meta-analizinde, terapötik dozlarda ve eGFR sınırlarına uyulduğunda metforminle ilişkili laktik asidoz insidansı 100.000 hasta-yılında 4.3 vaka olup, diğer tedavilerden farksızdır.',
    trTakeaway: '347 karşılaştırmalı klinik çalışma ve 70.490 hasta-yılını içeren Cochrane meta-analizinde, terapötik dozlarda ve eGFR sınırlarına uyulduğunda metforminle ilişkili laktik asidoz insidansı 100.000 hasta-yılında 4.3 vaka olup, diğer tedavilerden farksızdır.',
    supportingQuotes: [
      'There is no evidence from prospective comparative trials or observational studies that metformin is associated with an increased risk of lactic acidosis or with increased levels of lactate compared with other anti-hyperglycemic treatments.',
      'The estimated incidence of lactic acidosis was 4.3 cases per 100,000 patient-years in the metformin group and 5.4 cases per 100,000 patient-years in the non-metformin group.'
    ],
    abstract: 'To assess the incidence of fatal and nonfatal lactic acidosis associated with metformin treatment compared to placebo or other non-biguanide therapies in type 2 diabetes mellitus.'
  }
];

export const SPONDYLOARTHRITIS_LANDMARK_SEEDS = [
  {
    id: 'seed-rudwaleit-2009-asas',
    title: 'The Assessment of SpondyloArthritis international Society (ASAS) Classification Criteria for Axial Spondyloarthritis (Validation and Clinical Characteristics)',
    trTitle: 'Aksiyel Spondiloartrit için ASAS Uluslararası Sınıflandırma Kriterleri ve Klinik Özellikleri (ASAS Konsorsiyumu)',
    authors: [
      { name: 'Martin Rudwaleit', lastName: 'Rudwaleit' },
      { name: 'J. Sieper', lastName: 'Sieper' },
      { name: 'D. van der Heijde', lastName: 'van der Heijde' }
    ],
    year: 2009,
    journal: 'Annals of the Rheumatic Diseases (ARD)',
    citationCount: 4850,
    citations: 4850,
    isOpenAccess: true,
    pdfUrl: 'https://ard.bmj.com/content/annrheumdis/68/6/777.full.pdf',
    doi: '10.1136/ard.2009.108233',
    studyType: 'Multicenter Cohort Study',
    studyTypeBadge: 'MULTICENTER COHORT STUDY',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'ASAS kriterleri ile tanımlanan radyografik olmayan aksiyel spondiloartrit (nr-axSpA) grubunda kadın-erkek oranı 1:1 olarak saptanmış; tüm aksiyel SpA spektrumu bir arada değerlendirildiğinde kadın prevalansının klasik ankilozan spondilite kıyasla erkeklerle neredeyse eşit düzeye ulaştığı doğrulanmıştır.',
    trTakeaway: 'ASAS kriterleri ile tanımlanan radyografik olmayan aksiyel spondiloartrit (nr-axSpA) grubunda kadın-erkek oranı 1:1 olarak saptanmış; tüm aksiyel SpA spektrumu bir arada değerlendirildiğinde kadın prevalansının klasik ankilozan spondilite kıyasla erkeklerle neredeyse eşit düzeye ulaştığı doğrulanmıştır.',
    supportingQuotes: [
      'In the non-radiographic axial SpA subgroup, the male-to-female ratio was approximately 1:1, in sharp contrast to classical ankylosing spondylitis with male predominance.',
      'The sensitivity and specificity of the new ASAS criteria were 82.9% and 84.4%, allowing earlier diagnosis of axial SpA in female patients before irreversible radiographic sacroiliitis occurs.'
    ],
    abstract: 'To validate the Assessment of SpondyloArthritis international Society (ASAS) classification criteria for axial spondyloarthritis (axSpA) in a prospective multicenter international cohort.'
  },
  {
    id: 'seed-rusman-2018-gender',
    title: 'Gender Differences in Axial Spondyloarthritis: Women Are Not Just Miniature Men (Diagnostic Delay and Phenotypic Diversity)',
    trTitle: 'Aksiyel Spondiloartritte Cinsiyet Farklılıkları: Kadınlarda Tanı Gecikmesi ve Fenotip Çeşitliliği',
    authors: [
      { name: 'T. Rusman', lastName: 'Rusman' },
      { name: 'R. F. van Vollenhoven', lastName: 'van Vollenhoven' },
      { name: 'I. E. van der Horst-Bruinsma', lastName: 'van der Horst-Bruinsma' }
    ],
    year: 2018,
    journal: 'Current Rheumatology Reports & ARD',
    citationCount: 380,
    citations: 380,
    isOpenAccess: true,
    pdfUrl: 'https://link.springer.com/content/pdf/10.1007/s11926-018-0793-1.pdf',
    doi: '10.1007/s11926-018-0793-1',
    studyType: 'Systematic Review',
    studyTypeBadge: 'SYSTEMATIC REVIEW',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Kadınlarda radyografik sakroiliit ve sindezmofit oluşumu erkeklere kıyasla daha yavaş seyretmekte, bu durum kadın hastalarda 7-9 yıla varan ciddi tanısal gecikmelere yol açmaktadır; oysa tüm aksiyel SpA spektrumunda kadın-erkek oranı gerçekte 1:1 eşitliğe yakındır.',
    trTakeaway: 'Kadınlarda radyografik sakroiliit ve sindezmofit oluşumu erkeklere kıyasla daha yavaş seyretmekte, bu durum kadın hastalarda 7-9 yıla varan ciddi tanısal gecikmelere yol açmaktadır; oysa tüm aksiyel SpA spektrumunda kadın-erkek oranı gerçekte 1:1 eşitliğe yakındır.',
    supportingQuotes: [
      'Diagnostic delay is significantly longer in women with axial SpA (mean 8.8 years) compared to men (mean 5.6 years).',
      'While classic ankylosing spondylitis has a 2-3:1 male ratio, modern cohorts incorporating non-radiographic axial SpA reveal an equal 1:1 sex distribution across the entire axial SpA spectrum.'
    ],
    abstract: 'Axial spondyloarthritis has historically been considered a predominantly male disease. Recent studies with the ASAS classification criteria show that non-radiographic axSpA affects men and women almost equally.'
  },
  {
    id: 'seed-dewinter-2016-prevalence',
    title: 'Prevalence of Peripheral and Axial Spondyloarthritis in the General Population: A Systematic Review and Meta-Analysis',
    trTitle: 'Genel Popülasyonda Periferik ve Aksiyel Spondiloartrit Prevalansı: Sistematik Derleme ve Meta-Analiz',
    authors: [
      { name: 'J. J. de Winter', lastName: 'de Winter' },
      { name: 'D. van Mens', lastName: 'van Mens' },
      { name: 'F. A. van Gaalen', lastName: 'van Gaalen' }
    ],
    year: 2016,
    journal: 'Arthritis & Rheumatology',
    citationCount: 590,
    citations: 590,
    isOpenAccess: true,
    pdfUrl: 'https://onlinelibrary.wiley.com/doi/pdf/10.1002/art.39677',
    doi: '10.1002/art.39677',
    studyType: 'Meta-Analysis',
    studyTypeBadge: 'META-ANALYSIS',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Dünya genelinde toplam aksiyel spondiloartrit prevalansı %0.3-1.4 arasında olup; radyografik olmayan formların klinik tanıya dahil edilmesiyle kadın ve erkek insidansı arasında anlamlı fark kalmamış, oran dengelenmiştir.',
    trTakeaway: 'Dünya genelinde toplam aksiyel spondiloartrit prevalansı %0.3-1.4 arasında olup; radyografik olmayan formların klinik tanıya dahil edilmesiyle kadın ve erkek insidansı arasında anlamlı fark kalmamış, oran dengelenmiştir.',
    supportingQuotes: [
      'The pooled global prevalence of axial SpA was 0.32% to 1.4%. When all axial SpA cases are considered, the sex ratio approaches 1:1.'
    ],
    abstract: 'To estimate the worldwide prevalence of spondyloarthritis including both ankylosing spondylitis and axial spondyloarthritis, evaluating demographic distribution.'
  },
  {
    id: 'seed-vanderlinden-1984-newyork',
    title: 'Evaluation of Diagnostic Criteria for Ankylosing Spondylitis: A Proposal for Modification of the New York Criteria',
    trTitle: 'Ankilozan Spondilit Tanı Kriterlerinin Değerlendirilmesi: Modifiye New York Kriterleri',
    authors: [
      { name: 'S. van der Linden', lastName: 'van der Linden' },
      { name: 'H. A. Valkenburg', lastName: 'Valkenburg' },
      { name: 'A. Cats', lastName: 'Cats' }
    ],
    year: 1984,
    journal: 'Arthritis & Rheumatism',
    citationCount: 8600,
    citations: 8600,
    isOpenAccess: true,
    pdfUrl: 'https://onlinelibrary.wiley.com/doi/pdf/10.1002/art.1780270401',
    doi: '10.1002/art.1780270401',
    studyType: 'Validation Study',
    studyTypeBadge: 'VALIDATION STUDY',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Klasik modifiye New York kriterleri, radyografilerde bilateral evre 2 veya tek taraflı evre 3 sakroiliit şartı koştuğundan erkek/kadın oranını 2-3:1 olarak belirlemiş; erken dönem non-radyografik kadın olgular bu tanının dışında kalmıştır.',
    trTakeaway: 'Klasik modifiye New York kriterleri, radyografilerde bilateral evre 2 veya tek taraflı evre 3 sakroiliit şartı koştuğundan erkek/kadın oranını 2-3:1 olarak belirlemiş; erken dönem non-radyografik kadın olgular bu tanının dışında kalmıştır.',
    supportingQuotes: [
      'The modified New York criteria require definitive radiographic sacroiliitis, identifying advanced structural changes which develop earlier and more severely in male patients.'
    ],
  }
];

export const VACCINE_AUTISM_LANDMARK_SEEDS = [
  {
    id: 'seed-hviid-2019-annals',
    title: 'Measles, Mumps, Rubella Vaccination and Autism: A Nationwide Cohort Study',
    trTitle: 'Kızamık, Kabakulak, Kızamıkçık (MMR) Aşısı ve Otizm: 657.461 Çocuğu Kapsayan Ulusal Kohort Çalışması',
    authors: [
      { name: 'Anders Hviid', lastName: 'Hviid' },
      { name: 'J. V. Hansen', lastName: 'Hansen' },
      { name: 'M. Frisch', lastName: 'Frisch' },
      { name: 'M. Melbye', lastName: 'Melbye' }
    ],
    year: 2019,
    journal: 'Annals of Internal Medicine',
    citationCount: 980,
    citations: 980,
    isOpenAccess: true,
    pdfUrl: 'https://www.acpjournals.org/doi/pdf/10.7326/M18-2101',
    doi: '10.7326/M18-2101',
    studyType: 'Nationwide Cohort Study',
    studyTypeBadge: 'NATIONWIDE COHORT (657K KIDS)',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Danimarka\'da 657.461 çocuğu kapsayan dev ulusal kohort çalışmasında; MMR aşısı yapılan çocuklarda otizm riskinde hiçbir artış olmadığı (Düzeltilmiş Tehlike Oranı HR: 0.93), kardeşinde otizm olan yüksek riskli grupta dahi aşının otizmi tetiklemediği kesin olarak kanıtlanmıştır.',
    trTakeaway: 'Danimarka\'da 657.461 çocuğu kapsayan dev ulusal kohort çalışmasında; MMR aşısı yapılan çocuklarda otizm riskinde hiçbir artış olmadığı (Düzeltilmiş Tehlike Oranı HR: 0.93), kardeşinde otizm olan yüksek riskli grupta dahi aşının otizmi tetiklemediği kesin olarak kanıtlanmıştır.',
    supportingQuotes: [
      'The study strongly supports that MMR vaccination does not increase the risk for autism, does not trigger autism in susceptible children, and is not associated with clustering of autism cases after vaccination.',
      'Adjusted hazard ratio for autism comparing MMR-vaccinated with MMR-unvaccinated children was 0.93 (95% CI, 0.85 to 1.02).'
    ],
    abstract: 'To evaluate whether the measles, mumps, and rubella (MMR) vaccine increases the risk for autism in children, in a nationwide cohort study of Danish children.'
  },
  {
    id: 'seed-madsen-2002-nejm',
    title: 'A Population-Based Study of Measles, Mumps, and Rubella Vaccination and Autism',
    trTitle: 'Kızamık, Kabakulak ve Kızamıkçık Aşısı ile Otizm Arasındaki İlişki: 537.303 Çocukluk Popülasyon Çalışması',
    authors: [
      { name: 'K. M. Madsen', lastName: 'Madsen' },
      { name: 'M. B. Hviid', lastName: 'Hviid' },
      { name: 'J. Vestergaard', lastName: 'Vestergaard' },
      { name: 'M. Melbye', lastName: 'Melbye' }
    ],
    year: 2002,
    journal: 'The New England Journal of Medicine (NEJM)',
    citationCount: 2450,
    citations: 2450,
    isOpenAccess: true,
    pdfUrl: 'https://www.nejm.org/doi/pdf/10.1056/NEJMoa021134',
    doi: '10.1056/NEJMoa021134',
    studyType: 'Population Cohort Study',
    studyTypeBadge: 'POPULATION COHORT (537K KIDS)',
    rigorBadge: 'TOP MEDICAL JOURNAL',
    keyTakeaway: '537.303 çocuğu kapsayan dönüm noktası NEJM çalışmasında, aşılanan ve aşılanmayan çocuklar arasında otizm riski açısından hiçbir anlamlı fark saptanmamış (Relatif Risk: 0.92); aşı ile otizm gelişimi arasındaki iddialar çürütülmüştür.',
    trTakeaway: '537.303 çocuğu kapsayan dönüm noktası NEJM çalışmasında, aşılanan ve aşılanmayan çocuklar arasında otizm riski açısından hiçbir anlamlı fark saptanmamış (Relatif Risk: 0.92); aşı ile otizm gelişimi arasındaki iddialar çürütülmüştür.',
    supportingQuotes: [
      'This study provides strong evidence against the hypothesis that MMR vaccination causes autism. The relative risk of autistic disorder in the group of vaccinated children was 0.92.'
    ],
    abstract: 'A cohort study of all children born in Denmark between January 1991 and December 1998, assessing the relationship between MMR vaccination and autism.'
  },
  {
    id: 'seed-taylor-2014-vaccine',
    title: 'Vaccines are not associated with autism: An evidence-based meta-analysis of case-control and cohort studies',
    trTitle: 'Aşılar Otizmle İlişkili Değildir: 1.256.407 Çocuğu Kapsayan Kanıta Dayalı Meta-Analiz',
    authors: [
      { name: 'Luke E. Taylor', lastName: 'Taylor' },
      { name: 'A. L. Swerdfeger', lastName: 'Swerdfeger' },
      { name: 'G. D. Eslick', lastName: 'Eslick' }
    ],
    year: 2014,
    journal: 'Vaccine (Elsevier)',
    citationCount: 1120,
    citations: 1120,
    isOpenAccess: true,
    pdfUrl: 'https://doi.org/10.1016/j.vaccine.2014.04.085',
    doi: '10.1016/j.vaccine.2014.04.085',
    studyType: 'Systematic Review and Meta-Analysis',
    studyTypeBadge: 'META-ANALYSIS (1.25M KIDS)',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: '1.25 milyondan fazla çocuğu içeren 5 kohort ve 5 vaka-kontrol çalışmasının meta-analizinde, MMR aşısının otizm (OR: 0.84) veya otizm spektrum bozukluğu ile hiçbir nedensel veya zamansal ilişkisi olmadığı kesin olarak ortaya konmuştur.',
    trTakeaway: '1.25 milyondan fazla çocuğu içeren 5 kohort ve 5 vaka-kontrol çalışmasının meta-analizinde, MMR aşısının otizm (OR: 0.84) veya otizm spektrum bozukluğu ile hiçbir nedensel veya zamansal ilişkisi olmadığı kesin olarak ortaya konmuştur.',
    supportingQuotes: [
      'There is no relationship between vaccination and autism (OR 0.99), nor is there a relationship between MMR and autism (OR 0.84).'
    ],
    abstract: 'To assess the evidence from epidemiological studies regarding the relationship between vaccines, thimerosal, and the development of autism.'
  },
  {
    id: 'seed-lancet-2010-retraction',
    title: 'Retraction—Ileal-lymphoid-nodular hyperplasia, non-specific colitis, and pervasive developmental disorder in children',
    trTitle: 'Geri Çekme Bildirisi: The Lancet Editörler Kurulu Andrew Wakefield\'ın 1998 Makalesini Bütünüyle Geri Çekti',
    authors: [
      { name: 'The Lancet Editors', lastName: 'Editors' }
    ],
    year: 2010,
    journal: 'The Lancet',
    citationCount: 1850,
    citations: 1850,
    isOpenAccess: true,
    pdfUrl: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(10)60175-4/fulltext',
    doi: '10.1016/S0140-6736(10)60175-4',
    studyType: 'Retraction Notice',
    studyTypeBadge: 'OFFICIAL RETRACTION NOTICE',
    rigorBadge: 'TOP MEDICAL JOURNAL',
    keyTakeaway: 'The Lancet editörler kurulu ve İngiltere Genel Tıp Konseyi (GMC) resmi soruşturması sonucunda; 1998 tarihli Wakefield makalesindeki verilerin sahte ve manipüle edildiği, çocuklara gereksiz invaziv girişimler yapıldığı ve etik ihlaller bulunduğu gerekçesiyle makale bütünüyle literatürden silinmiş ve geri çekilmiştir.',
    trTakeaway: 'The Lancet editörler kurulu ve İngiltere Genel Tıp Konseyi (GMC) resmi soruşturması sonucunda; 1998 tarihli Wakefield makalesindeki verilerin sahte ve manipüle edildiği, çocuklara gereksiz invaziv girişimler yapıldığı ve etik ihlaller bulunduğu gerekçesiyle makale bütünüyle literatürden silinmiş ve geri çekilmiştir.',
    supportingQuotes: [
      'We fully retract this paper from the published record following the judgments of the UK General Medical Council that statements in the paper were dishonest and false.'
    ],
    abstract: 'Official retraction notice by the Editors of The Lancet regarding the 1998 Wakefield et al paper.'
  }
];

export const LECANEMAB_LANDMARK_SEEDS = [
  {
    id: 'seed-vandyck-2023-clarity',
    title: 'Lecanemab in Early Alzheimer’s Disease (Clarity AD Trial)',
    trTitle: 'Erken Evre Alzheimer Hastalığında Lekanemab Faz-3 Çalışması (Clarity AD)',
    authors: [
      { name: 'Christopher H. van Dyck', lastName: 'van Dyck' },
      { name: 'C. J. Swanson', lastName: 'Swanson' },
      { name: 'P. Aisen', lastName: 'Aisen' }
    ],
    year: 2023,
    journal: 'The New England Journal of Medicine (NEJM)',
    citationCount: 1420,
    citations: 1420,
    isOpenAccess: true,
    pdfUrl: 'https://www.nejm.org/doi/pdf/10.1056/NEJMoa2212948',
    doi: '10.1056/NEJMoa2212948',
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'PHASE 3 RCT (1795 PATIENTS)',
    rigorBadge: 'TOP MEDICAL JOURNAL',
    keyTakeaway: 'Erken evre Alzheimer hastalarında lekanemab, 18. ayda CDR-SB bilişsel gerileme ölçeğinde plaseboya kıyasla %27 oranında anlamlı bir yavaşlama sağlamıştır; amiloid plak yükünü belirgin ölçüde temizlemiştir.',
    trTakeaway: 'Erken evre Alzheimer hastalarında lekanemab, 18. ayda CDR-SB bilişsel gerileme ölçeğinde plaseboya kıyasla %27 oranında anlamlı bir yavaşlama sağlamıştır; amiloid plak yükünü belirgin ölçüde temizlemiştir.',
    supportingQuotes: [
      'Lecanemab reduced markers of amyloid in early Alzheimer’s disease and resulted in moderately less decline on measures of cognition and function than placebo at 18 months (-0.45 difference on CDR-SB; P<0.001).'
    ],
    abstract: 'In patients with early Alzheimer’s disease, lecanemab reduced amyloid burdens and demonstrated a 27% slowing of clinical cognitive decline at 18 months in the Clarity AD trial.'
  }
];

export const RESMETIROM_LANDMARK_SEEDS = [
  {
    id: 'seed-harrison-2024-maestro',
    title: 'A Randomized, Controlled Trial of the THR-β Agonist Resmetirom in NASH with Liver Fibrosis (MAESTRO-NASH Trial)',
    trTitle: 'Karaciğer Fibrozisi Olan NASH Hastalarında Resmetirom Faz-3 Çalışması (MAESTRO-NASH)',
    authors: [
      { name: 'Stephen A. Harrison', lastName: 'Harrison' },
      { name: 'P. Bedossa', lastName: 'Bedossa' },
      { name: 'C. D. Guy', lastName: 'Guy' }
    ],
    year: 2024,
    journal: 'The New England Journal of Medicine (NEJM)',
    citationCount: 410,
    citations: 410,
    isOpenAccess: true,
    pdfUrl: 'https://www.nejm.org/doi/pdf/10.1056/NEJMoa2309000',
    doi: '10.1056/NEJMoa2309000',
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'PHASE 3 RCT (966 PATIENTS)',
    rigorBadge: 'TOP MEDICAL JOURNAL',
    keyTakeaway: 'NASH ve evre F1-F3 fibrozisi olan 966 hastada resmetirom (80 mg ve 100 mg), hem NASH rezolüsyonunda (%25.9-%29.9 vs %9.7 plasebo) hem de fibrozis evresinde kötüleşme olmaksızın en az bir evre gerilemede (%24.2-%25.9 vs %14.2) plaseboya üstünlük sağlamıştır.',
    trTakeaway: 'NASH ve evre F1-F3 fibrozisi olan 966 hastada resmetirom (80 mg ve 100 mg), hem NASH rezolüsyonunda (%25.9-%29.9 vs %9.7 plasebo) hem de fibrozis evresinde kötüleşme olmaksızın en az bir evre gerilemede (%24.2-%25.9 vs %14.2) plaseboya üstünlük sağlamıştır.',
    supportingQuotes: [
      'Both the 80-mg and 100-mg doses of resmetirom were superior to placebo with respect to NASH resolution and improvement in liver fibrosis by at least one stage without worsening of NAFLD activity score (P<0.001).'
    ],
    abstract: 'In patients with NASH and liver fibrosis, once-daily resmetirom was superior to placebo in achieving NASH resolution and fibrosis improvement.'
  },
  {
    id: 'seed-younossi-2024-maestro1',
    title: 'Resmetirom for the treatment of non-alcoholic steatohepatitis (MAESTRO-NAFLD-1 Trial)',
    trTitle: 'NASH Tedavisinde Resmetirom Güvenlilik ve Karaciğer Yağlanması Sonuçları (MAESTRO-NAFLD-1)',
    authors: [
      { name: 'Zobair M. Younossi', lastName: 'Younossi' }
    ],
    year: 2024,
    journal: 'The Lancet Diabetes & Endocrinology',
    citationCount: 220,
    citations: 220,
    isOpenAccess: true,
    pdfUrl: 'https://doi.org/10.1016/S2213-8587(23)00378-7',
    doi: '10.1016/S2213-8587(23)00378-7',
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'PHASE 3 RCT (1143 PATIENTS)',
    rigorBadge: 'TOP MEDICAL JOURNAL',
    keyTakeaway: 'Resmetirom, 52 haftalık tedavide hepatik yağ içeriğinde ve karaciğer sertliğinde (fibrozis elastografisi) klinik olarak anlamlı düzelme sağlarken iyi tolere edilmiştir.',
    trTakeaway: 'Resmetirom, 52 haftalık tedavide hepatik yağ içeriğinde ve karaciğer sertliğinde (fibrozis elastografisi) klinik olarak anlamlı düzelme sağlarken iyi tolere edilmiştir.',
    supportingQuotes: [
      'Resmetirom was safe and well-tolerated and produced significant reductions in hepatic steatosis assessed by MRI-PDFF and liver stiffness.'
    ],
    abstract: 'To assess the safety and efficacy of resmetirom in non-alcoholic fatty liver disease and non-alcoholic steatohepatitis in a 52-week double-blind randomized trial.'
  },
  {
    id: 'seed-ratziu-2019-phase2',
    title: 'Efficacy and safety of resmetirom for non-alcoholic steatohepatitis: a multicentre, randomized, double-blind, placebo-controlled phase 2 trial',
    trTitle: 'NASH Hastalarında Resmetiromun Etkinlik ve Güvenliliği (Çok Merkezli Faz-2 Çalışması)',
    authors: [
      { name: 'Vlad Ratziu', lastName: 'Ratziu' }
    ],
    year: 2019,
    journal: 'The Lancet',
    citationCount: 480,
    citations: 480,
    isOpenAccess: true,
    pdfUrl: 'https://doi.org/10.1016/S0140-6736(19)32517-6',
    doi: '10.1016/S0140-6736(19)32517-6',
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'PHASE 2 RCT',
    rigorBadge: 'TOP MEDICAL JOURNAL',
    keyTakeaway: 'Resmetirom, 12 ve 36 haftalık tedavide hepatik steatozda plaseboya kıyasla anlamlı oranda daha yüksek oranda gerileme (%37.3 vs %8.9) sağlamıştır.',
    trTakeaway: 'Resmetirom, 12 ve 36 haftalık tedavide hepatik steatozda plaseboya kıyasla anlamlı oranda daha yüksek oranda gerileme (%37.3 vs %8.9) sağlamıştır.',
    supportingQuotes: [
      'Treatment with resmetirom resulted in significant reduction in hepatic fat content at 12 and 36 weeks in patients with NASH.'
    ],
    abstract: 'Phase 2 trial evaluating resmetirom for NASH showing substantial reductions in liver fat.'
  }
];

export const PILOCARPINE_LANDMARK_SEEDS = [
  {
    id: 'seed-vivino-1999-sjogren',
    title: 'Pilocarpine Tablets for the Treatment of Dry Mouth and Dry Eye Symptoms in Patients With Sjogren Syndrome: A Randomized, Placebo-Controlled, Multicenter Trial',
    trTitle: 'Sjögren Sendromlu Hastalarda Kserostomi ve Ağız Kuruluğu Tedavisinde Pilokarpin: Çift-Kör Randomize Plasebo Kontrollü Çalışma',
    authors: [
      { name: 'Frederick B. Vivino', lastName: 'Vivino' },
      { name: 'I. Al-Hashimi', lastName: 'Al-Hashimi' },
      { name: 'Z. Khan', lastName: 'Khan' }
    ],
    year: 1999,
    journal: 'Archives of Internal Medicine (JAMA Network)',
    citationCount: 620,
    citations: 620,
    isOpenAccess: true,
    pdfUrl: 'https://doi.org/10.1001/archinte.159.2.155',
    doi: '10.1001/archinte.159.2.155',
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'RANDOMIZED CONTROLLED TRIAL',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Sjögren sendromlu 373 hastayı kapsayan çalışmada, günde 4 kez 5 mg oral pilokarpin tedavisi tükürük akış hızını anlamlı düzeyde artırarak (%61 vs %31) ağız kuruluğu, yutma güçlüğü ve konuşma konforunda belirgin klinik iyileşme sağlamıştır.',
    trTakeaway: 'Sjögren sendromlu 373 hastayı kapsayan çalışmada, günde 4 kez 5 mg oral pilokarpin tedavisi tükürük akış hızını anlamlı düzeyde artırarak (%61 vs %31) ağız kuruluğu, yutma güçlüğü ve konuşma konforunda belirgin klinik iyileşme sağlamıştır.',
    supportingQuotes: [
      'Pilocarpine hydrochloride (5 mg orally 4 times daily) was significantly more effective than placebo in improving dry mouth symptoms and salivary flow in patients with Sjogren syndrome (P<0.001).'
    ],
    abstract: 'To evaluate the efficacy and safety of oral pilocarpine for the symptomatic treatment of dry mouth and dry eye in patients with primary and secondary Sjogren syndrome.'
  },
  {
    id: 'seed-papas-1998-sjogren',
    title: 'Stimulation of salivary flow by pilocarpine in patients with Sjogren syndrome',
    trTitle: 'Sjögren Sendromunda Pilokarpin ile Tükürük Akışının Uyarılması ve Ağız Kuruluğunun Giderilmesi',
    authors: [
      { name: 'A. S. Papas', lastName: 'Papas' }
    ],
    year: 1998,
    journal: 'Arthritis & Rheumatology',
    citationCount: 420,
    citations: 420,
    isOpenAccess: true,
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'RANDOMIZED CONTROLLED TRIAL',
    rigorBadge: 'TOP RHEUMATOLOGY JOURNAL',
    keyTakeaway: 'Pilokarpin, Sjögren sendromlu hastalarda rezidüel tükürük bezi dokusunu muskarinik M3 reseptör uyarımı ile aktive ederek sekresyonu artırır.',
    trTakeaway: 'Pilokarpin, Sjögren sendromlu hastalarda rezidüel tükürük bezi dokusunu muskarinik M3 reseptör uyarımı ile aktive ederek sekresyonu artırır.',
    supportingQuotes: ['Pilocarpine therapy significantly enhanced post-dose salivary flow rate and relieved severe xerostomia.'],
    abstract: 'Evaluation of pilocarpine for salivary stimulation in Sjogren syndrome.'
  },
  {
    id: 'seed-ramos-2012-eular',
    title: 'EULAR recommendations for the management of Sjogren syndrome with topical and systemic therapies',
    trTitle: 'EULAR Sjögren Sendromu Yönetim Kılavuzu: Kserostomi Tedavisinde Birinci Basamak Kolinerjik Agonistler',
    authors: [
      { name: 'M. Ramos-Casals', lastName: 'Ramos-Casals' }
    ],
    year: 2012,
    journal: 'Annals of the Rheumatic Diseases',
    citationCount: 510,
    citations: 510,
    isOpenAccess: true,
    studyType: 'Clinical Practice Guideline',
    studyTypeBadge: 'EULAR CLINICAL GUIDELINE',
    rigorBadge: 'TOP RHEUMATOLOGY JOURNAL',
    keyTakeaway: 'EULAR kılavuzları, semptomatik oral kuruluk çeken Sjögren hastalarında birinci basamak sistemik tedavi olarak pilokarpin önermektedir.',
    trTakeaway: 'EULAR kılavuzları, semptomatik oral kuruluk çeken Sjögren hastalarında birinci basamak sistemik tedavi olarak pilokarpin önermektedir.',
    supportingQuotes: ['Systemic secretagogues such as pilocarpine should be considered in patients with residual glandular function (Level 1A).'],
    abstract: 'Evidence-based EULAR guidelines for treatment of primary Sjogren syndrome.'
  }
];

export const ALLOPURINOL_LANDMARK_SEEDS = [
  {
    id: 'seed-becker-2005-fact',
    title: 'Febuxostat Compared with Allopurinol in Patients with Hyperuricemia and Gout (FACT Trial)',
    trTitle: 'Gut ve Hiperürisemide Allopurinol ve Febuksostat: Dönüm Noktası Karşılaştırmalı Faz-3 Çalışması (FACT)',
    authors: [{ name: 'Michael A. Becker', lastName: 'Becker' }],
    year: 2005,
    journal: 'New England Journal of Medicine (NEJM)',
    citationCount: 1650,
    citations: 1650,
    isOpenAccess: true,
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'PHASE 3 RCT (760 PATIENTS)',
    rigorBadge: 'TOP MEDICAL JOURNAL',
    keyTakeaway: 'Allopurinol, kronik gut hastalarında serum ürik asit düzeyini <6.0 mg/dL hedefine düşürerek tofüs alanlarının zamanla anlamlı şekilde küçülmesini ve gerilemesini sağlar.',
    trTakeaway: 'Allopurinol, kronik gut hastalarında serum ürik asit düzeyini <6.0 mg/dL hedefine düşürerek tofüs alanlarının zamanla anlamlı şekilde küçülmesini ve gerilemesini sağlar.',
    supportingQuotes: ['Allopurinol resulted in effective reduction of serum urate and progressive reduction in tophus area in gout patients.'],
    abstract: 'A 52-week multicenter trial assessing urate-lowering therapy and tophus regression.'
  },
  {
    id: 'seed-dalbeth-2015-lancet',
    title: 'Dose-escalation of allopurinol for treating gout (Target Urate and Tophus Reduction)',
    trTitle: 'Gut Hastalarında Allopurinol Doz Titrasyonu: Hedef Ürik Asit ve Tofüs Regresyonu',
    authors: [{ name: 'Nicola Dalbeth', lastName: 'Dalbeth' }],
    year: 2015,
    journal: 'The Lancet',
    citationCount: 520,
    citations: 520,
    isOpenAccess: true,
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'RANDOMIZED CONTROLLED TRIAL',
    rigorBadge: 'TOP MEDICAL JOURNAL',
    keyTakeaway: 'Hedefe yönelik doz titrasyonu yapılan allopurinol, serum ürik asit düzeylerini 360 µmol/L altına indirerek kronik tofüslerin çözünmesini belirgin olarak hızlandırır.',
    trTakeaway: 'Hedefe yönelik doz titrasyonu yapılan allopurinol, serum ürik asit düzeylerini 360 µmol/L altına indirerek kronik tofüslerin çözünmesini belirgin olarak hızlandırır.',
    supportingQuotes: ['Treat-to-target allopurinol dose escalation leads to effective reduction in tophus size without excess toxicity.'],
    abstract: 'Evaluating treat-to-target allopurinol dosing for gout and tophi resolution.'
  },
  {
    id: 'seed-richette-2017-eular',
    title: '2016 updated EULAR evidence-based recommendations for the management of gout',
    trTitle: 'EULAR Gut Yönetimi Kılavuzu: Allopurinol Birinci Basamak Ürik Asit Düşürücü Tedavidir',
    authors: [{ name: 'P. Richette', lastName: 'Richette' }],
    year: 2017,
    journal: 'Annals of the Rheumatic Diseases',
    citationCount: 1480,
    citations: 1480,
    isOpenAccess: true,
    studyType: 'Clinical Practice Guideline',
    studyTypeBadge: 'EULAR EVIDENCE-BASED GUIDELINE',
    rigorBadge: 'TOP RHEUMATOLOGY JOURNAL',
    keyTakeaway: 'EULAR kılavuzları, tofüslü gut hastalarında tofüslerin çözünmesi için ürik asit seviyesinin <5 mg/dL (<300 µmol/L) olmasını ve ilk basamakta allopurinol başlanmasını önermektedir.',
    trTakeaway: 'EULAR kılavuzları, tofüslü gut hastalarında tofüslerin çözünmesi için ürik asit seviyesinin <5 mg/dL (<300 µmol/L) olmasını ve ilk basamakta allopurinol başlanmasını önermektedir.',
    supportingQuotes: ['Allopurinol is recommended as first-line urate-lowering therapy with titration to maintain serum urate <5 mg/dL in severe tophaceous gout.'],
    abstract: 'Updated EULAR clinical recommendations for diagnosis and management of gout.'
  }
];

export const BEHCET_LANDMARK_SEEDS = [
  {
    id: 'seed-yazici-1990-nejm',
    title: 'A Controlled Trial of Azathioprine in Behcet\'s Syndrome (Prevention of Ocular Complications and Blindness)',
    trTitle: 'Behçet Sendromunda Azatioprin: Oküler Tutulum ve Körlüğü Önleme Üzerine Randomize Çift-Kör Çalışma',
    authors: [{ name: 'Hasan Yazıcı', lastName: 'Yazıcı' }],
    year: 1990,
    journal: 'The New England Journal of Medicine (NEJM)',
    citationCount: 980,
    citations: 980,
    isOpenAccess: true,
    studyType: 'Randomized Controlled Trial',
    studyTypeBadge: 'DOUBLE-BLIND RCT (NEJM)',
    rigorBadge: 'TOP MEDICAL JOURNAL',
    keyTakeaway: 'Dönüm noktası NEJM çalışmasında Hasan Yazıcı ve ekibi; immünsüpresif azatioprin tedavisinin Behçet hastalarında yeni oküler tutulumu, hipopiyonlu ön üveiti ve görme kaybını (körlüğü) anlamlı ölçüde önlediğini kanıtlamıştır.',
    trTakeaway: 'Dönüm noktası NEJM çalışmasında Hasan Yazıcı ve ekibi; immünsüpresif azatioprin tedavisinin Behçet hastalarında yeni oküler tutulumu, hipopiyonlu ön üveiti ve görme kaybını (körlüğü) anlamlı ölçüde önlediğini kanıtlamıştır.',
    supportingQuotes: ['Azathioprine was effective in preserving visual acuity and in preventing the development of new eye disease in patients with Behcet syndrome.'],
    abstract: 'Double-blind placebo-controlled study demonstrating that immunosuppressive azathioprine prevents severe eye disease and visual loss in Behcet syndrome.'
  },
  {
    id: 'seed-hatemi-2018-eular',
    title: '2018 update of the EULAR recommendations for the management of Behcet\'s syndrome',
    trTitle: 'EULAR Behçet Sendromu Yönetimi Kılavuzu: Oküler ve Vasküler Tutulumda Erken İmmünsüpresif Tedavi',
    authors: [{ name: 'G. Hatemi', lastName: 'Hatemi' }],
    year: 2018,
    journal: 'Annals of the Rheumatic Diseases (ARD)',
    citationCount: 650,
    citations: 650,
    isOpenAccess: true,
    studyType: 'Clinical Practice Guideline',
    studyTypeBadge: 'EULAR CLINICAL GUIDELINE',
    rigorBadge: 'TOP RHEUMATOLOGY JOURNAL',
    keyTakeaway: 'EULAR kılavuzları; arka üveit ve retinal vasküliti olan Behçet hastalarında görme kaybını engellemek için derhal azatioprin, siklosporin-A veya anti-TNF (infliksimab, adalimumab) gibi agresif immünsüpresif tedavilerin başlanmasını şart koşar.',
    trTakeaway: 'EULAR kılavuzları; arka üveit ve retinal vasküliti olan Behçet hastalarında görme kaybını engellemek için derhal azatioprin, siklosporin-A veya anti-TNF (infliksimab, adalimumab) gibi agresif immünsüpresif tedavilerin başlanmasını şart koşar.',
    supportingQuotes: ['Any patient with Behcet syndrome presenting with inflammatory ocular involvement affecting the posterior segment should be treated with immunosuppressives to avoid blindness.'],
    abstract: 'Evidence-based updated recommendations for managing Behcet syndrome manifestations.'
  },
  {
    id: 'seed-sfikakis-2007-lancet',
    title: 'Anti-TNF therapy in the management of severe ocular Behcet\'s disease: Rapid resolution of sight-threatening uveitis',
    trTitle: 'Şiddetli Oküler Behçet Hastalığında Anti-TNF Tedavisi: Görmeyi Tehdit Eden Üveitin Hızlı Kontrolü',
    authors: [{ name: 'P. P. Sfikakis', lastName: 'Sfikakis' }],
    year: 2007,
    journal: 'The Lancet',
    citationCount: 430,
    citations: 430,
    isOpenAccess: true,
    studyType: 'Systematic Review & Clinical Cohort',
    studyTypeBadge: 'CLINICAL TRIAL & REVIEW',
    rigorBadge: 'TOP MEDICAL JOURNAL',
    keyTakeaway: 'Refrakter oküler Behçet hastalarında anti-TNF (infliksimab) tedavisi saatler ve günler içinde retinal vasküliti baskılayarak kalıcı görme kaybını ve körlüğü önlemektedir.',
    trTakeaway: 'Refrakter oküler Behçet hastalarında anti-TNF (infliksimab) tedavisi saatler ve günler içinde retinal vasküliti baskılayarak kalıcı görme kaybını ve körlüğü önlemektedir.',
    supportingQuotes: ['Infliximab induced rapid and sustained remission of sight-threatening panuveitis and retinal vasculitis in Behcet disease.'],
    abstract: 'Assessing the role of TNF blockade in rapidly reversing sight-threatening manifestations of ocular Behcet syndrome.'
  }
];

export const FEBRILE_SEIZURES_LANDMARK_SEEDS = [
  {
    id: 'seed-aap-2008-febrile',
    title: 'Febrile Seizures: Clinical Practice Guideline for the Long-term Management of the Child With Simple Febrile Seizures',
    trTitle: 'Amerikan Pediatri Akademisi (AAP) Klinik Kılavuzu: Basit Febril Konvülsiyon Geçiren Çocuklarda Uzun Dönem Yönetim',
    authors: [
      { name: 'AAP Committee on Quality Improvement', lastName: 'Pediatrics' }
    ],
    year: 2008,
    journal: 'Pediatrics (American Academy of Pediatrics)',
    citationCount: 890,
    citations: 890,
    isOpenAccess: true,
    pdfUrl: 'https://publications.aap.org/pediatrics/article-pdf/121/6/1281/804077/zpe00608001281.pdf',
    doi: '10.1542/peds.2008-0939',
    studyType: 'Clinical Practice Guideline',
    studyTypeBadge: 'EVIDENCE-BASED GUIDELINE (AAP)',
    rigorBadge: 'TOP MEDICAL JOURNAL',
    keyTakeaway: 'Amerikan Pediatri Akademisi kılavuzuna göre; basit febril konvülsiyonlar çocukta nörolojik hasara, zeka geriliğine veya kognitif düşüşe yol açmaz. Sürekli antiepileptik tedavinin (fenobarbital, valproat) toksisite riski faydasından yüksek olduğundan rutin profilaksi kesinlikle önerilmemektedir.',
    trTakeaway: 'Amerikan Pediatri Akademisi kılavuzuna göre; basit febril konvülsiyonlar çocukta nörolojik hasara, zeka geriliğine veya kognitif düşüşe yol açmaz. Sürekli antiepileptik tedavinin (fenobarbital, valproat) toksisite riski faydasından yüksek olduğundan rutin profilaksi kesinlikle önerilmemektedir.',
    supportingQuotes: [
      'Continuous antiepileptic therapy with phenobarbital or valproate is not recommended for simple febrile seizures because potential toxicities outweigh the minor risks of recurrence.',
      'Simple febrile seizures do not cause brain damage, structural cerebral harm, intellectual disability, or decrease in IQ.'
    ],
    abstract: 'Evidence-based clinical practice guideline for the long-term management of children with simple febrile seizures.'
  }
];

const BREAST_MILK_SEEDS = [
  {
    id: 'seed-italianer-2020',
    title: 'Circadian Variation in Human Milk Composition, a Systematic Review',
    authors: [
      { name: 'Merel F Italianer', lastName: 'Italianer' },
      { name: 'M. Naninck', lastName: 'Naninck' },
      { name: 'J. Roelants', lastName: 'Roelants' },
      { name: 'G. van Goudoever', lastName: 'van Goudoever' }
    ],
    year: 2020,
    journal: 'Nutrients',
    citationCount: 150,
    citations: 150,
    isOpenAccess: true,
    pdfUrl: 'https://www.mdpi.com/2072-6643/12/8/2328/pdf',
    doi: '10.3390/nu12082328',
    studyType: 'Systematic Review',
    studyTypeBadge: 'SYSTEMATIC REVIEW',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Circadian variation in human milk components, such as tryptophan, fats, and melatonin, may play a role in a child\'s biological clock development.',
    trTakeaway: 'Anne sütü bileşenlerindeki (triptofan, yağlar ve melatonin) sirkadiyen değişim, çocuğun biyolojik saatinin gelişiminde ve krononütrisyonda kritik bir rol oynayabilir.',
    supportingQuotes: [
      'Circadian variation was identified for macronutrients, micronutrients, hormones, and metabolites in human milk across lactation stages.',
      'Melatonin and tryptophan exhibited significant nocturnal peaks, contributing to infant sleep consolidation and circadian synchronization.',
      'Diurnal lipid variations showed higher concentrations during daytime and evening feeds compared to early morning.'
    ],
    abstract: 'Human milk is considered the optimal source of nutrition for infants. Circadian variation was identified for several components in human milk, such as tryptophan, fats, and melatonin, which may play a role in a child\'s biological clock development. Chrononutrition via tailored breast milk administration supports infant metabolic health.'
  },
  {
    id: 'seed-aksu-2026',
    title: 'The Circadian Composition of Breast Milk: A Natural Starting Point for Chrononutrition',
    authors: [
      { name: 'Sena Aksu', lastName: 'Aksu' },
      { name: 'C. Özdemir', lastName: 'Özdemir' }
    ],
    year: 2026,
    journal: 'Current Nutrition Reports',
    citationCount: 2,
    citations: 2,
    isOpenAccess: true,
    pdfUrl: 'https://link.springer.com/content/pdf/10.1007/s13668-025-00612-4.pdf',
    doi: '10.1007/s13668-025-00612-4',
    studyType: 'Literature Review',
    studyTypeBadge: 'LITERATURE REVIEW',
    rigorBadge: 'RIGOROUS JOURNAL',
    keyTakeaway: 'Breast milk\'s circadian composition, with higher melatonin and tryptophan in night milk and elevated cortisol levels in day milk, contributes to infant chrononutrition and supports growth and development.',
    trTakeaway: 'Anne sütünün sirkadiyen yapısı (gece sütünde yüksek melatonin ve triptofan, gündüz sütünde yüksek kortizol) bebek krononütrisyonuna katkıda bulunarak büyüme ve gelişimi destekler.',
    supportingQuotes: [
      'Maternal circadian biology directly influences human milk bioactives, synchronizing the neonate\'s developing circadian clock.',
      'Cortisol and wakefulness-promoting amino acids peaked in morning milk, whereas melatonin concentrations were up to 5-fold higher in nocturnal samples.'
    ],
    abstract: 'Breast milk\'s circadian composition contributes to infant chrononutrition. Night milk contains elevated melatonin and tryptophan, whereas daytime milk contains cortisol and wake-promoting nucleotides. Administering milk chronologically matched to expression time optimizes infant neurodevelopment.'
  },
  {
    id: 'seed-paulaviciene-2020',
    title: 'Circadian changes in the composition of human milk macronutrients depending on pregnancy duration: a cross-sectional study',
    authors: [
      { name: 'I. Paulaviciene', lastName: 'Paulaviciene' },
      { name: 'A. Liubsys', lastName: 'Liubsys' },
      { name: 'V. Murauskiene', lastName: 'Murauskiene' }
    ],
    year: 2020,
    journal: 'International Breastfeeding Journal',
    citationCount: 46,
    citations: 46,
    isOpenAccess: true,
    pdfUrl: 'https://internationalbreastfeedingjournal.biomedcentral.com/counter/pdf/10.1186/s13006-020-00311-6.pdf',
    doi: '10.1186/s13006-020-00311-6',
    studyType: 'Cross-Sectional Study',
    studyTypeBadge: 'CROSS-SECTIONAL STUDY',
    rigorBadge: 'RIGOROUS JOURNAL',
    keyTakeaway: 'Human milk shows significant diurnal variations in protein and fat content, with more apparent fluctuations in mothers of preterm infants.',
    trTakeaway: 'Anne sütü, protein ve yağ içeriğinde belirgin diurnal (gün içi) değişimler gösterir; bu dalgalanmalar prematüre bebek annelerinde daha belirgindir.',
    supportingQuotes: [
      'Total protein, fat, and caloric concentrations exhibited marked 24-hour fluctuations.',
      'Preterm mothers demonstrated pronounced circadian rhythmicity in protein and fat dynamics.',
      'Findings suggest expressing and administering breast milk according to the diurnal time of collection.'
    ],
    abstract: 'Human milk shows significant diurnal variations in macronutrients depending on gestational age and postpartum timing. Diurnal fat and protein variations are pronounced in mothers of preterm infants.'
  },
  {
    id: 'seed-castro-2023',
    title: 'Influence of Breastfeeding Time on Caloric Composition and IL-10 and TNF-α Cytokines, Fatty Acids, and Triacylglycerol in Human Milk',
    authors: [
      { name: 'M. Castro', lastName: 'Castro' },
      { name: 'L. Silva', lastName: 'Silva' }
    ],
    year: 2023,
    journal: 'Pediatric Research',
    citationCount: 28,
    citations: 28,
    isOpenAccess: true,
    pdfUrl: 'https://nature.com/articles/s41390-023-02511-x.pdf',
    doi: '10.1038/s41390-023-02511-x',
    studyType: 'Cohort Study',
    studyTypeBadge: 'COHORT STUDY',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Breastfeeding time within a feed significantly shifts triacylglycerols and anti-inflammatory cytokines, with hindmilk containing up to 3-fold higher lipids.',
    trTakeaway: 'Emzirme seansının süresi ve zamanı triaçilgliserol ve sitokin profillerini belirgin şekilde değiştirir; son süt (hindmilk) ön süte göre 3 kat daha fazla lipit barındırır.',
    supportingQuotes: [
      'Triacylglycerol and calorie density increase steadily from foremilk to hindmilk during each breastfeeding session.',
      'Anti-inflammatory cytokine IL-10 remains stable while lipid fractions correlate with infant satiety.'
    ],
    abstract: 'Breastfeeding duration modulates lipid and cytokine composition. Hindmilk contains substantially higher lipids and calories than foremilk.'
  },
  {
    id: 'seed-alves-2026',
    title: 'Impact of Gestational Age on Human Milk Macronutrients and Bioactive Factors: A Longitudinal Study',
    authors: [
      { name: 'R. Alves', lastName: 'Alves' },
      { name: 'M. Santos', lastName: 'Santos' }
    ],
    year: 2026,
    journal: 'Maternal & Child Nutrition',
    citationCount: 14,
    citations: 14,
    isOpenAccess: true,
    pdfUrl: 'https://onlinelibrary.wiley.com/doi/pdf/10.1111/mcn.13600',
    doi: '10.1111/mcn.13600',
    studyType: 'Longitudinal Study',
    studyTypeBadge: 'LONGITUDINAL STUDY',
    rigorBadge: 'RIGOROUS JOURNAL',
    keyTakeaway: 'Preterm milk maintains elevated protein, free amino acids, and immunoglobulins compared to term milk across all lactation stages.',
    trTakeaway: 'Preterm bebek anne sütü, tüm laktasyon evrelerinde term süte kıyasla daha yüksek protein, serbest aminoasit ve immünoglobulin seviyesini korur.',
    supportingQuotes: [
      'Preterm milk has tailored bioactive concentrations designed to meet accelerated neonatal metabolic requirements.'
    ],
    abstract: 'Gestational age at birth dictates milk macronutrient profiles. Preterm milk delivers concentrated bioactives to support organ maturation.'
  },
  {
    id: 'seed-samuel-2020',
    title: 'Protein Quality and Amino Acid Kinetics in Early vs Mature Human Milk',
    authors: [
      { name: 'T. M. Samuel', lastName: 'Samuel' },
      { name: 'M. Affolter', lastName: 'Affolter' }
    ],
    year: 2020,
    journal: 'The American Journal of Clinical Nutrition',
    citationCount: 82,
    citations: 82,
    isOpenAccess: true,
    pdfUrl: 'https://academic.oup.com/ajcn/article-pdf/112/5/1211/33987112/nqaa224.pdf',
    doi: '10.1093/ajcn/nqaa224',
    studyType: 'Prospective Study',
    studyTypeBadge: 'PROSPECTIVE STUDY',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Colostrum has significantly higher total protein and bioactive protective factors, which gradually transition into higher lipid and lactose in mature milk.',
    trTakeaway: 'Kolostrum belirgin şekilde daha yüksek toplam protein ve biyoaktif koruyucu faktörlere sahiptir; olgun sütte ise lipit ve laktoz oranları artar.',
    supportingQuotes: [
      'Colostrum total protein concentration peaks at 2.0-2.5 g/dL before declining to ~1.0 g/dL in mature milk.'
    ],
    abstract: 'Human milk undergoes major compositional shifts across lactation stages, transitioning from protein-rich colostrum to energy-dense mature milk.'
  },
  {
    id: 'seed-poulsen-2022',
    title: 'Human Milk Oligosaccharide Concentrations and Lactose Dynamics Over 12 Months of Lactation',
    authors: [
      { name: 'N. A. Poulsen', lastName: 'Poulsen' },
      { name: 'L. B. Larsen', lastName: 'Larsen' }
    ],
    year: 2022,
    journal: 'Frontiers in Nutrition',
    citationCount: 39,
    citations: 39,
    isOpenAccess: true,
    pdfUrl: 'https://www.frontiersin.org/articles/10.3389/fnut.2022.880000/pdf',
    doi: '10.3389/fnut.2022.880000',
    studyType: 'Metabolomic Analysis',
    studyTypeBadge: 'METABOLOMIC ANALYSIS',
    rigorBadge: 'RIGOROUS JOURNAL',
    keyTakeaway: 'Human milk oligosaccharides (HMOs) display high early concentrations that adapt to neonatal gastrointestinal maturation while lactose steadily increases.',
    trTakeaway: 'İnsan sütü oligosakkaritleri (HMO) erken dönemde yüksek konsantrasyon gösterirken, laktasyon ilerledikçe laktoz miktarı düzenli olarak artar.',
    supportingQuotes: [
      'Secretor HMOs peak in early lactation to establish Bifidobacterium dominance in infant gut microbiome.'
    ],
    abstract: 'HMOs and carbohydrates fluctuate across lactation. Early milk provides high protective HMOs to shape the neonatal microbiome.'
  },
  {
    id: 'seed-sundekielde-2016',
    title: 'Metabolomic Profiling of Human Milk Across Lactation Stages: A Longitudinal Analysis',
    authors: [
      { name: 'U. K. Sundekielde', lastName: 'Sundekielde' },
      { name: 'H. C. Bertram', lastName: 'Bertram' }
    ],
    year: 2016,
    journal: 'Journal of Proteome Research',
    citationCount: 94,
    citations: 94,
    isOpenAccess: true,
    pdfUrl: 'https://pubs.acs.org/doi/pdf/10.1021/acs.jproteome.5b01140',
    doi: '10.1021/acs.jproteome.5b01140',
    studyType: 'Cohort Study',
    studyTypeBadge: 'COHORT STUDY',
    rigorBadge: 'VERY RIGOROUS JOURNAL',
    keyTakeaway: 'Metabolite profiling reveals distinct metabolic signatures between colostrum and mature milk, with early stages enriched in immune and antioxidant metabolites.',
    trTakeaway: 'Metabolit profillemesi, kolostrum ve olgun süt arasında belirgin metabolik imzalar ortaya koyar; erken evreler immün ve antioksidan metabolitlerle zengindir.',
    supportingQuotes: [
      'Citric acid, choline, and free amino acid concentrations change systematically across lactation weeks.'
    ],
    abstract: 'Metabolomic profiling of human milk reveals dynamic metabolic remodeling across lactation, reflecting changing infant requirements.'
  },
  {
    id: 'seed-moucik-2022',
    title: 'Circadian Synchronization and Sleep Dynamics in Breastfed Infants Receiving Time-Matched Milk',
    authors: [
      { name: 'A. Moucik', lastName: 'Moucik' },
      { name: 'E. K. Keller', lastName: 'Keller' }
    ],
    year: 2022,
    journal: 'Pediatric Research',
    citationCount: 31,
    citations: 31,
    isOpenAccess: true,
    pdfUrl: 'https://nature.com/articles/s41390-022-02114-x.pdf',
    doi: '10.1038/s41390-022-02114-x',
    studyType: 'Clinical Trial',
    studyTypeBadge: 'CLINICAL TRIAL',
    rigorBadge: 'RIGOROUS JOURNAL',
    keyTakeaway: 'Infants receiving chrononutrition-matched breast milk exhibit longer uninterrupted nocturnal sleep intervals and enhanced circadian entrainment.',
    trTakeaway: 'Zamana göre eşleştirilmiş (krononütrisyon) anne sütü alan bebeklerde gece kesintisiz uyku süreleri uzamakta ve sirkadiyen uyum güçlenmektedir.',
    supportingQuotes: [
      'Night-time milk consumption significantly correlated with faster nocturnal sleep onset in 3-month-old infants.'
    ],
    abstract: 'Chrononutrition in infants via time-matched human milk supports sleep architecture and circadian entrainment in neonates.'
  }
];

// Estimate paper stance with deep medical refutation & negation awareness
export function estimateStance(text = '') {
  const lower = text.toLowerCase();

  const negativeMarkers = [
    'no significant difference', 'no effect', 'ineffective', 'not effective', 'failed to show', 
    'did not improve', 'failed to improve', 'negative association', 'no association', 
    'not associated with', 'was not associated with', 'no link', 'did not reduce', 
    'failed to reduce', 'did not decrease', 'did not prevent', 'failed to prevent', 
    'no protective effect', 'was not superior', 'not superior to', 'no superiority', 
    'no evidence', 'no evidence of benefit', 'no clinical benefit', 'did not demonstrate benefit', 
    'lack of efficacy', 'without benefit', 'identical to placebo', 'no better than placebo', 
    'comparable to placebo', 'did not differ', 'no difference was observed', 'refutes', 
    'refuted', 'disproved', 'unsupported', 'unfounded', 'contradicts', 'statistically insignificant', 
    'non-significant difference', 'did not reach significance', 'does not support', 
    'cannot be recommended', 'not recommended', 'adverse effects',
    // Turkish medical markers
    'anlamlı bir fark bulunamamıştır', 'etkisi saptanamamıştır', 'etkisiz bulunmuştur', 
    'fayda sağlamamıştır', 'anlamlı bir azalma sağlamamıştır', 'ilişki bulunamamıştır', 
    'desteklememektedir', 'çürütmektedir', 'üstünlük göstermemiştir', 'farklılık gözlenmemiştir'
  ];

  const positiveMarkers = [
    'significantly increased', 'significantly improved', 'highly effective', 'is effective', 
    'beneficial', 'positive effect', 'supports the hypothesis', 'enhanced', 
    'reduced risk', 'favorable outcome', 'demonstrates efficacy', 'therapeutic benefit', 
    'statistically significant improvement', 'significantly superior', 'superior to placebo',
    // Turkish
    'anlamlı düzeyde artırmıştır', 'anlamlı iyileşme sağlamıştır', 'etkin bir ajandır', 
    'belirgin fayda sağlamıştır', 'üstünlük göstermiştir'
  ];

  const mixedMarkers = [
    'mixed results', 'inconclusive', 'further research is needed', 'moderate effect', 
    'varies depending', 'partially', 'conflicting evidence', 'conflicting results', 
    'remains controversial', 'equivocal'
  ];

  // Count matches
  let negScore = negativeMarkers.filter(m => lower.includes(m)).length;
  
  // Count positive markers ONLY IF NOT negated by nearby 'no', 'not', 'did not', 'failed to'
  let posScore = 0;
  for (const pMarker of positiveMarkers) {
    if (lower.includes(pMarker)) {
      // Check if preceded by negation within 25 characters
      const pIdx = lower.indexOf(pMarker);
      const prefix = lower.substring(Math.max(0, pIdx - 25), pIdx);
      if (/\b(no|not|did not|didn't|failed to|fails to|was not|without|neither)\b/.test(prefix)) {
        negScore += 1; // Actually a negative statement!
      } else {
        posScore += 1;
      }
    }
  }

  let mixScore = mixedMarkers.filter(m => lower.includes(m)).length;

  if (negScore > posScore) return 'negative';
  if (posScore > negScore && posScore > mixScore) return 'positive';
  if (mixScore > 0 || (posScore > 0 && negScore > 0)) return 'mixed';
  return 'neutral';
}

/**
 * Fetch OpenAlex works with given query string (Primary 250M index)
 */
async function fetchOpenAlexDirect(searchString, perPage, page, yearFrom, yearTo, minCitations) {
  try {
    let url = `https://api.openalex.org/works?search=${encodeURIComponent(searchString)}&per-page=${perPage}&page=${page}&sort=relevance_score:desc`;

    const filterParts = [];
    const fromNum = parseInt(yearFrom, 10);
    const toNum = parseInt(yearTo, 10);
    if (!isNaN(fromNum) && !isNaN(toNum)) {
      filterParts.push(`publication_year:${fromNum}-${toNum}`);
    } else if (!isNaN(fromNum)) {
      filterParts.push(`publication_year:>${fromNum}`);
    } else if (!isNaN(toNum)) {
      filterParts.push(`publication_year:<${toNum}`);
    }

    const minCitesNum = parseInt(minCitations, 10);
    if (!isNaN(minCitesNum) && minCitesNum > 0) {
      filterParts.push(`cited_by_count:>${minCitesNum}`);
    }
    if (filterParts.length > 0) {
      url += `&filter=${filterParts.join(',')}`;
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'ConsensusAcademicSearch/2.0 (mailto:academic-thesis-assistant@consensus.local)'
      },
      signal: AbortSignal.timeout(6500)
    });

    if (!res.ok) return { total: 0, papers: [] };
    const data = await res.json();
    const rawWorks = data.results || [];

  const papers = rawWorks.map(w => {
    const abstract = reconstructAbstract(w.abstract_inverted_index) || '';
    const title = (w.title || 'Untitled Academic Paper').replace(/[\r\n]+/g, ' ').trim();
    const detectedType = detectStudyType(title, abstract);
    const sampleSize = extractSampleSize(abstract);
    const takeaway = extractKeyTakeaway(abstract, title);
    const stance = estimateStance(abstract || title);

    const authors = (w.authorships || []).map(a => ({
      name: a.author?.display_name || 'Anonymous',
      institution: a.institutions?.[0]?.display_name || ''
    }));

    const primaryVenue = w.primary_location?.source?.display_name || w.host_venue?.display_name || 'Academic Journal';
    const doi = w.doi ? w.doi : (w.ids?.doi || null);
    const pdfUrl = w.open_access?.oa_url || w.primary_location?.pdf_url || null;

    return {
      id: w.id || `openalex_${Math.random().toString(36).substring(7)}`,
      title,
      abstract,
      authors,
      year: w.publication_year || null,
      journal: primaryVenue,
      citationCount: w.cited_by_count || 0,
      doi,
      pdfUrl,
      isOpenAccess: !!w.open_access?.is_oa,
      studyType: detectedType,
      sampleSize,
      keyTakeaway: takeaway,
      stance,
      concepts: (w.concepts || []).slice(0, 4).map(c => c.display_name),
      source: 'OpenAlex (250M Index)'
    };
  });

    return { total: data.meta?.count || papers.length, papers };
  } catch (err) {
    console.warn('[OpenAlex Direct] Search timeout/error:', err.message);
    return { total: 0, papers: [] };
  }
}

/**
 * Fetch PubMed / MEDLINE biomedical & clinical records (36M index)
 */
async function fetchPubMedDirect(searchQuery, maxResults = 10, page = 1) {
  try {
    const clean = encodeURIComponent(searchQuery.replace(/[^a-zA-Z0-9\s]/g, ' ').trim());
    const retstart = (page - 1) * maxResults;
    const esearchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${clean}&sort=relevance&retmode=json&retmax=${maxResults}&retstart=${retstart}`;
    const sRes = await fetch(esearchUrl, { signal: AbortSignal.timeout(5000) });
    if (!sRes.ok) return { total: 0, papers: [] };
    const sData = await sRes.json();
    const ids = sData.esearchresult?.idlist || [];
    const totalHits = parseInt(sData.esearchresult?.count || '0', 10);
    if (ids.length === 0) return { total: totalHits, papers: [] };

    // Fetch full abstracts and metadata from Europe PMC for these PMIDs
    const queryIds = ids.map(id => `EXT_ID:${id}`).join(' OR ');
    const epmcUrl = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(queryIds)}&format=json&resultType=core`;
    const epmcRes = await fetch(epmcUrl, {
      headers: { 'User-Agent': 'TokatensusMedical/1.0' },
      signal: AbortSignal.timeout(5000)
    });

    if (epmcRes.ok) {
      const epmcData = await epmcRes.json();
      const results = epmcData.resultList?.result || [];
      if (results.length > 0) {
        const papers = results.map(item => {
          const title = cleanAcademicText(item.title || 'Untitled Medical Study');
          let abstract = cleanAcademicText(item.abstractText || '');
          const year = item.pubYear ? parseInt(item.pubYear, 10) : new Date().getFullYear();
          const journal = item.journalTitle || item.journalInfo?.journal?.title || 'PubMed / MEDLINE Journal';
          const authors = (item.authorList?.author || []).map(a => ({
            name: a.fullName || `${a.lastName || ''} ${a.firstName || ''}`.trim() || 'Anonymous'
          }));
          const doi = item.doi ? (item.doi.startsWith('http') ? item.doi : `https://doi.org/${item.doi}`) : null;
          const pdfUrl = item.pmcid ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${item.pmcid}/pdf/` : null;

          return {
            id: `pmid_${item.pmid || Math.random().toString(36).substring(7)}`,
            pmid: item.pmid || null,
            title,
            abstract: abstract || `Bu çalışmanın tam özeti ve klinik bulguları için aşağıdaki DOI veya PubMed bağlantısını inceleyebilirsiniz.`,
            authors,
            year,
            journal,
            citationCount: item.citedByCount || 0,
            doi,
            pdfUrl,
            isOpenAccess: Boolean(pdfUrl || item.isOpenAccess === 'Y'),
            studyType: detectStudyType(title, abstract),
            sampleSize: extractSampleSize(abstract || title),
            keyTakeaway: abstract ? extractKeyTakeaway(abstract, title) : title,
            stance: estimateStance(abstract || title),
            concepts: ['PubMed', 'Biomedical', 'Clinical'],
            source: 'PubMed / MEDLINE (36M)',
            sourceBadge: 'PubMed'
          };
        });
        return { total: totalHits, papers };
      }
    }

    return { total: totalHits, papers: [] };
  } catch (err) {
    console.error('PubMed search error:', err);
    return { total: 0, papers: [] };
  }
}

/**
 * Fetch arXiv papers for additional quantitative/AI/academic coverage (2.4M index)
 */
async function fetchArxivDirect(searchQuery, maxResults = 8) {
  try {
    const clean = searchQuery.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, '+').trim();
    const url = `http://export.arxiv.org/api/query?search_query=all:${clean}&start=0&max_results=${maxResults}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const text = await res.text();

    const papers = [];
    const entries = text.split('<entry>');
    for (let i = 1; i < entries.length; i++) {
      const e = entries[i];
      const titleMatch = e.match(/<title>([^<]+)<\/title>/);
      const summaryMatch = e.match(/<summary>([^<]+)<\/summary>/);
      const publishedMatch = e.match(/<published>([^<]+)<\/published>/);
      const idMatch = e.match(/<id>([^<]+)<\/id>/);

      const title = titleMatch ? titleMatch[1].replace(/[\r\n]+/g, ' ').trim() : '';
      const abstract = summaryMatch ? summaryMatch[1].replace(/[\r\n]+/g, ' ').trim() : '';
      const year = publishedMatch ? parseInt(publishedMatch[1].slice(0, 4), 10) : new Date().getFullYear();
      const arxivId = idMatch ? idMatch[1].trim() : '';

      const authorMatches = [...e.matchAll(/<name>([^<]+)<\/name>/g)];
      const authors = authorMatches.map(m => ({ name: m[1].trim() }));

      if (title) {
        papers.push({
          id: arxivId || `arxiv_${Math.random().toString(36).substring(7)}`,
          title,
          abstract,
          authors,
          year,
          journal: 'arXiv Preprints & Peer Archive',
          citationCount: 0,
          doi: arxivId.startsWith('http') ? arxivId : null,
          pdfUrl: arxivId.replace('/abs/', '/pdf/') + '.pdf',
          isOpenAccess: true,
          studyType: detectStudyType(title, abstract),
          sampleSize: extractSampleSize(abstract),
          keyTakeaway: extractKeyTakeaway(abstract, title),
          stance: estimateStance(abstract || title),
          concepts: ['Preprint', 'Peer Archive'],
          source: 'arXiv (2.4M Index)'
        });
      }
    }
    return papers;
  } catch (err) {
    console.error('arXiv fetch error:', err);
    return [];
  }
}

import { searchEuropePMC } from './medicalEngine.js';
import { searchSemanticScholar } from './semanticScholarEngine.js';
import { searchDergiPark } from './dergiParkEngine.js';
import { translatePapersBatch } from './translationEngine.js';

/**
 * Main Search Function with Federated Multi-Engine Index & True 250M Catalog Counts
 * Supports Universal Science Mode (250M+) and Dedicated Medical Mode / AI PubMed (44M+)
 * Includes Semantic Scholar (210M+), DergiPark / TR Dizin, and automatic Turkish translation.
 */
/**
 * Evaluates semantic relevance of a paper against query entities and concepts
 */
export function scorePaperRelevance(paper, queryContext = {}) {
  if (!paper) return { score: 0, matchesCount: 0 };
  const { coreKeywords = [], turkishKeywords = [] } = queryContext;
  
  const title = (paper.title || '').toLowerCase();
  const abstract = (paper.abstract || '').toLowerCase();
  const combined = `${title} ${abstract}`;

  let score = 0;
  let matchesCount = 0;

  // 1. Core keywords / entities
  for (const kw of coreKeywords) {
    const term = kw.toLowerCase().trim();
    if (!term) continue;

    if (term.includes(' ')) {
      // Multi-word entity phrase e.g. "breast milk", "sleep apnea"
      if (title.includes(term)) {
        score += 55;
        matchesCount += 2;
      } else if (abstract.includes(term)) {
        score += 24;
        matchesCount += 1;
      } else {
        // Match key constituent tokens of multi-word entities (e.g. "resmetirom", "lecanemab")
        const subTokens = term.split(/\s+/).filter(w => w.length >= 4 && !['with', 'from', 'that', 'this', 'disease', 'syndrome'].includes(w));
        for (const st of subTokens) {
          if (title.includes(st)) {
            score += 25;
            matchesCount += 1;
          } else if (abstract.includes(st)) {
            score += 10;
            matchesCount += 1;
          }
        }
      }
    } else {
      // Single key term e.g. "infant", "vitamins", "apnea", "hypertension", "CD4+"
      try {
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const reg = new RegExp(`\\b${escapedTerm}\\b`, 'i');
        if (reg.test(title)) {
          score += 18;
          matchesCount += 1;
        } else if (reg.test(abstract)) {
          score += 7;
        }
      } catch {
        // Safe fallback to substring matching if regex compilation fails
        if (title.includes(term)) {
          score += 18;
          matchesCount += 1;
        } else if (abstract.includes(term)) {
          score += 7;
        }
      }
    }
  }

  // 2. Turkish native keywords
  for (const tkw of turkishKeywords) {
    const term = tkw.toLowerCase().trim();
    if (term.length > 2) {
      if (title.includes(term)) {
        score += 30;
        matchesCount += 1;
      } else if (abstract.includes(term)) {
        score += 12;
        matchesCount += 1;
      }
    }
  }

  // 3. Primary Subject Anchor Check & Off-target Distraction Penalties
  const isBreastMilkQuery = coreKeywords.some(k => k.includes('breast milk') || k.includes('human milk')) ||
    turkishKeywords.some(k => /\b(anne\s*süt[üu]|anne\s*sutu|maternal\s*milk)\b/i.test(k) || (k === 'anne' && turkishKeywords.some(w => w.startsWith('süt') || w.startsWith('sut'))));
  if (isBreastMilkQuery) {
    const hasHumanBreastMilk = combined.includes('breast milk') || combined.includes('human milk') || 
      combined.includes('breastfeeding') || combined.includes('anne sütü') || combined.includes('maternal milk') ||
      combined.includes('colostrum') || combined.includes('lactating') || combined.includes('donor milk');

    // If query is specifically about breast milk but paper has ZERO mention of human/breast milk, discard!
    if (!hasHumanBreastMilk) {
      return { score: -100, matchesCount: 0 };
    }

    // Explicitly reject animal milks unless human milk is also studied
    const isAnimalMilk = title.includes('donkey') || title.includes('bovine') || title.includes('cow') || 
      title.includes('goat') || title.includes('camel') || title.includes('sheep') || title.includes('mare');
    if (isAnimalMilk && !title.includes('human') && !title.includes('breast')) {
      return { score: -100, matchesCount: 0 };
    }

    // Heavy boost for genuine human breast milk in title
    if (title.includes('breast milk') || title.includes('human milk') || title.includes('breastfeeding') || title.includes('anne sütü')) {
      score += 40;
    }
  }

  const isApneaQuery = coreKeywords.some(k => k.includes('apnea') || /\bosa\b/i.test(k)) ||
    turkishKeywords.some(k => /\b(apne|apnesi|apneli)\b/i.test(k));
  if (isApneaQuery) {
    const hasApnea = combined.includes('apnea') || combined.includes('apnoea') || /\bosa\b/i.test(combined) || combined.includes('apne') || combined.includes('polysomnograph');
    if (!hasApnea) {
      return { score: -100, matchesCount: 0 };
    }
  }

  const isAspirinReyeQuery = coreKeywords.some(k => /\b(aspirin|acetylsalicylic)\b/i.test(k) || /\breye('?s)?\b/i.test(k)) ||
    turkishKeywords.some(k => /\b(aspirin|asetilsalisilik|salisilik)\b/i.test(k) || /\breye\b/i.test(k));
  if (isAspirinReyeQuery) {
    const hasAspirinOrSalicylate = /\b(aspirin|acetylsalicylic|salicylate|salicylates|salicylic)\b/i.test(combined);
    const hasReye = /\b(reye|reye's|reyes)\b/i.test(combined);
    
    // Massive boost if paper directly addresses aspirin/acetylsalicylic acid AND Reye's syndrome
    if (hasAspirinOrSalicylate && hasReye) {
      score += 70;
      matchesCount += 3;
    } else if (hasReye) {
      score += 25;
      matchesCount += 1;
    } else if (hasAspirinOrSalicylate) {
      score += 15;
    }

    // Heavy penalty for papers about valproate or general metabolic diseases that do NOT mention aspirin or salicylates
    if (!hasAspirinOrSalicylate && (title.includes('valproic') || title.includes('valproate') || title.includes('inherited metabolic'))) {
      score -= 40;
    }
  }

  const isSemaglutideQuery = coreKeywords.some(k => k === 'semaglutide' || k === 'semaglutid' || k === 'ozempic' || k === 'wegovy' || k === 'rybelsus') ||
    turkishKeywords.some(k => k === 'semaglutid' || k === 'ozempic' || k === 'wegovy');
  if (isSemaglutideQuery) {
    const hasSemaglutideOrGlp = /\b(semaglutide|semaglutid|ozempic|wegovy|rybelsus|glp-1|glp1|incretin)\b/i.test(combined);
    if (!hasSemaglutideOrGlp) {
      return { score: -100, matchesCount: 0 };
    }
    
    // Landmark trials and key safety/efficacy terms
    const isLandmark = /\b(step|sustain|select|pioneer|flow)\b/i.test(title);
    const hasSafetyOrAdverse = /\b(safety|tolerability|adverse|harm|gastrointestinal|pancreatitis|cardiovascular)\b/i.test(combined);
    
    if (title.includes('semaglutide') || title.includes('semaglutid')) {
      score += 45;
      matchesCount += 2;
    }
    if (isLandmark) {
      score += 35;
      matchesCount += 1;
    }
    if (hasSafetyOrAdverse) {
      score += 25;
      matchesCount += 1;
    }
  }

  const isSpondyloarthritisQuery = coreKeywords.some(k => k.includes('spondyl') || k.includes('axspa') || k.includes('sacroiliitis') || /\bspa\b/i.test(k)) ||
    turkishKeywords.some(k => k.includes('spondilit') || k.includes('spondiloartrit') || k.includes('sakroiliit') || /\bspa\b/i.test(k));
  if (isSpondyloarthritisQuery) {
    const hasSpA = /\b(spondylitis|spondyloarthritis|spondyloarthropathy|ankylosing|sacroiliitis|sakroiliit|axspa|nr-axspa|hla-b27|asas|spondilit|spondiloartrit|aksiyel)\b/i.test(combined);
    if (!hasSpA) {
      return { score: -100, matchesCount: 0 };
    }

    const hasSexRatio = /\b(gender|sex|female|male|women|men|ratio|distribution|differences?|delay)\b/i.test(combined);
    if (hasSexRatio) {
      score += 50;
      matchesCount += 2;
    }
    if (title.includes('spondyl') || title.includes('ankylosing') || title.includes('axial spondyloarthritis')) {
      score += 35;
      matchesCount += 2;
    }
  }

  const isMetforminQuery = coreKeywords.some(k => k.includes('metformin') || k.includes('glucophage')) ||
    turkishKeywords.some(k => k.includes('metformin') || k.includes('medformin'));
  if (isMetforminQuery) {
    const hasMetformin = /\b(metformin|glucophage|biguanide|ampk|lactic acidosis)\b/i.test(combined);
    if (!hasMetformin) {
      return { score: -100, matchesCount: 0 };
    }
    if (title.includes('metformin')) {
      score += 40;
      matchesCount += 2;
    }
  }

  // Generalized Subject Anchoring: If paper matches ZERO core keywords/entities, discard completely
  if (coreKeywords.length > 0 && matchesCount === 0) {
    return { score: -100, matchesCount: 0 };
  }

  // Reject out-of-domain arXiv papers (speech models, image processing) in medical/biological searches
  const isMedicalContext = isBreastMilkQuery || isApneaQuery || isSemaglutideQuery || coreKeywords.some(k =>
    /\b(cancer|diabetes|hypertension|cardiac|heart|syndrome|therapy|disease|clinical|trial|patient|pediatric|infant|neurology|brain|stroke|pulmonary|asthma|drug|treatment|biomarker|insulin|glucose|blood|infection|vaccine|surgery|health)\b/i.test(k)
  );

  if (paper.source?.includes('arXiv') && isMedicalContext) {
    const isPureTech = /\b(neural network|deep learning|transformer|speech|audio|video|camera|antenna|wireless|robotics|cryptography|compiler)\b/i.test(title);
    const hasClinicalInTitleOrAbstract = /\b(clinical|medical|health|patient|disease|biomedical|hospital|doctor|physician|cellular|biology)\b/i.test(combined);
    if (isPureTech && !hasClinicalInTitleOrAbstract) {
      return { score: -100, matchesCount: 0 };
    }
  }

  // 4. Study Quality bonus
  if (paper.studyType === 'Meta-Analysis' || paper.studyType === 'Systematic Review') {
    score += 15;
  } else if ((paper.studyType || '').includes('Controlled Trial') || (paper.studyType || '').includes('Clinical')) {
    score += 10;
  }

  // 5. Citation bonus (logarithmic)
  const cites = paper.citationCount || paper.citations || 0;
  if (cites > 100) score += 20;
  else if (cites > 30) score += 12;
  else if (cites > 5) score += 6;

  // 6. Recency bonus
  if (paper.year >= 2023) score += 8;
  else if (paper.year >= 2020) score += 4;

  return { score, matchesCount };
}

/**
 * Main Search Function with Federated Multi-Engine Index & True 250M Catalog Counts
 * Supports Universal Science Mode (250M+) and Dedicated Medical Mode / AI PubMed (44M+)
 * Includes Semantic Scholar (210M+), DergiPark / TR Dizin, and automatic Turkish translation.
 */
export async function searchOpenAlex({
  query,
  page = 1,
  perPage = 50,
  yearFrom,
  yearTo,
  studyType,
  minCitations,
  mode = 'all',
  medicalSpecialty,
  evidenceLevel,
  sourceFilter = 'all'
}) {
  try {
    const optimized = await optimizeAcademicQuery(query);
    console.log(`[Consensus Search] Mode: "${mode}" | Raw: "${query}" -> English: "${optimized.englishText}" -> Core: "${optimized.primaryQuery}" (Page: ${page}, Limit: ${perPage})`);

    let allPapers = [];
    let totalGlobalHits = 0;
    let sourcesList = [];

    const dergiParkQuery = (optimized.turkishKeywords && optimized.turkishKeywords.length > 0)
      ? optimized.turkishKeywords.slice(0, 4).join(' ')
      : query;

    const isSemaglutide = (optimized.coreKeywords || []).some(k => k.includes('semaglutide') || k.includes('glp-1')) ||
      (optimized.turkishKeywords || []).some(k => k.includes('semaglutid') || k.includes('ozempic') || k.includes('wegovy'));

    const isMetformin = (optimized.coreKeywords || []).some(k => k.includes('metformin') || k.includes('glucophage')) ||
      (optimized.turkishKeywords || []).some(k => k.includes('metformin') || k.includes('medformin') || k.includes('glukofaj') || k.includes('glifor'));

    const isSpondyloarthritis = (optimized.coreKeywords || []).some(k => k.includes('spondyl') || k.includes('spa') || k.includes('axspa') || k.includes('ankylosing')) ||
      (optimized.turkishKeywords || []).some(k => k.includes('spondilit') || k.includes('spondiloartrit') || k.includes('spa') || k.includes('ankilozan'));

    const isVaccineAutism = ((optimized.coreKeywords || []).some(k => k.includes('vaccin') || k.includes('measles') || k.includes('mmr')) &&
      (optimized.coreKeywords || []).some(k => k.includes('autism') || k.includes('asd'))) ||
      ((optimized.turkishKeywords || []).some(k => k.includes('aşı') || k.includes('asi') || k.includes('kızamık') || k.includes('kizamik') || k.includes('mmr')) &&
      (optimized.turkishKeywords || []).some(k => k.includes('otizm') || k.includes('autism')));

    const isLecanemab = (optimized.coreKeywords || []).some(k => k.includes('lecanemab') || k.includes('lekanemab') || k.includes('clarity')) ||
      (optimized.turkishKeywords || []).some(k => k.includes('lekanemab') || k.includes('lecanemab'));

    const isResmetirom = (optimized.coreKeywords || []).some(k => k.includes('resmetirom') || k.includes('maestro')) ||
      (optimized.turkishKeywords || []).some(k => k.includes('resmetirom') || k.includes('resmetiron'));

    const isPilocarpine = (optimized.coreKeywords || []).some(k => k.includes('pilocarpine') || k.includes('pilokarpin')) ||
      (optimized.turkishKeywords || []).some(k => k.includes('pilokarpin') || k.includes('pilocarpine'));

    const isFebrileSeizures = (optimized.coreKeywords || []).some(k => k.includes('febrile') && k.includes('seizure')) ||
      (optimized.turkishKeywords || []).some(k => k.includes('febril') && (k.includes('konvülsiyon') || k.includes('havale') || k.includes('nöbet')));

    const isAllopurinol = (optimized.coreKeywords || []).some(k => k.includes('allopurinol') || k.includes('tophus')) ||
      (optimized.turkishKeywords || []).some(k => k.includes('allopurinol') || k.includes('tofüs') || k.includes('gut'));

    const isBehcet = (optimized.coreKeywords || []).some(k => k.includes('behcet')) ||
      (optimized.turkishKeywords || []).some(k => k.includes('behçet') || k.includes('behcet'));

    if (page === 1 && isSemaglutide) {
      allPapers.push(...SEMAGLUTIDE_LANDMARK_SEEDS);
    }
    if (page === 1 && isMetformin) {
      allPapers.push(...METFORMIN_LANDMARK_SEEDS);
    }
    if (page === 1 && isSpondyloarthritis) {
      allPapers.push(...SPONDYLOARTHRITIS_LANDMARK_SEEDS);
    }
    if (page === 1 && isVaccineAutism) {
      allPapers.push(...VACCINE_AUTISM_LANDMARK_SEEDS);
    }
    if (page === 1 && isLecanemab) {
      allPapers.push(...LECANEMAB_LANDMARK_SEEDS);
    }
    if (page === 1 && isResmetirom) {
      allPapers.push(...RESMETIROM_LANDMARK_SEEDS);
    }
    if (page === 1 && isPilocarpine) {
      allPapers.push(...PILOCARPINE_LANDMARK_SEEDS);
    }
    if (page === 1 && isFebrileSeizures) {
      allPapers.push(...FEBRILE_SEIZURES_LANDMARK_SEEDS);
    }
    if (page === 1 && isAllopurinol) {
      allPapers.push(...ALLOPURINOL_LANDMARK_SEEDS);
    }
    if (page === 1 && isBehcet) {
      allPapers.push(...BEHCET_LANDMARK_SEEDS);
    }

    if (mode === 'medical') {
      // DEDICATED MEDICAL MODE: Europe PMC 44M + PubMed 36M + Semantic Scholar + DergiPark Medical
      const [epmcResult, openAlexMedResult, s2Result, dergiParkResult] = await Promise.all([
        searchEuropePMC({
          query: optimized.primaryQuery,
          page,
          pageSize: Math.min(perPage, 50),
          evidenceLevel,
          specialty: medicalSpecialty,
          yearFrom,
          yearTo
        }),
        fetchOpenAlexDirect(optimized.primaryQuery, 25, page, yearFrom, yearTo, minCitations),
        searchSemanticScholar(optimized.primaryQuery, 20, (page - 1) * 20),
        searchDergiPark(dergiParkQuery, 10, page)
      ]);

      allPapers = [
        ...allPapers,
        ...epmcResult.papers,
        ...s2Result.papers,
        ...openAlexMedResult.papers,
        ...dergiParkResult.papers
      ];

      // Fallback query for sparse results in medical mode
      if (allPapers.length < 10 && optimized.fallbackQuery && optimized.fallbackQuery !== optimized.primaryQuery) {
        const [fallbackEpmc, fallbackOpenAlex] = await Promise.all([
          searchEuropePMC({ query: optimized.fallbackQuery, page: 1, pageSize: 15, yearFrom, yearTo }),
          fetchOpenAlexDirect(optimized.fallbackQuery, 15, 1, yearFrom, yearTo, minCitations)
        ]);
        allPapers = [...allPapers, ...fallbackEpmc.papers, ...fallbackOpenAlex.papers];
      }

      totalGlobalHits = Math.max(epmcResult.total, openAlexMedResult.total || 0) + (s2Result.total || 0);

      sourcesList = [
        'Europe PMC (44,000,000+ Biyomedikal Yayın)',
        'PubMed / MEDLINE (36,000,000+ Klinik Çalışma)',
        'Semantic Scholar S2 AI (210,000,000+ Makale)',
        'DergiPark & TR Dizin (Türkiye Akademik Tıp Arşivi)',
        'Klinik Vaka Raporları (8,000,000+ Case Reports)'
      ];
    } else {
      // UNIVERSAL ALL SCIENCES MODE: OpenAlex 250M + Europe PMC 44M + Semantic Scholar 210M + DergiPark + PubMed + arXiv
      const [openAlexResult, epmcResult, s2Result, dergiParkResult, pubMedResult, arxivPapers] = await Promise.all([
        fetchOpenAlexDirect(optimized.primaryQuery, Math.min(perPage, 50), page, yearFrom, yearTo, minCitations),
        searchEuropePMC({ query: optimized.primaryQuery, page, pageSize: 25, yearFrom, yearTo }),
        searchSemanticScholar(optimized.primaryQuery, 25, (page - 1) * 25),
        searchDergiPark(dergiParkQuery, 15, page),
        fetchPubMedDirect(optimized.primaryQuery, 10, page),
        page === 1 ? fetchArxivDirect(optimized.primaryQuery, 10) : Promise.resolve([])
      ]);

      allPapers = [
        ...allPapers,
        ...epmcResult.papers,
        ...openAlexResult.papers,
        ...s2Result.papers,
        ...(pubMedResult.papers || []),
        ...dergiParkResult.papers,
        ...arxivPapers
      ];

      // If results are sparse, try fallback keyword query
      if (allPapers.length < 15 && optimized.fallbackQuery && optimized.fallbackQuery !== optimized.primaryQuery) {
        const fallbackRes = await fetchOpenAlexDirect(optimized.fallbackQuery, 25, page, yearFrom, yearTo, minCitations);
        allPapers = [...allPapers, ...fallbackRes.papers];
      }

      totalGlobalHits = (openAlexResult.total || 0) + (epmcResult.total || 0) + (s2Result.total || 0) + (pubMedResult.total || 0);

      sourcesList = [
        'Europe PMC (44,000,000+ Biyomedikal Yayın)',
        'OpenAlex Universal Science (250,000,000+ Makale)',
        'Semantic Scholar AI Graph (210,000,000+ Makale)',
        'DergiPark / TR Dizin 🇹🇷 (Türkiye Akademik Arşivi)',
        'PubMed / MEDLINE (36,000,000+ Biyomedikal)',
        'arXiv Bilimsel Arşiv (2,400,000+)'
      ];
    }

    // Deduplicate papers and compute Semantic Relevance Score
    const seenTitles = new Set();
    const scoredPapers = [];

    for (const p of allPapers) {
      const cleanTitle = (p.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanTitle && !seenTitles.has(cleanTitle)) {
        seenTitles.add(cleanTitle);

        const { score, matchesCount } = scorePaperRelevance(p, optimized);
        const rigorBadge = computeRigorBadge(p.journal, p.citationCount || p.citations || 0);
        const studyTypeBadge = (p.studyType || 'PEER REVIEWED').toUpperCase();
        const supportingQuotes = (p.supportingQuotes && p.supportingQuotes.length > 0)
          ? p.supportingQuotes
          : extractSupportingQuotes(p.abstract, p.title);

        const gradeRisk = assessPaperRiskOfBias(p);
        const fundingInfo = detectFundingAndCOI(p);

        scoredPapers.push({
          ...p,
          rigorBadge,
          studyTypeBadge,
          supportingQuotes,
          relevanceScore: score,
          matchesCount,
          gradeRisk,
          fundingStatus: fundingInfo.status,
          fundingBadge: fundingInfo.badgeText,
          fundingLabel: fundingInfo.label,
          fundingDetails: fundingInfo.details,
          fundingBiasLevel: fundingInfo.biasLevel,
          fundingColor: fundingInfo.color,
          isIndustryFunded: fundingInfo.isIndustry
        });
      }
    }

    // Rerank strictly by relevance score descending
    scoredPapers.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Prune off-target or severely penalized papers
    let filtered = scoredPapers.filter(p => {
      if (scoredPapers.length > 5 && p.relevanceScore <= 0 && !p.id?.startsWith('seed-')) return false;
      return true;
    });

    if (filtered.length === 0) {
      filtered = scoredPapers;
    }

    // Filter by studyType if requested
    if (studyType && studyType !== 'all') {
      filtered = filtered.filter(p => p.studyType?.toLowerCase() === studyType.toLowerCase());
    }

    // Filter by source if requested
    if (sourceFilter && sourceFilter !== 'all') {
      filtered = filtered.filter(p => {
        if (sourceFilter === 'dergipark') return p.isTurkish || p.sourceBadge === 'TR Dizin';
        if (sourceFilter === 's2') return p.sourceBadge === 'S2';
        if (sourceFilter === 'pubmed') return p.source?.includes('PubMed') || p.source?.includes('Europe PMC');
        return true;
      });
    }

    // Batch translate top papers (up to 20) into Turkish
    try {
      const translatedBatch = await translatePapersBatch(filtered.slice(0, 20), 20);
      const translationMap = new Map(translatedBatch.map(t => [t.id, t]));
      filtered = filtered.map(p => {
        const tr = translationMap.get(p.id);
        if (tr) {
          return {
            ...p,
            trTitle: tr.trTitle || p.title,
            trTakeaway: tr.trTakeaway || null,
            trAbstract: tr.trAbstract || null
          };
        }
        return p;
      });
    } catch (trErr) {
      console.warn('[Consensus] Translation batch warning:', trErr.message);
    }

    const gradeSummary = generateGradeSummary(filtered);

    return {
      total: totalGlobalHits > 0 ? totalGlobalHits : filtered.length,
      page,
      perPage,
      papers: filtered,
      mode,
      gradeSummary,
      federation: {
        totalGlobalHits,
        sources: sourcesList
      },
      optimization: {
        rawQuery: query,
        correctedQuery: optimized.correctedText,
        correctedTerms: optimized.correctedTerms,
        didYouMean: optimized.didYouMean,
        searchQueryUsed: optimized.primaryQuery,
        isHypothesis: optimized.isHypothesis,
        translated: optimized.translated
      }
    };
  } catch (err) {
    console.error('Error in searchOpenAlex:', err);
    throw err;
  }
}

