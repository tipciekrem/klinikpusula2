import React, { useState, useEffect } from 'react';
import { 
  X, 
  Shield, 
  Scale, 
  Check, 
  Copy, 
  Download, 
  ExternalLink, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  FileText,
  Activity,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export default function MethodologicalModal({ 
  isOpen, 
  onClose, 
  papers = [], 
  currentQuery = '',
  gradeSummary = null 
}) {
  const [activeTab, setActiveTab] = useState('revman'); // 'revman' | 'grade' | 'thesis'
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedPaperId, setExpandedPaperId] = useState(null);

  useEffect(() => {
    if (isOpen && papers.length > 0) {
      fetchReport();
    }
  }, [isOpen, papers, currentQuery]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pro/methodological-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ papers, topic: currentQuery })
      });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (err) {
      console.error('Failed to load methodological report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyThesisParagraph = () => {
    if (!reportData?.thesisParagraph) return;
    navigator.clipboard.writeText(reportData.thesisParagraph);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadReport = () => {
    if (!reportData) return;
    const content = `# METODOLOJİK DEĞERLENDİRME RAPORU (Cochrane RoB 2 & GRADE)\n` +
      `Konu: ${currentQuery}\n` +
      `Tarih: ${new Date().toLocaleDateString('tr-TR')}\n` +
      `İncelenen Çalışma Sayısı: ${reportData.summary?.totalAnalyzed || papers.length}\n` +
      `Genel GRADE Kanıt Düzeyi: ${reportData.summary?.overallGradeVerdict}\n\n` +
      `---\n\n` +
      `## 1. Tez Metodoloji ve Bulgular Taslağı\n\n${reportData.thesisParagraph}\n\n` +
      `---\n\n` +
      `## 2. Cochrane RoB 2 / ROBINS-I Yanlılık Riski Dağılımı\n` +
      `- Düşük Yanlılık Riski: %${reportData.summary?.robDistribution?.lowRiskPct} (${reportData.summary?.robDistribution?.counts?.lowRisk} çalışma)\n` +
      `- Bazı Endişeler: %${reportData.summary?.robDistribution?.someConcernsPct} (${reportData.summary?.robDistribution?.counts?.someConcerns} çalışma)\n` +
      `- Yüksek Yanlılık Riski: %${reportData.summary?.robDistribution?.highRiskPct} (${reportData.summary?.robDistribution?.counts?.highRisk} çalışma)\n\n` +
      `---\n\n` +
      `## 3. GRADE Kanıt Profili ve Değerlendirme Faktörleri\n` +
      (reportData.gradeFactors || []).map(f => `- **${f.factor}**: ${f.assessment} (${f.note})`).join('\n') +
      `\n\n---\n\n` +
      `## 4. İncelenen Çalışmaların Cochrane 5-Alanı Matrisi\n` +
      (reportData.assessedPapers || []).map(p => `### ${p.rowNumber}. ${p.studyName} - ${p.title}\n` +
        `- Araç: ${p.toolUsed} | GRADE: ${p.gradeLabel} | Genel RoB: ${p.overallLabel}\n` +
        `- D1 (Randomizasyon): ${p.d1?.status?.toUpperCase()} (${p.d1?.note})\n` +
        `- D2 (Müdahale Sapması): ${p.d2?.status?.toUpperCase()} (${p.d2?.note})\n` +
        `- D3 (Eksik Veri): ${p.d3?.status?.toUpperCase()} (${p.d3?.note})\n` +
        `- D4 (Sonuç Ölçümü): ${p.d4?.status?.toUpperCase()} (${p.d4?.note})\n` +
        `- D5 (Seçici Bildirim): ${p.d5?.status?.toUpperCase()} (${p.d5?.note})\n`
      ).join('\n\n');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cochrane_grade_metodoloji_raporu_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const summary = reportData?.summary || gradeSummary;

  const renderStatusDot = (status, size = 18) => {
    const isLow = status === 'low';
    const isMod = status === 'moderate';
    const bg = isLow ? '#10b981' : isMod ? '#f59e0b' : '#ef4444';
    const icon = isLow ? '+' : isMod ? '?' : '−';
    return (
      <span 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: bg,
          color: '#ffffff',
          fontWeight: '800',
          fontSize: `${size * 0.65}px`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
        }}
        title={isLow ? 'Düşük Yanlılık Riski (Low Risk)' : isMod ? 'Bazı Endişeler (Some Concerns)' : 'Yüksek Yanlılık Riski (High Risk)'}
      >
        {icon}
      </span>
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.25rem'
    }}>
      <div 
        className="modal-container" 
        onClick={e => e.stopPropagation()} 
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.2rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#047857',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Scale size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                Metodolojik Değerlendirme & Yanlılık Riski Denetimi
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                Cochrane RoB 2 (5 Alan) · ROBINS-I · GRADE Kanıt Hiyerarşisi
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={handleDownloadReport}
              className="btn-card"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                padding: '0.45rem 0.85rem',
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
              title="Metodolojik Raporu İndir (.md)"
            >
              <Download size={13} />
              <span>Raporu İndir</span>
            </button>
            <button 
              onClick={onClose} 
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Top High-level Metric Strip */}
        {summary && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            background: '#ffffff',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: '700' }}>GENEL GRADE HÜKMÜ</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#047857', marginTop: '0.2rem' }}>
                {summary.overallGradeVerdict}
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>YANLILIK RİSKİ DAĞILIMI</div>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', marginTop: '0.2rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#10b981' }}>%{summary.robDistribution?.lowRiskPct} Düşük</span>
                <span style={{ color: '#94a3b8' }}>·</span>
                <span style={{ color: '#f59e0b' }}>%{summary.robDistribution?.someConcernsPct} Bazı Endişe</span>
                <span style={{ color: '#94a3b8' }}>·</span>
                <span style={{ color: '#ef4444' }}>%{summary.robDistribution?.highRiskPct} Yüksek</span>
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>TOPLAM ANALİZ EDİLEN</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginTop: '0.2rem' }}>
                {summary.totalAnalyzed || papers.length} Hakemli Çalışma
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 1.5rem',
          background: '#f8fafc',
          gap: '1rem'
        }}>
          <button
            onClick={() => setActiveTab('revman')}
            style={{
              padding: '0.75rem 0.5rem',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'revman' ? '2px solid #047857' : '2px solid transparent',
              color: activeTab === 'revman' ? '#047857' : '#64748b',
              fontWeight: '700',
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Activity size={15} />
            <span>Cochrane RevMan Trafik Işığı Matrisi</span>
          </button>

          <button
            onClick={() => setActiveTab('grade')}
            style={{
              padding: '0.75rem 0.5rem',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'grade' ? '2px solid #047857' : '2px solid transparent',
              color: activeTab === 'grade' ? '#047857' : '#64748b',
              fontWeight: '700',
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Shield size={15} />
            <span>GRADE Kanıt Profili (SoF)</span>
          </button>

          <button
            onClick={() => setActiveTab('thesis')}
            style={{
              padding: '0.75rem 0.5rem',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'thesis' ? '2px solid #047857' : '2px solid transparent',
              color: activeTab === 'thesis' ? '#047857' : '#64748b',
              fontWeight: '700',
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <FileText size={15} />
            <span>Tez Metodoloji Paragrafı</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: COCHRANE REVMAN TRAFFIC LIGHT MATRIX */}
          {activeTab === 'revman' && (
            <div>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                  Her bir çalışma Cochrane RoB 2 (RCT) veya ROBINS-I (Gözlemsel) standardında 5 çekirdek alanda değerlendirilmiştir.
                </p>
                <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    {renderStatusDot('low', 14)} Düşük Risk (+)
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    {renderStatusDot('moderate', 14)} Bazı Endişeler (?)
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    {renderStatusDot('high', 14)} Yüksek Risk (−)
                  </span>
                </div>
              </div>

              {/* Traffic Light Table */}
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', color: '#334155' }}>
                      <th style={{ padding: '0.75rem 0.85rem', width: '35%' }}>Çalışma (Yazar & Yıl)</th>
                      <th style={{ padding: '0.75rem 0.5rem', width: '15%' }}>Tasarım</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', width: '8%' }} title="D1: Randomizasyon Süreci / Karıştırıcı Faktörler">D1</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', width: '8%' }} title="D2: Amaçlanan Müdahaleden Sapmalar / Körleme">D2</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', width: '8%' }} title="D3: Eksik Sonuç Verisi / Takip Kaybı">D3</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', width: '8%' }} title="D4: Sonuçların Ölçümü / Tespit Yanlılığı">D4</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', width: '8%' }} title="D5: Bildirilen Sonucun Seçimi / Raporlama">D5</th>
                      <th style={{ padding: '0.75rem 0.85rem', textAlign: 'center', width: '10%' }}>Genel RoB</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(reportData?.assessedPapers || []).map((p, idx) => {
                      const isExpanded = expandedPaperId === p.id;
                      return (
                        <React.Fragment key={p.id || idx}>
                          <tr 
                            onClick={() => setExpandedPaperId(isExpanded ? null : p.id)}
                            style={{ 
                              borderBottom: '1px solid #f1f5f9', 
                              cursor: 'pointer',
                              background: isExpanded ? '#f0fdf4' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc'),
                              transition: 'background 0.15s ease'
                            }}
                          >
                            <td style={{ padding: '0.7rem 0.85rem', fontWeight: '600', color: '#0f172a' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                {isExpanded ? <ChevronDown size={14} style={{ color: '#047857' }} /> : <ChevronRight size={14} style={{ color: '#94a3b8' }} />}
                                <span>{p.studyName}</span>
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '400', marginTop: '0.15rem' }}>
                                {p.title.length > 55 ? p.title.substring(0, 52) + '...' : p.title}
                              </div>
                            </td>
                            <td style={{ padding: '0.7rem 0.5rem', color: '#475569' }}>
                              <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.2rem 0.45rem', borderRadius: '4px' }}>
                                {p.studyType}
                              </span>
                            </td>
                            <td style={{ padding: '0.7rem 0.5rem', textAlign: 'center' }}>
                              {renderStatusDot(p.d1?.status)}
                            </td>
                            <td style={{ padding: '0.7rem 0.5rem', textAlign: 'center' }}>
                              {renderStatusDot(p.d2?.status)}
                            </td>
                            <td style={{ padding: '0.7rem 0.5rem', textAlign: 'center' }}>
                              {renderStatusDot(p.d3?.status)}
                            </td>
                            <td style={{ padding: '0.7rem 0.5rem', textAlign: 'center' }}>
                              {renderStatusDot(p.d4?.status)}
                            </td>
                            <td style={{ padding: '0.7rem 0.5rem', textAlign: 'center' }}>
                              {renderStatusDot(p.d5?.status)}
                            </td>
                            <td style={{ padding: '0.7rem 0.85rem', textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                background: p.overallRisk === 'low' ? '#dcfce7' : p.overallRisk === 'moderate' ? '#fef3c7' : '#fee2e2',
                                color: p.overallRisk === 'low' ? '#166534' : p.overallRisk === 'moderate' ? '#92400e' : '#991b1b'
                              }}>
                                {p.overallLabel}
                              </span>
                            </td>
                          </tr>

                          {/* Expandable Domain Audit Breakdown for Selected Study */}
                          {isExpanded && (
                            <tr style={{ background: '#f0fdf4', borderBottom: '1px solid #bbf7d0' }}>
                              <td colSpan={8} style={{ padding: '0.85rem 1.25rem' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#065f46', marginBottom: '0.5rem' }}>
                                  Metodolojik Detaylar & Cochrane RoB 2 Gerekçeleri ({p.studyName}):
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.6rem', fontSize: '0.77rem' }}>
                                  <div style={{ background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                    <strong>D1 - Randomizasyon / Karıştırıcı: </strong>
                                    <span style={{ color: '#475569' }}>{p.d1?.note}</span>
                                  </div>
                                  <div style={{ background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                    <strong>D2 - Sapmalar & Körleme: </strong>
                                    <span style={{ color: '#475569' }}>{p.d2?.note}</span>
                                  </div>
                                  <div style={{ background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                    <strong>D3 - Eksik Sonuç Verisi: </strong>
                                    <span style={{ color: '#475569' }}>{p.d3?.note}</span>
                                  </div>
                                  <div style={{ background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                    <strong>D4 - Sonuçların Ölçümü: </strong>
                                    <span style={{ color: '#475569' }}>{p.d4?.note}</span>
                                  </div>
                                  <div style={{ background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                    <strong>D5 - Raporlama Yanlılığı: </strong>
                                    <span style={{ color: '#475569' }}>{p.d5?.note}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: GRADE EVIDENCE PROFILE */}
          {activeTab === 'grade' && (
            <div>
              <div style={{ marginBottom: '1.2rem' }}>
                <h4 style={{ margin: '0 0 0.4rem 0', color: '#0f172a', fontSize: '0.95rem', fontWeight: '800' }}>
                  GRADE Summary of Findings (SoF) & Kanıt Kesinliği Değerlendirmesi
                </h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                  GRADE sistemi; randomize kontrollü çalışmalarla yüksek düzeyden (High) başlar ve 5 temel düşürme faktörüne göre değerlendirilir.
                </p>
              </div>

              {/* 5 Factors Table */}
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', color: '#334155' }}>
                      <th style={{ padding: '0.75rem 1rem', width: '32%' }}>GRADE Düşürme Faktörü</th>
                      <th style={{ padding: '0.75rem 1rem', width: '25%' }}>Değerlendirme</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Metodolojik Gerekçe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(reportData?.gradeFactors || []).map((gf, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: '#1e293b' }}>
                          {gf.factor}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            fontWeight: '600',
                            fontSize: '0.78rem',
                            background: gf.assessment.includes('-1') ? '#fee2e2' : '#dcfce7',
                            color: gf.assessment.includes('-1') ? '#991b1b' : '#166534'
                          }}>
                            {gf.assessment}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                          {gf.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Evidence Pyramid Visualization */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem'
              }}>
                <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a', marginBottom: '0.75rem' }}>
                  GRADE Kanıt Piramidi Dağılımı:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '500px', margin: '0 auto' }}>
                  <div style={{ padding: '0.6rem', textAlign: 'center', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '6px', fontWeight: '700', fontSize: '0.82rem' }}>
                    ▲ YÜKSEK KANIT (HIGH): %{summary?.gradeDistribution?.highPct || 0} ({summary?.gradeDistribution?.counts?.high || 0} Çalışma)
                  </div>
                  <div style={{ padding: '0.6rem', textAlign: 'center', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', fontWeight: '700', fontSize: '0.82rem' }}>
                    ▲ ORTA KANIT (MODERATE): %{summary?.gradeDistribution?.moderatePct || 0} ({summary?.gradeDistribution?.counts?.moderate || 0} Çalışma)
                  </div>
                  <div style={{ padding: '0.6rem', textAlign: 'center', background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', borderRadius: '6px', fontWeight: '700', fontSize: '0.82rem' }}>
                    ▲ DÜŞÜK KANIT (LOW): %{summary?.gradeDistribution?.lowPct || 0} ({summary?.gradeDistribution?.counts?.low || 0} Çalışma)
                  </div>
                  <div style={{ padding: '0.6rem', textAlign: 'center', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '6px', fontWeight: '700', fontSize: '0.82rem' }}>
                    ▲ ÇOK DÜŞÜK KANIT (VERY LOW): %{summary?.gradeDistribution?.veryLowPct || 0} ({summary?.gradeDistribution?.counts?.veryLow || 0} Çalışma)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FORMAL THESIS METHODOLOGY EXCERPT */}
          {activeTab === 'thesis' && (
            <div>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '0.95rem', fontWeight: '800' }}>
                    Tez Metodoloji Bölümüne Eklenecek Akademik Taslak
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                    Tıp ve sağlık bilimleri tezlerinin Bölüm 3 (Metodoloji) veya Sistematik İnceleme kısmına doğrudan eklenebilir.
                  </p>
                </div>
                <button
                  onClick={handleCopyThesisParagraph}
                  className="btn-card"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.82rem',
                    padding: '0.5rem 1rem',
                    background: copied ? '#ecfdf5' : '#047857',
                    color: copied ? '#065f46' : '#ffffff',
                    border: '1px solid',
                    borderColor: copied ? '#a7f3d0' : '#047857',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '700'
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Metin Kopyalandı!' : 'Metni Kopyala'}</span>
                </button>
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '1.25rem',
                lineHeight: '1.8',
                fontSize: '0.92rem',
                color: '#1e293b',
                whiteSpace: 'pre-line',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
              }}>
                {reportData?.thesisParagraph || 'Metodolojik sentez hazırlanıyor...'}
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Uluslararası PRISMA 2020 ve Cochrane Handbook for Systematic Reviews yönergeleriyle tam uyumludur.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
