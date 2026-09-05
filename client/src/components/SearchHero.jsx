import React, { useState } from 'react';
import { Search, ArrowRight, Stethoscope, Globe, Target } from 'lucide-react';
import PicoSearchModal from './PicoSearchModal';

const UNIVERSAL_EXAMPLES = [
  'Yapay zeka araçlarının lisansüstü tez yazımına etkisi',
  'Does remote work improve worker productivity in tech?',
  'Reinforcement learning in autonomous driving systems',
  'Impact of sleep deprivation on executive cognitive function',
  'Renewable energy integration in smart grid networks'
];

const MEDICAL_EXAMPLES = [
  'GLP-1 receptor agonists cardiovascular outcomes in type 2 diabetes',
  'Metformin and healthy lifespan longevity mechanisms',
  'Immunotherapy combination in triple-negative breast cancer',
  'Monoclonal antibodies efficacy in early Alzheimer disease',
  'Early goal-directed therapy protocols in severe sepsis management'
];

export default function SearchHero({ onSearch, isLoading, searchMode = 'all' }) {
  const [query, setQuery] = useState('');
  const [showPicoModal, setShowPicoModal] = useState(false);
  const isMedical = searchMode === 'medical';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    onSearch(example);
  };

  const activeExamples = isMedical ? MEDICAL_EXAMPLES : UNIVERSAL_EXAMPLES;

  return (
    <section className="search-hero">
      {isMedical ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#e0f2fe', color: '#0369a1', padding: '0.3rem 0.9rem', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: '800', marginBottom: '1rem' }}>
          <Stethoscope size={15} />
          KLİNİK PUSULA MEDİKAL (AI PUBMED) • DR. EKREM KASAPOĞLU
        </div>
      ) : (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#ccfbf1', color: '#0f766e', padding: '0.3rem 0.9rem', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: '800', marginBottom: '1rem' }}>
          <Globe size={15} />
          KLİNİK PUSULA TÜM BİLİMLER (250M+) • BİLİMSEL LİTERATÜR & TEZ PLATFORMU
        </div>
      )}

      <h1 className="hero-title">
        {isMedical ? (
          <>Tüm Tıp Literatürünü Arayın. <span>Klinik Kanıtları Alın.</span></>
        ) : (
          <>Tüm Bilim Dalları. <span>250 Milyon Araştırma.</span></>
        )}
      </h1>
      <p className="hero-subtitle">
        {isMedical ? (
          'KlinikPusula Medikal: 44.000.000+ Europe PMC & PubMed / MEDLINE, 8M+ vaka raporu ve klinik deney protokollerini anında tarayın.'
        ) : (
          'KlinikPusula (Dr. Ekrem Kasapoğlu): Tıp, Mühendislik, Sosyal Bilimler, Eğitim ve Fen alanında 250 milyondan fazla hakemli makaleyi tarayın.'
        )}
      </p>

      <div className="search-bar-wrapper">
        <form className="search-input-form" onSubmit={handleSubmit}>
          {isMedical ? <Stethoscope size={22} className="search-icon" color="#0284c7" /> : <Search size={22} className="search-icon" />}
          <input
            type="text"
            className="search-input"
            placeholder={isMedical 
              ? "Klinik bir soru, ilaç veya hastalık yazın (örn: GLP-1 cardiovascular outcomes)..."
              : "Herhangi bir bilimsel araştırma sorusu veya hipotez yazın (örn: Does creatine improve memory?)..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="search-submit-btn"
            style={{ background: isMedical ? '#0284c7' : undefined }}
            disabled={isLoading || !query.trim()}
          >
            <span>{isLoading ? 'Taranıyor...' : 'Ara'}</span>
            <Search size={17} />
          </button>
        </form>
      </div>

      {/* PICO Clinical Search Trigger */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.8rem' }}>
        <button
          type="button"
          onClick={() => setShowPicoModal(true)}
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1.5px solid #93c5fd',
            color: '#1d4ed8',
            borderRadius: '9999px',
            padding: '0.42rem 1.1rem',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 5px rgba(37, 99, 235, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          <Target size={16} />
          🎯 PICO Akıllı Klinik Soru Yapılandırıcısı (Popülasyon • Müdahale • Kontrol • Sonuç)
        </button>
      </div>

      <PicoSearchModal
        isOpen={showPicoModal}
        onClose={() => setShowPicoModal(false)}
        onSearch={(picoQuery, meta) => {
          onSearch(picoQuery, undefined, meta);
        }}
      />

      {/* Live Academic Database Federation Indicators */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        margin: '0.8rem auto 1.2rem',
        fontSize: '0.8rem',
        color: '#475569',
        flexWrap: 'wrap'
      }}>
        {isMedical ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#eff6ff', padding: '0.2rem 0.65rem', borderRadius: '9999px', border: '1px solid #bfdbfe' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0284c7' }}></span>
              <span><strong>Europe PMC:</strong> 44M+ Biyomedikal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#eff6ff', padding: '0.2rem 0.65rem', borderRadius: '9999px', border: '1px solid #bfdbfe' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6' }}></span>
              <span><strong>PubMed / MEDLINE:</strong> 36M+ Klinik</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#fef3c7', padding: '0.2rem 0.65rem', borderRadius: '9999px', border: '1px solid #fde68a' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#d97706' }}></span>
              <span><strong>Vaka Raporları:</strong> 8M+ Case Reports</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#ecfdf5', padding: '0.2rem 0.65rem', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
              <span><strong>OpenAlex:</strong> 250M+ Küresel Makale</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#eff6ff', padding: '0.2rem 0.65rem', borderRadius: '9999px', border: '1px solid #bfdbfe' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6' }}></span>
              <span><strong>PubMed & Tıp:</strong> 36M+</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#faf5ff', padding: '0.2rem 0.65rem', borderRadius: '9999px', border: '1px solid #e9d5ff' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#a855f7' }}></span>
              <span><strong>arXiv & Mühendislik:</strong> 2.4M+</span>
            </div>
          </>
        )}
      </div>

      <div className="example-questions">
        <span className="example-label">{isMedical ? 'Örnek tıp soruları:' : 'Örnek tez soruları:'}</span>
        {activeExamples.map((q, idx) => (
          <button
            key={idx}
            className="example-pill"
            onClick={() => handleExampleClick(q)}
            type="button"
          >
            {q}
          </button>
        ))}
      </div>
    </section>
  );
}
