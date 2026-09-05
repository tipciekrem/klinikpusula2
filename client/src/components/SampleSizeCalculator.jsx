import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Copy, 
  Check, 
  Info, 
  Users, 
  Sliders, 
  ShieldCheck, 
  FileText, 
  BookmarkPlus,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

import { calculateSampleSize } from '../services/sampleSizeEngine';

export default function SampleSizeCalculator({ currentQuery = '', onSaveToThesis }) {
  const [testType, setTestType] = useState('two_sample_t'); // two_sample_t | chi_square | paired_t | anova | correlation
  const [alpha, setAlpha] = useState(0.05); // 0.01, 0.05, 0.10
  const [power, setPower] = useState(0.80); // 0.80, 0.90, 0.95
  const [effectPreset, setEffectPreset] = useState('medium'); // small, medium, large, custom
  const [customEffect, setCustomEffect] = useState(0.50);
  const [allocationRatio, setAllocationRatio] = useState(1.0); // N2 / N1
  const [dropoutRate, setDropoutRate] = useState(0.10); // 0.10 = 10%
  const [numGroups, setNumGroups] = useState(3); // for ANOVA
  const [prop1, setProp1] = useState(0.40); // for Chi-square Group 1
  const [prop2, setProp2] = useState(0.20); // for Chi-square Group 2
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Calculate sample sizes with hardened boundaries
  const calculation = useMemo(() => {
    return calculateSampleSize({
      testType,
      alpha,
      power,
      effectPreset,
      customEffect,
      allocationRatio,
      dropoutRate,
      numGroups,
      prop1,
      prop2
    });
  }, [testType, alpha, power, effectPreset, customEffect, allocationRatio, dropoutRate, numGroups, prop1, prop2]);

  const effectiveEffect = calculation.effectiveEffect;

  // Construct ready-to-copy Ethics Committee Paragraph
  const ethicsText = useMemo(() => {
    const studyTitle = currentQuery ? `"${currentQuery}" konulu klinik araştırmada` : 'Bu araştırmada';
    const testName = {
      two_sample_t: 'iki bağımsız grup karşılaştırması (Randomize Kontrollü Deney / RKÇ)',
      paired_t: 'eşleştirilmiş t-testi (aynı olgularda tedavi öncesi ve sonrası değişim)',
      chi_square: 'iki bağımsız oranın karşılaştırılması (Ki-Kare testi)',
      anova: `${numGroups} kollu Tek Yönlü Varyans Analizi (One-Way ANOVA)`,
      correlation: 'iki değişken arasındaki korelasyon analizi (Pearson r)'
    }[testType];

    const effectDesc = {
      two_sample_t: `Cohen's d = ${effectiveEffect.toFixed(2)} (orta etki boyutu)`,
      paired_t: `Cohen's dz = ${effectiveEffect.toFixed(2)}`,
      chi_square: `Grup 1'de %${(prop1 * 100).toFixed(0)} ve Grup 2'de %${(prop2 * 100).toFixed(0)} beklenen oran farkı (Cohen's h = ${effectiveEffect})`,
      anova: `Cohen's f = ${effectiveEffect.toFixed(2)}`,
      correlation: `beklenen korelasyon katsayısı r = ${effectiveEffect.toFixed(2)}`
    }[testType];

    const dropoutPercent = Math.round(dropoutRate * 100);

    return `${studyTitle} birincil sonlanım noktası için gereken minimum örneklem büyüklüğü, G*Power 3.1 yazılımı standartlarına ve uluslararası biyoistatistik kılavuzlarına uygun olarak hesaplanmıştır. 

Hesaplamada Tip I hata düzeyi alfa = ${alpha} (çift yönlü), testin istatistiksel gücü (1-beta) = %${Math.round(power * 100)} ve ${effectDesc} olarak belirlenmiştir. Yapılan analizde, ${testName} için minimum ${calculation.totalN} olgunun (${calculation.n1 > 0 && calculation.n2 > 0 ? `Grup 1: ${calculation.n1}, Grup 2: ${calculation.n2}` : `Toplam: ${calculation.totalN}`}) çalışmaya dahil edilmesi gerektiği saptanmıştır. 

Klinik takip süresince ortaya çıkabilecek olası takipten çıkma, eksik veri ve hasta kayıpları (loss to follow-up / attrition) için %${dropoutPercent}'lik güvenlik marjı hesaba katıldığında, nihai olarak çalışmaya toplam ${calculation.adjustedTotalN} olgunun (${calculation.n1 > 0 && calculation.n2 > 0 ? `Grup başına ${calculation.adjustedN1} olgu` : `Toplam ${calculation.adjustedTotalN} katılımcı`}) alınması planlanmıştır.`.trim();
  }, [currentQuery, testType, numGroups, effectiveEffect, prop1, prop2, dropoutRate, alpha, power, calculation]);

  const handleCopy = () => {
    navigator.clipboard.writeText(ethicsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToThesisAction = () => {
    if (onSaveToThesis) {
      onSaveToThesis({
        title: `Örneklem & Güç Analizi Raporu (G*Power) - N=${calculation.adjustedTotalN}`,
        keyTakeaway: ethicsText,
        studyType: 'Biyoistatistiksel Güç Analizi',
        year: new Date().getFullYear(),
        isCustomNote: true
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.8rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>
          <Sparkles size={13} />
          <span>KlinikPusula Biyoistatistik • Dr. Ekrem Kasapoğlu G*Power Örneklem Motoru</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: 'var(--accent-navy)', margin: 0 }}>
          Örneklem Büyüklüğü & İstatistiksel Güç Hesaplayıcı
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
          Tıpta uzmanlık tezleri, klinik araştırmalar ve Etik Kurul başvuruları için Tip I hata (&alpha;=0.05), istatistiksel güç (1-&beta;=%80), etki büyüklüğü (Cohen's d) ve hasta kaybı düzeltmeli güç analizi.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Parameter Controls */}
        <div style={{ background: '#fff', padding: '1.6rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          {/* 1. Test Type Selector */}
          <div style={{ marginBottom: '1.4rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--accent-navy)', marginBottom: '0.4rem' }}>
              1. Klinik Çalışma Tasarımı / İstatistiksel Test:
            </label>
            <select
              value={testType}
              onChange={e => setTestType(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.92rem', fontWeight: '600', color: '#0f172a', background: '#f8fafc', outline: 'none' }}
            >
              <option value="two_sample_t">🩺 İki Bağımsız Grup t-Testi (RKÇ / İlaç vs Plasebo)</option>
              <option value="chi_square">📊 İki Oran Karşılaştırması (Ki-Kare / Mortalite / Komplikasyon)</option>
              <option value="paired_t">🔄 Eşleştirilmiş t-Testi (Tedavi Öncesi vs Tedavi Sonrası)</option>
              <option value="anova">👥 Tek Yönlü ANOVA (≥3 Tedavi Kolu Karşılaştırması)</option>
              <option value="correlation">📈 Pearson Korelasyon Analizi (İki Parametre İlişkisi)</option>
            </select>
          </div>

          {/* 2. Alpha (Type I Error) */}
          <div style={{ marginBottom: '1.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#334155' }}>
                2. Tip I Hata Düzeyi (&alpha; - Anlamlılık Eşiği):
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0369a1' }}>&alpha; = {alpha} (çift yönlü)</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[0.01, 0.05, 0.10].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAlpha(val)}
                  style={{
                    flex: 1,
                    padding: '0.45rem',
                    borderRadius: '8px',
                    border: alpha === val ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: alpha === val ? '#e0f2fe' : '#ffffff',
                    color: alpha === val ? '#0369a1' : '#475569',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {val === 0.05 ? '0.05 (Kılavuz Altın Standartı)' : val}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Power (1 - Beta) */}
          <div style={{ marginBottom: '1.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#334155' }}>
                3. Testin Gücü (1 - &beta; / İstatistiksel Güç):
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#166534' }}>%{(power * 100).toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[0.80, 0.90, 0.95].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPower(val)}
                  style={{
                    flex: 1,
                    padding: '0.45rem',
                    borderRadius: '8px',
                    border: power === val ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    background: power === val ? '#dcfce7' : '#ffffff',
                    color: power === val ? '#166534' : '#475569',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  %{val * 100} {val === 0.80 ? '(Standart Güç)' : (val === 0.90 ? '(Yüksek Güç)' : '')}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Effect Size Selection */}
          <div style={{ marginBottom: '1.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#334155' }}>
                4. Hedeflenen Etki Büyüklüğü:
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#7c3aed' }}>
                Değer: {effectiveEffect}
              </span>
            </div>

            {testType === 'chi_square' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', background: '#f8fafc', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '600' }}>Grup 1 Beklenen Oran (%):</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={Math.round(prop1 * 100)}
                    onChange={e => setProp1((Number(e.target.value) || 40) / 100)}
                    style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '600' }}>Grup 2 Beklenen Oran (%):</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={Math.round(prop2 * 100)}
                    onChange={e => setProp2((Number(e.target.value) || 20) / 100)}
                    style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '0.5rem' }}>
                {[
                  { key: 'small', label: 'Düşük Etki', sub: testType === 'anova' ? 'f = 0.10' : (testType === 'correlation' ? 'r = 0.10' : 'd = 0.20') },
                  { key: 'medium', label: 'Orta Etki (Önerilen)', sub: testType === 'anova' ? 'f = 0.25' : (testType === 'correlation' ? 'r = 0.30' : 'd = 0.50') },
                  { key: 'large', label: 'Yüksek Etki', sub: testType === 'anova' ? 'f = 0.40' : (testType === 'correlation' ? 'r = 0.50' : 'd = 0.80') }
                ].map(preset => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => setEffectPreset(preset.key)}
                    style={{
                      padding: '0.5rem 0.3rem',
                      borderRadius: '8px',
                      border: effectPreset === preset.key ? '2px solid #9333ea' : '1px solid #cbd5e1',
                      background: effectPreset === preset.key ? '#f3e8ff' : '#ffffff',
                      color: effectPreset === preset.key ? '#7e22ce' : '#475569',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div>{preset.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{preset.sub}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Dropout Rate */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#334155' }}>
                5. Olası Hasta / Takip Kaybı Oranı (Attrition / Dropout Rate):
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#d97706' }}>%{(dropoutRate * 100).toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[0.0, 0.10, 0.15, 0.20].map(dr => (
                <button
                  key={dr}
                  type="button"
                  onClick={() => setDropoutRate(dr)}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    borderRadius: '8px',
                    border: dropoutRate === dr ? '2px solid #f59e0b' : '1px solid #cbd5e1',
                    background: dropoutRate === dr ? '#fef3c7' : '#ffffff',
                    color: dropoutRate === dr ? '#b45309' : '#475569',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {dr === 0 ? '%0 (Sıfır Kayıp)' : (dr === 0.10 ? '%10 (Klinik Standart)' : `%${dr * 100}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Results & Ready-to-copy Ethics Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Output Metric Cards */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
                Hesaplanan Örneklem Sonuçları
              </span>
              <span style={{ background: '#059669', color: '#fff', fontSize: '0.72rem', fontWeight: '800', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                %100 Kanıta Dayalı
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.9rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Minimum Gerekli (Net N):</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#38bdf8' }}>
                  {calculation.totalN} <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#94a3b8' }}>hasta</span>
                </div>
                {calculation.n1 > 0 && calculation.n2 > 0 && (
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                    G1: {calculation.n1} | G2: {calculation.n2}
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '0.9rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.76rem', color: '#a7f3d0', marginBottom: '0.2rem' }}>Kayıp Düzeltmeli (Hedef N):</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#34d399' }}>
                  {calculation.adjustedTotalN} <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#a7f3d0' }}>hasta</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a7f3d0', marginTop: '0.2rem' }}>
                  %{Math.round(dropoutRate * 100)} kayıp payı dahil
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>
              ℹ️ {calculation.details} | Kritik Z(&alpha;/2)={calculation.zAlpha.toFixed(2)}, Z(&beta;)={calculation.zBeta.toFixed(2)}
            </div>
          </div>

          {/* Ethics Committee Copy Box */}
          <div style={{ background: '#fff', padding: '1.4rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.92rem', color: 'var(--accent-navy)' }}>
                <ShieldCheck size={16} color="#059669" />
                <span>Etik Kurul ve Tez İçin Güç Analizi Metni</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  background: copied ? '#ecfdf5' : '#f1f5f9',
                  color: copied ? '#059669' : '#334155',
                  border: copied ? '1px solid #10b981' : '1px solid #cbd5e1',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
              </button>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', fontSize: '0.86rem', lineHeight: '1.65', color: '#1e293b', maxHeight: '200px', overflowY: 'auto' }}>
              {ethicsText}
            </div>

            <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Tip Fakültesi Etik Kurul başvuru formları ve tez yöntemiyle %100 uyumlu.
              </span>
              {onSaveToThesis && (
                <button
                  type="button"
                  onClick={handleSaveToThesisAction}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    background: saved ? '#ecfdf5' : '#eff6ff',
                    color: saved ? '#059669' : '#1d4ed8',
                    border: saved ? '1px solid #10b981' : '1px solid #bfdbfe',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <BookmarkPlus size={13} />
                  <span>{saved ? 'Teze Eklendi!' : 'Tezime Not Olarak Ekle'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
