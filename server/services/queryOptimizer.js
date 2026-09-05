/**
 * Query Optimizer & Semantic Concept Extractor
 * Transforms raw user questions, clinical statements, and thesis hypotheses
 * into high-precision, entity-rich academic search terms.
 */

// Turkish hypothesis prefixes & question endings
const TURKISH_NOISE_PATTERNS = [
  /^h[0-9]:?\s*/i,
  /^hipotez\s*[0-9]?:?\s*/i,
  /\bistatistiksel olarak anlamlı bir ilişki yoktur\b/gi,
  /\bistatistiksel olarak anlamlı bir ilişki vardır\b/gi,
  /\bistatistiksel olarak anlamlı ve pozitif bir etkiye sahiptir\b/gi,
  /\bistatistiksel olarak anlamlı\b/gi,
  /\bpozitif yönlü aracılık etmektedir\b/gi,
  /\baracılık etmektedir\b/gi,
  /\barasındaki ilişki nedir\b/gi,
  /\barasındaki ilişki\b/gi,
  /\büzerinde anlamlı bir etkisi var mıdır\b/gi,
  /\betkisi var mıdır\b/gi,
  /\betkiler mi\b/gi,
  /\betkisi nedir\b/gi,
  /\bnasıl etkiler\b/gi,
  /\bnelerdir\b/gi,
  /\bvar mıdır\b/gi,
  /\byok mudur\b/gi,
  /\bzararlı mıdır\b/gi,
  /\bzararlı mı\b/gi,
  /\bzararları nelerdir\b/gi,
  /\bzararları\b/gi,
  /\bzararlı\b/gi,
  /\btehlikeli midir\b/gi,
  /\btehlikeli mi\b/gi,
  /\btehlikeli\b/gi,
  /\byan etkileri nelerdir\b/gi,
  /\byan etkileri\b/gi,
  /\byan etkisi var mıdır\b/gi,
  /\byan etkisi\b/gi,
  /\bgüvenli midir\b/gi,
  /\bgüvenli mi\b/gi,
  /\bneden olabilir mi\b/gi,
  /\bneden olabilir\b/gi,
  /\bneden olur mu\b/gi,
  /\bneden olur\b/gi,
  /\byol açar mı\b/gi,
  /\byol açabilir mi\b/gi,
  /\byol açabilir\b/gi,
  /\byol açar\b/gi,
  /\bsebep olur mu\b/gi,
  /\bsebep olabilir mi\b/gi,
  /\bsebep olabilir\b/gi,
  /\bsebep olur\b/gi,
  /\bsebebiyet verir mi\b/gi,
  /\bsebebiyet verir\b/gi,
  /\bolabilir mi\b/gi,
  /\bolabilir\b/gi,
  /\bmıdır\b/gi,
  /\bmidir\b/gi,
  /\bmudur\b/gi,
  /\bmüdür\b/gi,
  /\btek başına\b/gi,
  /\beşsiz bir besindir\b/gi,
  /\beşsiz bir\b/gi,
  /\bmükemmel bir\b/gi,
  /\bbilinmesine rağmen\b/gi,
  /\bbilinirken\b/gi,
  /\bbilinmektedir\b/gi,
  /\bbilindiği üzere\b/gi,
  /\bbilindiği gibi\b/gi,
  /\bson çalışmalarda\b/gi,
  /\byeni araştırmalarda\b/gi,
  /\byapılan çalışmalarda\b/gi,
  /\bçalışmalarda\b/gi,
  /\bliteratürde\b/gi,
  /\bgözlenmiştir\b/gi,
  /\bgözlemlenmiştir\b/gi,
  /\bsaptanmıştır\b/gi,
  /\bbildirilmiştir\b/gi,
  /\bgösterilmiştir\b/gi,
  /\btespit edilmiştir\b/gi,
  /\bgörülmektedir\b/gi,
  /\bbelirlenmiştir\b/gi,
  /\bdaha çok olduğu\b/gi,
  /\bdaha fazla olduğu\b/gi,
  /\bdaha sık olduğu\b/gi,
  /\bdaha az olduğu\b/gi,
  /\beşit olduğu\b/gi,
  /\bfarklı olduğu\b/gi,
  /\bdaha fazladır\b/gi,
  /\bdaha çoktur\b/gi,
  /\bdaha sıktır\b/gi,
  /\bdaha azdır\b/gi,
  /\beşittir\b/gi,
  /\bfarklıdır\b/gi,
  /\brağmen\b/gi,
  /\bkarşın\b/gi,
  /\bkarşılık\b/gi
];

