import React, { useState, useMemo, useRef } from 'react';
import { 
  GitFork, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Award, 
  ArrowRight, 
  Maximize2,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function CitationNetworkCanvas({
  basePaper,
  backwardCitations = [],
  forwardCitations = [],
  onReCenter
}) {
  const [zoom, setZoom] = useState(1);
  const [activeNode, setActiveNode] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'seminal', 'recent'
  const svgRef = useRef(null);

  // Compute layout positions for nodes
  const graphData = useMemo(() => {
    if (!basePaper) return null;

    const width = 850;
    const height = 520;
    const centerX = width / 2;
    const centerY = height / 2;

    const hubNode = {
      id: basePaper.id || 'hub',
      title: basePaper.title,
      authors: basePaper.authors,
      year: basePaper.year || 2023,
      citations: basePaper.citationCount || basePaper.citations || 120,
      journal: basePaper.journal,
      isHub: true,
      x: centerX,
      y: centerY,
      radius: 36,
      color: '#2563eb'
    };

    // Filter backward & forward nodes
    let bwList = (Array.isArray(backwardCitations) ? backwardCitations : [])
      .filter(p => p && typeof p === 'object')
      .slice(0, 10);
    let fwList = (Array.isArray(forwardCitations) ? forwardCitations : [])
      .filter(p => p && typeof p === 'object')
      .slice(0, 10);

    if (filterType === 'seminal') {
      bwList = bwList.filter(p => p.isSeminal || (Number(p.citationCount) || 0) > 50);
    } else if (filterType === 'recent') {
      fwList = fwList.filter(p => (Number(p.year) || 0) >= 2022);
    }

    // Place Backward Nodes on the Left Orbit (angles centered at 180 deg)
    const bwTotal = bwList.length;
    const bwNodes = bwList.map((p, idx) => {
      const angle = (bwTotal === 1) 
        ? (180 * Math.PI / 180)
        : (115 + (idx * 130) / Math.max(1, bwTotal - 1)) * (Math.PI / 180);
      const dist = 210 + (idx % 2 === 0 ? 30 : -20);
      const cites = Math.max(0, Number(p.citationCount || p.citations) || 0);
      const r = Math.min(28, Math.max(16, 14 + Math.log2(cites + 1) * 2.5));

      return {
        id: p.id || `bw_${idx}`,
        title: p.title || 'Referans Çalışma',
        authors: p.authors,
        year: p.year,
        citations: cites,
        journal: p.journal,
        isSeminal: Boolean(p.isSeminal),
        isBackward: true,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        radius: r,
        color: p.isSeminal ? '#d97706' : '#f59e0b',
        rawPaper: p
      };
    });

    // Place Forward Nodes on the Right Orbit (angles centered at 0 deg)
    const fwTotal = fwList.length;
    const fwNodes = fwList.map((p, idx) => {
      const angle = (fwTotal === 1)
        ? (0 * Math.PI / 180)
        : (-65 + (idx * 130) / Math.max(1, fwTotal - 1)) * (Math.PI / 180);
      const dist = 210 + (idx % 2 === 0 ? 30 : -20);
      const cites = Math.max(0, Number(p.citationCount || p.citations) || 0);
      const r = Math.min(28, Math.max(16, 14 + Math.log2(cites + 1) * 2.5));

      return {
        id: p.id || `fw_${idx}`,
        title: p.title || 'Atıf Yapan Çalışma',
        authors: p.authors,
        year: p.year,
        citations: cites,
        journal: p.journal,
        isForward: true,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        radius: r,
        color: '#0d9488',
        rawPaper: p
      };
    });

    // Generate edges connecting nodes to hub
    const edges = [
      ...bwNodes.map(node => ({
        id: `e_bw_${node.id}`,
        source: node,
        target: hubNode,
        type: 'backward',
        color: '#fde68a'
      })),
      ...fwNodes.map(node => ({
        id: `e_fw_${node.id}`,
        source: hubNode,
        target: node,
        type: 'forward',
        color: '#99f6e4'
      }))
    ];

    return { width, height, hubNode, bwNodes, fwNodes, edges };
  }, [basePaper, backwardCitations, forwardCitations, filterType]);

  if (!graphData) return null;

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Citation_Map_${(basePaper.title || 'Paper').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.svg`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #090d16 0%, #0f172a 100%)',
      borderRadius: '20px',
      padding: '1.6rem',
      color: '#fff',
      marginBottom: '2.5rem',
      boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.5)',
      border: '1px solid #1e293b',
      position: 'relative'
    }}>
      {/* Canvas Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            borderRadius: '8px',
            padding: '0.35rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GitFork size={18} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              İnteraktif Atıf Ağı Haritası (Connected Papers)
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Merkez Çalışma • {graphData.bwNodes.length} Öncül Seminal Kaynak • {graphData.fwNodes.length} Yeni Gelişme
            </span>
          </div>
        </div>

        {/* Filters & Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', background: '#1e293b', borderRadius: '8px', padding: '0.2rem' }}>
            <button
              onClick={() => setFilterType('all')}
              style={{
                background: filterType === 'all' ? '#3b82f6' : 'transparent',
                color: filterType === 'all' ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilterType('seminal')}
              style={{
                background: filterType === 'seminal' ? '#d97706' : 'transparent',
                color: filterType === 'seminal' ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⭐ Yüksek Atıflı
            </button>
            <button
              onClick={() => setFilterType('recent')}
              style={{
                background: filterType === 'recent' ? '#0d9488' : 'transparent',
                color: filterType === 'recent' ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🚀 Güncel (≥2022)
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button
              onClick={() => setZoom(prev => Math.min(1.4, prev + 0.15))}
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.35rem', borderRadius: '6px', cursor: 'pointer' }}
              title="Yakınlaştır"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(0.7, prev - 0.15))}
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.35rem', borderRadius: '6px', cursor: 'pointer' }}
              title="Uzaklaştır"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={() => setZoom(1)}
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.35rem', borderRadius: '6px', cursor: 'pointer' }}
              title="Sıfırla"
            >
              <RotateCcw size={15} />
            </button>
            <button
              onClick={handleDownloadSVG}
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
              title="SVG Olarak İndir"
            >
              <Download size={14} />
              SVG
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px',
        background: 'radial-gradient(circle at center, #1e293b 0%, #0b1120 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${graphData.width} ${graphData.height}`}
          width="100%"
          height="480"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.25s ease'
          }}
        >
          {/* Background Grid Accent */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Orbit Circles */}
          <circle cx={graphData.hubNode.x} cy={graphData.hubNode.y} r={210} fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
          <circle cx={graphData.hubNode.x} cy={graphData.hubNode.y} r={90} fill="none" stroke="rgba(59, 130, 246, 0.12)" />

          {/* Edges */}
          {graphData.edges.map(edge => {
            const isHighlighted = activeNode && (activeNode.id === edge.source.id || activeNode.id === edge.target.id);
            const dx = edge.target.x - edge.source.x;
            const dy = edge.target.y - edge.source.y;
            const cx = (edge.source.x + edge.target.x) / 2 + (dy * 0.1);
            const cy = (edge.source.y + edge.target.y) / 2 - (dx * 0.1);

            return (
              <path
                key={edge.id}
                d={`M ${edge.source.x} ${edge.source.y} Q ${cx} ${cy} ${edge.target.x} ${edge.target.y}`}
                fill="none"
                stroke={isHighlighted ? '#38bdf8' : edge.color}
                strokeWidth={isHighlighted ? 2.5 : 1.2}
                strokeOpacity={isHighlighted ? 0.9 : 0.35}
                strokeDasharray={edge.type === 'backward' ? '3 3' : 'none'}
              />
            );
          })}

          {/* Backward Nodes */}
          {graphData.bwNodes.map(node => {
            const isSelected = activeNode?.id === node.id;
            return (
              <g
                key={node.id}
                onClick={() => setActiveNode(node)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow ring */}
                {isSelected && (
                  <circle cx={node.x} cy={node.y} r={node.radius + 6} fill="none" stroke="#fde68a" strokeWidth="2" opacity="0.8" />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill="url(#goldGrad)"
                  stroke={isSelected ? '#fff' : '#f59e0b'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  fill="#fff"
                  fontSize={node.radius > 22 ? '10' : '8.5'}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {node.year || 'Öncül'}
                </text>
                <text
                  x={node.x}
                  y={node.y + node.radius + 14}
                  fill="#cbd5e1"
                  fontSize="9"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {(node.title || '').slice(0, 16)}...
                </text>
              </g>
            );
          })}

          {/* Forward Nodes */}
          {graphData.fwNodes.map(node => {
            const isSelected = activeNode?.id === node.id;
            return (
              <g
                key={node.id}
                onClick={() => setActiveNode(node)}
                style={{ cursor: 'pointer' }}
              >
                {isSelected && (
                  <circle cx={node.x} cy={node.y} r={node.radius + 6} fill="none" stroke="#67e8f9" strokeWidth="2" opacity="0.8" />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill="url(#cyanGrad)"
                  stroke={isSelected ? '#fff' : '#14b8a6'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  fill="#fff"
                  fontSize={node.radius > 22 ? '10' : '8.5'}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {node.year || 'Yeni'}
                </text>
                <text
                  x={node.x}
                  y={node.y + node.radius + 14}
                  fill="#cbd5e1"
                  fontSize="9"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {(node.title || '').slice(0, 16)}...
                </text>
              </g>
            );
          })}

          {/* Center Hub Node */}
          <g
            onClick={() => setActiveNode(graphData.hubNode)}
            style={{ cursor: 'pointer' }}
          >
            {/* Pulsing halo */}
            <circle cx={graphData.hubNode.x} cy={graphData.hubNode.y} r={graphData.hubNode.radius + 12} fill="rgba(37, 99, 235, 0.2)" />
            <circle cx={graphData.hubNode.x} cy={graphData.hubNode.y} r={graphData.hubNode.radius + 5} fill="none" stroke="#60a5fa" strokeWidth="1.5" />
            <circle
              cx={graphData.hubNode.x}
              cy={graphData.hubNode.y}
              r={graphData.hubNode.radius}
              fill="url(#hubGrad)"
              stroke="#fff"
              strokeWidth="2.5"
            />
            <text
              x={graphData.hubNode.x}
              y={graphData.hubNode.y - 4}
              fill="#fff"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              MERKEZ
            </text>
            <text
              x={graphData.hubNode.x}
              y={graphData.hubNode.y + 12}
              fill="#dbeafe"
              fontSize="9.5"
              textAnchor="middle"
            >
              {graphData.hubNode.year}
            </text>
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="hubGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
          </defs>
        </svg>

        {/* Legend Overlay in Canvas */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '0.4rem 0.8rem',
          fontSize: '0.72rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#2563eb' }}></span>
            <span>Merkez Odak</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b' }}></span>
            <span>Öncül Seminal (Backward)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#0d9488' }}></span>
            <span>Yeni Gelişme (Forward)</span>
          </div>
        </div>
      </div>

      {/* Floating Card for Selected Node */}
      {activeNode && (
        <div style={{
          marginTop: '1.2rem',
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '14px',
          padding: '1.2rem 1.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: '0 8px 20px rgba(0,0,0,0.35)'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{
                background: activeNode.isHub ? '#2563eb' : (activeNode.isBackward ? '#d97706' : '#0d9488'),
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px'
              }}>
                {activeNode.isHub ? 'Merkez Çalışma' : (activeNode.isBackward ? 'Öncül Kaynak' : 'Türev Çalışma')}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {activeNode.year} • {activeNode.journal || 'Akademik Yayın'} • <strong>{activeNode.citations}</strong> atıf
              </span>
            </div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>
              {activeNode.title}
            </h4>
          </div>

          {!activeNode.isHub && onReCenter && (
            <button
              onClick={() => {
                onReCenter(activeNode.rawPaper);
                setActiveNode(null);
              }}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem 1.1rem',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
              }}
            >
              <Sparkles size={14} />
              Bunu Yeni Merkez Yap
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
