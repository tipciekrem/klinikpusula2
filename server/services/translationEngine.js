/**
 * Translation Engine for Academic Literature
 * Translates paper titles, key takeaways, abstracts and synthesis evidence into fluent Turkish.
 * Features high-accuracy multi-engine translation (Google GTX + MyMemory) with in-memory caching.
 */

import { cleanAcademicText } from './academicSearch.js';

const MAX_CACHE_SIZE = 2500;
const translationCache = new Map();

function setCachedTranslation(key, value) {
  if (translationCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = translationCache.keys().next().value;
    if (oldestKey !== undefined) {
      translationCache.delete(oldestKey);
    }
  }
  translationCache.set(key, value);
}

// Academic domain dictionary for backup & domain phrase refinement
// Academic domain dictionary for backup & domain phrase refinement
const ACADEMIC_DICTIONARY = {
  'randomized controlled trial': 'randomize kontrollü klinik deney',
  'systematic review and meta-analysis': 'sistematik derleme ve meta-analiz',
  'systematic review': 'sistematik derleme',
  'meta-analysis': 'meta-analiz',
  'cohort study': 'kohort çalışması',
  'case-control study': 'vaka-kontrol çalışması',
  'cross-sectional study': 'kesitsel çalışma',
  'case report': 'vaka raporu',
  'case reports': 'vaka raporları',
  'case series': 'vaka serisi',
  'acetylsalicylic acid': 'asetilsalisilik asit',
  'salicylic acid': 'salisilik asit',
  'salicylates': 'salisilatlar',
  'salicylate': 'salisilat',
  "reye's syndrome": 'Reye sendromu',
  'reye syndrome': 'Reye sendromu',
  'obstructive sleep apnea': 'obstrüktif uyku apnesi',
  'obstructive sleep apnea syndrome': 'obstrüktif uyku apne sendromu',
  'sleep deprivation': 'uyku yoksunluğu',
  'cardiovascular disease': 'kardiyovasküler hastalık',
  'type 2 diabetes': 'tip 2 diyabet',
  'blood pressure': 'kan basıncı',
  'statistically significant': 'istatistiksel olarak anlamlı',
  'odds ratio': 'olasılıklar / odds oranı',
  'hazard ratio': 'risk oranı',
  'relative risk': 'rölatif risk',
  'confidence interval': 'güven aralığı',
  'p < 0.05': 'p < 0.05',
  'results indicate that': 'sonuçlar şunu göstermektedir:',
  'our findings suggest': 'bulgularımız şunu işaret etmektedir:',
  'in conclusion': 'sonuç olarak',
  'key takeaway': 'ana çıkarım'
};

/**
 * Enhanced Medical Term Polish Rules
 */