// English conversational, question, and generic fillers that ruin search recall
const ENGLISH_STOP_WORDS = new Set([
  // Question & auxiliary words
  'how', 'what', 'why', 'when', 'where', 'which', 'who', 'whom', 'whose',
  'can', 'could', 'would', 'should', 'shall', 'will', 'may', 'might', 'must',
  'does', 'do', 'did', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'having',
  // Conjunctions, prepositions, pronouns & determiners
  'the', 'a', 'an', 'and', 'or', 'of', 'in', 'on', 'with', 'by', 'from',
  'between', 'to', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'for', 'at', 'about', 'against', 'under', 'over', 'as',
  'this', 'that', 'these', 'those', 'there', 'here', 'it', 'its', 'itself',
  'every', 'each', 'all', 'any', 'both', 'other', 'others', 'another',
  'much', 'many', 'lot', 'lots', 'little', 'few', 'more', 'most', 'less', 'least',
  // Generic directional verbs & conversational glue
  'cause', 'causes', 'causing', 'caused', 'lead', 'leads', 'leading',
  'unique', 'excellent', 'great', 'good', 'best', 'essential', 'meets', 'meet',
  'meeting', 'sole', 'solely', 'except', 'excepting', 'entirely', 'ideal',
  'balance', 'source', 'food', 'intake', 'matter', 'thing', 'way', 'ways',
  'really', 'very', 'quite', 'rather', 'just', 'such', 'like', 'than',
  'part', 'parts', 'aspect', 'aspects', 'section', 'terms', 'term',
  'compare', 'compared', 'comparison', 'however', 'therefore', 'thus', 'moreover',
  'furthermore', 'although', 'though', 'especially', 'particularly', 'mainly',
  'attract', 'attracts', 'attracted', 'attention', 'view', 'point', 'regard', 'regards',
  'emphasize', 'emphasized', 'emphasizing', 'highlight', 'highlighted', 'note', 'noted',
  'choice', 'lifestyle', 'fundamental', 'basic', 'general', 'overall', 'true', 'false',
  'high', 'low', 'poor', 'rich', 'well', 'rate', 'rates',
  // Generic research fluff & directional verbs
  'study', 'studies', 'research', 'paper', 'article', 'investigate', 'investigated',
  'investigating', 'analyze', 'analyzed', 'analyzing', 'results', 'findings',
  'indicate', 'indicates', 'suggest', 'suggests', 'show', 'shows', 'shown',
  'relationship', 'association', 'correlate', 'correlation', 'impact', 'effect',
  'effects', 'affect', 'affects', 'affected', 'role', 'roles', 'significant',
  'statistically', 'level', 'levels', 'difference', 'differences',
  'increase', 'increases', 'increasing', 'increased', 'decrease', 'decreases', 'decreasing', 'decreased',
  'elevate', 'elevates', 'elevated', 'reduce', 'reduces', 'reduced',
  // Evidence & statement fluff that dilutes subject matching
  'known', 'know', 'knowing', 'unknown',
  'recent', 'recently', 'earlier', 'previously',
  'observed', 'observe', 'observing', 'observation', 'observations',
  'equal', 'equally', 'equality', 'unequal',
  'common', 'commonly', 'frequent', 'frequently', 'prevalent', 'prevalence', 'rare', 'rarely',
  'although', 'though', 'despite', 'whereas', 'while', 'even', 'since',
  'reported', 'report', 'reports', 'reporting',
  'found', 'find', 'finds', 'finding',
  'seen', 'see', 'sees', 'seeing',
  'described', 'describe', 'describes',
  'noted', 'notes',
  'demonstrated', 'demonstrate', 'demonstrates',
  'proven', 'proved', 'prove',
  'accepted', 'considered', 'thought', 'believed',
  'question', 'hypothesis', 'statement', 'claim',
  'entire', 'whole',
  'men', 'man', 'women', 'woman', 'male', 'female'
]);

