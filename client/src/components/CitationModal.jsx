import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download } from 'lucide-react';
import { getCitations, downloadRISFile, downloadBIBFile } from '../services/api';

export default function CitationModal({ paper, onClose }) {
  const [citations, setCitations] = useState(null);
  const [activeFormat, setActiveFormat] = useState('apa');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloadingRIS, setDownloadingRIS] = useState(false);
  const [downloadingBIB, setDownloadingBIB] = useState(false);

  useEffect(() => {
    if (paper) {
      setLoading(true);
      getCitations(paper)
        .then(res => {
          setCitations(res);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [paper]);

  if (!paper) return null;

  const currentText = citations ? citations[activeFormat] || '' : '';

  const handleCopy = () => {
    if (currentText) {
      navigator.clipboard.writeText(currentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadRIS = async () => {
    try {
      setDownloadingRIS(true);
      const safeTitle = (paper.title || 'makale').slice(0, 25).replace(/[^a-zA-Z0-9]/g, '_');
      await downloadRISFile(paper, `${safeTitle}_zotero.ris`);
    } catch (err) {
      alert('RIS dosyası indirilemedi: ' + err.message);
    } finally {
      setDownloadingRIS(false);
    }
  };

  const handleDownloadBIB = async () => {
    try {
      setDownloadingBIB(true);
      const safeTitle = (paper.title || 'makale').slice(0, 25).replace(/[^a-zA-Z0-9]/g, '_');
      await downloadBIBFile(paper, `${safeTitle}_bibtex.bib`);
    } catch (err) {
      alert('BibTeX dosyası indirilemedi: ' + err.message);
    } finally {
      setDownloadingBIB(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Akademik Atıf & Kaynakça</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem', fontWeight: '500' }}>
            "{paper.title}"
          </p>

          <div className="citation-tabs">
            <button 
              className={`citation-tab-btn ${activeFormat === 'apa' ? 'active' : ''}`}
              onClick={() => setActiveFormat('apa')}
            >
              APA 7
            </button>
            <button 
              className={`citation-tab-btn ${activeFormat === 'bibtex' ? 'active' : ''}`}
              onClick={() => setActiveFormat('bibtex')}
            >
              BibTeX (LaTeX / Zotero)
            </button>
            <button 
              className={`citation-tab-btn ${activeFormat === 'ris' ? 'active' : ''}`}
              onClick={() => setActiveFormat('ris')}
            >
              RIS (EndNote / Mendeley)
            </button>
            <button 
              className={`citation-tab-btn ${activeFormat === 'ieee' ? 'active' : ''}`}
              onClick={() => setActiveFormat('ieee')}
            >
              IEEE
            </button>
            <button 
              className={`citation-tab-btn ${activeFormat === 'mla' ? 'active' : ''}`}
              onClick={() => setActiveFormat('mla')}
            >
              MLA 9
            </button>
            <button 
              className={`citation-tab-btn ${activeFormat === 'inText' ? 'active' : ''}`}
              onClick={() => setActiveFormat('inText')}
            >
              Metin İçi Atıf
            </button>
          </div>

          <div className="citation-content-box" style={{ fontFamily: activeFormat === 'bibtex' || activeFormat === 'ris' ? 'monospace' : 'inherit', fontSize: '0.85rem' }}>
            {loading ? 'Atıf formatlanıyor...' : (currentText || 'Atıf bilgisi üretilemedi.')}
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-secondary"
              onClick={handleDownloadRIS}
              disabled={downloadingRIS}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
            >
              <Download size={14} />
              <span>{downloadingRIS ? 'İndiriliyor...' : '.RIS (Zotero / EndNote)'}</span>
            </button>
            <button 
              className="btn-secondary"
              onClick={handleDownloadBIB}
              disabled={downloadingBIB}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
            >
              <Download size={14} />
              <span>{downloadingBIB ? 'İndiriliyor...' : '.BIB (BibTeX / LaTeX)'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" onClick={onClose}>
              Kapat
            </button>
            <button className="btn-primary" onClick={handleCopy} disabled={!currentText || loading}>
              {copied ? (
                <>
                  <Check size={16} />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Metni Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
