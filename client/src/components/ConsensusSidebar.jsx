import React from 'react';
import { 
  Plus, 
  Home, 
  Bookmark, 
  History, 
  Search, 
  GitFork, 
  Table, 
  FileCheck, 
  Sparkles, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Calculator,
  Trash2,
  X
} from 'lucide-react';

export default function ConsensusSidebar({
  isCollapsed,
  setIsCollapsed,
  activeTab,
  setActiveTab,
  onNewThread,
  recentThreads = [],
  currentQuery,
  onSelectThread,
  onDeleteRecentThread,
  onClearAllRecentThreads,
  savedCount = 0
}) {
  return (
    <aside className={`consensus-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Top Header with Logo & Toggle */}
      <div className="sidebar-top">
        <div className="sidebar-logo-group" onClick={() => setActiveTab('search')} title="Klinik Pusula — Dr. Ekrem Kasapoğlu">
          <div className="klinik-pusula-sidebar-logo">
            <img src="/klinik-pusula-icon.png" alt="Klinik Pusula" className="sidebar-logo-img" />
          </div>
          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span className="consensus-brand-name">Klinik Pusula</span>
              <span style={{ fontSize: '0.69rem', color: '#0d9488', fontWeight: '800', letterSpacing: '0.1px', lineHeight: '1.2' }}>
                Dr. Ekrem Kasapoğlu
              </span>
            </div>
          )}
        </div>
        <button 
          className="sidebar-toggle-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Kenar Çubuğunu Genişlet' : 'Kenar Çubuğunu Daralt'}
        >
          {isCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
      </div>

      {/* New Thread Button */}
      <div className="sidebar-new-thread-wrap">
        <button className="new-thread-btn" onClick={onNewThread} title="Yeni Arama / Başlık">
          <Plus size={16} />
          {!isCollapsed && <span>Yeni Başlık</span>}
        </button>
      </div>

      {/* Main Nav Items */}
      <nav className="sidebar-nav">
        <button 
          className={`sidebar-nav-item ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Home size={17} />
          {!isCollapsed && <span>Ana Sayfa</span>}
        </button>

        <button 
          className={`sidebar-nav-item ${activeTab === 'workspace' ? 'active' : ''}`}
          onClick={() => setActiveTab('workspace')}
        >
          <Bookmark size={17} />
          {!isCollapsed && (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span>Kitaplığım</span>
              {savedCount > 0 && <span className="sidebar-count-badge">{savedCount}</span>}
            </div>
          )}
        </button>

        <button 
          className="sidebar-nav-item"
          onClick={() => setActiveTab('search')}
        >
          <History size={17} />
          {!isCollapsed && <span>Geçmiş</span>}
        </button>
      </nav>

      {/* Recents Section */}
      {!isCollapsed && (
        <div className="sidebar-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="sidebar-section-title" style={{ marginBottom: 0 }}>Son Aramalar</span>
            {recentThreads.length > 0 && (
              <button
                type="button"
                className="sidebar-clear-all-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearAllRecentThreads?.();
                }}
                title="Tüm Önceki Aramaları Temizle"
              >
                <Trash2 size={11} />
                <span>Tümünü Sil</span>
              </button>
            )}
          </div>
          <div className="sidebar-recents-list">
            {recentThreads.length === 0 ? (
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', padding: '6px 4px' }}>
                Henüz kayıtlı arama yok
              </div>
            ) : (
              recentThreads.map((thread, idx) => {
                const isActive = currentQuery === thread;
                const displayTitle = thread.length > 22 ? thread.substring(0, 20) + '...' : thread;
                return (
                  <div key={idx} className={`sidebar-recent-row ${isActive ? 'active' : ''}`}>
                    <button
                      type="button"
                      className="sidebar-recent-item-btn"
                      onClick={() => onSelectThread(thread)}
                      title={thread}
                    >
                      <span className="recent-bullet">○</span>
                      <span className="recent-text">{displayTitle}</span>
                    </button>
                    <button
                      type="button"
                      className="sidebar-delete-recent-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecentThread?.(thread);
                      }}
                      title="Bu aramayı sil"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tools Section */}
      {!isCollapsed && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">Araçlar</div>
          <nav className="sidebar-tools-nav">
            <button 
              className={`sidebar-tool-item ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              <Search size={15} />
              <span>Makale Arama</span>
            </button>
            <button 
              className={`sidebar-tool-item ${activeTab === 'graph' ? 'active' : ''}`}
              onClick={() => setActiveTab('graph')}
            >
              <GitFork size={15} />
              <span>Atıf Grafı</span>
            </button>
            <button 
              className={`sidebar-tool-item ${activeTab === 'matrix' ? 'active' : ''}`}
              onClick={() => setActiveTab('matrix')}
            >
              <Table size={15} />
              <span>Çalışma Matrisi</span>
            </button>
            <button 
              className={`sidebar-tool-item ${activeTab === 'auditor' ? 'active' : ''}`}
              onClick={() => setActiveTab('auditor')}
            >
              <FileCheck size={15} />
              <span>Makale Denetimi</span>
            </button>
            <button 
              className={`sidebar-tool-item ${activeTab === 'powerCalc' ? 'active' : ''}`}
              onClick={() => setActiveTab('powerCalc')}
            >
              <Calculator size={15} />
              <span>Örneklem & Güç (G*Power)</span>
            </button>
          </nav>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="sidebar-footer-links">
            <span className="footer-link" style={{ cursor: 'default', color: '#64748b', fontWeight: '600' }}>
              <span>KlinikPusula v2.5</span>
            </span>
            <button onClick={() => setActiveTab('auditor')} className="footer-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} title="Hakem Denetçisi">
              <span>Hakem Raporu</span> <Sparkles size={11} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
