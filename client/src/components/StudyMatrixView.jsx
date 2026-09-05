import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Download, 
  FileSpreadsheet, 
  Search, 
  Sparkles, 
  Check, 
  Quote, 
  BookmarkPlus,
  ArrowUpDown,
  ExternalLink,
  FileText
} from 'lucide-react';
import { getStudyMatrix, downloadRISFile, downloadBIBFile } from '../services/api';

export default function StudyMatrixView({ 
  papers, 
  onSaveToThesis, 
  onOpenCiteModal, 
  savedPaperIds = [] 
}) {
  const [matrixData, setMatrixData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('year');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    if (papers && papers.length > 0) {
      setLoading(true);
      getStudyMatrix(papers)
        .then(res => {
          setMatrixData(res.matrix || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setMatrixData([]);
    }
  }, [papers]);

  // Filter matrix by search term
  const filteredRows = matrixData.filter(row => {
    const q = searchTerm.toLowerCase();
    return (
      row.studyName.toLowerCase().includes(q) ||
      row.fullTitle.toLowerCase().includes(q) ||
      row.population.toLowerCase().includes(q) ||
      row.studyType.toLowerCase().includes(q) ||
      row.intervention.toLowerCase().includes(q) ||
      row.keyFinding.toLowerCase().includes(q)
    );
  });

  // Sort rows
  const sortedRows = [...filteredRows].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (matrixData.length === 0) return;

    const headers = [
      'Sıra No',
      'Çalışma (Yazar & Yıl)',
      'Makale Başlığı',
      'Yıl',
      'Dergi',
      'Çalışma Türü',
      'GRADE Kanıt Düzeyi',
      'Yanlılık Riski (RoB 2 / ROBINS-I)',
      'Örneklem (n)',
      'Popülasyon / Hedef Kitle',
      'Müdahale / Değişken',
      'Etki Büyüklüğü',
      'Temel Bulgu',
      'Atıf Sayısı',
      'DOI'
    ];

    const safeCsvCell = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    const rows = matrixData.map(r => [
      r.rowNumber,
      safeCsvCell(r.studyName),
      safeCsvCell(r.fullTitle),
      r.year || 'Bilinmiyor',
      safeCsvCell(r.journal),
      safeCsvCell(r.studyType),
      safeCsvCell(r.gradeLabel || 'Orta Kanıt'),
      safeCsvCell(r.overallRiskLabel || 'Düşük Yanlılık Riski'),
      safeCsvCell(r.sampleSize),
      safeCsvCell(r.population),
      safeCsvCell(r.intervention),
      safeCsvCell(r.effectSize),
      safeCsvCell(r.keyFinding),
      r.citationCount || 0,
      r.doi || ''
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'klinik_pusula_calisma_karsilastirma_matrisi.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export all matrix papers as RIS
  const handleExportRIS = () => {
    if (!papers || papers.length === 0) return;
    downloadRISFile(papers, 'klinik_pusula_calisma_matrisi_referanslari.ris');
  };

  // Export all matrix papers as BibTeX
  const handleExportBIB = () => {
    if (!papers || papers.length === 0) return;
    downloadBIBFile(papers, 'klinik_pusula_calisma_matrisi_referanslari.bib');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>
            <Sparkles size={13} />
            KlinikPusula PRO • Dr. Ekrem Kasapoğlu Çalışma Karşılaştırma Matrisi
          </div>
          <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: 'var(--accent-navy)' }}>
            Çalışma Karşılaştırma Matrisi (Study Matrix)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Arama sonuçlarınızdaki <strong>{matrixData.length}</strong> makaleyi örneklem büyüklüğü, yöntem, hedef kitle ve bulgular açısından yan yana kıyaslayın.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-secondary" 
            onClick={handleExportRIS}
            disabled={!papers || papers.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', border: '1px solid #cbd5e1', background: '#fff' }}
            title="Tüm matris çalışmalarını Zotero/EndNote için .RIS olarak indir"
          >
            <Download size={14} />
            <span>.RIS İndir</span>
          </button>
          <button 
            className="btn-secondary" 
            onClick={handleExportBIB}
            disabled={!papers || papers.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', border: '1px solid #cbd5e1', background: '#fff' }}
            title="Tüm matris çalışmalarını LaTeX/Overleaf için .BIB olarak indir"
          >
            <Download size={14} />
            <span>.BIB İndir</span>
          </button>
          <button 
            className="btn-primary" 
            onClick={handleExportCSV}
            disabled={matrixData.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem' }}
          >
            <FileSpreadsheet size={15} />
            <span>Excel / CSV İndir</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar within Matrix */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem', background: '#fff', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
        <Search size={18} style={{ color: 'var(--text-light)' }} />
        <input
          type="text"
          placeholder="Matris içinde filtrele (Örn: RCT, Yaşlı Bireyler, n=500, Kreatin)..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.92rem' }}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Temizle
          </button>
        )}
      </div>

      {/* Table Container */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Çalışmalar karşılaştırma matrisine dönüştürülüyor...</p>
        </div>
      ) : matrixData.length === 0 ? (
        <div className="empty-state">
          <Table size={44} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--accent-navy)' }}>Matris İçin Henüz Makale Yok</h3>
          <p style={{ fontSize: '0.9rem' }}>Önce arama sekmesinde bir tez sorusu arayın veya kütüphanenize makale ekleyin.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border-light)', color: '#334155' }}>
                <th style={{ padding: '0.9rem 1rem', width: '50px' }}>#</th>
                <th 
                  onClick={() => handleSort('studyName')}
                  style={{ padding: '0.9rem 1rem', cursor: 'pointer', minWidth: '180px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <strong>Çalışma (Yazar/Yıl)</strong>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('studyType')}
                  style={{ padding: '0.9rem 1rem', cursor: 'pointer', minWidth: '140px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <strong>Çalışma Türü</strong>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('gradeLevel')}
                  style={{ padding: '0.9rem 1rem', cursor: 'pointer', minWidth: '130px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <strong>GRADE Kanıtı</strong>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('overallRisk')}
                  style={{ padding: '0.9rem 1rem', cursor: 'pointer', minWidth: '150px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <strong>Yanlılık Riski (RoB)</strong>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('sampleSize')}
                  style={{ padding: '0.9rem 1rem', cursor: 'pointer', minWidth: '110px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <strong>Örneklem (n)</strong>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ padding: '0.9rem 1rem', minWidth: '150px' }}>
                  <strong>Popülasyon</strong>
                </th>
                <th style={{ padding: '0.9rem 1rem', minWidth: '140px' }}>
                  <strong>Finansman & COI</strong>
                </th>
                <th style={{ padding: '0.9rem 1rem', minWidth: '160px' }}>
                  <strong>Müdahale / Yöntem</strong>
                </th>
                <th style={{ padding: '0.9rem 1rem', minWidth: '150px' }}>
                  <strong>Etki Büyüklüğü</strong>
                </th>
                <th style={{ padding: '0.9rem 1rem', minWidth: '240px' }}>
                  <strong>Temel Çıkarım</strong>
                </th>
                <th style={{ padding: '0.9rem 1rem', minWidth: '110px', textAlign: 'center' }}>
                  <strong>İşlemler</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, idx) => {
                const isSaved = savedPaperIds.includes(row.id);
                return (
                  <tr 
                    key={row.id || idx}
                    style={{ 
                      borderBottom: '1px solid #f1f5f9',
                      background: idx % 2 === 0 ? '#ffffff' : '#fcfdfd',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-light)', fontWeight: '600' }}>
                      {idx + 1}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: '700', color: 'var(--accent-navy)', marginBottom: '0.2rem' }}>
                        {row.studyName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.3' }} title={row.fullTitle}>
                        {row.fullTitle.length > 70 ? row.fullTitle.slice(0, 70) + '...' : row.fullTitle}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '0.2rem' }}>
                        {row.citationCount.toLocaleString()} atıf
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-study" style={{ fontSize: '0.75rem' }}>
                        {row.studyType}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: row.gradeLevel === 'High' ? '#ecfdf5' : (row.gradeLevel === 'Moderate' ? '#eff6ff' : (row.gradeLevel === 'Low' ? '#fffbeb' : '#fef2f2')),
                        color: row.gradeLevel === 'High' ? '#047857' : (row.gradeLevel === 'Moderate' ? '#1d4ed8' : (row.gradeLevel === 'Low' ? '#b45309' : '#b91c1c')),
                        border: `1px solid ${row.gradeLevel === 'High' ? '#a7f3d0' : (row.gradeLevel === 'Moderate' ? '#bfdbfe' : (row.gradeLevel === 'Low' ? '#fde68a' : '#fecaca'))}`
                      }}>
                        🛡️ {row.gradeLabel || 'Orta Kanıt'}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: row.overallRisk === 'low' ? '#f0fdf4' : (row.overallRisk === 'moderate' ? '#fffbeb' : '#fef2f2'),
                          color: row.overallRisk === 'low' ? '#15803d' : (row.overallRisk === 'moderate' ? '#b45309' : '#b91c1c'),
                          border: `1px solid ${row.overallRisk === 'low' ? '#bbf7d0' : (row.overallRisk === 'moderate' ? '#fde68a' : '#fecaca')}`,
                          cursor: 'help'
                        }}
                        title={`${row.robTool || 'Cochrane RoB 2'}: ${row.overallRiskLabel || 'Düşük Yanlılık Riski'}\n${(row.robDomains || []).map(d => `${d.id}: ${d.status === 'low' ? 'Düşük' : d.status === 'moderate' ? 'Orta' : 'Yüksek'} - ${d.note}`).join('\n')}`}
                      >
                        ⚖️ {row.overallRiskLabel || 'Düşük Yanlılık Riski'}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: '#6b21a8' }}>
                      {row.sampleSize}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                      {row.population}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.73rem',
                          fontWeight: '700',
                          background: row.fundingStatus === 'industry' ? '#fff7ed' : '#f0fdf4',
                          color: row.fundingStatus === 'industry' ? '#c2410c' : '#15803d',
                          border: `1px solid ${row.fundingStatus === 'industry' ? '#fed7aa' : '#bbf7d0'}`,
                          whiteSpace: 'nowrap'
                        }}
                        title={row.fundingDetails || (row.fundingStatus === 'industry' ? 'Endüstri / İlaç Sponsorluğu Bildirimi' : 'Bağımsız Fonlama')}
                      >
                        {row.fundingBadge || (row.fundingStatus === 'industry' ? '🟠 Endüstri' : '🟢 Bağımsız')}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: '#0e8388', fontWeight: '500' }}>
                      {row.intervention}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: row.effectSize.includes('Yüksek') ? '#ecfdf5' : (row.effectSize.includes('Orta') ? '#eff6ff' : '#fef2f2'),
                        color: row.effectSize.includes('Yüksek') ? '#065f46' : (row.effectSize.includes('Orta') ? '#1e40af' : '#991b1b')
                      }}>
                        {row.effectSize}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.84rem', lineHeight: '1.4' }}>
                      "{row.keyFinding}"
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                        <button 
                          onClick={() => onOpenCiteModal(papers.find(p => p.id === row.id))}
                          title="Alıntı yap"
                          style={{ padding: '0.3rem', color: 'var(--text-muted)' }}
                        >
                          <Quote size={15} />
                        </button>

                        <button 
                          onClick={() => onSaveToThesis(papers.find(p => p.id === row.id))}
                          title={isSaved ? "Tezde Kayıtlı" : "Tezime Ekle"}
                          style={{ padding: '0.3rem', color: isSaved ? '#10b981' : 'var(--primary)' }}
                        >
                          {isSaved ? <Check size={16} /> : <BookmarkPlus size={16} />}
                        </button>

                        {row.pdfUrl && (
                          <a 
                            href={row.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title="Tam metin PDF"
                            style={{ padding: '0.3rem', color: '#166534' }}
                          >
                            <FileText size={15} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
