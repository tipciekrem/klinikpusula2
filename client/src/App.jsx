import React, { useState, useEffect } from 'react';
import ConsensusSidebar from './components/ConsensusSidebar';
import ConsensusCenter from './components/ConsensusCenter';
import ConsensusReferences from './components/ConsensusReferences';
import SearchHero from './components/SearchHero';
import CitationModal from './components/CitationModal';
import ThesisWorkspace from './components/ThesisWorkspace';
import HypothesisHelper from './components/HypothesisHelper';

// PRO Components
import StudyMatrixView from './components/StudyMatrixView';
import CitationGraphView from './components/CitationGraphView';
import ManuscriptAuditor from './components/ManuscriptAuditor';
import SampleSizeCalculator from './components/SampleSizeCalculator';
import ResearchGapsModal from './components/ResearchGapsModal';
import PrivateDocModal from './components/PrivateDocModal';

import { 
  searchPapers, 
  getThesisWorkspace, 
  saveThesisWorkspace, 
  savePaperToThesis,
  submitThreadFollowUp
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Consensus Layout States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isReferencesOpen, setIsReferencesOpen] = useState(true);
  const [activeCitationId, setActiveCitationId] = useState(null);
  const [recentThreads, setRecentThreads] = useState(() => {
    try {
      const saved = localStorage.getItem('consensus_recent_threads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filters
  const [studyType, setStudyType] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [minCitations, setMinCitations] = useState('0');
  const [onlyOA, setOnlyOA] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchMode, setSearchMode] = useState('medical');
  const [medicalSpecialty, setMedicalSpecialty] = useState('all');
  const [evidenceLevel, setEvidenceLevel] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Modals
  const [citeModalPaper, setCiteModalPaper] = useState(null);
  const [showResearchGapsModal, setShowResearchGapsModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);

  // Thesis Data
  const [thesisData, setThesisData] = useState({
    chapters: [],
    savedPapers: [],
    notes: {},
    customUploads: []
  });

  // Thread & Continuous Conversation States
  const [currentThread, setCurrentThread] = useState(null);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [threadStore, setThreadStore] = useState(() => {
    try {
      const saved = localStorage.getItem('consensus_thread_store');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Load thesis workspace on mount (do NOT auto-search; wait for user query)
  useEffect(() => {
    getThesisWorkspace()
      .then(data => setThesisData(data))
      .catch(err => console.error('Failed to load thesis workspace:', err));
  }, []);

  // Dynamic Browser Tab Title with Dr. Ekrem Kasapoğlu for every view
  useEffect(() => {
    const tabTitles = {
      search: currentQuery ? `"${currentQuery}" — Dr. Ekrem Kasapoğlu` : 'KlinikPusula — Dr. Ekrem Kasapoğlu',
      workspace: 'Kitaplığım & Tez Alanı — Dr. Ekrem Kasapoğlu | KlinikPusula',
      graph: 'Atıf Grafı — Dr. Ekrem Kasapoğlu | KlinikPusula',
      matrix: 'Çalışma Karşılaştırma Matrisi — Dr. Ekrem Kasapoğlu | KlinikPusula',
      auditor: 'Tez & Makale Denetimi — Dr. Ekrem Kasapoğlu | KlinikPusula',
      powerCalc: 'G*Power Örneklem & Güç — Dr. Ekrem Kasapoğlu | KlinikPusula'
    };
    document.title = tabTitles[activeTab] || 'KlinikPusula — Dr. Ekrem Kasapoğlu';
  }, [activeTab, currentQuery]);

  // Delete single recent search thread
  const handleDeleteRecentThread = (threadToDelete) => {
    setRecentThreads(prev => {
      const updated = prev.filter(t => t !== threadToDelete);
      try {
        localStorage.setItem('consensus_recent_threads', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Clear all recent search threads
  const handleClearAllRecentThreads = () => {
    setRecentThreads([]);
    try {
      localStorage.removeItem('consensus_recent_threads');
    } catch {}
  };

  // Save paper, search topic, or biostatistics note to thesis workspace
  const handleSaveToThesis = async (paperOrNote) => {
    try {
      let targetPaper = paperOrNote;
      if (!targetPaper) {
        const queryTitle = currentThread?.title || currentQuery || 'Klinik Arama';
        const topTurn = currentThread?.turns?.[0];
        const synthesisText = topTurn?.synthesis?.text || searchResult?.synthesis?.text || '';
        targetPaper = {
          id: `topic-${Date.now()}`,
          title: queryTitle,
          authors: ['Dr. Ekrem Kasapoğlu Sentezi'],
          year: new Date().getFullYear(),
          journal: 'KlinikPusula Literatür Taraması',
          keyTakeaway: synthesisText ? synthesisText.slice(0, 250) + '...' : 'Akademik uzlaşı ve sentez notu.',
          abstract: synthesisText,
          isCustomNote: true
        };
      }

      const defaultChapterId = thesisData.chapters?.[0]?.id || 'chap-2';
      const res = await savePaperToThesis({
        paper: targetPaper,
        chapterId: defaultChapterId
      });

      if (res && res.workspace) {
        setThesisData(res.workspace);
      } else {
        // Optimistic state update & save
        setThesisData(prev => {
          const prevSaved = Array.isArray(prev.savedPapers) ? prev.savedPapers : [];
          const exists = prevSaved.some(p => p.id === targetPaper.id);
          const updatedPapers = exists ? prevSaved : [...prevSaved, targetPaper];
          const updatedChapters = (prev.chapters || []).map((c, idx) => {
            if (c.id === defaultChapterId || idx === 0) {
              const pList = Array.isArray(c.papers) ? c.papers : [];
              return { ...c, papers: pList.includes(targetPaper.id) ? pList : [...pList, targetPaper.id] };
            }
            return c;
          });
          const updated = { ...prev, savedPapers: updatedPapers, chapters: updatedChapters };
          saveThesisWorkspace(updated).catch(() => {});
          return updated;
        });
      }
      return true;
    } catch (err) {
      console.error('Teze kaydetme hatası:', err);
      setThesisData(prev => {
        const prevSaved = Array.isArray(prev.savedPapers) ? prev.savedPapers : [];
        const fallbackPaper = paperOrNote || {
          id: `topic-${Date.now()}`,
          title: currentThread?.title || currentQuery || 'Klinik Araştırma',
          year: new Date().getFullYear(),
          journal: 'KlinikPusula Notu'
        };
        const updatedPapers = [...prevSaved, fallbackPaper];
        const updated = { ...prev, savedPapers: updatedPapers };
        saveThesisWorkspace(updated).catch(() => {});
        return updated;
      });
      return true;
    }
  };

  // Compute publication year range from filter
  const getYearRange = (filter) => {
    const currentYear = new Date().getFullYear();
    if (filter === 'last3') return { yearFrom: currentYear - 3, yearTo: currentYear };
    if (filter === 'last5') return { yearFrom: currentYear - 5, yearTo: currentYear };
    if (filter === 'last10') return { yearFrom: currentYear - 10, yearTo: currentYear };
    return { yearFrom: undefined, yearTo: undefined };
  };

  // Execute academic search (Turn 1 of a thread)
  const performSearch = async (queryText, overrideMode, meta = {}) => {
    if (!queryText || !queryText.trim()) return;
    const cleanQuery = queryText.trim();
    setIsLoading(true);
    setError(null);
    setCurrentQuery(cleanQuery);
    setCurrentPage(1);
    setActiveTab('search');

    // Add to recent threads and save to localStorage
    setRecentThreads(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== cleanQuery.toLowerCase());
      const updated = [cleanQuery, ...filtered].slice(0, 15);
      try {
        localStorage.setItem('consensus_recent_threads', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    const activeMode = overrideMode || searchMode;

    try {
      const { yearFrom, yearTo } = getYearRange(yearFilter);
      const data = await searchPapers({
        q: queryText,
        page: 1,
        perPage: 50,
        studyType: studyType !== 'all' ? studyType : undefined,
        yearFrom,
        yearTo,
        minCitations: minCitations !== '0' ? minCitations : undefined,
        mode: activeMode,
        specialty: medicalSpecialty !== 'all' ? medicalSpecialty : undefined,
        evidenceLevel: evidenceLevel !== 'all' ? evidenceLevel : undefined,
        sourceFilter: sourceFilter !== 'all' ? sourceFilter : undefined
      });

      if (meta?.pico) {
        data.pico = meta.pico;
      }
      setSearchResult(data);

      // Create Turn 1 for the new thread
      const initialTurn = {
        turnIndex: 1,
        query: cleanQuery,
        pico: meta?.pico,
        searchSteps: data.searchSteps || [
          `Literatür sorgusu yapılandırıldı: "${cleanQuery}"`,
          `Europe PMC, PubMed, Semantic Scholar ve OpenAlex taranıyor...`,
          `${(data.papers || []).length} hakemli klinik çalışma ve kanıt analiz edildi`,
          `Klinik sentez ve kanıt konsensüsü oluşturuldu`
        ],
        consensus: data.consensus,
        synthesis: data.synthesis,
        papers: data.papers || []
      };

      const threadObj = {
        id: 'thread-' + Date.now(),
        title: cleanQuery,
        pico: meta?.pico,
        turns: [initialTurn],
        allPapers: data.papers || [],
        federation: data.federation,
        total: data.total,
        optimization: data.optimization
      };

      setCurrentThread(threadObj);
      setThreadStore(prev => {
        const updated = { ...prev, [cleanQuery.toLowerCase()]: threadObj };
        try {
          localStorage.setItem('consensus_thread_store', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } catch (err) {
      setError(err.message || 'Akademik arama gerçekleştirilemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Follow-up question in existing thread (Turn 2, 3...) - continuous synthesis
  const handleFollowUp = async (followUpText) => {
    if (!followUpText || !followUpText.trim()) return;
    const cleanFollowUp = followUpText.trim();

    // If no active thread exists, treat as initial search
    if (!currentThread) {
      return performSearch(cleanFollowUp);
    }

    setIsFollowUpLoading(true);
    setError(null);

    try {
      const lastTurn = currentThread.turns[currentThread.turns.length - 1];
      const previousSynthesis = lastTurn?.synthesis || searchResult?.synthesis;
      const previousPapers = currentThread.allPapers || searchResult?.papers || [];

      const result = await submitThreadFollowUp({
        followUpQuery: cleanFollowUp,
        threadTitle: currentThread.title,
        originalQuery: currentThread.title,
        previousPapers: previousPapers.slice(0, 30),
        previousSynthesis: previousSynthesis,
        mode: searchMode
      });

      // Deduplicate merged papers across turns
      const existingPaperIds = new Set((currentThread.allPapers || []).map(p => p.id || (p.title || '').toLowerCase().trim()));
      const newUniquePapers = (result.papers || []).filter(p => !existingPaperIds.has(p.id || (p.title || '').toLowerCase().trim()));
      const mergedPapers = [...(currentThread.allPapers || []), ...newUniquePapers];

      const newTurn = {
        turnIndex: currentThread.turns.length + 1,
        query: cleanFollowUp,
        searchSteps: result.searchSteps || [
          `Takip sorusu bağlamı analiz edildi: "${cleanFollowUp}"`,
          `Önceki "${currentThread.title}" literatür havuzuyla çapraz tarandı`,
          `${(result.papers || []).length} ilgili klinik çalışma ve kanıt sentezlendi`
        ],
        consensus: result.consensus || currentThread.turns[0]?.consensus,
        synthesis: result.synthesis,
        papers: result.papers || []
      };

      const updatedThread = {
        ...currentThread,
        turns: [...currentThread.turns, newTurn],
        allPapers: mergedPapers
      };

      setCurrentThread(updatedThread);
      setSearchResult(prev => ({
        ...prev,
        papers: mergedPapers,
        synthesis: result.synthesis,
        consensus: result.consensus || prev?.consensus
      }));

      // Update thread store without changing the thread title or adding a new sidebar item
      setThreadStore(prev => {
        const updated = { ...prev, [currentThread.title.toLowerCase()]: updatedThread };
        try {
          localStorage.setItem('consensus_thread_store', JSON.stringify(updated));
        } catch {}
        return updated;
      });

    } catch (err) {
      console.error('Follow-up error:', err);
      alert('Takip sorusu sentezlenirken hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  // Select an existing thread from sidebar
  const handleSelectThread = (threadTitle) => {
    const threadKey = threadTitle.toLowerCase();
    if (threadStore[threadKey]) {
      const stored = threadStore[threadKey];
      setCurrentThread(stored);
      setCurrentQuery(stored.title);
      setSearchResult({
        papers: stored.allPapers,
        synthesis: stored.turns[stored.turns.length - 1]?.synthesis,
        consensus: stored.turns[stored.turns.length - 1]?.consensus,
        searchSteps: stored.turns[stored.turns.length - 1]?.searchSteps,
        total: stored.total,
        federation: stored.federation,
        optimization: stored.optimization
      });
      setActiveTab('search');
    } else {
      performSearch(threadTitle);
    }
  };

  // Load more papers (batch pagination from index)
  const handleLoadMore = async () => {
    if (!currentQuery || isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const { yearFrom, yearTo } = getYearRange(yearFilter);
      const data = await searchPapers({
        q: currentQuery,
        page: nextPage,
        perPage: 50,
        studyType: studyType !== 'all' ? studyType : undefined,
        yearFrom,
        yearTo,
        minCitations: minCitations !== '0' ? minCitations : undefined,
        mode: searchMode,
        specialty: medicalSpecialty !== 'all' ? medicalSpecialty : undefined,
        evidenceLevel: evidenceLevel !== 'all' ? evidenceLevel : undefined,
        sourceFilter: sourceFilter !== 'all' ? sourceFilter : undefined
      });

      if (data.papers && data.papers.length > 0) {
        setSearchResult(prev => {
          const existingIds = new Set((prev?.papers || []).map(p => p.id));
          const newUnique = data.papers.filter(p => !existingIds.has(p.id));
          return {
            ...prev,
            papers: [...(prev?.papers || []), ...newUnique],
            page: nextPage
          };
        });
        setCurrentPage(nextPage);
      }
    } catch (err) {
      console.error('Daha fazla makale yüklenemedi:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleUpdateWorkspace = async (newData) => {
    setThesisData(newData);
    try {
      await saveThesisWorkspace(newData);
    } catch (err) {
      console.error('Failed to sync thesis data:', err);
    }
  };

  let displayedPapers = searchResult?.papers || [];
  if (onlyOA) {
    displayedPapers = displayedPapers.filter(p => p.isOpenAccess && p.pdfUrl);
  }

  const savedIds = (thesisData.savedPapers || []).map(p => p.id);

  return (
    <div className="consensus-layout">
      {/* 1. Left Sidebar */}
      <ConsensusSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewThread={() => {
          setSearchResult(null);
          setCurrentThread(null);
          setCurrentQuery('');
          setActiveTab('search');
        }}
        recentThreads={recentThreads}
        currentQuery={currentThread?.title || currentQuery}
        onSelectThread={(thread) => handleSelectThread(thread)}
        onDeleteRecentThread={handleDeleteRecentThread}
        onClearAllRecentThreads={handleClearAllRecentThreads}
        savedCount={savedIds.length}
      />

      {/* 2. Center Panel */}
      {activeTab === 'search' && (
        <>
          {isLoading && !searchResult ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
              <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px', marginBottom: '1.2rem' }}></div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700, marginBottom: '0.4rem' }}>
                "{currentQuery}" Taranıyor...
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', textAlign: 'center', maxWidth: '460px' }}>
                Europe PMC, PubMed, Semantic Scholar ve OpenAlex taranıyor. Atıf yapılan kaynaklar ve akademik cevap hazırlanıyor.
              </p>
            </div>
          ) : searchResult ? (
            <ConsensusCenter
              currentThread={currentThread}
              currentQuery={currentQuery}
              searchResult={searchResult}
              onSearch={performSearch}
              onFollowUp={handleFollowUp}
              isLoading={isLoading}
              isFollowUpLoading={isFollowUpLoading}
              onSelectCitation={(cit) => {
                setActiveCitationId(cit);
                setIsReferencesOpen(true);
              }}
              activeCitationId={activeCitationId}
              onOpenUploadDoc={() => setShowUploadDocModal(true)}
              onOpenFilters={() => {}}
              onSaveToThesis={handleSaveToThesis}
              savedPapersCount={savedIds.length}
            />
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', padding: '40px 32px' }}>
              {error && (
                <div style={{ maxWidth: '720px', margin: '0 auto 1.5rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                  {error}
                </div>
              )}
              <SearchHero 
                onSearch={performSearch} 
                isLoading={isLoading} 
                searchMode={searchMode} 
              />
            </div>
          )}

          {/* 3. Right Panel (Atıf yapılabilecek siteler - 20'li olarak açılabilen liste) */}
          {searchResult && (
            <ConsensusReferences
              papers={currentThread?.allPapers && currentThread.allPapers.length > 0 ? currentThread.allPapers : displayedPapers}
              totalHits={searchResult.federation?.totalGlobalHits || searchResult.total || displayedPapers.length}
              currentQuery={currentThread?.title || currentQuery}
              activeCitationId={activeCitationId}
              onSaveToThesis={handleSaveToThesis}
              savedIds={savedIds}
              isOpen={isReferencesOpen}
              onClose={() => setIsReferencesOpen(false)}
              onLoadMoreFromServer={handleLoadMore}
              isLoadingMore={isLoadingMore}
            />
          )}
        </>
      )}

      {/* Alternate Views (accessed from sidebar tools) */}
      {activeTab === 'workspace' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          <ThesisWorkspace
            thesisData={thesisData}
            onUpdateWorkspace={handleUpdateWorkspace}
            onOpenCiteModal={(p) => setCiteModalPaper(p)}
          />
        </div>
      )}

      {activeTab === 'matrix' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          <StudyMatrixView
            papers={displayedPapers.length > 0 ? displayedPapers : thesisData.savedPapers}
            onSaveToThesis={handleSaveToThesis}
            onOpenCiteModal={(p) => setCiteModalPaper(p)}
            savedPaperIds={savedIds}
          />
        </div>
      )}

      {activeTab === 'graph' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          <CitationGraphView
            papers={displayedPapers.length > 0 ? displayedPapers : thesisData.savedPapers}
            onSaveToThesis={handleSaveToThesis}
            onOpenCiteModal={(p) => setCiteModalPaper(p)}
            savedPaperIds={savedIds}
          />
        </div>
      )}

      {activeTab === 'auditor' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          <ManuscriptAuditor />
        </div>
      )}

      {activeTab === 'powerCalc' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          <SampleSizeCalculator 
            currentQuery={currentThread?.title || currentQuery} 
            onSaveToThesis={handleSaveToThesis}
          />
        </div>
      )}

      {/* Modals */}
      {citeModalPaper && (
        <CitationModal
          paper={citeModalPaper}
          onClose={() => setCiteModalPaper(null)}
        />
      )}

      {showResearchGapsModal && (
        <ResearchGapsModal
          papers={displayedPapers}
          thesisTopic={currentQuery}
          onClose={() => setShowResearchGapsModal(false)}
        />
      )}

      {showUploadDocModal && (
        <PrivateDocModal
          chapters={thesisData.chapters}
          onClose={() => setShowUploadDocModal(false)}
          onDocUploaded={(doc) => {
            getThesisWorkspace().then(d => setThesisData(d));
          }}
        />
      )}
    </div>
  );
}
