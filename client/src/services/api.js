/**
 * API client for Consensus backend services
 */

const API_BASE = '/api';

export async function searchPapers({ 
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
  sourceFilter
}) {
  const params = new URLSearchParams({ q, page, perPage });
  if (yearFrom) params.append('yearFrom', yearFrom);
  if (yearTo) params.append('yearTo', yearTo);
  if (studyType && studyType !== 'all') params.append('studyType', studyType);
  if (minCitations) params.append('minCitations', minCitations);
  if (mode) params.append('mode', mode);
  if (specialty && specialty !== 'all') params.append('specialty', specialty);
  if (evidenceLevel && evidenceLevel !== 'all') params.append('evidenceLevel', evidenceLevel);
  if (sourceFilter && sourceFilter !== 'all') params.append('sourceFilter', sourceFilter);

  const res = await fetch(`${API_BASE}/search?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Arama başarısız oldu (${res.status})`);
  }
  return res.json();
}

export async function submitThreadFollowUp({
  followUpQuery,
  threadTitle,
  originalQuery,
  previousPapers = [],
  previousSynthesis = null,
  mode = 'all'
}) {
  const res = await fetch(`${API_BASE}/thread/follow-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      followUpQuery,
      threadTitle,
      originalQuery,
      previousPapers,
      previousSynthesis,
      mode
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Takip sorusu yanıtlanamadı (${res.status})`);
  }
  return res.json();
}

export async function translateText(text) {
  if (!text || typeof text !== 'string') return '';
  try {
    const res = await fetch(`${API_BASE}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Çeviri yapılamadı');
    const data = await res.json();
    return data.translatedText || text;
  } catch (err) {
    console.warn('translateText warning:', err.message);
    return text;
  }
}

export async function downloadRISFile(paperOrPapers, filename = 'klinik_pusula_referanslar.ris') {
  const body = Array.isArray(paperOrPapers) ? { papers: paperOrPapers } : { paper: paperOrPapers };
  const res = await fetch(`${API_BASE}/export-ris`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('RIS dışa aktarılamadı');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function downloadBIBFile(paperOrPapers, filename = 'klinik_pusula_referanslar.bib') {
  const body = Array.isArray(paperOrPapers) ? { papers: paperOrPapers } : { paper: paperOrPapers };
  const res = await fetch(`${API_BASE}/export-bib`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('BibTeX dışa aktarılamadı');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function downloadPrismaWordDocument({ query, stats }) {
  const res = await fetch(`${API_BASE}/export-prisma-word`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, stats })
  });
  if (!res.ok) throw new Error('PRISMA Word raporu oluşturulamadı');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = `PRISMA_2020_${(query || 'Akis_Semasi').replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ_-]/g, '_').slice(0, 40)}`;
  a.download = `${safeName}.doc`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function auditManuscriptChecklist({ text, guideline = 'consort' }) {
  const res = await fetch(`${API_BASE}/audit-checklist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, guideline })
  });
  if (!res.ok) throw new Error('Yapay Zeka Hakem Denetimi tamamlanamadı');
  return res.json();
}

export async function downloadThesisWordDocument({
  title,
  topic,
  pico,
  papers,
  synthesis,
  consensus,
  gradeSummary,
  citationStyle = 'vancouver'
}) {
  const res = await fetch(`${API_BASE}/export-thesis-word`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, topic, pico, papers, synthesis, consensus, gradeSummary, citationStyle })
  });
  if (!res.ok) throw new Error('Word belgesi oluşturulamadı');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = (title || topic || 'KlinikPusula_Tez_Bolumu').replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ_-]/g, '_').slice(0, 45);
  a.download = `${safeName}.doc`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function getCitations(paper) {
  const res = await fetch(`${API_BASE}/cite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paper })
  });
  if (!res.ok) throw new Error('Atıf oluşturulamadı');
  return res.json();
}

export async function generateLiteratureReview({ papers, thesisTopic, language = 'tr' }) {
  const res = await fetch(`${API_BASE}/literature-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ papers, thesisTopic, language })
  });
  if (!res.ok) throw new Error('Literatür taraması oluşturulamadı');
  return res.json();
}

export async function refineTopic(topic) {
  const res = await fetch(`${API_BASE}/refine-topic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  });
  if (!res.ok) throw new Error('Hipotez analizi yapılamadı');
  return res.json();
}

export async function getThesisWorkspace() {
  const res = await fetch(`${API_BASE}/thesis-workspace`);
  if (!res.ok) throw new Error('Tez kütüphanesi yüklenemedi');
  return res.json();
}

export async function saveThesisWorkspace(data) {
  const res = await fetch(`${API_BASE}/thesis-workspace`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Tez kütüphanesi kaydedilemedi');
  return res.json();
}

export async function savePaperToThesis({ paper, chapterId, note }) {
  const res = await fetch(`${API_BASE}/thesis-workspace/save-paper`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paper, chapterId, note })
  });
  if (!res.ok) throw new Error('Makale teze eklenemedi');
  return res.json();
}

// ==========================================
// CONSENSUS PRO API CALLS
// ==========================================

export async function getStudyMatrix(papers) {
  const res = await fetch(`${API_BASE}/pro/study-matrix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ papers })
  });
  if (!res.ok) throw new Error('Karşılaştırma matrisi oluşturulamadı');
  return res.json();
}

export async function getCitationSnowball({ paperId, title, doi }) {
  const params = new URLSearchParams();
  if (paperId) params.append('paperId', paperId);
  if (title) params.append('title', title);
  if (doi) params.append('doi', doi);

  const res = await fetch(`${API_BASE}/pro/snowball?${params.toString()}`);
  if (!res.ok) throw new Error('Atıf grafı ve snowballing verisi çekilemedi');
  return res.json();
}

export async function auditManuscript(text) {
  const res = await fetch(`${API_BASE}/pro/audit-manuscript`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Metin denetimi yapılamadı');
  return res.json();
}

export async function getResearchGaps({ papers, thesisTopic }) {
  const res = await fetch(`${API_BASE}/pro/research-gaps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ papers, thesisTopic })
  });
  if (!res.ok) throw new Error('Literatür boşluğu analizi yapılamadı');
  return res.json();
}

export async function uploadPrivateDoc({ filename, title, content, chapterId }) {
  const res = await fetch(`${API_BASE}/pro/upload-doc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, title, content, chapterId })
  });
  if (!res.ok) throw new Error('Özel belge yüklenemedi');
  return res.json();
}

