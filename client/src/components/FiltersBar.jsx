import React from 'react';
import { SlidersHorizontal, FileText, Stethoscope, Award, Users } from 'lucide-react';

const UNIVERSAL_STUDY_TYPES = [
  { label: 'Tümü', value: 'all' },
  { label: 'Meta-Analysis', value: 'Meta-Analysis' },
  { label: 'Systematic Review', value: 'Systematic Review' },
  { label: 'RCT / Deneysel', value: 'Randomized Controlled Trial' },
  { label: 'Cohort / Gözlemsel', value: 'Cohort Study' }
];

const EBM_EVIDENCE_LEVELS = [
  { label: 'Tüm Kanıtlar', value: 'all' },
  { label: 'Meta-Analiz & Derleme', value: 'meta' },
  { label: 'RCT / Klinik Deney', value: 'rct' },
  { label: 'Vaka Raporu (Case Report)', value: 'case_report' },
  { label: 'Sadece İnsan (Human)', value: 'human' }
];

const MEDICAL_SPECIALTIES_LIST = [
  { label: 'Tüm Tıp Uzmanlıkları', value: 'all' },
  { label: 'Kardiyoloji & Kalp', value: 'cardiology' },
  { label: 'Nöroloji & Beyin', value: 'neurology' },
  { label: 'Onkoloji & Kanser', value: 'oncology' },
  { label: 'Endokrinoloji & Diyabet', value: 'endocrinology' },
  { label: 'Göğüs Hastalıkları & Uyku', value: 'pulmonology' },
  { label: 'Psikiyatri & Ruh Sağlığı', value: 'psychiatry' },
  { label: 'Pediatri & Çocuk', value: 'pediatrics' },
  { label: 'Farmakoloji & İlaç', value: 'pharmacology' }
];