// Protected key medical & scientific multi-word entities (must not be fragmented)
const PROTECTED_PHRASES = [
  { pattern: /\b(ankylosing spondylitis|ankilozan spondilit|axial spondyloarthritis|aksiyel spondiloartrit|spondyloarthritis|spondiloartrit|axspa|nr-axspa|sacroiliitis|sakroiliit|hla-b27|asas criteria)\b/gi, entity: 'ankylosing spondylitis axial spondyloarthritis' },
  { pattern: /\b(men and women|men women|women and men|women men|male female|female male|kadın erkek|erkek kadın|cinsiyet dağılımı|cinsiyet|sex ratio|gender differences?|sex differences?|gender distribution|male-to-female|female-to-male)\b/gi, entity: 'sex ratio gender distribution' },
  { pattern: /\b(rheumatoid arthritis|romatoid artrit)\b/gi, entity: 'rheumatoid arthritis' },
  { pattern: /\b(systemic lupus erythematosus|sistemik lupus eritematozus|lupus|sle)\b/gi, entity: 'systemic lupus erythematosus' },
  { pattern: /\b(multiple sclerosis|multiple skleroz)\b/gi, entity: 'multiple sclerosis' },
  { pattern: /\b(inflammatory bowel disease|inflamatuar bağırsak hastalığı|crohn|ulcerative colitis|ülseratif kolit)\b/gi, entity: 'inflammatory bowel disease' },
  { pattern: /\b(chronic kidney disease|kronik böbrek hastalığı|ckd|nephropathy)\b/gi, entity: 'chronic kidney disease' },
  { pattern: /\b(heart failure|kalp yetmezliği)\b/gi, entity: 'heart failure' },
  { pattern: /\b(metformin|medformin|medfomin|glucophage|glifor|biguanides?)\b/gi, entity: 'metformin type 2 diabetes' },
  { pattern: /\b(semaglutide|ozempic|wegovy|rybelsus)\b/gi, entity: 'semaglutide' },
  { pattern: /\b(tirzepatide|mounjaro|zepbound)\b/gi, entity: 'tirzepatide' },
  { pattern: /\b(liraglutide|victoza|saxenda)\b/gi, entity: 'liraglutide' },
  { pattern: /\b(glp-1|glp-1 receptor agonist|glp-1 ra)\b/gi, entity: 'glp-1 receptor agonist' },
  { pattern: /\b(acetylsalicylic acid|salicylic acid|aspirin|salicylates?)\b/gi, entity: 'aspirin acetylsalicylic acid' },
  { pattern: /\b(reye syndrome|reye's syndrome|reyes syndrome)\b/gi, entity: 'reye syndrome' },
  { pattern: /\b(valproic acid|sodium valproate|valproate)\b/gi, entity: 'valproic acid' },
  { pattern: /\b(kawasaki disease|kawasaki syndrome)\b/gi, entity: 'kawasaki disease' },
  { pattern: /\b(breast milk|human milk|maternal milk)\b/gi, entity: 'breast milk' },
  { pattern: /\b(infant formula|formula milk)\b/gi, entity: 'infant formula' },
  { pattern: /\b(human milk oligosaccharides|hmos)\b/gi, entity: 'human milk oligosaccharides' },
  { pattern: /\b(hind milk|hindmilk)\b/gi, entity: 'hindmilk' },
  { pattern: /\b(fore milk|foremilk)\b/gi, entity: 'foremilk' },
  { pattern: /\b(lactose content|lactose)\b/gi, entity: 'lactose' },
  { pattern: /\b(fat content|lipid content)\b/gi, entity: 'fat content' },
  { pattern: /\b(growth rate|growth velocity)\b/gi, entity: 'growth rate' },
  { pattern: /\b(physiological maturity|physiological development)\b/gi, entity: 'physiological maturity' },
  { pattern: /\b(human rights?|child rights?|rights of the child)\b/gi, entity: 'human rights child' },
  { pattern: /\b(obstructive sleep apnea|sleep apnea syndrome|sleep apnea|apnea|osas?|ahi)\b/gi, entity: 'obstructive sleep apnea' },
  { pattern: /\b(obesity|overweight|body mass index|bmi|adiposity)\b/gi, entity: 'obesity' },
  { pattern: /\b(weight loss|bariatric surgery|gastric bypass)\b/gi, entity: 'weight loss' },
  { pattern: /\b(type 2 diabetes|t2d|type 1 diabetes|diabetes mellitus|diabetic)\b/gi, entity: 'type 2 diabetes' },
  { pattern: /\b(insulin resistance|insulin sensitivity|homa-ir)\b/gi, entity: 'insulin resistance' },
  { pattern: /\b(blood pressure|hypertension|arterial pressure)\b/gi, entity: 'hypertension' },
  { pattern: /\b(cardiovascular disease|cvd|coronary artery disease|heart failure)\b/gi, entity: 'cardiovascular disease' },
  { pattern: /\b(intermittent fasting|time-restricted feeding|time restricted eating)\b/gi, entity: 'intermittent fasting' },
  { pattern: /\b(creatine monohydrate|creatine supplementation|creatine)\b/gi, entity: 'creatine' },
  { pattern: /\b(sleep deprivation|sleep loss|sleep restriction)\b/gi, entity: 'sleep deprivation' },
  { pattern: /\b(cognitive performance|cognitive function|memory performance|executive function)\b/gi, entity: 'cognitive function' },
  { pattern: /\b(gut microbiota|gut microbiome)\b/gi, entity: 'gut microbiota' },
  { pattern: /\b(metabolic syndrome|mets)\b/gi, entity: 'metabolic syndrome' },
  { pattern: /\b(fatty liver|nafld|nash|mash|hepatic steatosis)\b/gi, entity: 'fatty liver disease' },
  { pattern: /\b(energy requirement|energy needs|nutritional requirement|nutritional needs)\b/gi, entity: 'infant nutrition' },
  { pattern: /\b(brain development|neurodevelopment)\b/gi, entity: 'neurodevelopment' },
  { pattern: /\b(lekanemab|lecanemab|clarity ad|leqembi)\b/gi, entity: 'lecanemab alzheimer' },
  { pattern: /\b(resmetirom|maestro-nash|madrigal)\b/gi, entity: 'resmetirom nash' },
  { pattern: /\b(pilokarpin|pilocarpine|salagen|sjogren|xerostomia)\b/gi, entity: 'pilocarpine sjogren' },
  { pattern: /\b(allopurinol|alopurinol|gout|hyperuricemia|tophus)\b/gi, entity: 'allopurinol gout' },
  { pattern: /\b(prep|pre-exposure prophylaxis|tenofovir emtricitabine|truvada)\b/gi, entity: 'hiv prep tenofovir' },
  { pattern: /\b(febril konvülsiyon|febril konvulsiyon|febrile seizure|febrile convulsions)\b/gi, entity: 'febrile seizures' }
];

const MEDICAL_SYNONYMS = [
  [/\btüm spa\b/gi, 'all axial spondyloarthritis'],
  [/\bspa\b/gi, 'axial spondyloarthritis'],
  [/\bankilozan spondilit\b/gi, 'ankylosing spondylitis'],
  [/\baksiyel spondiloartrit\b/gi, 'axial spondyloarthritis'],
  [/\bspondiloartrit\b/gi, 'spondyloarthritis'],
  [/\bsakroiliit\b/gi, 'sacroiliitis'],
  [/\bromatoid artrit\b/gi, 'rheumatoid arthritis'],
  [/\bsistemik lupus eritematozus\b/gi, 'systemic lupus erythematosus'],
  [/\b(?<!systemic\s+)lupus(?!\s+erythematosus)\b/gi, 'systemic lupus erythematosus'],
  [/\bbaby\b/gi, 'infant'],
  [/\bbabies\b/gi, 'infants'],
  [/\bnewborn\b/gi, 'newborn infant'],
  [/\bmaternal milk\b/gi, 'breast milk human milk'],
  [/\byour obesity\b/gi, 'obstructive sleep apnea obesity'],
  [/\bacetylsalicylic acid\b/gi, 'aspirin acetylsalicylic acid'],
  [/\basetil salisilik asit\b/gi, 'aspirin acetylsalicylic acid'],
  [/\bharmful\b/gi, 'safety adverse effects clinical trial'],
  [/\bharm\b/gi, 'safety adverse effects'],
  [/\bsemaglutid\b/gi, 'semaglutide'],
  [/\bozempik\b/gi, 'ozempic'],
  [/\bmedformin\b/gi, 'metformin'],
  [/\bmetfomin\b/gi, 'metformin'],
  [/\bglukofaj\b/gi, 'metformin'],
  [/\bglifor\b/gi, 'metformin'],
  [/\blekanemab\b/gi, 'lecanemab'],
  [/\blekanemabı\b/gi, 'lecanemab'],
  [/\bleqembi\b/gi, 'lecanemab'],
  [/\bresmetiron\b/gi, 'resmetirom'],
  [/\bpilokarpin\b/gi, 'pilocarpine'],
  [/\balopurinol\b/gi, 'allopurinol'],
  [/\bfebril konvülsiyon\b/gi, 'febrile seizures'],
  [/\bfebril konvulsiyon\b/gi, 'febrile seizures']
];

// Damerau-Levenshtein distance algorithm
export function levenshteinDistance(s1 = '', s2 = '') {
  const a = s1.toLowerCase().trim();
  const b = s2.toLowerCase().trim();
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const d = [];
  for (let i = 0; i <= a.length; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // deletion
        d[i][j - 1] + 1,      // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1); // transposition
      }
    }
  }

  return d[a.length][b.length];
}

