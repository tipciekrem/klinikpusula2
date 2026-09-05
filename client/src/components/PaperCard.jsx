import React, { useState, useEffect } from 'react';
import { 
  Quote, 
  BookmarkPlus, 
  Check, 
  ExternalLink, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Users,
  Download,
  Languages,
  Loader2
} from 'lucide-react';
import { downloadRISFile, downloadBIBFile, translateText } from '../services/api';

function stripHtmlTags(str = '') {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<\/?[a-z0-9_\-:]+(?:\s+[^>]*?)?>/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\b(h[1-6]|jats:[a-z]+)\b/gi, ' ')
    .replace(/^(conclusions?|results?|background|methods?|findings?|abstract|objective|sonuçlar?|arka plan|yöntemler?|bulgular)\s*[:\-–]\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function PaperCard({ 
  paper, 
  isSaved, 
  onSaveToThesis, 
  onOpenCiteModal,
  globalTurkishMode = false 
}) {
  const [showAbstract, setShowAbstract] = useState(false);
  const [abstractLang, setAbstractLang] = useState('tr'); // 'tr' | 'en'
  const [showTurkishLocal, setShowTurkishLocal] = useState(false);
  const [isTranslatingCard, setIsTranslatingCard] = useState(false);
  const [isTranslatingAbstract, setIsTranslatingAbstract] = useState(false);
  const [isExportingRIS, setIsExportingRIS] = useState(false);
  const [isExportingBIB, setIsExportingBIB] = useState(false);

  // Local translations (initialized with pre-translated batch if available)
  const [localTrTitle, setLocalTrTitle] = useState(paper.trTitle || (paper.isTurkish ? paper.title : null));
  const [localTrTakeaway, setLocalTrTakeaway] = useState(paper.trTakeaway || (paper.isTurkish ? paper.keyTakeaway : null));
  const [localTrAbstract, setLocalTrAbstract] = useState(paper.trAbstract || (paper.isTurkish ? paper.abstract : null));

  // Sync if paper prop changes
  useEffect(() => {
    setLocalTrTitle(paper.trTitle || (paper.isTurkish ? paper.title : null));
    setLocalTrTakeaway(paper.trTakeaway || (paper.isTurkish ? paper.keyTakeaway : null));
    setLocalTrAbstract(paper.trAbstract || (paper.isTurkish ? paper.abstract : null));
  }, [paper.id, paper.trTitle, paper.trTakeaway, paper.trAbstract]);

  // Is Turkish view active? (global toggle OR local button toggle OR Turkish native paper)
  const isTurkishView = globalTurkishMode || showTurkishLocal || paper.isTurkish;

  // Active translation function
  const triggerCardTranslation = async () => {
    if (paper.isTurkish) return;
    setIsTranslatingCard(true);
    try {
      const needsTitle = !localTrTitle || localTrTitle === paper.title;
      const needsTakeaway = !localTrTakeaway || localTrTakeaway === paper.keyTakeaway;

      const [trT, trK] = await Promise.all([
        needsTitle && paper.title ? translateText(paper.title) : Promise.resolve(localTrTitle),
        needsTakeaway && paper.keyTakeaway ? translateText(paper.keyTakeaway) : Promise.resolve(localTrTakeaway)
      ]);

      if (trT) setLocalTrTitle(trT);
      if (trK) setLocalTrTakeaway(trK);
    } catch (err) {
      console.warn('Card translation error:', err);
    } finally {
      setIsTranslatingCard(false);
    }
  };

  // Trigger abstract translation
  const triggerAbstractTranslation = async () => {
    if (localTrAbstract || !paper.abstract || paper.isTurkish) return;
    setIsTranslatingAbstract(true);
    try {
      const trans = await translateText(paper.abstract);
      if (trans) setLocalTrAbstract(trans);
    } catch (err) {
      console.warn('Abstract translation error:', err);
    } finally {
      setIsTranslatingAbstract(false);
    }
  };

  // If Turkish view becomes active and card isn't translated yet, automatically translate
  useEffect(() => {
    if (isTurkishView && !paper.isTurkish) {
      const needsTranslation = (!localTrTakeaway && paper.keyTakeaway) || (!localTrTitle && paper.title);
      if (needsTranslation && !isTranslatingCard) {
        triggerCardTranslation();
      }
    }
  }, [isTurkishView, localTrTakeaway, localTrTitle]);

  const handleToggleTurkish = async (e) => {
    e.stopPropagation();
    if (paper.isTurkish) return;
    const nextState = !showTurkishLocal;
    setShowTurkishLocal(nextState);

    // If switching ON and translations don't exist yet, actively translate right now
    if (nextState && (!localTrTakeaway || !localTrTitle)) {
      await triggerCardTranslation();
    }
  };

  const handleOpenAbstract = () => {
    const nextState = !showAbstract;
    setShowAbstract(nextState);
    if (nextState && abstractLang === 'tr' && !localTrAbstract && paper.abstract && !paper.isTurkish) {
      triggerAbstractTranslation();
    }
  };

  const handleSelectAbstractLang = (lang) => {
    setAbstractLang(lang);
    if (lang === 'tr' && !localTrAbstract && paper.abstract && !paper.isTurkish) {
      triggerAbstractTranslation();
    }
  };

  const displayTitle = stripHtmlTags(isTurkishView && localTrTitle ? localTrTitle : paper.title);
  const displayTakeaway = stripHtmlTags(isTurkishView && localTrTakeaway ? localTrTakeaway : paper.keyTakeaway);

  const authorsFormatted = (paper.authors || [])
    .slice(0, 3)
    .map(a => (typeof a === 'string' ? a : a.name))
    .join(', ') + ((paper.authors && paper.authors.length > 3) ? ' et al.' : '');

  const getStudyClass = (type) => {
    if (!type) return '';
    const t = type.toLowerCase();
    if (t.includes('meta') || t.includes('systematic')) return 'meta';
    if (t.includes('controlled') || t.includes('trial') || t.includes('experimental')) return 'rct';
    return '';
  };

  const handleDownloadRIS = async (e) => {
    e.stopPropagation();
    try {
      setIsExportingRIS(true);
      const safeTitle = (paper.title || 'makale').slice(0, 25).replace(/[^a-zA-Z0-9]/g, '_');
      await downloadRISFile(paper, `${safeTitle}_zotero.ris`);
    } catch (err) {
      alert('RIS dosyası indirilemedi: ' + err.message);
    } finally {
      setIsExportingRIS(false);
    }
  };

  const handleDownloadBIB = async (e) => {
    e.stopPropagation();
    try {
      setIsExportingBIB(true);
      const safeTitle = (paper.title || 'makale').slice(0, 25).replace(/[^a-zA-Z0-9]/g, '_');
      await downloadBIBFile(paper, `${safeTitle}_bibtex.bib`);
    } catch (err) {
      alert('BibTeX dosyası indirilemedi: ' + err.message);
    } finally {
      setIsExportingBIB(false);
    }
  };

  return (
    <article className="paper-card" style={{ borderLeft: isTurkishView ? '4px solid #10b981' : undefined }}>
      <div className="paper-badges" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
          {/* Source Badges */}
          {paper.sourceBadge && (
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              background: paper.isTurkish ? '#ecfdf5' : (paper.sourceBadge === 'S2' ? '#f5f3ff' : '#e0f2fe'),
              color: paper.isTurkish ? '#047857' : (paper.sourceBadge === 'S2' ? '#6d28d9' : '#0369a1'),
              border: `1px solid ${paper.isTurkish ? '#a7f3d0' : (paper.sourceBadge === 'S2' ? '#ddd6fe' : '#bae6fd')}`
            }}>
              {paper.sourceBadge === 'TR Dizin' ? '🇹🇷 DergiPark / TR Dizin' : (paper.sourceBadge === 'S2' ? '🧠 Semantic Scholar' : paper.sourceBadge)}
            </span>
          )}

          {paper.studyType && (
            <span className={`badge badge-study ${getStudyClass(paper.studyType)}`}>
              {paper.studyType}
            </span>
          )}

          {paper.sampleSize && (
            <span className="badge badge-sample" title="Araştırma örneklem büyüklüğü">
              <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {paper.sampleSize}
            </span>
          )}

          {paper.citationCount > 0 && (
            <span className="badge badge-citations" title="Toplam atıf sayısı">
              {paper.citationCount.toLocaleString()} atıf
            </span>
          )}

          {paper.isOpenAccess && paper.pdfUrl && (
            <span className="badge badge-oa">
              <FileText size={12} />
              Açık Erişim PDF
            </span>
          )}

          {/* Funding / Conflict of Interest (COI) Bias Radar Badge */}
          {paper.fundingStatus === 'industry' || paper.isIndustryFunded ? (
            <span 
              style={{
                fontSize: '0.72rem',
                fontWeight: '800',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: '#fff7ed',
                color: '#c2410c',
                border: '1px solid #fed7aa',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title={paper.fundingDetails || 'Endüstri / İlaç Sponsorluğu Bildirimi (Olası Sponsorluk Yanlılığı / Funding Bias)'}
            >
              <span>{paper.fundingBadge || '🟠 Endüstri / COI'}</span>
            </span>
          ) : (paper.fundingStatus === 'academic' || paper.isTurkish ? (
            <span 
              style={{
                fontSize: '0.72rem',
                fontWeight: '800',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title={paper.fundingDetails || 'Bağımsız Kamu / Üniversite / TÜBİTAK Fonlaması'}
            >
              <span>{paper.fundingBadge || '🟢 Bağımsız Fonlu'}</span>
            </span>
          ) : null)}
        </div>

        {/* Translation Toggle Button */}
        {!paper.isTurkish && (
          <button
            onClick={handleToggleTurkish}
            disabled={isTranslatingCard}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              background: isTurkishView ? '#d1fae5' : '#f1f5f9',
              color: isTurkishView ? '#065f46' : '#475569',
              border: isTurkishView ? '1.5px solid #10b981' : '1px solid #cbd5e1',
              cursor: isTranslatingCard ? 'wait' : 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Başlık ve özet çıkarımını kaliteli tıbbi Türkçeye çevir"
          >
            {isTranslatingCard ? (
              <>
                <Loader2 size={13} className="spin-animate" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Çevriliyor...</span>
              </>
            ) : (
              <>
                <Languages size={13} />
                <span>{isTurkishView ? '🇹🇷 Türkçe (Aktif)' : '🇬🇧 Orijinal (TR Çevir)'}</span>
              </>
            )}
          </button>
        )}
      </div>

      <h2 className="paper-title" style={{ marginTop: '0.6rem' }}>
        {paper.doi ? (
          <a href={paper.doi} target="_blank" rel="noopener noreferrer">
            {displayTitle}
          </a>
        ) : (
          <span>{displayTitle}</span>
        )}
      </h2>

      {/* If translated, show original title in small muted font for academic fidelity */}
      {isTurkishView && localTrTitle && localTrTitle !== paper.title && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '-0.3rem', marginBottom: '0.4rem' }}>
          Orijinal: {paper.title}
        </div>
      )}

      {/* Metadata with prominent DOI and PMID links */}
      <div className="paper-meta" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem', fontSize: '0.85rem' }}>
        <span>{authorsFormatted || 'Anonim'}</span>
        {paper.year && <span>• {paper.year}</span>}
        {paper.journal && <span>• <span className="journal">{paper.journal}</span></span>}
        {paper.doi && (
          <span>
            •{' '}
            <a 
              href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi.replace(/^doi:/i, '')}`}
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#0284c7', textDecoration: 'underline', fontWeight: '700' }}
              title="Resmi DOI Bağlantısı (Crossref / Publisher)"
            >
              DOI: {paper.doi.replace(/^https?:\/\/doi\.org\//i, '')}
            </a>
          </span>
        )}
        {paper.pmid && (
          <span>
            •{' '}
            <a 
              href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`}
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#0d9488', fontWeight: '700' }}
              title="PubMed PMID Bağlantısı"
            >
              PMID: {paper.pmid}
            </a>
          </span>
        )}
      </div>

      {/* Ana Çıkarım (Key Takeaway) Box */}
      {displayTakeaway && (
        <div className="takeaway-box" style={{ background: isTurkishView ? '#f0fdf4' : undefined, borderColor: isTurkishView ? '#86efac' : undefined }}>
          <div className="takeaway-label" style={{ color: isTurkishView ? '#166534' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={13} />
              {isTurkishView ? 'Ana Çıkarım (Akademik Özet - Türkçe)' : 'Ana Çıkarım (Key Takeaway)'}
            </span>
            {isTranslatingCard && (
              <span style={{ fontSize: '0.72rem', color: '#059669', fontStyle: 'italic' }}>
                Tıbbi çeviri güncelleniyor...
              </span>
            )}
          </div>
          <p className="takeaway-text" style={{ color: isTurkishView ? '#14532d' : undefined, fontSize: '0.94rem', lineHeight: '1.6' }}>
            "{displayTakeaway}"
          </p>
        </div>
      )}

      {/* Abstract Dropdown Section with Turkish / English toggles */}
      {showAbstract && (
        <div className="paper-abstract" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '0.95rem', marginTop: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <strong style={{ color: 'var(--accent-navy)', fontSize: '0.9rem' }}>Özet (Abstract):</strong>
              
              {/* Abstract Language Switcher */}
              {!paper.isTurkish && (
                <div style={{ display: 'inline-flex', gap: '0.3rem', background: '#e2e8f0', padding: '0.15rem', borderRadius: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleSelectAbstractLang('tr')}
                    style={{
                      padding: '0.15rem 0.55rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: 'none',
                      background: abstractLang === 'tr' ? '#10b981' : 'transparent',
                      color: abstractLang === 'tr' ? '#ffffff' : '#475569',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    🇹🇷 Türkçe
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAbstractLang('en')}
                    style={{
                      padding: '0.15rem 0.55rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: 'none',
                      background: abstractLang === 'en' ? '#0284c7' : 'transparent',
                      color: abstractLang === 'en' ? '#ffffff' : '#475569',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    🇬🇧 English
                  </button>
                </div>
              )}
            </div>

            {paper.doi && (
              <a 
                href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi.replace(/^doi:/i, '')}`}
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontSize: '0.78rem', color: '#0284c7', textDecoration: 'underline', fontWeight: '700' }}
              >
                DOI Sayfası ↗
              </a>
            )}
          </div>

          {/* Abstract Content */}
          {paper.abstract ? (
            <div>
              {abstractLang === 'tr' && isTranslatingAbstract ? (
                <div style={{ padding: '0.8rem', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Bilimsel ve tıbbi terminolojiye uygun Türkçe özet çevirisi hazırlanıyor...</span>
                </div>
              ) : (
                <p style={{ marginTop: '0.4rem', lineHeight: '1.65', fontSize: '0.9rem', color: '#334155' }}>
                  {stripHtmlTags(abstractLang === 'tr' ? (localTrAbstract || paper.abstract) : paper.abstract)}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p style={{ marginTop: '0.4rem', color: '#64748b', fontStyle: 'italic', fontSize: '0.88rem' }}>
                Bu yayının tam metin özeti açık dizin kayıtlarında metin olarak bulunmamaktadır. Resmi DOI bağlantısı üzerinden yayıncının orijinal makale sayfasına ulaşarak özete erişebilirsiniz.
              </p>
              {paper.doi && (
                <a 
                  href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi.replace(/^doi:/i, '')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-card"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}
                >
                  <ExternalLink size={13} />
                  <span>Yayıncı Sayfasında Özeti Gör ({paper.doi.replace(/^https?:\/\/doi\.org\//i, '')})</span>
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Card Actions */}
      <div className="paper-actions">
        <div className="actions-left" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          <button 
            className="btn-card btn-cite"
            onClick={() => onOpenCiteModal(paper)}
            title="APA, BibTeX, IEEE, MLA formatlarında kopyala"
          >
            <Quote size={14} />
            <span>Alıntı Yap</span>
          </button>

          {/* Quick RIS Download for Zotero / EndNote */}
          <button 
            className="btn-card"
            onClick={handleDownloadRIS}
            disabled={isExportingRIS}
            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155' }}
            title="Zotero, EndNote ve Mendeley için .RIS dosyasını doğrudan indir"
          >
            <Download size={13} />
            <span>{isExportingRIS ? 'İndiriliyor...' : '.RIS'}</span>
          </button>

          {/* Quick BIB Download for BibTeX / LaTeX / Overleaf */}
          <button 
            className="btn-card"
            onClick={handleDownloadBIB}
            disabled={isExportingBIB}
            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155' }}
            title="LaTeX, Overleaf ve Zotero için .BIB (BibTeX) dosyasını doğrudan indir"
          >
            <Download size={13} />
            <span>{isExportingBIB ? 'İndiriliyor...' : '.BIB'}</span>
          </button>

          <button 
            className={`btn-card btn-save-thesis ${isSaved ? 'saved' : ''}`}
            onClick={() => onSaveToThesis(paper)}
            title={isSaved ? "Tez kütüphanenizde kayıtlı" : "Tez kütüphanenize ve literatür listenize ekleyin"}
          >
            {isSaved ? (
              <>
                <Check size={14} />
                <span>Tezde Kayıtlı</span>
              </>
            ) : (
              <>
                <BookmarkPlus size={14} />
                <span>Tezime Ekle</span>
              </>
            )}
          </button>

          {paper.pdfUrl && (
            <a 
              href={paper.pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-card btn-pdf"
              title="Tam metin PDF dosyasını aç"
            >
              <FileText size={14} />
              <span>PDF Oku</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        <div className="actions-right">
          <button 
            className="btn-card btn-abstract-toggle"
            onClick={handleOpenAbstract}
            title="Yayının tam özetini ve Türkçe/İngilizce çevirisini aç/kapat"
          >
            <span>{showAbstract ? 'Özeti Gizle' : 'Özeti Oku'}</span>
            {showAbstract ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>
    </article>
  );
}
