import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  X, 
  Search, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle, 
  Check, 
  Layers,
  Users,
  Pill,
  Scale,
  Activity
} from 'lucide-react';

export default function PicoSearchModal({ isOpen, onClose, onSearch }) {
  const [population, setPopulation] = useState('');
  const [intervention, setIntervention] = useState('');
  const [comparison, setComparison] = useState('');
  const [outcome, setOutcome] = useState('');
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  if (!isOpen) return null;

  // NLP rule-based smart parser for free-form clinical questions
  const handleAutoParse = () => {
    if (!rawText.trim()) return;
    setIsParsing(true);

    setTimeout(() => {
      let text = rawText.trim();
      let p = '', i = '', c = '', o = '';

      // 1. Comparison detection (vs, kıyasla, göre, karşı, versus, compared to)
      const compMatch = text.match(/(?:kıyasla|kıyasla\s+olarak|karşılaştırmalı|karşı|göre|versus|\bvs\.?\b|compared\s+to|in\s+comparison\s+with)\s+([^,.\n;]+?)(?=\s+(?:üzerindeki|açısından|etkisi|faydası|sonuçları|oranı|sağlar\s+mı|azaltır\s+mı|etkinliği)|[.,;]|$)/i);
      if (compMatch) {
        c = compMatch[1].replace(/^(?:olan|ile)\s+/i, '').trim();
      }

      // 2. Intervention detection (tedavisi, kullanımı, ilacı, müdahalesi, therapy, treatment)
      const intMatch = text.match(/([a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s\/-]+?)\s+(?:tedavisi|kullanımı|uygulaması|tedavisinin|ilacı|müdahalesi|therapy|treatment|use|intervention|administration)/i);
      if (intMatch) {
        i = intMatch[1]
          .replace(/^(?:hastalarda|bireylerde|hastalarında|erişkinlerde|çocuklarda)\s+/i, '')
          .replace(/^(?:veya|ile|ve)\s+/i, '')
          .trim();
      }

      // 3. Population detection (hastalarında, olgularında, bireylerde, popülasyonunda, patients, adults)
      const popMatch = text.match(/([a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s\/-]+?)\s+(?:hastalarında|hastalarında\s+olan|olgularında|tanılı\s+bireylerde|tanısı\s+almış|popülasyonunda|hastalarda|erişkinlerde|çocuklarda|kohortunda|patients|adults|individuals|cohort)/i);
      if (popMatch) {
        p = popMatch[1]
          .replace(/^(?:h1:|h2:|soru:|araştırma:|klinik\s+soru:)\s*/i, '')
          .replace(/^(?:yetişkin|erişkin)\s+/i, 'Yetişkin ')
          .trim();
      }

      // 4. Outcome detection (mortalite, azalma, iyileşme, kontrolü, riski, outcome, reduction)
      const outMatch = text.match(/(?:üzerindeki|açısından|yönünden|etkisiyle|bakımından|hedefleyen)\s+([^,.\n?;]+?)(?=\s+(?:etkisi|nedir|sağlar\s+mı|üstün\s+müdür|azaltır\s+mı)|[?.,;]|$)/i) ||
                       text.match(/([a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s\/-]+?\s+(?:mortalite|mace|hba1c|kilo\s+kaybı|iyileşme|remisyon|sağkalım|azalması|artışı|riski|olayları|kontrolü))/i);
      if (outMatch) {
        o = outMatch[1].trim();
      }

      // Fallback heuristics if regex missed
      const lower = text.toLowerCase();
      if (!p) {
        if (lower.includes('diyabet') || lower.includes('t2d')) p = 'Tip 2 Diyabet Hastaları';
        else if (lower.includes('obez') || lower.includes('vki')) p = 'Obezite Tanılı Bireyler';
        else if (lower.includes('kalp yetmezliği') || lower.includes('hfpef')) p = 'Kalp Yetmezliği Olguları';
        else if (lower.includes('hipertansiyon')) p = 'Esansiyel Hipertansiyon Hastaları';
        else if (lower.includes('kanser') || lower.includes('malign')) p = 'Onkoloji Hastaları';
        else if (lower.includes('kronik böbrek') || lower.includes('kbh')) p = 'Kronik Böbrek Hastaları';
      }

      if (!i) {
        if (lower.includes('tirzepatid')) i = 'Tirzepatid';
        else if (lower.includes('semaglutid')) i = 'Semaglutid';
        else if (lower.includes('metformin')) i = 'Metformin';
        else if (lower.includes('sglt2') || lower.includes('empagliflozin')) i = 'SGLT2 İnhibitörleri';
        else if (lower.includes('aspirin')) i = 'Aspirin Tedavisi';
        else if (lower.includes('statin')) i = 'Statin Tedavisi';
      }

      if (!c) {
        if (lower.includes('plasebo')) c = 'Plasebo';
        else if (lower.includes('standart tedavi')) c = 'Standart Tedavi';
        else if (lower.includes('sulfonilüre')) c = 'Sulfonilüre';
      }

      if (!o) {
        if (lower.includes('mortalite') || lower.includes('ölüm')) o = 'Tüm Nedenlere Bağlı Mortalite';
        else if (lower.includes('kilo') || lower.includes('ağırlık')) o = 'Vücut Ağırlığı Değişimi (%)';
        else if (lower.includes('hba1c') || lower.includes('glisemik')) o = 'HbA1c Düzeyinde Düşüş';
        else if (lower.includes('mace') || lower.includes('kardiyovasküler')) o = 'Kardiyovasküler Olay Riski (MACE)';
        else if (lower.includes('sağkalım')) o = 'Genel Sağkalım (OS)';
      }

      if (p) setPopulation(p);
      if (i) setIntervention(i);
      if (c) setComparison(c);
      if (o) setOutcome(o);

      setIsParsing(false);
    }, 250);
  };

  // Build combined academic boolean query
  const buildPicoQuery = () => {
    const parts = [];
    if (population.trim()) parts.push(`(${population.trim()})`);
    if (intervention.trim()) parts.push(`(${intervention.trim()})`);
    if (comparison.trim() && !comparison.toLowerCase().includes('plasebo')) {
      parts.push(`(${comparison.trim()})`);
    }
    if (outcome.trim()) parts.push(`(${outcome.trim()})`);
    return parts.join(' AND ');
  };

  const handleLaunchSearch = (e) => {
    e.preventDefault();
    const query = buildPicoQuery();
    if (!query) return;

    onSearch(query, {
      pico: {
        population: population.trim(),
        intervention: intervention.trim(),
        comparison: comparison.trim(),
        outcome: outcome.trim()
      }
    });
    onClose();
  };

  const handleClear = () => {
    setPopulation('');
    setIntervention('');
    setComparison('');
    setOutcome('');
    setRawText('');
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
        maxWidth: '860px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--border-light, #e2e8f0)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.6rem 2rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>
              <Target size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' }}>
                  PICO Akıllı Klinik Soru Yapılandırıcısı
                </h3>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  background: '#dbeafe',
                  padding: '0.15rem 0.6rem',
                  borderRadius: '9999px'
                }}>
                  Kanıta Dayalı Tıp Standardı
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                Araştırma sorunuzu 4 boyutta yapılandırarak en hassas kanıtları ve klinik çalışmaları hedefleyin.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.8rem 2rem' }}>
          {/* Quick NLP Auto-Parser Bar */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px dashed #cbd5e1',
            borderRadius: '14px',
            padding: '1.2rem 1.4rem',
            marginBottom: '1.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={15} style={{ color: '#2563eb' }} />
                Serbest Klinik Sorunuzdan Otomatik PICO Çıkarın
              </label>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Örnek veya hipotez yapıştırın</span>
            </div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <input
                type="text"
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Örn: Tip 2 diyabet hastalarında tirzepatid kullanımının semaglutide kıyasla HbA1c ve kilo kaybı üzerindeki etkisi nedir?"
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: '#fff'
                }}
                onKeyDown={e => { if (e.key === 'Enter') handleAutoParse(); }}
              />
              <button
                type="button"
                onClick={handleAutoParse}
                disabled={isParsing || !rawText.trim()}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.65rem 1.2rem',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: rawText.trim() ? 'pointer' : 'not-allowed',
                  opacity: rawText.trim() ? 1 : 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {isParsing ? 'Ayrıştırılıyor...' : '✨ PICO’ya Dönüştür'}
              </button>
            </div>
          </div>

          {/* 4 PICO Grid Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.6rem' }}>
            {/* P: Population */}
            <div style={{
              background: '#fff',
              border: '1px solid #bfdbfe',
              borderRadius: '14px',
              padding: '1.2rem',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ background: '#2563eb', color: '#fff', fontWeight: 800, fontSize: '0.75rem', width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>P</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e3a8a' }}>Popülasyon / Hasta</span>
                </div>
                <Users size={16} style={{ color: '#3b82f6' }} />
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', marginBottom: '0.6rem' }}>
                Hangi hasta grubu, yaş, klinik evre veya sağlık sorunu?
              </p>
              <input
                type="text"
                value={population}
                onChange={e => setPopulation(e.target.value)}
                placeholder="Örn: Tip 2 Diyabetli ve Obez Erişkinler"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.6rem' }}>
                {['Tip 2 Diyabet', 'Kalp Yetmezliği', 'Obezite', 'Aksiyel Spondiloartrit'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setPopulation(tag)}
                    style={{ background: '#eff6ff', border: '1px solid #dbeafe', color: '#1e40af', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* I: Intervention */}
            <div style={{
              background: '#fff',
              border: '1px solid #bbf7d0',
              borderRadius: '14px',
              padding: '1.2rem',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ background: '#16a34a', color: '#fff', fontWeight: 800, fontSize: '0.75rem', width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>I</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#065f46' }}>Müdahale / İlaç</span>
                </div>
                <Pill size={16} style={{ color: '#10b981' }} />
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', marginBottom: '0.6rem' }}>
                İncelenen etken madde, cerrahi yöntem veya tanı aracı?
              </p>
              <input
                type="text"
                value={intervention}
                onChange={e => setIntervention(e.target.value)}
                placeholder="Örn: Tirzepatid veya Semaglutid"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.6rem' }}>
                {['Tirzepatid', 'Semaglutid', 'Empagliflozin', 'Resmetirom'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setIntervention(tag)}
                    style={{ background: '#f0fdf4', border: '1px solid #dcfce7', color: '#166534', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* C: Comparison */}
            <div style={{
              background: '#fff',
              border: '1px solid #fde68a',
              borderRadius: '14px',
              padding: '1.2rem',
              boxShadow: '0 2px 4px rgba(245, 158, 11, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ background: '#d97706', color: '#fff', fontWeight: 800, fontSize: '0.75rem', width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>C</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#92400e' }}>Karşılaştırma / Kontrol</span>
                </div>
                <Scale size={16} style={{ color: '#f59e0b' }} />
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', marginBottom: '0.6rem' }}>
                Plasebo, standart bakım (SOC) veya rakip ilaç?
              </p>
              <input
                type="text"
                value={comparison}
                onChange={e => setComparison(e.target.value)}
                placeholder="Örn: Plasebo veya Standart Tedavi"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.6rem' }}>
                {['Plasebo', 'Standart Tedavi (SOC)', 'Metformin', 'Aktif Kontrol'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setComparison(tag)}
                    style={{ background: '#fffbeb', border: '1px solid #fef3c7', color: '#92400e', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* O: Outcome */}
            <div style={{
              background: '#fff',
              border: '1px solid #e9d5ff',
              borderRadius: '14px',
              padding: '1.2rem',
              boxShadow: '0 2px 4px rgba(139, 92, 246, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ background: '#7c3aed', color: '#fff', fontWeight: 800, fontSize: '0.75rem', width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>O</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#5b21b6' }}>Klinik Sonlanım</span>
                </div>
                <Activity size={16} style={{ color: '#8b5cf6' }} />
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', marginBottom: '0.6rem' }}>
                Ölçülen primer/sekonder sonuç (mortalite, HbA1c, remisyon)?
              </p>
              <input
                type="text"
                value={outcome}
                onChange={e => setOutcome(e.target.value)}
                placeholder="Örn: Kardiyovasküler Mortalite & HbA1c"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.6rem' }}>
                {['Kardiyovasküler Mortalite', 'MACE Olayları', 'HbA1c Düşüşü', 'Kilo Kaybı'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setOutcome(tag)}
                    style={{ background: '#faf5ff', border: '1px solid #f3e8ff', color: '#6b21a8', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Live Boolean Preview */}
          <div style={{
            background: '#0f172a',
            color: '#f8fafc',
            borderRadius: '12px',
            padding: '1rem 1.4rem',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.6rem'
          }}>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>PICO Boolean Sorgusu: </span>
              <span>{buildPicoQuery() || 'Henüz PICO alanları doldurulmadı...'}</span>
            </div>
            {buildPicoQuery() && (
              <span style={{ background: '#1e293b', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
                Akademik Filtreli
              </span>
            )}
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: 'transparent',
                border: '1px solid #cbd5e1',
                color: '#64748b',
                borderRadius: '10px',
                padding: '0.6rem 1.2rem',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <RotateCcw size={15} />
              Temizle
            </button>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  color: '#475569',
                  borderRadius: '10px',
                  padding: '0.6rem 1.4rem',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleLaunchSearch}
                disabled={!buildPicoQuery()}
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '0.6rem 1.6rem',
                  fontSize: '0.9rem',
                  cursor: buildPicoQuery() ? 'pointer' : 'not-allowed',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: buildPicoQuery() ? 1 : 0.6
                }}
              >
                <Search size={16} />
                PICO ile Klinik Aramayı Başlat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
