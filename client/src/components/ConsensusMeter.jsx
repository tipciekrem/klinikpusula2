import React from 'react';
import { BarChart3, Info } from 'lucide-react';

export default function ConsensusMeter({ consensus }) {
  if (!consensus || consensus.totalAnalyzed === 0) return null;

  const { yes, possibly, no, totalAnalyzed, verdict, counts } = consensus;

  return (
    <div className="consensus-meter-card">
      <div className="meter-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span className="meter-badge" style={{ background: '#0f766e', color: '#ffffff' }}>
            <BarChart3 size={15} />
            KlinikPusula Meter™
          </span>
          <span className="meter-stats-text">
            {totalAnalyzed} hakemli çalışma incelendi
          </span>
        </div>
        <div className="meter-verdict">
          {verdict}
        </div>
      </div>

      <div className="meter-bar-container">
        {yes > 0 && (
          <div 
            className="meter-bar-segment yes" 
            style={{ width: `${yes}%` }}
            title={`Destekliyor: %${yes} (${counts?.yes || 0} makale)`}
          >
            {yes >= 12 && `%${yes} Evet`}
          </div>
        )}
        {possibly > 0 && (
          <div 
            className="meter-bar-segment maybe" 
            style={{ width: `${possibly}%` }}
            title={`Olası/Karışık: %${possibly} (${counts?.possibly || 0} makale)`}
          >
            {possibly >= 12 && `%${possibly} Belki`}
          </div>
        )}
        {no > 0 && (
          <div 
            className="meter-bar-segment no" 
            style={{ width: `${no}%` }}
            title={`Desteklemiyor: %${no} (${counts?.no || 0} makale)`}
          >
            {no >= 12 && `%${no} Hayır`}
          </div>
        )}
      </div>

      <div className="meter-legend">
        <div className="legend-item">
          <span className="legend-dot yes"></span>
          <span>% {yes} Evet / Destekliyor ({counts?.yes || 0})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot maybe"></span>
          <span>% {possibly} Belki / Koşullu ({counts?.possibly || 0})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot no"></span>
          <span>% {no} Hayır / Anlamsız ({counts?.no || 0})</span>
        </div>
      </div>
    </div>
  );
}