// Canonical Medical & Scientific Lexicon for fuzzy matching
export const CANONICAL_MEDICAL_LEXICON = [
  'metformin', 'semaglutide', 'tirzepatide', 'liraglutide', 'dulaglutide', 'aspirin',
  'paracetamol', 'acetaminophen', 'ibuprofen', 'naproxen', 'atorvastatin', 'rosuvastatin',
  'simvastatin', 'levothyroxine', 'omeprazole', 'esomeprazole', 'pantoprazole', 'amoxicillin',
  'ciprofloxacin', 'azithromycin', 'doxycycline', 'clarithromycin', 'methotrexate',
  'prednisone', 'prednisolone', 'dexamethasone', 'hydrochlorothiazide', 'amlodipine',
  'ramipril', 'lisinopril', 'losartan', 'valsartan', 'empagliflozin', 'dapagliflozin',
  'sitagliptin', 'vildagliptin', 'insulin', 'glargine', 'valproic', 'carbamazepine',
  'gabapentin', 'pregabalin', 'sertraline', 'escitalopram', 'fluoxetine', 'duloxetine',
  'venlafaxine', 'quetiapine', 'olanzapine', 'apixaban', 'rivaroxaban', 'warfarin',
  'clopidogrel', 'heparin', 'enoxaparin', 'colchicine', 'allopurinol', 'salbutamol',
  'formoterol', 'budesonide', 'fluticasone', 'montelukast', 'diabetes', 'hypertension',
  'pancreatitis', 'sarcopenia', 'obesity', 'apnea', 'reye', 'kawasaki', 'atherosclerosis',
  'arrhythmia', 'myocardial', 'infarction', 'ischemia', 'stroke', 'cirrhosis', 'steatosis',
  'nephropathy', 'neuropathy', 'retinopathy', 'cholesterol', 'triglycerides', 'glucose',
  'creatine', 'creatinine', 'bilirubin', 'troponin', 'ferritin', 'hemoglobin', 'albumin',
  'lactate', 'acidosis', 'ketoacidosis', 'pneumonia', 'bronchitis', 'asthma', 'sepsis',
  'anaphylaxis', 'hypothyroidism', 'hyperthyroidism', 'hashimoto', 'graves', 'psoriasis',
  'arthritis', 'osteoporosis', 'osteopenia', 'endometriosis', 'pcos', 'fibromyalgia',
  'alzheimer', 'parkinson', 'dementia', 'epilepsy', 'migraine', 'meningitis', 'encephalitis',
  'gastritis', 'colitis', 'crohn', 'carcinoma', 'melanoma', 'leukemia', 'lymphoma',
  'lecanemab', 'resmetirom', 'pilocarpine', 'tenofovir', 'emtricitabine',
  'gravis', 'myasthenia', 'cholelithiasis', 'cholecystitis', 'celiac',
  'spondylitis', 'spondyloarthritis', 'sacroiliitis', 'necrotizing', 'enterocolitis',
  'anorexia', 'bulimia', 'schizophrenia', 'amyotrophic', 'sclerosis'
];

