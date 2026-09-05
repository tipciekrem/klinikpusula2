/**
 * PICO (Population, Intervention, Comparison, Outcome) Intelligent Clinical Parser
 * Rule-based NLP and Clinical Pattern Extraction Engine
 */

export function parseClinicalPico(rawText = '') {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return { population: '', intervention: '', comparison: '', outcome: '' };
  }

  let text = rawText.trim();
  let p = '', i = '', c = '', o = '';

  // 1. Comparison detection (vs, kıyasla, göre, karşı, versus, compared to)
  const compMatch = text.match(/(?:kıyasla|kıyasla\s+olarak|karşılaştırmalı|karşı|göre|versus|\bvs\.?\b|compared\s+to|in\s+comparison\s+with)\s+([^,.\n;]+?)(?=\s+(?:üzerindeki|açısından|etkisi|faydası|sonuçları|oranı|sağlar\s+mı|azaltır\s+mı|etkinliği)|[.,;]|$)/i);
  if (compMatch) {
    c = compMatch[1].replace(/^(?:olan|ile)\s+/i, '').trim();
  }

  // 2. Intervention detection (tedavisi, kullanımı, ilacı, müdahalesi, therapy, treatment)
  const intMatch = text.match(/([a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s\/-]+?)\s+(?:tedavisi|kullanımı|uygulaması|tedavisinin|ilacı|müdahalesi|therapy|treatment|use|intervention|administration)/i);
  if (intMatch) {
    i = intMatch[1]
      .replace(/^(?:hastalarda|bireylerde|hastalarında|erişkinlerde|çocuklarda)\s+/i, '')
      .replace(/^(?:veya|ile|ve)\s+/i, '')
      .trim();
  }

  // 3. Population detection (hastalarında, olgularında, bireylerde, popülasyonunda, patients, adults)
  const popMatch = text.match(/([a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s\/-]+?)\s+(?:hastalarında|hastalarında\s+olan|olgularında|tanılı\s+bireylerde|tanısı\s+almış|popülasyonunda|hastalarda|erişkinlerde|çocuklarda|kohortunda|patients|adults|individuals|cohort)/i);
  if (popMatch) {
    p = popMatch[1]
      .replace(/^(?:h1:|h2:|soru:|araştırma:|klinik\s+soru:)\s*/i, '')
      .replace(/^(?:yetişkin|erişkin)\s+/i, 'Yetişkin ')
      .trim();
  }

  // 4. Outcome detection (mortalite, azalma, iyileşme, kontrolü, riski, outcome, reduction)
  const outMatch = text.match(/(?:üzerindeki|açısından|yönünden|etkisiyle|bakımından|hedefleyen)\s+([^,.\n?;]+?)(?=\s+(?:etkisi|nedir|sağlar\s+mı|üstün\s+müdür|azaltır\s+mı)|[?.,;]|$)/i) ||
                   text.match(/([a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s\/-]+?\s+(?:mortalite|mace|hba1c|kilo\s+kaybı|iyileşme|remisyon|sağkalım|azalması|artışı|riski|olayları|kontrolü))/i);
  if (outMatch) {
    o = outMatch[1].trim();
  }

  // Targeted Clinical Entity Heuristic Backstops
  const lower = text.toLowerCase();

  // Population Backstops
  if (!p) {
    if (lower.includes('diyabet') || lower.includes('t2d') || lower.includes('dm')) p = 'Tip 2 Diyabet Hastaları';
    else if (lower.includes('obez') || lower.includes('vki')) p = 'Obezite Tanılı Bireyler';
    else if (lower.includes('kalp yetmezliği') || lower.includes('hfpef') || lower.includes('hfref')) p = 'Kalp Yetmezliği Olguları';
    else if (lower.includes('hipertansiyon') || lower.includes('tansiyon')) p = 'Esansiyel Hipertansiyon Hastaları';
    else if (lower.includes('kanser') || lower.includes('tümör') || lower.includes('malign')) p = 'Onkoloji Hastaları';
    else if (lower.includes('kronik böbrek') || lower.includes('kbh') || lower.includes('egfr')) p = 'Kronik Böbrek Hastaları';
    else if (lower.includes('depresyon') || lower.includes('anksiyete')) p = 'Major Depresif Bozukluk Olguları';
  }

  // Intervention Backstops
  if (!i) {
    if (lower.includes('tirzepatid')) i = 'Tirzepatid';
    else if (lower.includes('semaglutid')) i = 'Semaglutid';
    else if (lower.includes('metformin')) i = 'Metformin';
    else if (lower.includes('empagliflozin') || lower.includes('sglt2')) i = 'SGLT2 İnhibitörleri';
    else if (lower.includes('aspirin')) i = 'Asetilsalisilik Asit (Aspirin)';
    else if (lower.includes('statin') || lower.includes('atorvastatin')) i = 'Statin Tedavisi';
    else if (lower.includes('pembrolizumab')) i = 'Pembrolizumab (İmmünoterapi)';
    else if (lower.includes('kortikosteroid') || lower.includes('deksametazon')) i = 'Kortikosteroid';
  }

  // Comparison Backstops (Only if explicitly contrasting or mentioning comparator)
  if (!c) {
    if (lower.includes('plasebo')) c = 'Plasebo';
    else if (lower.includes('standart tedavi') || lower.includes('kontrol grubu')) c = 'Standart Bakım (Standard of Care)';
    else if (lower.includes('sulfonilüre')) c = 'Sulfonilüre';
    else if (lower.includes('glp-1') && !i.toLowerCase().includes('glp-1')) c = 'GLP-1 Reseptör Agonistleri';
  }

  // Outcome Backstops
  if (!o) {
    if (lower.includes('mortalite') || lower.includes('ölüm')) o = 'Tüm Nedenlere Bağlı Mortalite';
    else if (lower.includes('kilo') || lower.includes('vücut ağırlığı')) o = 'Vücut Ağırlığı Değişimi (%)';
    else if (lower.includes('hba1c') || lower.includes('glisemik')) o = 'HbA1c Düzeyinde Düşüş';
    else if (lower.includes('mace') || lower.includes('kardiyovasküler olay')) o = 'Majör İstenmeyen Kardiyovasküler Olaylar (MACE)';
    else if (lower.includes('sağkalım') || lower.includes('pfs') || lower.includes('os')) o = 'Progresyonsuz Sağkalım (PFS)';
    else if (lower.includes('hastaneye yatış')) o = 'Hastaneye Yatış Oranları';
  }

  return {
    population: p.trim(),
    intervention: i.trim(),
    comparison: c.trim(),
    outcome: o.trim()
  };
}

export function buildPicoBooleanQuery(pico) {
  if (!pico || typeof pico !== 'object') return '';
  const parts = [];
  
  if (pico.population && pico.population.trim()) {
    parts.push(`(${pico.population.trim()})`);
  }
  if (pico.intervention && pico.intervention.trim()) {
    parts.push(`(${pico.intervention.trim()})`);
  }
  if (pico.comparison && pico.comparison.trim() && !pico.comparison.toLowerCase().includes('plasebo')) {
    parts.push(`(${pico.comparison.trim()})`);
  }
  if (pico.outcome && pico.outcome.trim()) {
    parts.push(`(${pico.outcome.trim()})`);
  }

  return parts.join(' AND ');
}
