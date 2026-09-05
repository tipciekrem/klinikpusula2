import React from 'react';
import { Sparkles, GraduationCap, CheckCircle2, BookmarkPlus, Target } from 'lucide-react';

export default function SynthesisBox({ synthesis, onSaveToThesis, onOpenResearchGaps }) {
  if (!synthesis || !synthesis.summary) return null;

  return (
    <div className="synthesis-card">
      <div className="synthesis-header">
        <div className="synthesis-title-group">
          <Sparkles size={20} className="synthesis-icon" />
          <h3 className="synthesis-title">KlinikPusula Akademik Literatür Sentezi</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {onOpenResearchGaps && (
            <button
              className="btn-card"
              style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }}
              onClick={onOpenResearchGaps}
              title="Literatürdeki boşlukları (Research Gaps) tespit et"
            >
              <Target size={14} />
              <span>Literatür Boşluklarını Gör</span>
            </button>
          )}
          {onSaveToThesis && (
            <button 
              className="btn-card btn-save-thesis"
              onClick={onSaveToThesis}
              title="Bu sentezi tezinizin literatür notlarına kaydedin"
            >
              <BookmarkPlus size={15} />
              <span>Tez Notlarıma Ekle</span>
            </button>
          )}
        </div>
      </div>

      <div className="synthesis-text">
        {synthesis.summary.split('\n\n').map((paragraph, pIdx) => (
          <div key={pIdx} style={{ marginBottom: '0.9rem', whiteSpace: 'pre-line', lineHeight: '1.7' }}>
            {paragraph}
          </div>
        ))}
      </div>

      {synthesis.keyPoints && synthesis.keyPoints.length > 0 && (
        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#334155', marginBottom: '0.5rem' }}>
            Öne Çıkan Kanıtlar:
          </div>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {synthesis.keyPoints.map((pt, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.45rem', fontSize: '0.92rem', color: '#334155' }}>
                <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '0.2rem' }} />
                <span>{pt.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {synthesis.methodologyTrend && (
        <div className="synthesis-callout">
          <GraduationCap size={18} className="callout-icon" />
          <div>
            <strong>Metodolojik Eğilim: </strong>
            {synthesis.methodologyTrend}
          </div>
        </div>
      )}

      {synthesis.thesisImplication && (
        <div className="synthesis-callout thesis-tip">
          <Sparkles size={18} className="callout-icon" />
          <div>
            <strong>Tez Yazım Tavsiyesi (Research Gap): </strong>
            {synthesis.thesisImplication}
          </div>
        </div>
      )}
    </div>
  );
}
