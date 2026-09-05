import React from 'react';
import { 
  Search, 
  Table, 
  GitFork, 
  FileCheck, 
  BookOpen, 
  Sparkles,
  Upload,
  Stethoscope,
  Globe
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  savedPapersCount = 0,
  onOpenUploadDoc,
  searchMode = 'all',
  setSearchMode
}) {
  const isMedical = searchMode === 'medical';

  return (
    <header className="header">
      <div className="header-inner" style={{ maxWidth: '1440px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div className="logo-group" onClick={() => setActiveTab('search')} style={{ cursor: 'pointer' }}>
            <div className="logo-badge" style={{ 
              background: '#ffffff', 
              border: isMedical ? '1.5px solid #0284c7' : '1.5px solid #0f766e', 
              padding: '2px', 
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(13, 148, 136, 0.25)'
            }}>
              <img src="/klinik-pusula-icon.png" alt="Klinik Pusula" style={{ width: '100%', height: '100%', borderRadius: '7px', objectFit: 'cover' }} />
            </div>
            <div className="logo-text" style={{ letterSpacing: '-0.5px' }}>klinikpusula</div>
            <span className="logo-tag" style={{ background: isMedical ? '#e0f2fe' : '#ccfbf1', color: isMedical ? '#0369a1' : '#0f766e', fontWeight: '800' }}>
              {isMedical ? 'DR. EKREM KASAPOĞLU • KLİNİK PUSULA' : 'DR. EKREM KASAPOĞLU • KLİNİK PUSULA PRO'}
            </span>
          </div>

          {/* Mode Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f1f5f9',
            padding: '0.2rem',
            borderRadius: '9999px',
            border: '1px solid var(--border-light)'
          }}>
            <button
              onClick={() => setSearchMode('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: '700',
                background: !isMedical ? '#ffffff' : 'transparent',
                color: !isMedical ? 'var(--accent-navy)' : 'var(--text-muted)',
                boxShadow: !isMedical ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease'
              }}
              title="Mühendislik, Sosyal Bilimler, Fen, Eğitim ve tüm akademik disiplinler (250M+)"
            >
              <Globe size={13} />
              <span>Tüm Bilimler</span>
            </button>

            <button
              onClick={() => setSearchMode('medical')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: '700',
                background: isMedical ? '#0284c7' : 'transparent',
                color: isMedical ? '#ffffff' : 'var(--text-muted)',
                boxShadow: isMedical ? '0 1px 3px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
              title="Europe PMC 44M+, PubMed / MEDLINE 36M+, 8M+ Klinik Vaka Raporu ve Klinik Deneyler"
            >
              <Stethoscope size={13} />
              <span>Tıp Modu (AI PubMed)</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <nav className="nav-links" style={{ gap: '0.35rem', flexWrap: 'wrap' }}>
            <button 
              className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              <Search size={15} />
              <span>Arama</span>
            </button>

            <button 
              className={`nav-btn ${activeTab === 'matrix' ? 'active' : ''}`}
              onClick={() => setActiveTab('matrix')}
            >
              <Table size={15} />
              <span>Çalışma Matrisi</span>
              <span style={{ fontSize: '0.65rem', background: '#dbeafe', color: '#1e40af', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: '700' }}>PRO</span>
            </button>

            <button 
              className={`nav-btn ${activeTab === 'graph' ? 'active' : ''}`}
              onClick={() => setActiveTab('graph')}
            >
              <GitFork size={15} />
              <span>Atıf Grafı</span>
              <span style={{ fontSize: '0.65rem', background: '#dbeafe', color: '#1e40af', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: '700' }}>PRO</span>
            </button>

            <button 
              className={`nav-btn ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              <FileCheck size={15} />
              <span>Metin Denetimi</span>
              <span style={{ fontSize: '0.65rem', background: '#dbeafe', color: '#1e40af', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: '700' }}>PRO</span>
            </button>

            <button 
              className={`nav-btn ${activeTab === 'thesis' ? 'active' : ''}`}
              onClick={() => setActiveTab('thesis')}
            >
              <BookOpen size={15} />
              <span>Tez Kütüphanem</span>
              {savedPapersCount > 0 && (
                <span className="thesis-badge-count">{savedPapersCount}</span>
              )}
            </button>

            <button 
              className={`nav-btn ${activeTab === 'hypothesis' ? 'active' : ''}`}
              onClick={() => setActiveTab('hypothesis')}
            >
              <Sparkles size={15} />
              <span>Hipotez</span>
            </button>

            <button
              className="nav-btn"
              onClick={onOpenUploadDoc}
              style={{ background: '#f8fafc', border: '1px solid var(--border-light)' }}
              title="Özel PDF / Tez Notu Yükle"
            >
              <Upload size={14} />
              <span>Belge Yükle</span>
            </button>
          </nav>

          {/* Top-Right Badge: Dr. Ekrem Kasapoğlu */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              background: 'linear-gradient(135deg, #f0fdf4, #ffffff)',
              padding: '0.32rem 0.8rem',
              borderRadius: '9999px',
              border: '1.5px solid #86efac',
              boxShadow: '0 2px 5px rgba(16, 185, 129, 0.15)',
              marginLeft: '0.4rem',
              flexShrink: 0
            }}
            title="Dr. Ekrem Kasapoğlu - Bilimsel Danışman & Araştırmacı Hekim"
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #059669, #0284c7)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.82rem',
              fontWeight: '800'
            }}>
              🩺
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.15' }}>
                Dr. Ekrem Kasapoğlu
              </span>
              <span style={{ fontSize: '0.64rem', color: '#059669', fontWeight: '700', letterSpacing: '0.2px' }}>
                Hekim & Araştırmacı
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