// Recognized valid Turkish medical vocabulary
export const VALID_TURKISH_MEDICAL_WORDS = new Set([
  'obezite', 'diyabet', 'hipertansiyon', 'insülin', 'tiroid', 'pankreatit', 'sarkopeni',
  'apne', 'kolesterol', 'pnömoni', 'kardiyovasküler', 'ateroskleroz', 'kanser', 'melanom',
  'lösemi', 'lenfoma', 'epilepsi', 'migren', 'hepatit', 'siroz', 'astım', 'nefrit',
  'metformin', 'semaglutid', 'tirzepatid', 'liraglutid', 'dulaglutid', 'empagliflozin',
  'dapagliflozin', 'aspirin', 'parasetamol', 'ibuprofen', 'naproksen', 'atorvastatin',
  'rosuvastatin', 'simvastatin', 'levotiroksin', 'omeprazol', 'pantoprazol', 'amoksisilin',
  'siprofloksasin', 'azitromisin', 'doksisiklin', 'metotreksat', 'prednizolon', 'deksametazon',
  'amlodipin', 'ramipril', 'valsartan', 'losartan', 'metoprolol', 'bisoprolol', 'lekanemab',
  'donanemab', 'resmetirom', 'pilokarpin', 'allopurinol', 'kolşisin', 'sekukinumab',
  'infliksimab', 'adalimumab', 'trastuzumab', 'pembrolizumab', 'nivolumab', 'klopidogrel',
  'apiksaban', 'rivaroksaban', 'varfarin', 'heparin', 'kreatin', 'protein', 'glukoz',
  'troponin', 'ferritin', 'hemoglobin', 'albumin', 'laktat', 'asidoz', 'sepsis',
  'gravis', 'miyastenia', 'kolelitiyazis', 'kolesistit', 'çölyak', 'kolit',
  'spondilit', 'spondiloartrit', 'sakroiliit', 'anoreksiya', 'şizofreni',
  'bipolar', 'depresyon', 'anksiyete', 'otizm'
]);

export const CANONICAL_SET = new Set([
  ...CANONICAL_MEDICAL_LEXICON,
  ...VALID_TURKISH_MEDICAL_WORDS
]);

// Direct Turkish / speech-to-text common typo mappings
export const DIRECT_TYPO_MAP = {
  'lekanemab': 'lecanemab',
  'lekanemabı': 'lecanemab',
  'resmetiron': 'resmetirom',
  'pilokarpin': 'pilocarpine',
  'alopurinol': 'allopurinol',
  'medformin': 'metformin',
  'medfomin': 'metformin',
  'metfomin': 'metformin',
  'medformine': 'metformin',
  'metformine': 'metformin',
  'glukofaj': 'metformin',
  'glifor': 'metformin',
  'semaklutid': 'semaglutide',
  'semaglutit': 'semaglutide',
  'semaglutat': 'semaglutide',
  'semaglotid': 'semaglutide',
  'ozempik': 'ozempic',
  'tirzepatit': 'tirzepatide',
  'tirzepetid': 'tirzepatide',
  'mounkaro': 'mounjaro',
  'parasetemol': 'paracetamol',
  'parasetamol': 'paracetamol',
  'parasetamolü': 'paracetamol',
  'asprin': 'aspirin',
  'asprini': 'aspirin',
  'asetilsalisilik': 'aspirin',
  'asetil-salisilik': 'aspirin',
  'pankreatitis': 'pancreatitis',
  'pankreatite': 'pancreatitis',
  'kolelitiyazis': 'cholelithiasis',
  'kolelitiazis': 'cholelithiasis',
  'diyavet': 'diyabet',
  'seker': 'diyabet',
  'şeker': 'diyabet',
  'alzaymır': 'alzheimer',
  'alzaymer': 'alzheimer',
  'alzhimer': 'alzheimer',
  'parkison': 'parkinson',
  'tiroit': 'tiroid',
  'kolestrol': 'kolesterol',
  'tansiyon': 'hipertansiyon',
  'zaturre': 'pnömoni',
  'zatürre': 'pnömoni',
  'sarkopenisi': 'sarcopenia',
  'sarkopeni': 'sarcopenia'
};

/**
 * Detects and corrects typos in speech-to-text or typed clinical queries
 */
