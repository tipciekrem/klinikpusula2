import React, { useState, useEffect, useRef } from 'react';
import { 
  Bookmark, 
  Download, 
  Columns, 
  List, 
  Grid, 
  X, 
  Check, 
  ExternalLink, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Quote,
  Shield,
  Scale,
  AlertCircle
} from 'lucide-react';
import { downloadRISFile, downloadBIBFile } from '../services/api';

export default function ConsensusReferences({
  papers = [],
  totalHits = 0,
  currentQuery = '',
  activeCitationId,
  onSaveToThesis,
  savedIds = [],
  isOpen = true,
  onClose,
  onLoadMoreFromServer,
  isLoadingMore = false
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaperIds, setSelectedPaperIds] = useState(new Set());
  const [expandedQuotes, setExpandedQuotes] = useState({}); // { [paperId]: boolean }
  const [expandedRob, setExpandedRob] = useState({}); // { [paperId]: boolean }
  const [methodFilter, setMethodFilter] = useState('all'); // 'all' | 'high_grade' | 'low_rob' | 'rct'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'compact'
  const cardRefs = useRef({});

  const PAGE_SIZE = 20;

  // Filter papers by methodological quality if selected
  const filteredPapers = papers.filter(p => {
    if (methodFilter === 'high_grade') {
      return p.gradeRisk?.gradeLevel === 'High';
    }
    if (methodFilter === 'low_rob') {
      return p.gradeRisk?.overallRisk === 'low';
    }
    if (methodFilter === 'rct') {
      const type = (p.studyType || '').toLowerCase();
      const text = ((p.title || '') + ' ' + (p.abstract || '')).toLowerCase();
      return type.includes('trial') || type.includes('rct') || type.includes('meta') || type.includes('systematic') || text.includes('randomized');
    }
    if (methodFilter === 'academic_only') {
      return p.fundingStatus === 'academic' || p.isTurkish;
    }
    if (methodFilter === 'industry_only') {
      return p.fundingStatus === 'industry' || p.isIndustryFunded;
    }
    return true;
  });

  const totalPapers = filteredPapers.length;
  const totalPages = Math.max(1, Math.ceil(totalPapers / PAGE_SIZE));

  // Auto-switch page and scroll when an in-text citation badge is clicked in center column
  useEffect(() => {
    if (!activeCitationId || papers.length === 0) return;

    const citationUpper = activeCitationId.toUpperCase();
    // Find index of matching paper with precise author and year verification
    const paperIdx = papers.findIndex(p => {
      const auth = (p.authors?.[0]?.lastName || p.authors?.[0]?.name || '').trim().toUpperCase();
      const yr = String(p.year || '').trim();
      const authMatch = auth.length >= 2 && citationUpper.includes(auth);
      const yearMatch = yr.length === 4 && citationUpper.includes(yr);
      const idMatch = p.id && citationUpper.includes(p.id.toUpperCase());
      return (authMatch && (yearMatch || !yr)) || idMatch;
    });

    if (paperIdx !== -1) {
      const targetPage = Math.floor(paperIdx / PAGE_SIZE) + 1;
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage);
      }
      setTimeout(() => {
        const targetPaper = papers[paperIdx];
        if (targetPaper && cardRefs.current[targetPaper.id]) {
          cardRefs.current[targetPaper.id].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [activeCitationId, papers]);

  // Current 20 papers for active page
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentBatchPapers = filteredPapers.slice(startIndex, startIndex + PAGE_SIZE);

  const toggleSelectPaper = (id) => {
    setSelectedPaperIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleQuotes = (paperId) => {
    setExpandedQuotes(prev => ({
      ...prev,
      [paperId]: !prev[paperId]
    }));
  };

  const toggleRob = (paperId) => {
    setExpandedRob(prev => ({
      ...prev,
      [paperId]: !prev[paperId]
    }));
  };

  const handleExportSelected = () => {
    const selectedList = papers.filter(p => selectedPaperIds.has(p.id));
    const toExport = selectedList.length > 0 ? selectedList : currentBatchPapers;
    downloadRISFile(toExport, `klinik_pusula_referanslar_sayfa_${currentPage}.ris`);
  };

  const handleExportSelectedBIB = () => {
    const selectedList = papers.filter(p => selectedPaperIds.has(p.id));
    const toExport = selectedList.length > 0 ? selectedList : currentBatchPapers;
    downloadBIBFile(toExport, `klinik_pusula_referanslar_sayfa_${currentPage}.bib`);
  };

  // Helper to format authors list
  const formatAuthorDisplay = (paper) => {
    const authors = paper.authors || [];
    if (authors.length === 0) return 'Anonim';
    const first = authors[0];
    const firstName = typeof first === 'string' ? first : (first.name || first.lastName || '');
    if (authors.length > 1) {
      return `${firstName} et al.`;
    }
    return firstName;
  };

  if (!isOpen) return null;

  return (
    <aside className="consensus-references">
      {/* Header */}
      <div className="references-header">
        <div className="references-header-title">
          <span className="ref-label">Kaynaklar</span>
          <span className="ref-slash">/</span>
          <span className="ref-query-preview" title={currentQuery}>
            🔎 {currentQuery.length > 32 ? currentQuery.substring(0, 30) + '...' : currentQuery}
          </span>
        </div>
        {onClose && (
          <button className="ref-close-btn" onClick={onClose} title="Referansları Gizle">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Sub-bar: Results count & action icons */}
      <div className="references-subbar">
        <div className="ref-results-count">
          <strong>Sonuçlar</strong>
          <span className="count-num">
            {totalHits > 1000 ? `${(totalHits / 1000).toFixed(1)}K` : (totalHits || totalPapers)}
          </span>
        </div>

        <div className="ref-tools-group" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button 
            className="ref-tool-btn" 
            onClick={handleExportSelected} 
            title="Seçili veya bu sayfadaki 20 yayını .RIS (EndNote / Zotero) olarak indir"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.25rem 0.5rem' }}
          >
            <Download size={13} />
            <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>.RIS</span>
          </button>
          <button 
            className="ref-tool-btn" 
            onClick={handleExportSelectedBIB} 
            title="Seçili veya bu sayfadaki 20 yayını .BIB (BibTeX / LaTeX) olarak indir"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.25rem 0.5rem' }}
          >
            <Download size={13} />
            <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>.BIB</span>
          </button>
          <span className="ref-new-badge">YENİ</span>
        </div>
      </div>

      {/* Methodological Quality Quick Filter Chips */}
      <div style={{
        display: 'flex',
        gap: '0.35rem',
        padding: '0.45rem 1rem',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        overflowX: 'auto',
        alignItems: 'center'
      }}>
        <button
          onClick={() => { setMethodFilter('all'); setCurrentPage(1); }}
          style={{
            padding: '0.2rem 0.55rem',
            borderRadius: '16px',
            border: methodFilter === 'all' ? '1px solid #0f766e' : '1px solid #cbd5e1',
            background: methodFilter === 'all' ? '#0f766e' : '#ffffff',
            color: methodFilter === 'all' ? '#ffffff' : '#475569',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Tümü ({papers.length})
        </button>
        <button
          onClick={() => { setMethodFilter('high_grade'); setCurrentPage(1); }}
          style={{
            padding: '0.2rem 0.55rem',
            borderRadius: '16px',
            border: methodFilter === 'high_grade' ? '1px solid #059669' : '1px solid #cbd5e1',
            background: methodFilter === 'high_grade' ? '#ecfdf5' : '#ffffff',
            color: '#059669',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          🟢 GRADE Yüksek
        </button>
        <button
          onClick={() => { setMethodFilter('low_rob'); setCurrentPage(1); }}
          style={{
            padding: '0.2rem 0.55rem',
            borderRadius: '16px',
            border: methodFilter === 'low_rob' ? '1px solid #10b981' : '1px solid #cbd5e1',
            background: methodFilter === 'low_rob' ? '#f0fdf4' : '#ffffff',
            color: '#15803d',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          🛡️ RoB Düşük Risk
        </button>
        <button
          onClick={() => { setMethodFilter('academic_only'); setCurrentPage(1); }}
          style={{
            padding: '0.2rem 0.55rem',
            borderRadius: '16px',
            border: methodFilter === 'academic_only' ? '1px solid #16a34a' : '1px solid #cbd5e1',
            background: methodFilter === 'academic_only' ? '#dcfce7' : '#ffffff',
            color: '#15803d',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
          title="Yalnızca bağımsız, kamu veya üniversite fonlu yayınlar"
        >
          🟢 Bağımsız Fonlu
        </button>
        <button
          onClick={() => { setMethodFilter('industry_only'); setCurrentPage(1); }}
          style={{
            padding: '0.2rem 0.55rem',
            borderRadius: '16px',
            border: methodFilter === 'industry_only' ? '1px solid #ea580c' : '1px solid #cbd5e1',
            background: methodFilter === 'industry_only' ? '#ffedd5' : '#ffffff',
            color: '#c2410c',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
          title="Endüstri ve ilaç firması sponsorluğu olan yayınlar (COI)"
        >
          🟠 Endüstri / COI
        </button>
        <button
          onClick={() => { setMethodFilter('rct'); setCurrentPage(1); }}
          style={{
            padding: '0.2rem 0.55rem',
            borderRadius: '16px',
            border: methodFilter === 'rct' ? '1px solid #3b82f6' : '1px solid #cbd5e1',
            background: methodFilter === 'rct' ? '#eff6ff' : '#ffffff',
            color: '#1d4ed8',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          🧪 RKÇ & Meta
        </button>
      </div>

      {/* 20-Batch Pagination Navigation Bar */}
      <div className="ref-pagination-bar">
        <div className="pagination-info">
          <span>Gösterilen: <strong>{startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, totalPapers)}</strong> / {totalPapers}</span>
        </div>

        <div className="pagination-controls">
          <button 
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            title="Önceki 20 Kaynak"
          >
            <ChevronLeft size={14} />
            <span>Önceki 20</span>
          </button>

          <span className="page-pill active">
            {currentPage} / {totalPages}
          </span>

          <button 
            className="pagination-btn"
            disabled={currentPage === totalPages && !onLoadMoreFromServer}
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(prev => prev + 1);
              } else if (onLoadMoreFromServer) {
                onLoadMoreFromServer();
              }
            }}
            title="Sonraki 20 Kaynak"
          >
            <span>Sonraki 20</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Papers List (20 per page) */}
      <div className="references-cards-list">
        {currentBatchPapers.map((paper, idx) => {
          const itemNumber = startIndex + idx + 1;
          const isSelected = selectedPaperIds.has(paper.id);
          const isSaved = savedIds.includes(paper.id);
          const quotesExpanded = !!expandedQuotes[paper.id];
          const quotes = paper.supportingQuotes || [];

          // Match highlighted citation
          const authorLast = (paper.authors?.[0]?.lastName || paper.authors?.[0]?.name || '').toUpperCase();
          const isHighlighted = activeCitationId && activeCitationId.toUpperCase().includes(authorLast);

          return (
            <div
              key={paper.id || idx}
              ref={el => (cardRefs.current[paper.id] = el)}
              className={`reference-paper-card ${isHighlighted ? 'active-highlight' : ''}`}
            >
              {/* Card Top Row: Number, Title, Checkbox */}
              <div className="ref-card-header-row">
                <div className="ref-card-number-badge">{itemNumber}</div>

                <h3 className="ref-card-title">
                  <a 
                    href={paper.pdfUrl || paper.doi ? `https://doi.org/${paper.doi}` : (paper.openAlexUrl || '#')} 
                    target="_blank" 
                    rel="noreferrer"
                    className="ref-title-link"
                  >
                    {paper.trTitle || paper.title}
                  </a>
                </h3>

                <label className="ref-checkbox-wrap" title="Seç">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectPaper(paper.id)}
                    className="ref-checkbox-input"
                  />
                  <span className="ref-custom-checkbox">
                    {isSelected && <Check size={11} />}
                  </span>
                </label>
              </div>

              {/* Key Takeaway Section */}
              <div className="ref-takeaway-block">
                <span className="takeaway-label">ANA ÇIKARIM</span>
                <span className="takeaway-dot">·</span>
                <span className="takeaway-text">
                  {paper.trTakeaway || paper.keyTakeaway || paper.title}
                </span>
              </div>

              {/* Supporting Quotes & Tags Row */}
              <div className="ref-badges-row">
                {quotes.length > 0 && (
                  <button 
                    type="button" 
                    className={`ref-quotes-btn ${quotesExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleQuotes(paper.id)}
                  >
                    <Quote size={11} />
                    <span>{quotes.length} DESTEKLEYİCİ ALINTI</span>
                    {quotesExpanded ? <ChevronUp size={11} /> : <ChevronRight size={11} />}
                  </button>
                )}

                {/* GRADE Evidence Level Badge */}
                {paper.gradeRisk && (
                  <span 
                    className="ref-badge grade-badge"
                    style={{
                      backgroundColor: paper.gradeRisk.gradeLevel === 'High' ? '#ecfdf5' :
                                       paper.gradeRisk.gradeLevel === 'Moderate' ? '#eff6ff' :
                                       paper.gradeRisk.gradeLevel === 'Low' ? '#fffbeb' : '#fef2f2',
                      color: paper.gradeRisk.gradeLevel === 'High' ? '#047857' :
                             paper.gradeRisk.gradeLevel === 'Moderate' ? '#1d4ed8' :
                             paper.gradeRisk.gradeLevel === 'Low' ? '#b45309' : '#b91c1c',
                      borderColor: paper.gradeRisk.gradeLevel === 'High' ? '#a7f3d0' :
                                   paper.gradeRisk.gradeLevel === 'Moderate' ? '#bfdbfe' :
                                   paper.gradeRisk.gradeLevel === 'Low' ? '#fde68a' : '#fecaca',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      fontWeight: '600'
                    }}
                    title={`GRADE Kanıt Düzeyi: ${paper.gradeRisk.gradeLabel}`}
                  >
                    <Shield size={11} />
                    <span>GRADE: {paper.gradeRisk.gradeLabel}</span>
                  </span>
                )}

                {/* Cochrane RoB 2 / ROBINS-I Risk of Bias Badge */}
                {paper.gradeRisk && (
                  <button 
                    type="button" 
                    className={`ref-quotes-btn ${expandedRob[paper.id] ? 'expanded' : ''}`}
                    style={{
                      backgroundColor: paper.gradeRisk.overallRisk === 'low' ? '#f0fdf4' :
                                       paper.gradeRisk.overallRisk === 'moderate' ? '#fffbeb' : '#fef2f2',
                      color: paper.gradeRisk.overallRisk === 'low' ? '#15803d' :
                             paper.gradeRisk.overallRisk === 'moderate' ? '#b45309' : '#b91c1c',
                      borderColor: paper.gradeRisk.overallRisk === 'low' ? '#bbf7d0' :
                                   paper.gradeRisk.overallRisk === 'moderate' ? '#fde68a' : '#fecaca'
                    }}
                    onClick={() => toggleRob(paper.id)}
                    title="Cochrane RoB 2 / ROBINS-I 5 Yanlılık Alanını İncele"
                  >
                    <Scale size={11} />
                    <span>{paper.gradeRisk.toolUsed === 'Cochrane RoB 2' ? 'RoB 2' : 'ROBINS-I'}: {paper.gradeRisk.overallLabel}</span>
                    {expandedRob[paper.id] ? <ChevronUp size={11} /> : <ChevronRight size={11} />}
                  </button>
                )}

                {paper.studyTypeBadge && (
                  <span className="ref-badge study-badge">
                    📑 {paper.studyTypeBadge}
                  </span>
                )}

                {paper.rigorBadge && (
                  <span className="ref-badge rigor-badge">
                    ✨ {paper.rigorBadge}
                  </span>
                )}
              </div>

              {/* Expandable Cochrane RoB 2 / ROBINS-I 5 Domains Box */}
              {expandedRob[paper.id] && paper.gradeRisk?.domains && (
                <div style={{
                  marginTop: '0.6rem',
                  padding: '0.6rem 0.8rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem' }}>
                    <strong style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Scale size={12} style={{ color: '#0284c7' }} />
                      {paper.gradeRisk.toolUsed} Metodolojik Yanlılık Analizi
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>5 Çekirdek Alan</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {paper.gradeRisk.domains.map(d => (
                      <div key={d.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', lineHeight: '1.3' }}>
                        <span style={{
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          flexShrink: 0,
                          marginTop: '0.1rem',
                          background: d.status === 'low' ? '#dcfce7' : d.status === 'moderate' ? '#fef3c7' : '#fee2e2',
                          color: d.status === 'low' ? '#166534' : d.status === 'moderate' ? '#92400e' : '#991b1b'
                        }}>
                          {d.id}: {d.status === 'low' ? 'Düşük' : d.status === 'moderate' ? 'Orta' : 'Yüksek'}
                        </span>
                        <div>
                          <strong style={{ color: '#334155' }}>{(d.name || d.id || '').replace(/\(D\d\)/, '')}: </strong>
                          <span style={{ color: '#64748b' }}>{d.note || 'Değerlendirildi'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Supporting Quotes Content */}
              {quotesExpanded && quotes.length > 0 && (
                <div className="ref-quotes-expanded-box">
                  {quotes.map((q, qIdx) => (
                    <div key={qIdx} className="quote-item">
                      <span className="quote-bullet">“</span>
                      <p className="quote-sentence">{q}”</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Metadata Row: Year, Citations, Author, Journal, PDF */}
              <div className="ref-card-meta-row">
                <div className="ref-meta-left">
                  <span className="ref-meta-item ref-year">{paper.year || '2024'}</span>
                  <span className="meta-sep">·</span>
                  <span className="ref-meta-item ref-cites">
                    {paper.citationCount || paper.citations || 0} atıf
                  </span>
                  <span className="meta-sep">·</span>
                  <span className="ref-meta-item ref-author">
                    {formatAuthorDisplay(paper)}
                  </span>
                </div>

                <div className="ref-meta-right">
                  {paper.journal && (
                    <span className="ref-journal-name" title={paper.journal}>
                      {paper.journal.length > 25 ? paper.journal.substring(0, 23) + '...' : paper.journal}
                    </span>
                  )}

                  {paper.pdfUrl && (
                    <a 
                      href={paper.pdfUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="ref-pdf-pill"
                      title="Tam Metin PDF Aç"
                    >
                      <FileText size={11} />
                      <span>PDF</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Load More / Next 20 bar */}
      <div className="ref-bottom-action-bar">
        {currentPage < totalPages ? (
          <button 
            className="ref-load-more-btn"
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            <span>+20 Daha Göster (Sayfa {currentPage + 1}/{totalPages})</span>
          </button>
        ) : onLoadMoreFromServer ? (
          <button 
            className="ref-load-more-btn"
            onClick={onLoadMoreFromServer}
            disabled={isLoadingMore}
          >
            <span>{isLoadingMore ? 'Yükleniyor...' : 'Veritabanından +20 Makale Daha Getir'}</span>
          </button>
        ) : (
          <div className="ref-all-loaded-text">Tüm kaynaklar görüntülendi ({totalPapers} yayın)</div>
        )}
      </div>
    </aside>
  );
}
