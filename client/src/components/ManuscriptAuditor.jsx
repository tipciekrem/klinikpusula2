import React, { useState } from 'react';
import { 
  FileCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  PlusCircle,
  RotateCcw,
  ShieldCheck,
  ClipboardCheck,
  BookOpen,
  Filter,
  Info
} from 'lucide-react';
import { auditManuscript, auditManuscriptChecklist } from '../services/api';

const SAMPLE_CONSORT_TEXT = `Bu randomize kontrollü, çift-kör, paralel gruplu çalışmada (1:1 tahsis) Tip 2 diyabetli hastalarda yeni bir SGLT2 inhibitörünün glisemik kontrol üzerindeki etkinliği araştırılmıştır. 
Dahil edilme kriterleri 18-75 yaş arası ve HbA1c %7.5-10.5 olan ardışık hastalardı; son dönem böbrek yetmezliği olanlar dışlandı. 
Katılımcılar 12 hafta boyunca günde oral tek doz 10 mg çalışma ilacı veya eşleşen plasebo almak üzere bilgisayar tabanlı rastgele blok randomizasyon ve sıralı kapalı zarflar kullanılarak tahsis edildi; katılımcılar ve araştırmacılar atamaya körlendi. 
Primer sonlanım noktası 12. haftadaki HbA1c düzeyindeki başlangıca göre değişimdir. 
Tip I hata alfa=0.05 ve %80 istatistiksel güç ile 0.5 standart sapmalık farkı saptamak için her gruba en az 64 hasta (toplam 128) hesaplandı; %10 olası kayıp ile 142 hasta dahil edildi. 
Primer analizler Intention-to-Treat (ITT) prensibiyle gerçekleştirildi (%95 GA ve iki yönlü p < 0.05). İstenmeyen olaylar ve hipoglisemi atakları her vizitte kaydedildi. 
Çalışma ClinicalTrials.gov (NCT04829104) protokol tescili ve Etik Kurul onayı (Karar: 2023/142) ile yürütülmüş olup yazarlar herhangi bir çıkar çatışması olmadığını bildirmiştir.`;

const SAMPLE_STROBE_TEXT = `Bu prospektif kohort çalışmasında, Ocak 2021 - Aralık 2023 tarihleri arasında üniversite hastanemiz kardiyoloji kliniğine başvuran akut koroner sendromlu hastalarda yüksek duyarlılıklı troponin düzeyleri ile 1 yıllık kardiyovasküler mortalite ilişkisi araştırıldı. 
Dahil edilme kriterleri 18 yaş üzeri ve STEMI tanısı alan ardışık hastalardı; aktif malignitesi olanlar dışlanma kriteri olarak belirlendi. 
Tüm biyokimyasal testler standardize laboratuvar yöntemleriyle ölçüldü. Seçim yanlılığını önlemek amacıyla ardışık başvuran tüm hastalar protokole dahil edildi. 
Yaş, cinsiyet, diyabet ve ejeksiyon fraksiyonu gibi karıştırıcı (confounder) faktörler çok değişkenli lojistik regresyon ve Cox orantılı risk modeli ile analiz edilerek düzeltilmiş risk oranları (adjusted OR / HR, %95 GA) hesaplandı. 
Toplam 340 hasta (140 kadın, 200 erkek, yaş ortalaması 62.4) takip edildi; takip kaybı %3.2 olarak kaydedildi. 
Çalışmanın temel kısıtlılıkları tek merkezli doğası ve gözlemsel tasarım nedeniyle kalan potansiyel artık karıştırıcılardır. 
Çalışma yerel Etik Kurul onayı (2021/88) ve aydınlatılmış onam ile yürütülmüş olup bağımsız kamu araştırma fonu ile desteklenmiştir; yazarlar herhangi bir çıkar çatışması bulunmadığını beyan etmiştir.`;