export default function FiltersBar({ 
  totalResults,
  totalGlobalHits,
  displayedCount,
  studyType, 
  setStudyType, 
  yearFilter, 
  setYearFilter, 
  minCitations, 
  setMinCitations,
  onlyOA,
  setOnlyOA,
  searchMode = 'all',
  medicalSpecialty = 'all',
  setMedicalSpecialty,
  evidenceLevel = 'all',
  setEvidenceLevel,
  globalTurkishMode = false,
  setGlobalTurkishMode,
  sourceFilter = 'all',
  setSourceFilter
}) {
  const isMedical = searchMode === 'medical';
  const formattedGlobal = totalGlobalHits ? totalGlobalHits.toLocaleString() : (totalResults ? totalResults.toLocaleString() : '0');

  return (
    <div className="filters-bar" style={{ background: isMedical ? '#f0f9ff' : '#ffffff', borderRadius: '12px', padding: '1rem', border: isMedical ? '1px solid #bae6fd' : '1px solid var(--border-light)' }}>
      <div className="filters-left" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isMedical ? '#0369a1' : 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>
          {isMedical ? <Stethoscope size={16} /> : <SlidersHorizontal size={15} />}
          <span>{isMedical ? 'Tıp Filtreleri:' : 'Filtrele:'}</span>
        </div>

        {/* Global Turkish Translation Switch */}
        <button
          onClick={() => setGlobalTurkishMode && setGlobalTurkishMode(!globalTurkishMode)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.8rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: '800',
            cursor: 'pointer',
            background: globalTurkishMode ? '#10b981' : '#f0fdf4',
            color: globalTurkishMode ? '#ffffff' : '#047857',
            border: globalTurkishMode ? '1px solid #059669' : '1px solid #a7f3d0',
            boxShadow: globalTurkishMode ? '0 2px 4px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
          title="Tüm yabancı makale başlıklarını ve ana çıkarımlarını otomatik olarak Türkçeye çevir"
        >
          <span>🇹🇷</span>
          <span>{globalTurkishMode ? 'Tüm Sonuçlar Türkçe (Aktif)' : 'Tümünü Türkçe Göster'}</span>
        </button>

        {/* Quick TR Dizin / DergiPark Filter Toggle */}
        <button
          onClick={() => setSourceFilter && setSourceFilter(sourceFilter === 'dergipark' ? 'all' : 'dergipark')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.8rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: '800',
            cursor: 'pointer',
            background: sourceFilter === 'dergipark' ? '#4338ca' : '#eef2ff',
            color: sourceFilter === 'dergipark' ? '#ffffff' : '#4338ca',
            border: sourceFilter === 'dergipark' ? '1px solid #3730a3' : '1px solid #c7d2fe',
            boxShadow: sourceFilter === 'dergipark' ? '0 2px 4px rgba(67, 56, 202, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
          title="Sadece TÜBİTAK ULAKBİM TR Dizin ve DergiPark indeksli Türkiye tıp literatürünü filtrele"
        >
          <span>🏛️</span>
          <span>{sourceFilter === 'dergipark' ? 'Sadece TR Dizin (Aktif)' : 'TR Dizin / DergiPark'}</span>
        </button>

        {/* Academic Source Filter */}
        <select
          className="filter-select"
          value={sourceFilter}
          onChange={(e) => setSourceFilter && setSourceFilter(e.target.value)}
          style={{ fontWeight: '700', color: sourceFilter !== 'all' ? '#4338ca' : undefined }}
          title="Veritabanı kaynağına göre filtrele"
        >
          <option value="all">Tüm Kaynaklar (250M+ S2, PubMed, OpenAlex, DergiPark)</option>
          <option value="dergipark">🇹🇷 DergiPark & TR Dizin (Türkiye Akademik Arşivi)</option>
          <option value="s2">🧠 Semantic Scholar AI (210M+)</option>
          <option value="pubmed">🩺 PubMed & Europe PMC (44M+)</option>
        </select>

        {/* Study Types / EBM Levels */}
        {isMedical ? (
          EBM_EVIDENCE_LEVELS.map((ebm) => (
            <button
              key={ebm.value}
              className={`filter-chip ${evidenceLevel === ebm.value ? 'active' : ''}`}
              style={{
                background: evidenceLevel === ebm.value ? '#0284c7' : undefined,
                borderColor: evidenceLevel === ebm.value ? '#0284c7' : undefined
              }}
              onClick={() => setEvidenceLevel(ebm.value)}
            >
              {ebm.label}
            </button>
          ))
        ) : (
          UNIVERSAL_STUDY_TYPES.map((t) => (
            <button
              key={t.value}
              className={`filter-chip ${studyType === t.value ? 'active' : ''}`}
              onClick={() => setStudyType(t.value)}
            >
              {t.label}
            </button>
          ))
        )}

        {/* Medical Specialty Dropdown */}
        {isMedical && (
          <select 
            className="filter-select"
            value={medicalSpecialty}
            onChange={(e) => setMedicalSpecialty(e.target.value)}
            style={{ border: '1px solid #7dd3fc', fontWeight: '600', color: '#0369a1' }}
          >
            {MEDICAL_SPECIALTIES_LIST.map(spec => (
              <option key={spec.value} value={spec.value}>{spec.label}</option>
            ))}
          </select>
        )}

        {/* Publication Year */}
        <select 
          className="filter-select"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="all">Tüm Yıllar</option>
          <option value="last3">Son 3 Yıl (2023-2026)</option>
          <option value="last5">Son 5 Yıl (2021-2026)</option>
          <option value="last10">Son 10 Yıl (2016-2026)</option>
        </select>

        {/* Open Access Toggle */}
        <button 
          className={`filter-chip ${onlyOA ? 'active' : ''}`}
          onClick={() => setOnlyOA(!onlyOA)}
          title="Sadece doğrudan tam metin PDF bağlantısı olan makaleler"
        >
          <FileText size={13} style={{ display: 'inline', marginRight: '4px' }} />
          Sadece PDF'li
        </button>
      </div>

      <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
        <div style={{ fontSize: '0.9rem', color: isMedical ? '#0369a1' : 'var(--accent-navy)', fontWeight: '800' }}>
          {isMedical ? '🩺 Tıp Literatüründen ' : '🌐 250M+ Havuzdan '}
          <span style={{ color: isMedical ? '#0284c7' : 'var(--primary)' }}>{formattedGlobal}</span> Makale Bulundu
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {isMedical 
            ? `(Europe PMC 44M • PubMed 36M • S2 210M • DergiPark 🇹🇷 | Gösterilen: ${displayedCount})`
            : `(OpenAlex 250M • Semantic Scholar 210M • DergiPark 🇹🇷 • PubMed | Gösterilen: ${displayedCount})`
          }
        </div>
      </div>
    </div>
  );
}
