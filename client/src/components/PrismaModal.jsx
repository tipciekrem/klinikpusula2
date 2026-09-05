import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  Download, 
  Copy, 
  Check, 
  RotateCcw, 
  X, 
  Sparkles, 
  FileText, 
  ArrowDown, 
  Info,
  Database,
  Loader2
} from 'lucide-react';
import { downloadPrismaWordDocument } from '../services/api';

export default function PrismaModal({ 
  isOpen, 
  onClose, 
  searchResult = null, 
  currentQuery = '' 
}) {
  const [copied, setCopied] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const svgRef = useRef(null);

  // Compute default initial stats based on current search result
  const defaultTotalHits = searchResult?.federation?.totalGlobalHits || 1420;
  const papersCount = searchResult?.papers?.length || 24;

  const [stats, setStats] = useState({
    pubmedHits: Math.round(defaultTotalHits * 0.42),
    openAlexHits: Math.round(defaultTotalHits * 0.38),
    europePmcHits: Math.round(defaultTotalHits * 0.15),
    dergiParkHits: Math.round(defaultTotalHits * 0.05),
    duplicatesRemoved: Math.round(defaultTotalHits * 0.22),
    recordsScreened: 0,
    recordsExcluded: 0,
    fullTextAssessed: 0,
    fullTextExcludedDesign: 0,
    fullTextExcludedOutcome: 0,
    fullTextExcludedPopulation: 0,
    studiesIncluded: papersCount,
    metaAnalysesIncluded: Math.max(2, Math.round(papersCount * 0.25))
  });

  // Calculate dependent numbers whenever base changes
  useEffect(() => {
    const totalIdentified = Math.max(0, 
      (Number(stats.pubmedHits) || 0) + 
      (Number(stats.openAlexHits) || 0) + 
      (Number(stats.europePmcHits) || 0) + 
      (Number(stats.dergiParkHits) || 0)
    );

    const dup = Math.min(totalIdentified, Math.max(0, Number(stats.duplicatesRemoved) || 0));
    const screened = Math.max(0, totalIdentified - dup);
    
    // Full text cannot exceed records screened, and cannot be less than included studies
    const targetIncluded = Math.max(0, Number(stats.studiesIncluded) || 0);
    const estimatedFT = Math.max(targetIncluded, Math.round(screened * 0.12));
    const fullText = Math.min(screened, estimatedFT);
    const excludedScreened = Math.max(0, screened - fullText);
    
    const safeIncluded = Math.min(fullText, targetIncluded);
    const excludedFT = Math.max(0, fullText - safeIncluded);
    const exDesign = Math.round(excludedFT * 0.45);
    const exOutcome = Math.round(excludedFT * 0.35);
    const exPop = Math.max(0, excludedFT - exDesign - exOutcome);

    setStats(prev => ({
      ...prev,
      recordsScreened: screened,
      recordsExcluded: excludedScreened,
      fullTextAssessed: fullText,
      fullTextExcludedDesign: exDesign,
      fullTextExcludedOutcome: exOutcome,
      fullTextExcludedPopulation: exPop
    }));
  }, [stats.pubmedHits, stats.openAlexHits, stats.europePmcHits, stats.dergiParkHits, stats.duplicatesRemoved, stats.studiesIncluded]);

  if (!isOpen) return null;

  const totalIdentified = (Number(stats.pubmedHits) || 0) + 
                          (Number(stats.openAlexHits) || 0) + 
                          (Number(stats.europePmcHits) || 0) + 
                          (Number(stats.dergiParkHits) || 0);

  const totalFullTextExcluded = (Number(stats.fullTextExcludedDesign) || 0) + 
                                (Number(stats.fullTextExcludedOutcome) || 0) + 
                                (Number(stats.fullTextExcludedPopulation) || 0);

  // Copy table text to clipboard
  const handleCopyText = () => {
    const text = `
PRISMA 2020 AKIŞ ŞEMASI VERİLERİ (${currentQuery || 'Klinik Araştırma'})
============================================================
1. TANIMLAMA (IDENTIFICATION)
   - PubMed / MEDLINE: ${stats.pubmedHits}
   - OpenAlex: ${stats.openAlexHits}
   - Europe PMC: ${stats.europePmcHits}
   - DergiPark / TR Dizin: ${stats.dergiParkHits}
   - Toplam Tanımlanan Kayıt: ${totalIdentified}
   - Ayıklanan Mükerrer (Duplike) Kayıtlar: ${stats.duplicatesRemoved}

2. TARAMA (SCREENING)
   - Başlık ve Özet Bazında Taranan Kayıtlar: ${stats.recordsScreened}
   - Başlık/Özet Dışlama Ölçütlerine Göre Elenenler: ${stats.recordsExcluded}

3. UYGUNLUK (ELIGIBILITY)
   - Tam Metni Değerlendirilen Rapor Sayısı: ${stats.fullTextAssessed}
   - Tam Metin Dışlananlar (Toplam: ${totalFullTextExcluded}):
     * Yetersiz / Uygunsuz Çalışma Tasarımı: ${stats.fullTextExcludedDesign}
     * Hedeflenen Klinik Sonlanım Verisi Eksikliği: ${stats.fullTextExcludedOutcome}
     * Uygun Olmayan Popülasyon / Yaş / Doz: ${stats.fullTextExcludedPopulation}

4. DAHİL EDİLENLER (INCLUDED)
   - Kalitatif Senteze Dahil Edilen Çalışmalar: ${stats.studiesIncluded}
   - Kantitatif Senteze (Meta-Analiz) Dahil Edilenler: ${stats.metaAnalysesIncluded}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download SVG
  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PRISMA_2020_${(currentQuery || 'Akis_Semasi').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.svg`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Download Word (.doc)
  const handleDownloadWord = async () => {
    try {
      setIsDownloadingWord(true);
      await downloadPrismaWordDocument({
        query: currentQuery || 'Klinik_Arastirma',
        stats
      });
    } catch (err) {
      alert('PRISMA Word belgesi indirilemedi: ' + err.message);
    } finally {
      setIsDownloadingWord(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '1050px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--border-light, #e2e8f0)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.4rem 2rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
            }}>
              <Layers size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  PRISMA 2020 Akış Şeması Jeneratörü
                </h3>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#047857',
                  background: '#d1fae5',
                  padding: '0.15rem 0.6rem',
                  borderRadius: '9999px'
                }}>
                  Resmi Tez & Derleme Standardı
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', marginTop: '0.2rem' }}>
                Sistematik derleme ve tezler için arama, ayıklama ve dahil etme şemasını otomatik hesaplayın ve indirin.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={handleCopyText}
              style={{
                background: '#fff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              {copied ? 'Kopyalandı!' : 'Metin Olarak Kopyala'}
            </button>

            <button
              onClick={handleDownloadSVG}
              style={{
                background: '#059669',
                border: 'none',
                color: '#fff',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
              }}
            >
              <Download size={14} />
              Vektörel SVG İndir
            </button>

            <button
              onClick={handleDownloadWord}
              disabled={isDownloadingWord}
              style={{
                background: '#1e40af',
                border: 'none',
                color: '#fff',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: isDownloadingWord ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 6px rgba(30, 64, 175, 0.3)'
              }}
            >
              <FileText size={14} />
              {isDownloadingWord ? 'İndiriliyor...' : 'Word İndir (.doc)'}
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.4rem'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.6rem 2rem', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem' }}>
          {/* Controls & Number Inputs Panel */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            fontSize: '0.85rem'
          }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Database size={16} color="#059669" />
              Sayısal Parametreleri Düzenle
            </h4>

            <div>
              <label style={{ fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                Veritabanı Sonuçları (Tanımlanan):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>PubMed:</span>
                  <input
                    type="number"
                    value={stats.pubmedHits}
                    onChange={e => setStats({ ...stats, pubmedHits: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>OpenAlex:</span>
                  <input
                    type="number"
                    value={stats.openAlexHits}
                    onChange={e => setStats({ ...stats, openAlexHits: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Europe PMC:</span>
                  <input
                    type="number"
                    value={stats.europePmcHits}
                    onChange={e => setStats({ ...stats, europePmcHits: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>DergiPark:</span>
                  <input
                    type="number"
                    value={stats.dergiParkHits}
                    onChange={e => setStats({ ...stats, dergiParkHits: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                Çıkarılan Duplikeler:
              </label>
              <input
                type="number"
                value={stats.duplicatesRemoved}
                onChange={e => setStats({ ...stats, duplicatesRemoved: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                Nihai Dahil Edilen Çalışmalar:
              </label>
              <input
                type="number"
                value={stats.studiesIncluded}
                onChange={e => setStats({ ...stats, studiesIncluded: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '0.8rem', fontSize: '0.78rem', color: '#065f46' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                <Info size={14} />
                PRISMA 2020 Standartları
              </div>
              Bu diyagram, uluslararası tıp dergileri (ICMJE) ve Cochrane derleme kılavuzlarına tam uyumlu 4 aşamalı veri akışını gösterir.
            </div>
          </div>

          {/* PRISMA 2020 Diagram Visual Canvas (SVG) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflowX: 'auto'
          }}>
            <svg
              ref={svgRef}
              viewBox="0 0 620 680"
              width="600"
              height="660"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {/* Definitions */}
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                </marker>
                <linearGradient id="blueBox" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#eff6ff" />
                </linearGradient>
                <linearGradient id="greenBox" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f0fdf4" />
                  <stop offset="100%" stopColor="#dcfce7" />
                </linearGradient>
              </defs>

              {/* Phase 1: IDENTIFICATION */}
              <g id="phase1">
                <rect x="20" y="20" width="120" height="24" rx="4" fill="#2563eb" />
                <text x="80" y="36" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">TANIMLAMA</text>

                {/* Box 1: Databases Identified */}
                <rect x="20" y="55" width="320" height="95" rx="8" fill="url(#blueBox)" stroke="#93c5fd" strokeWidth="1.5" />
                <text x="35" y="75" fill="#1e3a8a" fontSize="11" fontWeight="bold">Veritabanlarından Tanımlanan Kayıtlar</text>
                <text x="35" y="93" fill="#334155" fontSize="10">• PubMed / MEDLINE (n = {stats.pubmedHits})</text>
                <text x="35" y="109" fill="#334155" fontSize="10">• OpenAlex Global (n = {stats.openAlexHits})</text>
                <text x="35" y="125" fill="#334155" fontSize="10">• Europe PMC (n = {stats.europePmcHits}) • DergiPark (n = {stats.dergiParkHits})</text>
                <text x="35" y="141" fill="#1e40af" fontSize="10" fontWeight="bold">Toplam Kayıt: n = {totalIdentified}</text>

                {/* Arrow to Box 2 */}
                <line x1="340" y1="102" x2="395" y2="102" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

                {/* Box 2: Duplicates Removed */}
                <rect x="400" y="70" width="200" height="65" rx="8" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1.5" />
                <text x="410" y="90" fill="#9f1239" fontSize="10" fontWeight="bold">Taramadan Önce Elenenler:</text>
                <text x="410" y="108" fill="#881337" fontSize="10">Mükerrer (Duplike) Kayıtlar</text>
                <text x="410" y="124" fill="#9f1239" fontSize="10" fontWeight="bold">(n = {stats.duplicatesRemoved})</text>
              </g>

              {/* Arrow Down to Screening */}
              <line x1="180" y1="150" x2="180" y2="195" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

              {/* Phase 2: SCREENING */}
              <g id="phase2">
                <rect x="20" y="185" width="120" height="24" rx="4" fill="#0284c7" />
                <text x="80" y="201" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">AYIKLAMA</text>

                {/* Box 3: Records Screened */}
                <rect x="20" y="220" width="320" height="65" rx="8" fill="url(#blueBox)" stroke="#93c5fd" strokeWidth="1.5" />
                <text x="35" y="242" fill="#0369a1" fontSize="11" fontWeight="bold">Taranan Kayıtlar (Başlık & Özet)</text>
                <text x="35" y="262" fill="#0f172a" fontSize="11">İncelenen Çalışma Sayısı: <strong>n = {stats.recordsScreened}</strong></text>

                {/* Arrow to Excluded */}
                <line x1="340" y1="252" x2="395" y2="252" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

                {/* Box 4: Records Excluded */}
                <rect x="400" y="220" width="200" height="65" rx="8" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1.5" />
                <text x="410" y="242" fill="#9f1239" fontSize="10" fontWeight="bold">Dışlanan Kayıtlar:</text>
                <text x="410" y="262" fill="#881337" fontSize="10">Başlık/Özet Kriteri Dışı: <strong>n = {stats.recordsExcluded}</strong></text>
              </g>

              {/* Arrow Down to Eligibility */}
              <line x1="180" y1="285" x2="180" y2="330" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

              {/* Phase 3: ELIGIBILITY */}
              <g id="phase3">
                <rect x="20" y="320" width="120" height="24" rx="4" fill="#d97706" />
                <text x="80" y="336" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">UYGUNLUK</text>

                {/* Box 5: Full-text assessed */}
                <rect x="20" y="355" width="320" height="75" rx="8" fill="url(#blueBox)" stroke="#93c5fd" strokeWidth="1.5" />
                <text x="35" y="377" fill="#1e3a8a" fontSize="11" fontWeight="bold">Tam Metni Değerlendirilen Raporlar</text>
                <text x="35" y="397" fill="#0f172a" fontSize="10">Uygunluk İncelemesi: <strong>n = {stats.fullTextAssessed}</strong></text>
                <text x="35" y="415" fill="#64748b" fontSize="9.5">Tam metin erişim ve yöntem doğrulaması</text>

                {/* Arrow to Full-text Excluded */}
                <line x1="340" y1="392" x2="395" y2="392" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

                {/* Box 6: Full-text Excluded with reasons */}
                <rect x="400" y="340" width="200" height="105" rx="8" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1.5" />
                <text x="410" y="360" fill="#9f1239" fontSize="10" fontWeight="bold">Dışlanan Tam Metinler (n = {totalFullTextExcluded}):</text>
                <text x="410" y="378" fill="#475569" fontSize="9.5">• Tasarım Uygunsuzluğu (n = {stats.fullTextExcludedDesign})</text>
                <text x="410" y="396" fill="#475569" fontSize="9.5">• Yetersiz Sonlanım Verisi (n = {stats.fullTextExcludedOutcome})</text>
                <text x="410" y="414" fill="#475569" fontSize="9.5">• Hedef Popülasyon Dışı (n = {stats.fullTextExcludedPopulation})</text>
              </g>

              {/* Arrow Down to Included */}
              <line x1="180" y1="430" x2="180" y2="475" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

              {/* Phase 4: INCLUDED */}
              <g id="phase4">
                <rect x="20" y="465" width="120" height="24" rx="4" fill="#059669" />
                <text x="80" y="481" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">DAHİL EDİLEN</text>

                {/* Box 7: Studies included */}
                <rect x="20" y="500" width="320" height="110" rx="8" fill="url(#greenBox)" stroke="#86efac" strokeWidth="2" />
                <text x="35" y="525" fill="#065f46" fontSize="12" fontWeight="bold">Derlemeye Dahil Edilen Çalışmalar</text>
                <text x="35" y="548" fill="#0f172a" fontSize="11">Sentezlenen Klinik Çalışma Sayısı: <strong>n = {stats.studiesIncluded}</strong></text>
                <text x="35" y="568" fill="#047857" fontSize="10.5">• Nicel Sentez / Meta-Analiz: <strong>n = {stats.metaAnalysesIncluded}</strong></text>
                <text x="35" y="588" fill="#047857" fontSize="10.5">• Nitel Konsensüs ve Cochrane RoB 2 Matrisi: <strong>n = {stats.studiesIncluded}</strong></text>
              </g>

              {/* Diagram Footer */}
              <text x="310" y="650" fill="#94a3b8" fontSize="9.5" textAnchor="middle">
                PRISMA 2020 Akış Şeması • KlinikPusula (Dr. Ekrem Kasapoğlu) Tarafından Oluşturulmuştur
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