export default function ManuscriptAuditor() {
  const [auditorTab, setAuditorTab] = useState('claims'); // 'claims' | 'checklist'

  // --- State for Tab 1: Claims & Citation Auditor ---
  const [manuscriptText, setManuscriptText] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [updatedSentences, setUpdatedSentences] = useState({});
  const [replacedSentences, setReplacedSentences] = useState({});

  // --- State for Tab 2: CONSORT / STROBE Checklist Auditor ---
  const [guideline, setGuideline] = useState('consort'); // 'consort' | 'strobe'
  const [checklistText, setChecklistText] = useState(SAMPLE_CONSORT_TEXT);
  const [checklistResult, setChecklistResult] = useState(null);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [checklistCopied, setChecklistCopied] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'missing' | 'partial' | 'met'
  const [copiedSuggestionId, setCopiedSuggestionId] = useState(null);

  // Tab 1 Handlers
  const handleAudit = async (e) => {
    e.preventDefault();
    if (!manuscriptText.trim()) return;
    setLoading(true);
    try {
      const res = await auditManuscript(manuscriptText.trim());
      setAuditResult(res);
      setUpdatedSentences({});
      setReplacedSentences({});
    } catch (err) {
      alert('Denetim hatası: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRephrase = (sentenceIndex, rephrase) => {
    setReplacedSentences(prev => {
      const next = { ...prev };
      if (next[sentenceIndex]) {
        delete next[sentenceIndex];
      } else {
        next[sentenceIndex] = rephrase;
      }
      return next;
    });
  };

  const handleInsertCitation = (sentenceIndex, citation) => {
    setUpdatedSentences(prev => ({
      ...prev,
      [sentenceIndex]: citation
    }));
  };

  const getEffectiveReadiness = () => {
    if (!auditResult || !auditResult.claims) return 0;
    const totalClaims = Math.max(1, auditResult.claims.length);
    const verifiedCount = auditResult.claims.filter((c, i) => c.status === 'verified' || replacedSentences[i]).length;
    const contradictedCount = auditResult.claims.filter((c, i) => c.status === 'contradicted' && !replacedSentences[i]).length;
    return Math.max(0, Math.min(100, Math.round(((verifiedCount - (contradictedCount * 1.2)) / totalClaims) * 100)));
  };

  const getCompiledParagraph = () => {
    if (!auditResult) return manuscriptText;
    return auditResult.claims.map((claim, idx) => {
      const activeSentence = replacedSentences[idx] || claim.sentence;
      const cit = updatedSentences[idx];
      if (cit) {
        const trimmed = activeSentence.trim();
        const lastChar = trimmed.slice(-1);
        if (['.', '!', '?'].includes(lastChar)) {
          return `${trimmed.slice(0, -1)} ${cit}${lastChar}`;
        }
        return `${trimmed} ${cit}.`;
      }
      return activeSentence;
    }).join(' ');
  };

  const handleCopyCompiled = () => {
    navigator.clipboard.writeText(getCompiledParagraph());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Tab 2 Handlers (Checklist)
  const handleChecklistAudit = async (e) => {
    if (e) e.preventDefault();
    if (!checklistText.trim()) return;
    setChecklistLoading(true);
    try {
      const res = await auditManuscriptChecklist({ text: checklistText.trim(), guideline });
      setChecklistResult(res);
    } catch (err) {
      alert('Kılavuz denetim hatası: ' + err.message);
    } finally {
      setChecklistLoading(false);
    }
  };

  const handleCopyReviewerFeedback = () => {
    if (!checklistResult) return;
    const textToCopy = `[KLİNİKPUSULA AI HAKEM RAPORU - ${checklistResult.guideline}]\nGenel Uyum Skoru: %${checklistResult.complianceScore} (${checklistResult.overallGrade})\n\nHakem Değerlendirmesi:\n${checklistResult.summaryFeedback}\n\nEksik / Revizyon Önerileri:\n` +
      checklistResult.items
        .filter(item => item.status !== 'met')
        .map(item => `• [${item.guidelineRef}] ${item.title}: ${item.suggestion}`)
        .join('\n');
    navigator.clipboard.writeText(textToCopy);
    setChecklistCopied(true);
    setTimeout(() => setChecklistCopied(false), 2000);
  };

  const handleCopySuggestion = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedSuggestionId(id);
    setTimeout(() => setCopiedSuggestionId(null), 2000);
  };

  const switchGuideline = (newGuideline) => {
    setGuideline(newGuideline);
    if (newGuideline === 'consort') {
      setChecklistText(SAMPLE_CONSORT_TEXT);
    } else {
      setChecklistText(SAMPLE_STROBE_TEXT);
    }
    setChecklistResult(null);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ecfdf5', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>
          <Sparkles size={13} />
          KlinikPusula PRO • Dr. Ekrem Kasapoğlu AI Peer-Review Suite
        </div>
        <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: 'var(--accent-navy)', margin: '0.2rem 0' }}>
          Tez & Makale Denetimi (Peer-Review Suite)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
          Taslak metninizi Q1/Q2 uluslararası tıp dergileri standartlarında denetleyin: İddia bazlı atıf doğrulama veya CONSORT/STROBE kılavuz uyumu analizi yapın.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.6rem',
        background: '#f1f5f9',
        padding: '0.4rem',
        borderRadius: '12px',
        marginBottom: '1.8rem',
        border: '1px solid #e2e8f0'
      }}>
        <button
          type="button"
          onClick={() => setAuditorTab('claims')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1rem',
            borderRadius: '9px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
            background: auditorTab === 'claims' ? '#ffffff' : 'transparent',
            color: auditorTab === 'claims' ? 'var(--accent-navy)' : '#64748b',
            boxShadow: auditorTab === 'claims' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <FileCheck size={17} color={auditorTab === 'claims' ? 'var(--primary)' : '#64748b'} />
          <span>İddia & Atıf Denetimi (Claim Auditor)</span>
        </button>

        <button
          type="button"
          onClick={() => setAuditorTab('checklist')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1rem',
            borderRadius: '9px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
            background: auditorTab === 'checklist' ? '#ffffff' : 'transparent',
            color: auditorTab === 'checklist' ? 'var(--accent-navy)' : '#64748b',
            boxShadow: auditorTab === 'checklist' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <ClipboardCheck size={17} color={auditorTab === 'checklist' ? '#0d9488' : '#64748b'} />
          <span>Yapay Zeka Hakem Raporu (CONSORT & STROBE)</span>
        </button>
      </div>

      {/* ====================================================================
          TAB 1: CLAIMS & CITATION AUDITOR
          ==================================================================== */}
      {auditorTab === 'claims' && (
        <>
          {/* Input Box */}
          <div style={{ background: '#fff', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
            <form onSubmit={handleAudit}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-navy)', marginBottom: '0.6rem' }}>
                Denetlenecek Tez Paragrafı veya Taslak Metin:
              </label>
              <textarea
                value={manuscriptText}
                onChange={e => setManuscriptText(e.target.value)}
                rows={5}
                placeholder="Tezinizden bir paragraf veya literatür taslağınızı buraya yapıştırın..."
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                  marginBottom: '1rem',
                  outline: 'none'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                {manuscriptText.trim() ? (
                  <button 
                    type="button" 
                    onClick={() => setManuscriptText('')}
                    style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Metni Temizle
                  </button>
                ) : <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Kendi paragrafınızı yapıştırın veya yazın</span>}

                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading || !manuscriptText.trim()}
                  style={{ padding: '0.65rem 1.4rem' }}
                >
                  <FileCheck size={17} />
                  <span>{loading ? 'İddialar Denetleniyor...' : 'Atıf & İddia Denetimi Başlat'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Audit Results */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cümleler ayrıştırılıyor ve hakemli akademik kanıtlar taranıyor...</p>
            </div>
          ) : auditResult ? (
            <div>
              {/* Readiness Score Banner */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: '14px',
                padding: '1.4rem 1.8rem',
                marginBottom: '1.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Akademik Atıf Hazırlık Skoru (Citation Readiness)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: getEffectiveReadiness() >= 70 ? '#10b981' : '#f59e0b', fontFamily: 'var(--font-editorial)' }}>
                      %{getEffectiveReadiness()} Hazır
                    </span>
                    {Object.keys(replacedSentences).length > 0 && (
                      <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.72rem', fontWeight: '700', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                        {Object.keys(replacedSentences).length} İfade Literatürle Uyumlu Hale Getirildi
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  onClick={handleCopyCompiled}
                  style={{ fontSize: '0.85rem' }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copied ? 'Kopyalandı!' : 'Atıflı Güncel Metni Kopyala'}</span>
                </button>
              </div>

              {/* Claims breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
                {auditResult.claims.map((claim, idx) => {
                  const inserted = updatedSentences[idx];
                  const isReplaced = !!replacedSentences[idx];
                  const isContradicted = claim.status === 'contradicted';
                  const isVerified = claim.status === 'verified';
                  const cardBg = isReplaced ? '#f0fdf4' : (isContradicted ? '#fff5f5' : (isVerified ? '#ffffff' : '#fffbeb'));
                  const cardBorder = isReplaced ? '1.5px solid #86efac' : (isContradicted ? '1.5px solid #f87171' : (isVerified ? '1.5px solid #86efac' : '1.5px solid #fde68a'));

                  return (
                    <div 
                      key={idx}
                      style={{
                        background: cardBg,
                        border: cardBorder,
                        borderRadius: '12px',
                        padding: '1.4rem',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isReplaced ? (
                            <CheckCircle2 size={18} color="#059669" />
                          ) : isContradicted ? (
                            <XCircle size={18} color="#dc2626" />
                          ) : isVerified ? (
                            <CheckCircle2 size={18} color="#10b981" />
                          ) : (
                            <AlertCircle size={18} color="#f59e0b" />
                          )}
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isReplaced ? '#065f46' : (isContradicted ? '#991b1b' : (isVerified ? '#166534' : '#92400e')) }}>
                            İddia Cümlesi #{idx + 1} {isReplaced ? '(Literatürle Uyumlu Hale Getirildi)' : ''}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{
                            background: isReplaced ? '#dcfce7' : (isContradicted ? '#fee2e2' : (isVerified ? '#dcfce7' : '#fef3c7')),
                            color: isReplaced ? '#166534' : (isContradicted ? '#991b1b' : (isVerified ? '#166534' : '#92400e')),
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px',
                            border: isReplaced ? '1px solid #86efac' : (isContradicted ? '1px solid #fca5a5' : (isVerified ? '1px solid #86efac' : '1px solid #fde68a'))
                          }}>
                            {isReplaced ? '✅ LİTERATÜRLE UYUMLU İFADEYE DÖNÜŞTÜRÜLDÜ' : (isContradicted ? '❌ LİTERATÜRLE ÇELİŞİYOR / ÇÜRÜTÜLMÜŞ BULGU' : (isVerified ? '✅ LİTERATÜRLE UYUMLU' : '⚠️ ATIF DESTEĞİ GEREKİYOR'))}
                          </span>
                          {inserted && (
                            <span style={{ background: '#dbeafe', color: '#1e40af', fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                              Atıf Eklendi: {inserted}
                            </span>
                          )}
                        </div>
                      </div>

                      <p style={{ fontSize: '1.02rem', fontWeight: '600', color: isReplaced ? '#065f46' : (isContradicted ? '#7f1d1d' : 'var(--accent-navy)'), marginBottom: '0.8rem', lineHeight: '1.5' }}>
                        "{isReplaced ? replacedSentences[idx] : claim.sentence}"
                      </p>

                      {isReplaced && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginBottom: '0.8rem' }}>
                          Orijinal iddia: "{claim.sentence}"
                        </div>
                      )}

                      <div style={{ 
                        fontSize: '0.85rem', 
                        color: isReplaced ? '#047857' : (isContradicted ? '#991b1b' : 'var(--text-muted)'), 
                        marginBottom: '0.8rem',
                        fontWeight: isContradicted ? '600' : 'normal',
                        background: isReplaced ? '#ecfdf5' : (isContradicted ? '#fef2f2' : 'transparent'),
                        padding: (isContradicted || isReplaced) ? '0.5rem 0.75rem' : '0',
                        borderRadius: (isContradicted || isReplaced) ? '6px' : '0'
                      }}>
                        {claim.feedback}
                      </div>

                      {claim.suggestedRephrase && (
                        <div style={{
                          background: isReplaced ? '#f0fdf4' : '#fff1f2',
                          border: isReplaced ? '1px solid #86efac' : '1px dashed #f43f5e',
                          borderRadius: '8px',
                          padding: '0.8rem 1rem',
                          marginBottom: '0.8rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: isReplaced ? '#065f46' : '#be123c', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                              {isReplaced ? '✅ Kanıta Dayalı İfade Metne Eklendi' : '💡 Literatürle Uyumlu Önerilen Bilimsel İfade:'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleRephrase(idx, claim.suggestedRephrase)}
                              style={{
                                background: isReplaced ? '#f1f5f9' : '#e11d48',
                                color: isReplaced ? '#334155' : '#ffffff',
                                border: isReplaced ? '1px solid #cbd5e1' : 'none',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                              }}
                            >
                              {isReplaced ? <RotateCcw size={13} /> : <Sparkles size={13} />}
                              {isReplaced ? 'Orijinal İfadeye Geri Dön' : 'Literatürle Uyumlu İfadeye Dönüştür'}
                            </button>
                          </div>
                          <p style={{ fontSize: '0.92rem', color: isReplaced ? '#047857' : '#9f1239', fontStyle: 'italic', margin: 0, lineHeight: '1.5' }}>
                            "{claim.suggestedRephrase}"
                          </p>
                        </div>
                      )}

                      {claim.suggestedCitations && claim.suggestedCitations.length > 0 && (
                        <div style={{ background: isContradicted ? '#fef2f2' : '#f8fafc', borderRadius: '8px', padding: '0.8rem 1rem', marginTop: '0.6rem', border: isContradicted ? '1px solid #fecaca' : 'none' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: isContradicted ? '#991b1b' : '#334155', marginBottom: '0.5rem' }}>
                            {isContradicted ? '⚠️ Bu İddiayı Çürüten / Literatürle Çeliştiğini Gösteren Kanıtlar:' : 'Eşleşen Hakemli Makaleler:'}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {claim.suggestedCitations.map(p => (
                              <div 
                                key={p.id}
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'space-between', 
                                  gap: '0.8rem', 
                                  fontSize: '0.85rem', 
                                  background: '#fff', 
                                  padding: '0.5rem 0.8rem', 
                                  borderRadius: '6px', 
                                  border: isContradicted ? '1px solid #fca5a5' : '1px solid var(--border-light)' 
                                }}
                              >
                                <div style={{ overflow: 'hidden' }}>
                                  <strong style={{ color: isContradicted ? '#b91c1c' : 'var(--accent-navy)' }}>{p.inTextCitation}:</strong>{' '}
                                  <span style={{ color: '#475569' }}>{p.title}</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleInsertCitation(idx, p.inTextCitation)}
                                  className="btn-secondary"
                                  style={{ 
                                    padding: '0.25rem 0.65rem', 
                                    fontSize: '0.75rem', 
                                    whiteSpace: 'nowrap', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.3rem',
                                    borderColor: isContradicted ? '#f87171' : undefined,
                                    color: isContradicted ? '#991b1b' : undefined
                                  }}
                                >
                                  <PlusCircle size={13} />
                                  <span>{isContradicted ? 'Çelişen Kaynağı Ekle' : 'Cümleye Ekle'}</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Compiled text preview */}
              <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-light)', padding: '1.8rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-navy)', marginBottom: '0.6rem' }}>
                  Atıflarla Güçlendirilmiş Güncel Tez Paragrafınız:
                </h3>
                <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '8px', lineHeight: '1.8', fontSize: '0.98rem', color: '#1e293b' }}>
                  {getCompiledParagraph()}
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* ====================================================================
          TAB 2: AI PEER-REVIEW CHECKLIST AUDITOR (CONSORT & STROBE)
          ==================================================================== */}
      {auditorTab === 'checklist' && (
        <div>
          {/* Guideline Selection Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div
              onClick={() => switchGuideline('consort')}
              style={{
                background: guideline === 'consort' ? '#f0fdfa' : '#ffffff',
                border: guideline === 'consort' ? '2px solid #0d9488' : '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '1.2rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: guideline === 'consort' ? '0 4px 12px rgba(13,148,136,0.1)' : 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Klinik İlaç & Girişimsel Deneyler
                </span>
                {guideline === 'consort' && (
                  <span style={{ background: '#0d9488', color: '#fff', fontSize: '0.7rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                    SEÇİLİ
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-navy)', margin: '0 0 0.3rem 0' }}>
                CONSORT 2010 Kılavuzu
              </h3>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                Randomize Kontrollü Klinik Deneyler (RKÇ). 12 temel bildirim kriteri: Randomizasyon gizleme, körleme, ITT analizi, güç hesaplaması ve protokol tescili.
              </p>
            </div>

            <div
              onClick={() => switchGuideline('strobe')}
              style={{
                background: guideline === 'strobe' ? '#f0fdfa' : '#ffffff',
                border: guideline === 'strobe' ? '2px solid #0d9488' : '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '1.2rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: guideline === 'strobe' ? '0 4px 12px rgba(13,148,136,0.1)' : 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Gözlemsel Epidemiyoloji
                </span>
                {guideline === 'strobe' && (
                  <span style={{ background: '#0d9488', color: '#fff', fontSize: '0.7rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                    SEÇİLİ
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-navy)', margin: '0 0 0.3rem 0' }}>
                STROBE Kılavuzu
              </h3>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                Kohort, Vaka-Kontrol ve Kesitsel Gözlemsel Çalışmalar. 10 temel kriter: Karıştırıcı kontrolü (confounders), seçim yanlılığı (bias) ve kısıtlılıklar.
              </p>
            </div>
          </div>

          {/* Input Box for Checklist */}
          <div style={{ background: '#fff', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
            <form onSubmit={handleChecklistAudit}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-navy)', marginBottom: '0.6rem' }}>
                Denetlenecek Makale Özeti / Yöntem & Bulgular Bölümü:
              </label>
              <textarea
                value={checklistText}
                onChange={e => setChecklistText(e.target.value)}
                rows={6}
                placeholder={`${guideline.toUpperCase()} kılavuzuna göre denetlenecek makalenizin Yöntem, Özet veya Bulgular bölümlerini buraya yapıştırın...`}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.92rem',
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                  marginBottom: '1rem',
                  outline: 'none'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                <button 
                  type="button" 
                  onClick={() => setChecklistText(guideline === 'consort' ? SAMPLE_CONSORT_TEXT : SAMPLE_STROBE_TEXT)}
                  style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: '600' }}
                >
                  Örnek {guideline.toUpperCase()} Metnini Yükle
                </button>

                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={checklistLoading || !checklistText.trim()}
                  style={{ padding: '0.65rem 1.4rem', background: '#0d9488' }}
                >
                  <ClipboardCheck size={17} />
                  <span>{checklistLoading ? 'Kılavuz Denetleniyor...' : `${guideline.toUpperCase()} Hakem Denetimini Başlat`}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Checklist Audit Results */}
          {checklistLoading ? (
            <div className="loading-state">
              <div className="spinner" style={{ borderTopColor: '#0d9488' }}></div>
              <p>Uluslararası {guideline.toUpperCase()} kontrol listesi maddeleri taranıyor ve hakem raporu oluşturuluyor...</p>
            </div>
          ) : checklistResult ? (
            <div>
              {/* Score & Grade Banner */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: '14px',
                padding: '1.6rem 2rem',
                marginBottom: '1.8rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {checklistResult.guideline} Kılavuz Bildirim Uyum Skoru (Compliance Score)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '2.4rem', fontWeight: '900', color: checklistResult.gradeColor, fontFamily: 'var(--font-editorial)', lineHeight: 1 }}>
                        %{checklistResult.complianceScore}
                      </span>
                      <span style={{
                        background: `${checklistResult.gradeColor}15`,
                        color: checklistResult.gradeColor,
                        border: `1.5px solid ${checklistResult.gradeColor}40`,
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '8px'
                      }}>
                        {checklistResult.overallGrade}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    className="btn-primary" 
                    onClick={handleCopyReviewerFeedback}
                    style={{ fontSize: '0.85rem', background: '#0f766e' }}
                  >
                    {checklistCopied ? <Check size={15} /> : <Copy size={15} />}
                    <span>{checklistCopied ? 'Hakem Raporu Kopyalandı!' : 'Tüm Hakem Raporunu Kopyala'}</span>
                  </button>
                </div>

                {/* Status Counter Pills */}
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem', color: '#065f46', fontWeight: '700' }}>
                    ✅ Tam Karşılanan: {checklistResult.metCount} / {checklistResult.totalItems}
                  </div>
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem', color: '#92400e', fontWeight: '700' }}>
                    ⚠️ Kısmen Karşılanan: {checklistResult.partialCount}
                  </div>
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem', color: '#991b1b', fontWeight: '700' }}>
                    ❌ Eksik / Bildirilmemiş: {checklistResult.missingCount}
                  </div>
                </div>
              </div>

              {/* Reviewer Editorial Feedback Card */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px',
                padding: '1.4rem 1.6rem',
                marginBottom: '1.8rem',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={18} color="#0f766e" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-navy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Hakem Değerlendirme Özeti (Editorial Peer-Review Feedback)
                  </span>
                </div>
                <p style={{ fontSize: '0.94rem', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                  "{checklistResult.summaryFeedback}"
                </p>
              </div>

              {/* Filter Chips */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-navy)' }}>
                  <Filter size={15} />
                  <span>Kriterleri Filtrele:</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setFilterStatus('all')}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      background: filterStatus === 'all' ? 'var(--accent-navy)' : '#fff',
                      color: filterStatus === 'all' ? '#fff' : '#475569'
                    }}
                  >
                    Tümü ({checklistResult.totalItems})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterStatus('missing')}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #fecaca',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      background: filterStatus === 'missing' ? '#dc2626' : '#fff',
                      color: filterStatus === 'missing' ? '#fff' : '#dc2626'
                    }}
                  >
                    ❌ Eksikler ({checklistResult.missingCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterStatus('partial')}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #fde68a',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      background: filterStatus === 'partial' ? '#d97706' : '#fff',
                      color: filterStatus === 'partial' ? '#fff' : '#d97706'
                    }}
                  >
                    ⚠️ Kısmi ({checklistResult.partialCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterStatus('met')}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #a7f3d0',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      background: filterStatus === 'met' ? '#16a34a' : '#fff',
                      color: filterStatus === 'met' ? '#fff' : '#16a34a'
                    }}
                  >
                    ✅ Karşılanan ({checklistResult.metCount})
                  </button>
                </div>
              </div>

              {/* Checklist Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {checklistResult.items
                  .filter(item => filterStatus === 'all' || item.status === filterStatus)
                  .map(item => {
                    const isMissing = item.status === 'missing';
                    const isPartial = item.status === 'partial';
                    const isMet = item.status === 'met';

                    const itemBg = isMet ? '#ffffff' : (isPartial ? '#fffdf7' : '#fff8f8');
                    const itemBorder = isMet ? '1px solid #e2e8f0' : (isPartial ? '1.5px solid #fde68a' : '1.5px solid #fca5a5');

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: itemBg,
                          border: itemBorder,
                          borderRadius: '12px',
                          padding: '1.2rem 1.4rem',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                              {item.section}
                            </span>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>
                              {item.guidelineRef}
                            </span>
                          </div>

                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px',
                            background: isMet ? '#dcfce7' : (isPartial ? '#fef3c7' : '#fee2e2'),
                            color: isMet ? '#166534' : (isPartial ? '#92400e' : '#991b1b'),
                            border: isMet ? '1px solid #86efac' : (isPartial ? '1px solid #fde68a' : '1px solid #fca5a5')
                          }}>
                            {item.statusBadge} • {item.statusLabel}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.02rem', fontWeight: '700', color: 'var(--accent-navy)', margin: '0.3rem 0 0.5rem 0' }}>
                          {item.title}
                        </h4>

                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 0.8rem 0' }}>
                          {item.explanation}
                        </p>

                        {/* Suggestion Box */}
                        <div style={{
                          background: isMet ? '#f8fafc' : (isPartial ? '#fffbeb' : '#fef2f2'),
                          border: isMet ? '1px solid #e2e8f0' : (isPartial ? '1px dashed #f59e0b' : '1px dashed #ef4444'),
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.6rem'
                        }}>
                          <div style={{ flex: 1, minWidth: '240px' }}>
                            <div style={{ fontSize: '0.74rem', fontWeight: '800', color: isMet ? '#475569' : (isPartial ? '#b45309' : '#b91c1c'), textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                              💡 Hakem Revizyon Tavsiyesi:
                            </div>
                            <div style={{ fontSize: '0.86rem', color: '#1e293b', fontStyle: 'italic', lineHeight: '1.4' }}>
                              "{item.suggestion}"
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopySuggestion(item.id, item.suggestion)}
                            style={{
                              background: copiedSuggestionId === item.id ? '#10b981' : '#ffffff',
                              color: copiedSuggestionId === item.id ? '#ffffff' : '#334155',
                              border: '1px solid #cbd5e1',
                              padding: '0.3rem 0.7rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {copiedSuggestionId === item.id ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copiedSuggestionId === item.id ? 'Kopyalandı!' : 'Öneriyi Kopyala'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