const MEDICAL_POLISH_RULES = [
  [/\bacetylsalicylic acid\b/gi, "asetilsalisilik asit"],
  [/\bacetylsalicylic\b/gi, "asetilsalisilik"],
  [/\bsalicylate\b/gi, "salisilat"],
  [/\bsalicylates\b/gi, "salisilatlar"],
  [/\bReye('s)? syndrome\b/gi, "Reye sendromu"],
  [/\bReyes syndrome\b/gi, "Reye sendromu"],
  [/\bReye-like\b/gi, "Reye-benzeri"],
  [/\bhepatic encephalopathy\b/gi, "hepatik ensefalopati"],
  [/\bhepatic dysfunction\b/gi, "hepatik disfonksiyon (karaciğer yetmezliği)"],
  [/\bmicrovesicular steatosis\b/gi, "mikroveziküler hepatik steatoz (karaciğer yağlanması)"],
  [/\bsteatosis\b/gi, "steatoz (yağlanma)"],
  [/\bvaricella\b/gi, "suçiçeği (varisella)"],
  [/\bchickenpox\b/gi, "suçiçeği"],
  [/\binfluenza\b/gi, "influenza (grip)"],
  [/\bhyperammonemia\b/gi, "hiperamonyemi (kanda toksik amonyak yükselmesi)"],
  [/\bmitochondrial\b/gi, "mitokondriyal"],
  [/\bmitochondria\b/gi, "mitokondriler"],
  [/\bfatty acid oxidation\b/gi, "yağ asidi beta-oksidasyonu"],
  [/\bcontraindicated\b/gi, "kontrendike (kesinlikle kullanılmamalı)"],
  [/\bcontraindication\b/gi, "kontrendikasyon"],
  [/\binborn errors? of metabolism\b/gi, "kalıtsal metabolik bozukluklar"],
  [/\bIMD\b/g, "kalıtsal metabolik hastalık (IMD)"],
  [/\brhabdomyolysis\b/gi, "rabdomiyoliz (kas yıkımı)"],
  [/\bnoninflammatory\b/gi, "non-inflamatuar (iltihabi olmayan)"],
  [/\bstatus epilepticus\b/gi, "status epileptikus"],
  [/\bvalproic acid\b/gi, "valproik asit"],
  [/\bKawasaki disease\b/gi, "Kawasaki hastalığı"],
  [/\bsemaglutide\b/gi, "semaglutid"],
  [/\btirzepatide\b/gi, "tirzepatid"],
  [/\bliraglutide\b/gi, "liraglutid"],
  [/\bdulaglutide\b/gi, "dulaglutid"],
  [/\bGLP-1 receptor agonists?\b/gi, "GLP-1 reseptör agonistleri"],
  [/\bGLP-1 RA\b/g, "GLP-1 RA"],
  [/\bmedullary thyroid carcinoma\b/gi, "medüller tiroid karsinomu (MTC)"],
  [/\bpancreatitis\b/gi, "pankreatit"],
  [/\bcholelithiasis\b/gi, "kolelitiyazis (safra kesesi taşı)"],
  [/\bcholecystitis\b/gi, "kolesistit (safra kesesi iltihabı)"],
  [/\bgastroparesis\b/gi, "gastroparez (gecikmiş mide boşalması)"],
  [/\bsarcopenia\b/gi, "sarkopeni (kas kütlesi kaybı)"],
  [/\blean body mass\b/gi, "yağsız vücut kütlesi"],
  [/\bcounterfeit semaglutide\b/gi, "sahte / lisanssız semaglutid"],
  [/\bcounterfeit\b/gi, "sahte / taklit"],
  [/\beuglycemic ketoacidosis\b/gi, "öglisemik ketoasidoz"],
  [/\balpha diversity\b/gi, "alfa çeşitlilik"],
  [/\bbeta diversity\b/gi, "beta çeşitlilik"],
  [/\bstructural shifts\b/gi, "yapısal değişimler / kaymalar"],
  [/\bgastrointestinal adverse events\b/gi, "gastrointestinal advers etkiler"],
  [/\bgastrointestinal adverse effects\b/gi, "gastrointestinal yan etkiler"],
  [/\btitration\b/gi, "kademeli doz titrasyonu"],
  [/\btolerability\b/gi, "tolere edilebilirlik"],
  [/\bsafety profile\b/gi, "güvenlilik profili"],
  [/\bbenefit-risk profile\b/gi, "fayda-risk profili"],
  [/\bmajor adverse cardiovascular events\b/gi, "majör advers kardiyovasküler olaylar (MACE)"],
  [/\bneovascular age-related macular degeneration\b/gi, "neovasküler yaşa bağlı makula dejenerasyonu (NVAMD)"],
  [/\bstandard of care\b/gi, "standart tedavi"],
  [/\breal-world evidence\b/gi, "gerçek yaşam verisi (RWE)"],
  [/\bHMO'lar\b/gi, "HMO'lar (İnsan Sütü Oligosakkaritleri)"],
  [/\bprebiotic\b/gi, "prebiyotik"],
  [/\bprebiotics\b/gi, "prebiyotikler"],
  [/\bmikrobiyom\b/gi, "mikrobiyota"],
  [/\bneonate\b/gi, "yenidoğan"],
  [/\bneonates\b/gi, "yenidoğanlar"],
  [/\binfant formula\b/gi, "bebek maması / formül sütü"],
  [/\bbioactive\b/gi, "biyoaktif"],
  [/\bgastrointestinal\b/gi, "gastrointestinal"],
  [/\bplacebo-controlled\b/gi, "plasebo kontrollü"],
  [/\bdouble-blind\b/gi, "çift kör"],
  [/\bclinical efficacy\b/gi, "klinik etkinlik"],
  [/\badverse events\b/gi, "istenmeyen advers olaylar"],
  [/\bmortality rate\b/gi, "mortalite oranı"],
  [/\bmorbidity\b/gi, "morbidite"],
  [/\bpathogenesis\b/gi, "patogenez"],
  [/\betiology\b/gi, "etyoloji"],
  [/\bprognosis\b/gi, "prognoz"],
  [/\btherapeutic\b/gi, "terapötik"],
  [/\bpharmacokinetics\b/gi, "farmakokinetik"],
  [/\bpharmacodynamics\b/gi, "farmakodinamik"],
  [/\bcardiovascular\b/gi, "kardiyovasküler"],
  [/\bhypertension\b/gi, "hipertansiyon"],
  [/\bpediatric\b/gi, "pediyatrik"],
  [/\bpreterm\b/gi, "preterm (erken doğan)"],
  [/\bgestational\b/gi, "gestasyonel"],
  [/\bapnea\b/gi, "apne"],
  [/\bhypopnea\b/gi, "hipopne"],
  [/\bpolysomnography\b/gi, "polisomnografi"],
  [/\bmeta-analysis\b/gi, "meta-analiz"],
  [/\bsystematic review\b/gi, "sistematik derleme"],
  [/\brandomized controlled trial\b/gi, "randomize kontrollü çalışma"],
  [/\bcohort study\b/gi, "kohort çalışması"],
  [/\bcross-sectional\b/gi, "kesitsel"]
];

function polishMedicalTurkish(text) {
  if (!text) return '';
  let polished = cleanAcademicText(text);
  for (const [pattern, replacement] of MEDICAL_POLISH_RULES) {
    polished = polished.replace(pattern, replacement);
  }
  return cleanAcademicText(polished);
}

const ENGLISH_COMMON_WORDS = new Set([
  'the', 'and', 'is', 'are', 'was', 'were', 'in', 'of', 'to', 'for', 'with', 'on', 'at', 'by', 'from',
  'about', 'into', 'through', 'during', 'before', 'after', 'that', 'this', 'these', 'those', 'it', 'its',
  'we', 'our', 'they', 'their', 'he', 'she', 'which', 'what', 'who', 'whose', 'not', 'no', 'only', 'also',
  'more', 'most', 'other', 'others', 'such', 'than', 'as', 'increased', 'decreased', 'showed', 'demonstrated',
  'found', 'associated', 'observed', 'group', 'groups', 'analysis', 'significant', 'significantly', 'effect',
  'effects', 'clinical', 'trial', 'trials', 'data', 'patients', 'treatment', 'dose', 'doses', 'safety',
  'adverse', 'harmful', 'risk', 'risks', 'study', 'studies', 'results', 'findings', 'conclusion', 'overall',
  'however', 'further', 'evidence', 'between', 'among', 'using', 'used', 'based', 'well', 'high', 'low',
  'versus', 'compared', 'superior', 'efficacy', 'effective', 'tolerance', 'tolerated', 'events', 'administration',
  'oral', 'subcutaneous', 'daily', 'weekly', 'baseline', 'reduction', 'weight', 'loss', 'body', 'without',
  'particularly', 'higher', 'lower', 'reported', 'evaluated', 'included', 'conducted', 'both', 'shifts', 'indices',
  'diversity', 'structural', 'though', 'may', 'can', 'could', 'should', 'would', 'have', 'has', 'had', 'been'
]);

export function isEnglishText(text = '') {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (trimmed.length < 5) return false;

  // Extract letter tokens
  const words = trimmed.toLowerCase().match(/[a-zçğıöşü]+/g) || [];
  if (words.length === 0) return false;

  const hasTurkishSpecificChars = /[çğıöşü]/i.test(trimmed);

  let engCount = 0;
  for (const w of words) {
    if (ENGLISH_COMMON_WORDS.has(w)) engCount++;
  }

  if (hasTurkishSpecificChars) {
    // Has Turkish letters: only consider English if overwhelming English words (> 38%)
    return words.length >= 5 && (engCount / words.length) >= 0.38;
  }

  // Pure ASCII text
  if (words.length <= 6) return engCount >= 2;
  return (engCount / words.length) >= 0.22;
}

/**
 * Translate English text to Turkish using fast Google GTX API with MyMemory fallback
 * Supports long text chunking for full abstracts.
 */
export async function translateTextToTurkish(text) {
  if (!text || typeof text !== 'string') return '';
  const trimmed = cleanAcademicText(text);
  if (!trimmed) return '';

  // Check cache
  if (translationCache.has(trimmed)) {
    const cached = translationCache.get(trimmed);
    if (cached && !isEnglishText(cached)) {
      return cached;
    }
  }

  // If text is very long (e.g. abstract > 700 chars), chunk it by sentences
  if (trimmed.length > 700) {
    const sentences = trimmed.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [trimmed];
    const chunks = [];
    let currentChunk = '';

    for (const s of sentences) {
      if ((currentChunk + s).length > 550) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = s;
      } else {
        currentChunk += ' ' + s;
      }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());

    const translatedChunks = [];
    for (const c of chunks) {
      const trChunk = await translateSingleChunk(c);
      if (trChunk) translatedChunks.push(trChunk);
    }
    const fullTranslation = polishMedicalTurkish(translatedChunks.join(' ').trim());
    if (fullTranslation && !isEnglishText(fullTranslation)) {
      setCachedTranslation(trimmed, fullTranslation);
      return fullTranslation;
    }
    return '';
  }

  const result = await translateSingleChunk(trimmed);
  const polished = polishMedicalTurkish(result);
  if (polished && !isEnglishText(polished)) {
    setCachedTranslation(trimmed, polished);
    return polished;
  }
  return '';
}

async function translateSingleChunk(chunk) {
  const trimmed = chunk.trim();
  if (!trimmed) return '';

  // Engine 1: Google Translate GTX (sl=en, tl=tr)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const encoded = encodeURIComponent(trimmed);
      const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encoded}`;
      
      const res = await fetch(gtxUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(6000)
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const translatedParts = data[0].map(segment => segment[0]).filter(Boolean);
          const translatedText = translatedParts.join('').trim();
          if (translatedText && !isEnglishText(translatedText)) {
            return translatedText;
          }
        }
      }
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // Engine 1b: Google Client5 Dict Chrome Extension API
  try {
    const encoded = encodeURIComponent(trimmed);
    const c5Url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=tr&q=${encoded}`;
    const res = await fetch(c5Url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      const trText = Array.isArray(data) ? (Array.isArray(data[0]) ? data[0][0] : data[0]) : (typeof data === 'string' ? data : '');
      if (trText && typeof trText === 'string' && !isEnglishText(trText)) {
        return trText.trim();
      }
    }
  } catch {
    // Continue to next engine
  }

  // Engine 2: MyMemory API Fallback
  try {
    const encoded = encodeURIComponent(trimmed.slice(0, 450));
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|tr`, {
      headers: { 'User-Agent': 'KlinikPusulaAcademic/2.0' },
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      const trText = data?.responseData?.translatedText;
      if (trText && !trText.includes('MYMEMORY WARNING') && !isEnglishText(trText)) {
        return trText
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&');
      }
    }
  } catch {
    // Fall back
  }

  return '';
}

/**
 * Batch translate papers (titles and key takeaways) in disciplined concurrent chunks
 * Avoids rate limits by focusing on search card essentials.
 */
export async function translatePapersBatch(papers, maxItems = 20) {
  if (!Array.isArray(papers) || papers.length === 0) return [];
  
  const itemsToTranslate = papers.slice(0, maxItems);
  const chunkSize = 3;
  const results = [];

  for (let i = 0; i < itemsToTranslate.length; i += chunkSize) {
    const chunk = itemsToTranslate.slice(i, i + chunkSize);
    const chunkPromises = chunk.map(async (paper) => {
      try {
        const [trTitle, trTakeaway] = await Promise.all([
          (paper.trTitle && !isEnglishText(paper.trTitle))
            ? Promise.resolve(paper.trTitle)
            : (paper.title ? translateTextToTurkish(paper.title) : Promise.resolve('')),
          (paper.trTakeaway && !isEnglishText(paper.trTakeaway))
            ? Promise.resolve(paper.trTakeaway)
            : (paper.keyTakeaway ? translateTextToTurkish(paper.keyTakeaway) : Promise.resolve(''))
        ]);
        return {
          id: paper.id,
          trTitle: trTitle || paper.trTitle || paper.title,
          trTakeaway: trTakeaway || paper.trTakeaway || null,
          trAbstract: null // Abstract translated on-demand when expanded to prevent 429 rate limit
        };
      } catch {
        return { id: paper.id, trTitle: paper.trTitle || null, trTakeaway: paper.trTakeaway || null, trAbstract: null };
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);

    if (i + chunkSize < itemsToTranslate.length) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  return results;
}