export function correctMedicalTypos(inputText = '') {
  if (!inputText || typeof inputText !== 'string') {
    return { correctedText: '', correctedTerms: [], didYouMean: null };
  }

  const words = inputText.split(/(\s+|[,;.!?:()]+)/);
  const correctedTerms = [];

  const newWords = words.map(token => {
    if (/^[\s,;.!?:()]+$/.test(token) || token.length < 3) {
      return token;
    }

    const clean = token.toLowerCase().replace(/['".,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

    // 0. Exact match guard: if the term or its Turkish inflected stem is already valid, NEVER mutate!
    if (CANONICAL_SET.has(clean) || VALID_TURKISH_MEDICAL_WORDS.has(clean)) {
      return token;
    }
    const stem = clean.replace(/(?:in|ın|un|ün|e|a|de|da|den|dan|i|ı|u|ü|le|la|si|sı|su|sü)$/i, '');
    if (stem.length >= 4 && (CANONICAL_SET.has(stem) || VALID_TURKISH_MEDICAL_WORDS.has(stem))) {
      return token;
    }

    // 1. Direct typo dictionary match
    if (DIRECT_TYPO_MAP[clean]) {
      const matched = DIRECT_TYPO_MAP[clean];
      correctedTerms.push({ from: token, to: matched });
      return matched;
    }

    // 2. Fuzzy Levenshtein match against canonical lexicon (guarded against drug cross-substitution)
    let bestMatch = null;
    let minDistance = 999;

    for (const canonical of CANONICAL_MEDICAL_LEXICON) {
      if (Math.abs(clean.length - canonical.length) > 2) continue;

      const dist = levenshteinDistance(clean, canonical);
      const maxAllowedDist = clean.length >= 9 ? 2 : (clean.length >= 6 ? 1 : 0);
      const similarity = 1 - (dist / Math.max(clean.length, canonical.length));

      if (dist > 0 && dist <= maxAllowedDist && similarity >= 0.82 && dist < minDistance) {
        minDistance = dist;
        bestMatch = canonical;
      }
    }

    if (bestMatch) {
      correctedTerms.push({ from: token, to: bestMatch });
      return bestMatch;
    }

    return token;
  });

  const correctedText = newWords.join('');
  const didYouMean = correctedTerms.length > 0 ? correctedTerms.map(c => c.to).join(', ') : null;

  return {
    correctedText,
    correctedTerms,
    didYouMean
  };
}

const queryTranslationCache = new Map();

function transliterateTurkish(str = '') {
  return str
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C');
}

const TURKISH_TO_ENGLISH_LEXICON = [
  [/\berişkin\b/gi, 'adult'],
  [/\bçocuklarda\b/gi, 'children'],
  [/\bçocukluk çağı\b/gi, 'childhood'],
  [/\bçocuk\b/gi, 'child'],
  [/\bgebelikte\b/gi, 'pregnancy'],
  [/\bgebelik\b/gi, 'pregnancy'],
  [/\bbebeklerde\b/gi, 'infants'],
  [/\bbebek\b/gi, 'infant'],
  [/\byenidoğan\b/gi, 'neonatal newborn'],
  [/\bprematüre\b/gi, 'premature preterm'],
  [/\banne sütü\b/gi, 'breast milk'],
  [/\bformül mama\b/gi, 'infant formula'],
  [/\bnekrotizan enterokolit\b/gi, 'necrotizing enterocolitis'],
  [/\bfebril konvülsiyon\b/gi, 'febrile seizures'],
  [/\bhavale\b/gi, 'seizures'],
  [/\bnöbet sıklığı\b/gi, 'seizure frequency'],
  [/\bnöbet\b/gi, 'seizures'],
  [/\bdirençli epilepsi\b/gi, 'refractory epilepsy drug-resistant'],
  [/\bepilepsi\b/gi, 'epilepsy'],
  [/\bketojenik diyet\b/gi, 'ketogenic diet'],
  [/\bparasetamol\b/gi, 'paracetamol acetaminophen'],
  [/\bdikkat eksikliği ve hiperaktivite\b/gi, 'attention deficit hyperactivity disorder adhd'],
  [/\bdikkat eksikliği\b/gi, 'attention deficit adhd'],
  [/\bhiperaktivite\b/gi, 'hyperactivity'],
  [/\bmetilfenidat\b/gi, 'methylphenidate'],
  [/\bçalışma belleği\b/gi, 'working memory'],
  [/\bbellek\b/gi, 'memory'],
  [/\bdikkat\b/gi, 'attention'],
  [/\bşizofreni\b/gi, 'schizophrenia'],
  [/\bklozapin\b/gi, 'clozapine'],
  [/\bantipsikotik\b/gi, 'antipsychotic'],
  [/\bbipolar bozukluk\b/gi, 'bipolar disorder'],
  [/\blityum\b/gi, 'lithium'],
  [/\bintihar riski\b/gi, 'suicide risk'],
  [/\bdepresyon\b/gi, 'depression'],
  [/\bssri\b/gi, 'ssri antidepressants'],
  [/\bplasebo\b/gi, 'placebo'],
  [/\bpnömoni\b/gi, 'pneumonia'],
  [/\bventilatör ilişkili\b/gi, 'ventilator-associated'],
  [/\bdeeskalasyon\b/gi, 'de-escalation'],
  [/\bseptik şok\b/gi, 'septic shock sepsis'],
  [/\bkristalloid\b/gi, 'crystalloids balanced'],
  [/\bsalin\b/gi, 'normal saline'],
  [/\bakut böbrek hasarı\b/gi, 'acute kidney injury'],
  [/\bbakteriyel menenjit\b/gi, 'bacterial meningitis'],
  [/\bdeksametazon\b/gi, 'dexamethasone'],
  [/\bişitme kaybı\b/gi, 'hearing loss'],
  [/\bhepatit c\b/gi, 'hepatitis c'],
  [/\bdirekt etkili antiviral\b/gi, 'direct acting antivirals'],
  [/\bvirolojik yanıt\b/gi, 'virological response'],
  [/\btüberküloz\b/gi, 'tuberculosis'],
  [/\brifampisin\b/gi, 'rifampicin resistance genexpert'],
  [/\binfluenza\b/gi, 'influenza'],
  [/\boseltamivir\b/gi, 'oseltamivir'],
  [/\bkistik fibrozis\b/gi, 'cystic fibrosis cftr'],
  [/\bakciğer\b/gi, 'pulmonary lung'],
  [/\bintussusepsiyon\b/gi, 'intussusception hydrostatic reduction'],
  [/\bretinopati\b/gi, 'retinopathy prematurity anti-vegf'],
  [/\bkolorektal kanser\b/gi, 'colorectal cancer screening colonoscopy'],
  [/\bözofagus varis\b/gi, 'esophageal varices beta blockers'],
  [/\bpeptik ülser\b/gi, 'peptic ulcer helicobacter pylori'],
  [/\bcrohn\b/gi, 'crohn disease infliximab'],
  [/\bülseratif kolit\b/gi, 'ulcerative colitis vedolizumab'],
  [/\bkaraciğer fibrozisi\b/gi, 'liver fibrosis resmetirom nash'],
  [/\balzheimer\b/gi, 'alzheimer lecanemab cognitive'],
  [/\bparkinson\b/gi, 'parkinson levodopa motor'],
  [/\binme\b/gi, 'acute ischemic stroke alteplase'],
  [/\bmultipl skleroz\b/gi, 'multiple sclerosis natalizumab pml'],
  [/\bmigren\b/gi, 'migraine prophylaxis cgrp'],
  [/\bmeme kanseri\b/gi, 'breast cancer trastuzumab her2'],
  [/\bakciğer kanseri\b/gi, 'lung cancer egfr osimertinib'],
  [/\bmelanom\b/gi, 'melanoma anti-pd-1 pembrolizumab'],
  [/\bmultipl miyelom\b/gi, 'multiple myeloma bortezomib'],
  [/\bkolon kanseri\b/gi, 'colon cancer folfox adjuvant'],
  [/\bcar-t\b/gi, 'car-t cell therapy cytokine release'],
  [/\bitp\b/gi, 'immune thrombocytopenia thrombopoietin'],
  [/\baml\b/gi, 'acute myeloid leukemia venetoclax azacitidine'],
  [/\bpankreas kanseri\b/gi, 'pancreatic cancer folfirinox gemcitabine'],
  [/\bhodgkin lenfoma\b/gi, 'hodgkin lymphoma brentuximab vedotin']
];

// Multi-engine translation with cache and local medical fallback
async function translateToEnglish(text, options = {}) {
  if (queryTranslationCache.has(text)) {
    return queryTranslationCache.get(text);
  }

  // Fast offline / batch mode for evaluation suites
  if (options.fastMode || process.env.FAST_EVAL === '1') {
    let localResult = text;
    for (const [pat, rep] of TURKISH_TO_ENGLISH_LEXICON) {
      localResult = localResult.replace(pat, rep);
    }
    for (const [pat, rep] of MEDICAL_SYNONYMS) {
      localResult = localResult.replace(pat, rep);
    }
    localResult = transliterateTurkish(localResult).trim();
    queryTranslationCache.set(text, localResult);
    return localResult;
  }

  // 1. Google Translate GTX
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      const translated = data[0]?.map(s => s[0]).filter(Boolean).join('') || '';
      if (translated && !/[çğıöşü]/i.test(translated)) {
        let polished = translated.trim();
        for (const [pat, rep] of MEDICAL_SYNONYMS) {
          polished = polished.replace(pat, rep);
        }
        queryTranslationCache.set(text, polished);
        return polished;
      }
    }
  } catch {}

  // 2. Google Clients5
  try {
    const c5Url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=tr&tl=en&q=${encodeURIComponent(text)}`;
    const c5Res = await fetch(c5Url, { signal: AbortSignal.timeout(3500) });
    if (c5Res.ok) {
      const c5Data = await c5Res.json();
      const trStr = Array.isArray(c5Data) ? c5Data[0] : (typeof c5Data === 'string' ? c5Data : '');
      if (trStr && !/[çğıöşü]/i.test(trStr)) {
        let polished = trStr.trim();
        for (const [pat, rep] of MEDICAL_SYNONYMS) {
          polished = polished.replace(pat, rep);
        }
        queryTranslationCache.set(text, polished);
        return polished;
      }
    }
  } catch {}

  // 3. MyMemory API
  try {
    const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 400))}&langpair=tr|en`;
    const mmRes = await fetch(mmUrl, { signal: AbortSignal.timeout(3500) });
    if (mmRes.ok) {
      const mmData = await mmRes.json();
      const trText = mmData.responseData?.translatedText;
      if (trText && !trText.includes('MYMEMORY WARNING') && !/[çğıöşü]/i.test(trText)) {
        let polished = trText.trim();
        for (const [pat, rep] of MEDICAL_SYNONYMS) {
          polished = polished.replace(pat, rep);
        }
        queryTranslationCache.set(text, polished);
        return polished;
      }
    }
  } catch {}

  // 4. Robust Local Medical Lexicon Fallback + Transliteration
  let localResult = text;
  for (const [pat, rep] of TURKISH_TO_ENGLISH_LEXICON) {
    localResult = localResult.replace(pat, rep);
  }
  for (const [pat, rep] of MEDICAL_SYNONYMS) {
    localResult = localResult.replace(pat, rep);
  }
  localResult = transliterateTurkish(localResult).trim();
  queryTranslationCache.set(text, localResult);
  return localResult;
}

