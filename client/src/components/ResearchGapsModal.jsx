import React, { useState, useEffect } from 'react';
import { Sparkles, X, Target, Lightbulb, AlertTriangle, Copy, Check } from 'lucide-react';
import { getResearchGaps } from '../services/api';

export default function ResearchGapsModal({ papers, thesisTopic, onClose }) {
  const [gapsData, setGapsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (papers && papers.length > 0) {
      setLoading(true);
      getResearchGaps({ papers, thesisTopic })
        .then(res => {
          setGapsData(res);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [papers, thesisTopic]);

  const handleCopySummary = () => {
    if (!gapsData) return;
    let text = `LİTERATÜRDEKİ BOŞLUKLAR (RESEARCH GAPS) VE BU TEZİN ÖZGÜN DEĞERİ\n\n`;
    (gapsData.identifiedGaps || []).forEach((g, i) => {
      text += `${i + 1}. ${g.type}: ${g.description}\n`;
    });
    text += `\nÖNERİLEN TEZ KATKILARI:\n`;
    (gapsData.suggestedContributions || []).forEach((s, i) => {
      text += `- ${s}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '750px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--primary)" />
            <h3 className="modal-title">Literatür Boşlukları (Research Gap Finder)</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {loading ? (
            <div className="loading-state" style={{ padding: '2rem' }}>
              <div className="spinner"></div>
              <p>Literatürdeki metodolojik boşluklar ve temsil kısıtları taranıyor...</p>
            </div>
          ) : gapsData ? (
            <div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '1.4rem' }}>
                İncelenen <strong>{gapsData.papersAnalyzedCount}</strong> akademik yayının metodoloji, örneklem ve teorik eksiklikleri analiz edildi. Bu bulguları tezinizin <em>Giriş, Problem Durumu ve Araştırmanın Önemi</em> bölümlerinde doğrudan kullanabilirsiniz.
              </p>

              {/* Identified Gaps */}
              <div style={{ marginBottom: '1.8rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-navy)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={16} color="#d97706" />
                  Tespit Edilen Literatür Boşlukları:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {(gapsData.identifiedGaps || []).map((gap, i) => (
                    <div key={i} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '1rem' }}>
                      <div style={{ fontWeight: '700', color: '#92400e', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                        {gap.type}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#78350f', lineHeight: '1.5' }}>
                        {gap.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Contributions */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-navy)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lightbulb size={16} color="#059669" />
                  Teziniz İçin Tavsiye Edilen Özgün Katkı Alanları:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(gapsData.suggestedContributions || []).map((sug, i) => (
                    <div key={i} style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '0.9rem 1rem', fontSize: '0.9rem', color: '#065f46' }}>
                      ✓ {sug}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Kapat
          </button>
          <button className="btn-primary" onClick={handleCopySummary} disabled={loading || !gapsData}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Kopyalandı!' : 'Tez Raporunu Kopyala'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
