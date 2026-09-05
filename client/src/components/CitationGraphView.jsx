import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Award, 
  ExternalLink, 
  Quote, 
  BookmarkPlus, 
  Check, 
  FileText,
  Search
} from 'lucide-react';
import { getCitationSnowball } from '../services/api';
import CitationNetworkCanvas from './CitationNetworkCanvas.jsx';

export default function CitationGraphView({ 
  papers = [], 
  onSaveToThesis, 
  onOpenCiteModal,
  savedPaperIds = [] 
}) {
  const [selectedPaper, setSelectedPaper] = useState(papers[0] || null);
  const [snowballData, setSnowballData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualQuery, setManualQuery] = useState('');

  // Load snowballing data for current paper
  const loadSnowball = async (paperOrQuery) => {
    setLoading(true);
    try {
      let params = {};
      if (typeof paperOrQuery === 'string') {
        params = { title: paperOrQuery };
      } else if (paperOrQuery) {
        params = {
          paperId: paperOrQuery.id,
          doi: paperOrQuery.doi,
          title: paperOrQuery.title
        };
      }
      const data = await getCitationSnowball(params);
      setSnowballData(data);
      if (data.basePaper) {
        setSelectedPaper(data.basePaper);
      }
    } catch (err) {
      alert('Atıf grafı yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (papers.length > 0 && !snowballData) {
      loadSnowball(papers[0]);
    }
  }, [papers]);

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (manualQuery.trim()) {
      loadSnowball(manualQuery.trim());
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>
          <Sparkles size={13} />
          KlinikPusula PRO • Dr. Ekrem Kasapoğlu Atıf Grafı & Snowballing
        </div>
        <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: 'var(--accent-navy)' }}>
          Atıf Grafı & Snowballing Analizi
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Tek bir kilit makaleden yola çıkarak hem dayandığı <strong>kurucu (seminal)</strong> kaynakları geriye doğru hem de onu referans veren <strong>yeni çalışmaları</strong> ileriye doğru keşfedin.
        </p>
      </div>

      {/* Select or Search Paper */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '2rem', background: '#fff', padding: '1rem 1.4rem', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
        <form onSubmit={handleManualSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Search size={18} style={{ color: 'var(--text-light)' }} />
          <input
            type="text"
            placeholder="Analiz edilecek makale başlığı veya DOI girin..."
            value={manualQuery}
            onChange={e => setManualQuery(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.92rem' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
            Grafı Çıkar
          </button>
        </form>

        {papers.length > 0 && (
          <select 
            onChange={(e) => {
              const p = papers.find(item => item.id === e.target.value);
              if (p) {
                setSelectedPaper(p);
                loadSnowball(p);
              }
            }}
            value={selectedPaper?.id || ''}
            style={{ padding: '0.45rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <option value="">Arama sonuçlarından makale seçin...</option>
            {papers.map(p => (
              <option key={p.id} value={p.id}>
                {p.title.length > 50 ? p.title.slice(0, 50) + '...' : p.title} ({p.year})
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Atıf grafı çözülüyor ve seminal makaleler taranıyor...</p>
        </div>
      ) : snowballData ? (
        <div>
          {/* Base Paper Centerpiece */}
          <div style={{
            background: 'linear-gradient(135deg, #0a2540 0%, #0e8388 100%)',
            color: '#fff',
            borderRadius: '16px',
            padding: '1.8rem 2.2rem',
            marginBottom: '2.5rem',
            boxShadow: '0 10px 25px -5px rgba(10, 37, 64, 0.25)',
            position: 'relative'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.6rem' }}>
              <GitFork size={13} />
              Merkez Odak Makale (Hub)
            </div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-editorial)', lineHeight: '1.3', marginBottom: '0.6rem' }}>
              {snowballData.basePaper.title}
            </h3>
            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1rem' }}>
              {(snowballData.basePaper.authors || []).slice(0, 3).join(', ')} • {snowballData.basePaper.year} • {snowballData.basePaper.journal}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
              <span>📚 <strong>{snowballData.totalReferences}</strong> Dayandığı Kaynak (Backward)</span>
              <span>🚀 <strong>{snowballData.totalCitations}</strong> Yapılan Atıf (Forward)</span>
            </div>
          </div>

          {/* Interactive Visual Network Canvas */}
          <CitationNetworkCanvas
            basePaper={snowballData.basePaper}
            backwardCitations={snowballData.backwardCitations}
            forwardCitations={snowballData.forwardCitations}
            onReCenter={(paper) => {
              setSelectedPaper(paper);
              loadSnowball(paper);
            }}
          />

          {/* Two-Column Snowballing Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Backward Citations */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.6rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', color: '#b45309' }}>
                <ArrowLeft size={20} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--accent-navy)' }}>
                  Geriye Doğru Atıflar (Dayandığı Temeller)
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                Bu makalenin tezini inşa ederken kaynak gösterdiği en etkili öncül çalışmalar:
              </p>

              {snowballData.backwardCitations.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Açık referans verisi bulunamadı.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {snowballData.backwardCitations.map(p => (
                    <div 
                      key={p.id}
                      style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        background: p.isSeminal ? '#fffbeb' : '#f8fafc',
                        border: p.isSeminal ? '1.5px solid #fde68a' : '1px solid var(--border-light)'
                      }}
                    >
                      {p.isSeminal && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#fef3c7', color: '#92400e', fontSize: '0.72rem', fontWeight: '800', padding: '0.15rem 0.5rem', borderRadius: '9999px', marginBottom: '0.4rem' }}>
                          <Award size={12} />
                          Seminal / Kurucu Makale ({p.citationCount} atıf)
                        </div>
                      )}
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-navy)', marginBottom: '0.3rem' }}>
                        {p.title}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                        {(p.authors || []).slice(0, 2).join(', ')} • {p.year} • {p.journal}
                      </div>
                      <button 
                        onClick={() => loadSnowball(p)}
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                      >
                        Buna Snowball Yap ➔
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Forward Citations */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.6rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', color: 'var(--primary)' }}>
                <ArrowRight size={20} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--accent-navy)' }}>
                  İleriye Doğru Atıflar (Yeni Gelişmeler)
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                Bu makaleyi baz alarak konuyu ileri taşıyan en güncel ve en çok atıf alan çalışmalar:
              </p>

              {snowballData.forwardCitations.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Bu çalışma henüz açık grafikte atıf almamış.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {snowballData.forwardCitations.map(p => (
                    <div 
                      key={p.id}
                      style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-navy)', marginBottom: '0.3rem' }}>
                        {p.title}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                        {(p.authors || []).slice(0, 2).join(', ')} • {p.year} • {p.citationCount} atıf
                      </div>
                      <button 
                        onClick={() => loadSnowball(p)}
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                      >
                        Buna Snowball Yap ➔
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <GitFork size={44} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <h3>Atıf Grafı Çıkarmak İçin Bir Makale Seçin</h3>
        </div>
      )}
    </div>
  );
}