/**
 * Extracts substantive semantic keywords while preserving domain phrases
 */
function extractSemanticConcepts(englishText) {
  let text = englishText;
  const detectedEntities = [];

  // 1. Detect & preserve multi-word medical/academic entities
  for (const { pattern, entity } of PROTECTED_PHRASES) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      detectedEntities.push(entity);
      pattern.lastIndex = 0;
      text = text.replace(pattern, ' ');
    }
  }

  // 2. Tokenize remaining words, removing punctuation & fluff
  const cleanTokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 2 && !ENGLISH_STOP_WORDS.has(t));

  // 3. Merge entities + high-value keywords without duplication
  const combined = [...detectedEntities, ...cleanTokens];
  const unique = Array.from(new Set(combined));

  return unique;
}

/**
 * Optimizes an incoming query or long hypothesis into high-recall, high-precision academic search terms
 */
export async function optimizeAcademicQuery(rawInput = '', options = {}) {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      raw: '',
      correctedText: '',
      correctedTerms: [],
      didYouMean: null,
      englishText: '',
      primaryQuery: '',
      fallbackQuery: '',
      coreKeywords: [],
      turkishKeywords: [],
      isHypothesis: false,
      translated: false
    };
  }

  // 1. Detect & correct medical and scientific typos (Fuzzy Levenshtein + Direct Typo Map)
  const { correctedText, correctedTerms, didYouMean } = correctMedicalTypos(rawInput);
  if (correctedTerms.length > 0 && !options.silent && !options.fastMode) {
    console.log(`[QueryOptimizer] Typo Detected & Auto-Corrected: "${rawInput}" -> "${correctedText}" (${JSON.stringify(correctedTerms)})`);
  }

  let text = correctedText.trim();
  const isHypothesis = /h[0-9]:|hipotez|aracılık|istatistiksel|belirleyici|farklılık|farklıdır/i.test(text);

  // Strip hypothesis boilerplate
  for (const regex of TURKISH_NOISE_PATTERNS) {
    text = text.replace(regex, ' ');
  }
  text = text.replace(/\s+/g, ' ').trim();

  // Extract clean Turkish keywords for DergiPark
  const turkishStopWords = new Set([
    've', 'ile', 'için', 'olan', 'bir', 'bu', 'gibi', 'her', 'tüm', 'ilk', 'tek', 
    'haricinde', 'neden', 'olabilir', 'olur', 'sebep', 'yol', 'açar', 'yapar', 'mi', 'mı', 'mu', 'mü',
    'zararlı', 'zarar', 'zararları', 'tehlikeli', 'tehlike', 'güvenli', 'yan', 'etki', 'etkileri', 'midir', 'mıdır'
  ]);
  const turkishKeywords = text
    .toLowerCase()
    .replace(/[^a-z0-9çğıöşü\s]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !turkishStopWords.has(w));

  // Check if text needs Turkish-to-English translation
  const isPureEnglish = /^[a-z0-9\s.,!?:;'"()-]+$/i.test(text) && 
    !/\b(apne|obezite|artar|azalir|azalır|etki|etkisi|nedir|nelerdir|nasil|nasıl|ilişki|iliski|fark|farklılık|faktor|faktör|direnc|direnç|fayda|faydalı|faydalari|zarar|zararları|hastalik|hastalığı|tedavi|tedavisi|ilac|ilaç|cocuk|çocuk|gebelik|bebek|beslenme|uyku|kilo|zayiflama|zayıflama|karaciger|karaciğer|akciger|akciğer|kalp|damar|tansiyon|seker|şeker|oruç|oruc|kreatin|protein|diyet|oruç|aralıklı)\b/i.test(text) &&
    /\b(the|is|are|and|in|of|for|with|on|to|from|by|between|effect|effects|impact|association|correlation|apnea|obesity|increases|decreases|risk)\b/i.test(text);

  let englishText = text;
  let wasTranslated = false;

  if (!isPureEnglish) {
    const translated = await translateToEnglish(text, options);
    if (translated && translated.trim().length > 0) {
      englishText = translated;
      wasTranslated = true;
    }
  }

  // Extract substantive concepts
  const coreKeywords = extractSemanticConcepts(englishText);

  // Build primary search query: clean space-separated terms for API compatibility
  let primaryQuery = '';
  if (coreKeywords.length > 0) {
    primaryQuery = coreKeywords.slice(0, 8).join(' ');
  } else {
    primaryQuery = englishText.slice(0, 60);
  }

  // Fallback query (top 2-3 most essential concepts)
  const fallbackQuery = coreKeywords.slice(0, 3).join(' ');

  return {
    raw: rawInput,
    correctedText,
    correctedTerms,
    didYouMean,
    englishText,
    primaryQuery,
    fallbackQuery,
    coreKeywords,
    turkishKeywords,
    isHypothesis,
    translated: wasTranslated
  };
}

