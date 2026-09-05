import React, { useState, useEffect, useRef } from 'react';
import { 
  Bookmark, 
  Sparkles, 
  Share2, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Check, 
  Search, 
  Plus, 
  ArrowUp, 
  Mic, 
  SlidersHorizontal, 
  FileText, 
  ExternalLink, 
  Layers, 
  HelpCircle,
  MessageSquarePlus,
  Loader2,
  Shield,
  Scale,
  BarChart3,
  Target,
  Download
} from 'lucide-react';
import ConsensusMeter from './ConsensusMeter.jsx';
import MethodologicalModal from './MethodologicalModal.jsx';
import PicoSearchModal from './PicoSearchModal.jsx';
import PrismaModal from './PrismaModal.jsx';
import { downloadThesisWordDocument } from '../services/api.js';

export default function ConsensusCenter({
  currentThread = null,
  currentQuery = '',
  searchResult = null,
  onSearch,
  onFollowUp,
  isLoading = false,
  isFollowUpLoading = false,
  onSelectCitation,
  activeCitationId,
  onOpenUploadDoc,
  onOpenFilters,
  onSaveToThesis,
  savedPapersCount = 0
}) {
  const [isCurrentSaved, setIsCurrentSaved] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState({ 0: true });
  const [followUpQuery, setFollowUpQuery] = useState('');
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  const [isPicoModalOpen, setIsPicoModalOpen] = useState(false);
  const [isPrismaModalOpen, setIsPrismaModalOpen] = useState(false);
  const [isWordExporting, setIsWordExporting] = useState(false);
  const [showWordStyleMenu, setShowWordStyleMenu] = useState(false);
  const scrollContainerRef = useRef(null);

  const handleWordExport = async (style = 'vancouver') => {
    setShowWordStyleMenu(false);
    try {
      setIsWordExporting(true);
      await downloadThesisWordDocument({
        title: threadTitle,
        topic: currentQuery,
        pico: searchResult?.pico || currentThread?.pico,
        papers: searchResult?.papers || currentThread?.allPapers || [],
        synthesis: searchResult?.synthesis,
        consensus: searchResult?.consensus,
        gradeSummary: searchResult?.gradeSummary,
        citationStyle: style
      });
    } catch (err) {
      alert('Word belgesi indirilemedi: ' + err.message);
    } finally {
      setIsWordExporting(false);
    }
  };

  // Normalize turns: prefer currentThread.turns, fallback to single turn from searchResult
  const turns = (currentThread?.turns && currentThread.turns.length > 0)
    ? currentThread.turns
    : (searchResult ? [{
        turnIndex: 1,
        query: currentQuery,
        searchSteps: searchResult?.synthesis?.searchSteps,
        synthesis: searchResult?.synthesis,
        consensus: searchResult?.consensus,
        gradeSummary: searchResult?.gradeSummary || searchResult?.synthesis?.gradeSummary
      }] : []);

  const threadTitle = currentThread?.title || searchResult?.synthesis?.threadTitle || (currentQuery ? (currentQuery.length > 35 ? currentQuery.substring(0, 32) + '...' : currentQuery) : 'Yeni Araştırma');
  const turnsCount = turns.length || 1;

  // Auto-scroll on new follow-up or loading state
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [turns.length, isFollowUpLoading]);

  // Reset save & share states on query change
  useEffect(() => {
    setIsCurrentSaved(false);
    setSaveSuccess(false);
    setShareSuccess(false);
  }, [currentQuery, currentThread?.id]);

  // Teze Kaydet / Favorile Handler
  const handleSaveCurrentSearch = async () => {
    if (onSaveToThesis) {
      const currentTopic = currentThread?.title || currentQuery || 'Klinik Arama';
      const firstTurn = currentThread?.turns?.[0];
      const synthesisText = firstTurn?.synthesis?.text || searchResult?.synthesis?.text || '';
      const topPapers = (currentThread?.allPapers || searchResult?.papers || []).slice(0, 5);
      
      await onSaveToThesis({
        id: `topic-${Date.now()}`,
        title: currentTopic,
        authors: ['Dr. Ekrem Kasapoğlu Sentezi'],
        year: new Date().getFullYear(),
        journal: 'KlinikPusula Literatür Taraması',
        keyTakeaway: synthesisText ? synthesisText.slice(0, 250) + '...' : 'Akademik uzlaşı ve sentez notu.',
        abstract: synthesisText,
        isCustomNote: true,
        relatedPapers: topPapers.map(p => p.id)
      });
      
      setIsCurrentSaved(true);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  // Paylaş / Panoya Kopyala Handler
  const handleShareCurrentSearch = async () => {
    const title = currentThread?.title || currentQuery || 'Klinik Arama';
    const firstTurn = currentThread?.turns?.[0];
    const takeaway = firstTurn?.synthesis?.keyTakeaway || firstTurn?.synthesis?.text?.slice(0, 220) || '';
    const url = window.location.href;
    const shareText = `🔬 KlinikPusula — Dr. Ekrem Kasapoğlu\n\n📌 Araştırma Konusu: ${title}\n💡 Sentez & Uzlaşı: ${takeaway}\n🔗 Bağlantı: ${url}`;

    let copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareText);
        copied = true;
      } catch (err) {
        // Fallback to execCommand
      }
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copied = true;
      } catch (e) {
        // Fallback to prompt
      }
    }

    if (copied) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3500);
    } else {
      prompt('Arama özetini ve bağlantısını kopyalayın:', shareText);
    }
  };

  const handleCopyQuery = (text, idx) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleSteps = (tIdx) => {
    setExpandedSteps(prev => ({
      ...prev,
      [tIdx]: !prev[tIdx]
    }));
  };

  const handleFollowUpSubmit = (e) => {
    e.preventDefault();
    if (!followUpQuery.trim()) return;
    const text = followUpQuery.trim();
    setFollowUpQuery('');
    if (onFollowUp && (currentThread || turns.length > 0)) {
      onFollowUp(text);
    } else {
      onSearch(text);
    }
  };

  // Helper to parse paragraph text and render interactive citation badges [AUTHOR YEAR] and markdown bold
  const renderFormattedInline = (inlineText) => {
    if (!inlineText) return null;
    const boldParts = inlineText.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bPart, bIdx) => {
      const boldMatch = bPart.match(/^\*\*([^*]+)\*\*$/);
      if (boldMatch) {
        return <strong key={bIdx} style={{ fontWeight: 650, color: '#0f172a' }}>{boldMatch[1]}</strong>;
      }
      return bPart;
    });
  };

  const renderTextWithCitations = (text = '') => {
    if (!text) return null;
    const parts = text.split(/(\[[A-Za-z0-9\s,\.\-–\p{L}]+\]|\+\d+\s+MORE)/gu);

    return parts.map((part, idx) => {
      const matchCitation = part.match(/^\[([A-Za-z0-9\s,\.\-–\p{L}]+)\]$/u);
      const isMore = part.toUpperCase().includes('MORE');

      if (matchCitation) {
        const citationRaw = matchCitation[1].trim();
        const citationUpper = citationRaw.toUpperCase();
        const isSelected = activeCitationId && activeCitationId.toUpperCase().includes(citationUpper.split(' ')[0]);

        return (
          <button
            key={idx}
            type="button"
            className={`inline-citation-badge ${isSelected ? 'highlighted' : ''}`}
            onClick={() => onSelectCitation(citationUpper)}
            title={`${citationRaw} kaynağına git`}
          >
            <Bookmark size={11} className="badge-icon" />
            <span>{citationRaw}</span>
          </button>
        );
      }

      if (isMore) {
        return (
          <span key={idx} className="inline-more-badge">
            {part}
          </span>
        );
      }

      return <span key={idx}>{renderFormattedInline(part)}</span>;
    });
  };

  return (
    <main className="consensus-center">
      {/* Top Header Bar */}
      <div className="center-top-bar">
        <div className="center-title-group">
          <h1 className="center-thread-title">
            <span>{threadTitle}</span>
            <span className="thread-number" title={`${turnsCount} tur soru-cevap`}>{turnsCount}</span>
            <ChevronDown size={15} className="title-caret" />
          </h1>
        </div>

        <div className="center-top-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* PICO Button */}
          <button 
            type="button"
            className="top-action-btn"
            onClick={() => setIsPicoModalOpen(true)}
            title="PICO Akıllı Klinik Soru Yapılandırıcısı"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Target size={14} />
            <span>PICO Modu</span>
          </button>

          {/* PRISMA 2020 Button */}
          <button 
            type="button"
            className="top-action-btn"
            onClick={() => setIsPrismaModalOpen(true)}
            title="PRISMA 2020 Akış Şeması"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Layers size={14} />
            <span>PRISMA 2020</span>
          </button>

          {/* Word Export Dropdown Button */}
          <div style={{ position: 'relative' }}>
            <button 
              type="button"
              className="top-action-btn"
              onClick={() => setShowWordStyleMenu(prev => !prev)}
              disabled={isWordExporting}
              title="Tez Bölümünü Word (.doc) Olarak İndir"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(37, 99, 235, 0.25)'
              }}
            >
              <Download size={14} />
              <span>{isWordExporting ? 'Hazırlanıyor...' : 'Word İndir'}</span>
              <ChevronDown size={12} />
            </button>

            {showWordStyleMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '6px',
                background: '#fff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.18)',
                padding: '0.4rem',
                zIndex: 100,
                minWidth: '220px'
              }}>
                <button
                  type="button"
                  onClick={() => handleWordExport('vancouver')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#1e293b'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontWeight: 700, color: '#1d4ed8' }}>📄 Vancouver Stili ([1-3])</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Tıp Fakülteleri Tez Kılavuzu</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWordExport('apa')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#1e293b'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontWeight: 700, color: '#0f766e' }}>📑 APA 7. Baskı (Yazar, Yıl)</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Sosyal & Fen Bilimleri Standardı</span>
                </button>
              </div>
            )}
          </div>

          <button 
            type="button"
            className="center-share-btn"
            onClick={handleSaveCurrentSearch}
            title={isCurrentSaved ? "Tez Kütüphanenizde Kayıtlı (Kitaplığım sekmesinden erişebilirsiniz)" : "Bu Araştırmayı ve Sentezi Teze Kaydet / Favorile"}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: '8px',
              border: isCurrentSaved ? '1.5px solid #0d9488' : '1px solid #cbd5e1',
              background: isCurrentSaved ? '#ccfbf1' : '#ffffff',
              color: isCurrentSaved ? '#0d9488' : '#334155',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <Bookmark size={15} fill={isCurrentSaved ? '#0d9488' : 'none'} color={isCurrentSaved ? '#0d9488' : 'currentColor'} />
            <span>{isCurrentSaved ? 'Teze Eklendi' : 'Teze Kaydet'}</span>
          </button>
          <button 
            type="button"
            className="center-share-btn"
            onClick={handleShareCurrentSearch}
            title="Arama özetini ve bağlantısını paylaş / panoya kopyala"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: '8px',
              border: shareSuccess ? '1.5px solid #10b981' : '1px solid #cbd5e1',
              background: shareSuccess ? '#ecfdf5' : '#ffffff',
              color: shareSuccess ? '#047857' : '#334155',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            {shareSuccess ? <Check size={15} color="#047857" /> : <Share2 size={15} />}
            <span>{shareSuccess ? 'Kopyalandı! 📋' : 'Paylaş'}</span>
          </button>
        </div>
      </div>

      {/* Save to Thesis Notification Banner */}
      {saveSuccess && (
        <div style={{
          background: '#f0fdf4',
          borderBottom: '1px solid #bbf7d0',
          color: '#166534',
          padding: '8px 24px',
          fontSize: '0.84rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={16} color="#16a34a" />
          <span>✅ <strong>"{currentThread?.title || currentQuery}"</strong> araştırması ve akademik sentezi <strong>Kitaplığım (Tez Çalışma Alanı)</strong> bölümüne kaydedildi!</span>
        </div>
      )}

      {/* Share Notification Banner */}
      {shareSuccess && (
        <div style={{
          background: '#ecfdf5',
          borderBottom: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '8px 24px',
          fontSize: '0.84rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={16} color="#059669" />
          <span>📋 <strong>"{currentThread?.title || currentQuery}"</strong> akademik araştırma özeti ve bağlantı panoya kopyalandı!</span>
        </div>
      )}

      {/* Center Scrollable Article Area */}
      <div className="center-content-scroll" ref={scrollContainerRef}>
        <div className="center-content-inner">
          {/* Typo Correction & Did-You-Mean Notification Banner */}
          {(searchResult?.optimization?.correctedTerms?.length > 0 || currentThread?.optimization?.correctedTerms?.length > 0) && (
            <div className="typo-correction-alert">
              <Sparkles size={15} className="typo-alert-icon" />
              <div className="typo-alert-text">
                <span>Yazım düzeltildi: </span>
                <span className="typo-original">"{(searchResult?.optimization || currentThread?.optimization)?.rawQuery}"</span>
                <span className="typo-arrow"> ➔ </span>
                <strong className="typo-corrected">"{((searchResult?.optimization || currentThread?.optimization)?.correctedTerms || []).map(c => c.to).join(', ')}"</strong>
                <span className="typo-note"> için klinik ve biyomedikal literatür tarandı.</span>
              </div>
            </div>
          )}

          {turns.map((turn, tIdx) => {
            const isStepsOpen = expandedSteps[tIdx] ?? (tIdx === 0);
            const turnSearchSteps = turn.searchSteps || [
              { query: turn.query, count: '15.6K' },
              { query: `${turn.query} patofizyolojik mekanizmalar ve klinik deneyler`, count: '47' },
              { query: 'Özetler ve Tam Metinler İncelendi', count: '20' }
            ];
            const turnGradeSummary = turn.gradeSummary || turn.synthesis?.gradeSummary || searchResult?.gradeSummary;

            return (
              <div key={turn.id || tIdx} className={`thread-turn-container ${tIdx > 0 ? 'follow-up-turn' : ''}`}>
                {/* Follow-up Turn Separator Header */}
                {tIdx > 0 && (
                  <div className="turn-separator">
                    <div className="turn-separator-line" />
                    <div className="turn-badge">
                      <MessageSquarePlus size={12} className="turn-badge-icon" />
                      <span>Takip Sorusu & Literatür Sentezi · Tur {tIdx + 1}</span>
                    </div>
                    <div className="turn-separator-line" />
                  </div>
                )}

                {/* User Research Question Card (Mint green bubble) */}
                {turn.query && (
                  <div className="user-question-card">
                    <div className="question-text">
                      {turn.query}
                    </div>
                    <div className="question-actions">
                      <button 
                        className="question-copy-btn" 
                        onClick={() => handleCopyQuery(turn.query, tIdx)} 
                        title="Soruyu kopyala"
                      >
                        {copiedIndex === tIdx ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Research Steps Breakdown (Pro 3 steps >) */}
                {turnSearchSteps && turnSearchSteps.length > 0 && (
                  <div className="research-steps-widget">
                    <button 
                      className="steps-toggle-header" 
                      onClick={() => toggleSteps(tIdx)}
                    >
                      <div className="steps-header-left">
                        <span className="pro-infinity-badge">∞ Pro</span>
                        <span className="steps-count-text">· {turnSearchSteps.length} adım</span>
                      </div>
                      <div className="steps-chevron">
                        {isStepsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </div>
                    </button>

                    {isStepsOpen && (
                      <div className="steps-list">
                        {turnSearchSteps.map((step, sIdx) => {
                          const isLast = sIdx === turnSearchSteps.length - 1;
                          return (
                            <div key={sIdx} className="step-item">
                              <div className="step-left">
                                {isLast ? (
                                  <FileText size={14} className="step-icon step-read" />
                                ) : (
                                  <Search size={14} className="step-icon step-search" />
                                )}
                                <span className="step-query-text">{step.query}</span>
                              </div>
                              <div className="step-right">
                                <span className="step-count">{step.count}</span>
                                <span className="step-arrow">↗</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* PICO Clinical Framework Card */}
                {(turn.pico || searchResult?.pico) && (
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #bfdbfe',
                    borderLeft: '4px solid #2563eb',
                    borderRadius: '12px',
                    padding: '0.9rem 1.2rem',
                    marginBottom: '1.2rem',
                    boxShadow: '0 1px 3px rgba(37, 99, 235, 0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: '#1e40af' }}>
                        <Target size={15} />
                        <span>PICO Klinik Araştırma Çerçevesi</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPicoModalOpen(true)}
                        style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        PICO'yu Düzenle ↗
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.6rem' }}>
                      {(turn.pico?.population || searchResult?.pico?.population) && (
                        <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '0.45rem 0.7rem', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 700, color: '#1e40af', display: 'block', fontSize: '0.72rem' }}>P - Popülasyon:</span>
                          <span style={{ color: '#1e293b' }}>{turn.pico?.population || searchResult?.pico?.population}</span>
                        </div>
                      )}
                      {(turn.pico?.intervention || searchResult?.pico?.intervention) && (
                        <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '0.45rem 0.7rem', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 700, color: '#166534', display: 'block', fontSize: '0.72rem' }}>I - Müdahale:</span>
                          <span style={{ color: '#1e293b' }}>{turn.pico?.intervention || searchResult?.pico?.intervention}</span>
                        </div>
                      )}
                      {(turn.pico?.comparison || searchResult?.pico?.comparison) && (
                        <div style={{ background: '#fffbeb', borderRadius: '8px', padding: '0.45rem 0.7rem', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 700, color: '#92400e', display: 'block', fontSize: '0.72rem' }}>C - Karşılaştırma:</span>
                          <span style={{ color: '#1e293b' }}>{turn.pico?.comparison || searchResult?.pico?.comparison}</span>
                        </div>
                      )}
                      {(turn.pico?.outcome || searchResult?.pico?.outcome) && (
                        <div style={{ background: '#faf5ff', borderRadius: '8px', padding: '0.45rem 0.7rem', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 700, color: '#6b21a8', display: 'block', fontSize: '0.72rem' }}>O - Sonlanım:</span>
                          <span style={{ color: '#1e293b' }}>{turn.pico?.outcome || searchResult?.pico?.outcome}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Consensus Meter (if available) */}
                {turn.consensus && turn.consensus.totalAnalyzed > 0 && (
                  <div style={{ marginBottom: '1.2rem' }}>
                    <ConsensusMeter consensus={turn.consensus} />
                  </div>
                )}

                {/* GRADE Evidence Certainty & Cochrane RoB 2 Methodological Summary Widget */}
                {turnGradeSummary && turnGradeSummary.totalAnalyzed > 0 && (
                  <div className="grade-rob-summary-widget" style={{
                    marginBottom: '1.5rem',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.1rem 1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: '#ecfdf5',
                          color: '#065f46',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          border: '1px solid #a7f3d0'
                        }}>
                          <Shield size={13} />
                          {turnGradeSummary.overallGradeVerdict}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                          Cochrane RoB 2 / ROBINS-I Metodolojik Değerlendirmesi
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#0f766e' }}>
                        {turnGradeSummary.totalAnalyzed} hakemli yayın tarandı
                      </span>
                    </div>

                    {/* Cochrane Risk of Bias Distribution Bar */}
                    <div style={{ marginBottom: '0.7rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>
                        <span>Metodolojik Yanlılık Riski (Risk of Bias) Dağılımı:</span>
                        <span>% {turnGradeSummary.robDistribution?.lowRiskPct || 0} Düşük Risk</span>
                      </div>
                      <div style={{ display: 'flex', height: '9px', borderRadius: '5px', overflow: 'hidden', background: '#f1f5f9' }}>
                        <div style={{ width: `${turnGradeSummary.robDistribution?.lowRiskPct || 0}%`, background: '#10b981' }} title={`Düşük Risk: %${turnGradeSummary.robDistribution?.lowRiskPct || 0}`} />
                        <div style={{ width: `${turnGradeSummary.robDistribution?.someConcernsPct || 0}%`, background: '#f59e0b' }} title={`Bazı Endişeler: %${turnGradeSummary.robDistribution?.someConcernsPct || 0}`} />
                        <div style={{ width: `${turnGradeSummary.robDistribution?.highRiskPct || 0}%`, background: '#ef4444' }} title={`Yüksek Risk: %${turnGradeSummary.robDistribution?.highRiskPct || 0}`} />
                      </div>
                      <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.4rem', fontSize: '0.75rem', color: '#64748b', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                          % {turnGradeSummary.robDistribution?.lowRiskPct || 0} Düşük Yanlılık Riski ({turnGradeSummary.robDistribution?.counts?.lowRisk || 0})
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                          % {turnGradeSummary.robDistribution?.someConcernsPct || 0} Bazı Endişeler ({turnGradeSummary.robDistribution?.counts?.someConcerns || 0})
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                          % {turnGradeSummary.robDistribution?.highRiskPct || 0} Yüksek Risk ({turnGradeSummary.robDistribution?.counts?.highRisk || 0})
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#334155', lineHeight: '1.45', background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                      {turnGradeSummary.narrativeSummary}
                    </p>

                    <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setIsMethodologyModalOpen(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: '#f0fdf4',
                          color: '#166534',
                          border: '1px solid #bbf7d0',
                          borderRadius: '6px',
                          padding: '0.35rem 0.8rem',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                        }}
                        title="Cochrane RevMan Trafik Işığı Matrisi ve GRADE Kanıt Profilini İncele"
                      >
                        <Scale size={13} />
                        <span>RevMan Trafik Işığı & GRADE Matrisini İncele ↗</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Academic Synthesis Content */}
                <article className="academic-synthesis-article">
                  {turn.synthesis?.sections && turn.synthesis.sections.length > 0 ? (
                    turn.synthesis.sections.map((sec, secIdx) => {
                      if (sec.type === 'table') {
                        return (
                          <div key={secIdx} className="academic-table-wrap">
                            {sec.title && <h3 className="table-caption-title">{sec.title}</h3>}
                            <div className="table-responsive-container">
                              <table className="consensus-academic-table">
                                <thead>
                                  <tr>
                                    {sec.headers.map((h, hIdx) => (
                                      <th key={hIdx}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {sec.rows.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx}>
                                          {renderTextWithCitations(cell)}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <section key={secIdx} className="synthesis-section">
                          <h2 className="synthesis-section-heading">{sec.title}</h2>
                          <div className="synthesis-section-paragraph">
                            {renderTextWithCitations(sec.content)}
                          </div>
                        </section>
                      );
                    })
                  ) : (
                    /* Fallback if sections array is not present */
                    <div className="synthesis-fallback-text">
                      {(turn.synthesis?.summary || '').split('\n\n').map((p, pIdx) => (
                        <p key={pIdx} className="synthesis-section-paragraph">
                          {renderTextWithCitations(p)}
                        </p>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            );
          })}

          {/* Follow-Up In-Progress Shimmer Card */}
          {isFollowUpLoading && (
            <div className="follow-up-loading-card">
              <div className="loading-card-pulse">
                <Loader2 size={20} className="animate-spin" style={{ color: '#0d9488' }} />
                <div className="loading-card-texts">
                  <div className="loading-card-title">Takip sorusu literatürle sentezleniyor...</div>
                  <div className="loading-card-subtitle">
                    Önceki araştırma bulguları ({threadTitle}) ve yeni kanıtlar taranıp birleştiriliyor
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Prompt Input Bar */}
      <div className="center-bottom-bar">
        <form className="floating-prompt-pill" onSubmit={handleFollowUpSubmit}>
          <div className="pill-input-row">
            <input
              type="text"
              className="pill-text-input"
              value={followUpQuery}
              onChange={(e) => setFollowUpQuery(e.target.value)}
              placeholder={threadTitle ? `"${threadTitle}" hakkında takip sorusu sorun veya parametre ekleyin... (Enter)` : 'Akademik bir takip sorusu veya hipotez yazın...'}
              disabled={isFollowUpLoading || isLoading}
            />
          </div>

          <div className="pill-actions-row">
            <div className="pill-left-tools">
              <button 
                type="button" 
                className="pill-tool-btn" 
                onClick={onOpenUploadDoc} 
                title="Kendi Özel Dokümanını / Tezi Ekle"
              >
                <Plus size={15} />
              </button>
              <button type="button" className="pill-chip-btn">
                <span>Corpus</span>
                <ChevronDown size={13} />
              </button>
              <button type="button" className="pill-chip-btn deep-chip">
                <span>Deep</span>
                <Plus size={13} />
              </button>
              <button 
                type="button" 
                className="pill-chip-btn" 
                onClick={onOpenFilters}
                title="Filtreleri Düzenle"
              >
                <SlidersHorizontal size={13} />
                <span>Filter</span>
              </button>
            </div>

            <div className="pill-right-tools">
              <button type="button" className="pill-tool-btn mic-btn" title="Sesli Soru">
                <Mic size={15} />
              </button>
              <button 
                type="submit" 
                className={`pill-send-btn ${followUpQuery.trim() ? 'active' : ''}`}
                disabled={!followUpQuery.trim() || isFollowUpLoading || isLoading}
                title="Gönder"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Cochrane RevMan & GRADE Methodological Evaluation Modal */}
      <MethodologicalModal
        isOpen={isMethodologyModalOpen}
        onClose={() => setIsMethodologyModalOpen(false)}
        papers={searchResult?.papers || []}
        currentQuery={currentQuery}
        gradeSummary={searchResult?.gradeSummary || searchResult?.synthesis?.gradeSummary}
      />

      {/* PICO Smart Clinical Search Modal */}
      <PicoSearchModal
        isOpen={isPicoModalOpen}
        onClose={() => setIsPicoModalOpen(false)}
        onSearch={onSearch}
      />

      {/* PRISMA 2020 Flow Diagram Modal */}
      <PrismaModal
        isOpen={isPrismaModalOpen}
        onClose={() => setIsPrismaModalOpen(false)}
        searchResult={searchResult}
        currentQuery={currentQuery}
      />
    </main>
  );
}
