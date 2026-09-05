import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  BookOpen, 
  PlusCircle, 
  StickyNote,
  ExternalLink,
  Quote
} from 'lucide-react';
import { generateLiteratureReview, downloadRISFile } from '../services/api';

export default function ThesisWorkspace({ 
  thesisData, 
  onUpdateWorkspace,
  onOpenCiteModal 
}) {
  const [activeChapterId, setActiveChapterId] = useState('chap-2');
  const [selectedPaperIds, setSelectedPaperIds] = useState([]);
  const [thesisTopic, setThesisTopic] = useState('');
  const [language, setLanguage] = useState('tr');
  const [reviewResult, setReviewResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNoteText, setTempNoteText] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [pendingDeleteChapter, setPendingDeleteChapter] = useState(null);

  const chapters = thesisData.chapters || [];
  const savedPapers = thesisData.savedPapers || [];
  const notes = thesisData.notes || {};

  const activeChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];
  const chapterPapers = savedPapers.filter(p => activeChapter?.papers?.includes(p.id));

  // Toggle selection for literature review
  const toggleSelectPaper = (id) => {
    setSelectedPaperIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllInChapter = () => {
    const allIds = chapterPapers.map(p => p.id);
    const areAllSelected = allIds.every(id => selectedPaperIds.includes(id));
    if (areAllSelected) {
      setSelectedPaperIds(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setSelectedPaperIds(prev => Array.from(new Set([...prev, ...allIds])));
    }
  };

  // Add chapter
  const handleAddChapter = (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;
    const newId = `chap-${Date.now()}`;
    const updated = {
      ...thesisData,
      chapters: [
        ...chapters,
        { id: newId, name: newChapterTitle.trim(), papers: [] }
      ]
    };
    onUpdateWorkspace(updated);
    setActiveChapterId(newId);
    setNewChapterTitle('');
    setShowAddChapter(false);
  };

  // Trigger chapter delete confirmation modal
  const handleDeleteChapter = (e, chapterId, chapterName) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (chapters.length <= 1) {
      alert('Tez çalışma alanınızda en az bir bölüm bulunmalıdır.');
      return;
    }
    const chapterToDelete = chapters.find(c => c.id === chapterId);
    setPendingDeleteChapter({
      id: chapterId,
      name: chapterName,
      paperCount: chapterToDelete?.papers?.length || 0
    });
  };

  // Confirmed delete chapter action
  const confirmDeleteChapter = () => {
    if (!pendingDeleteChapter) return;
    const { id: chapterId, paperCount } = pendingDeleteChapter;
    const chapterToDelete = chapters.find(c => c.id === chapterId);
    const remainingChapters = chapters.filter(c => c.id !== chapterId);
    
    // If deleted chapter had papers, migrate them to the first remaining chapter so no references are lost
    if (paperCount > 0 && remainingChapters.length > 0) {
      const firstRemaining = remainingChapters[0];
      const mergedPapers = Array.from(new Set([...(firstRemaining.papers || []), ...(chapterToDelete?.papers || [])]));
      remainingChapters[0] = { ...firstRemaining, papers: mergedPapers };
    }

    const updated = {
      ...thesisData,
      chapters: remainingChapters
    };
    onUpdateWorkspace(updated);
    if (activeChapterId === chapterId && remainingChapters.length > 0) {
      setActiveChapterId(remainingChapters[0].id);
    }
    setPendingDeleteChapter(null);
  };

  // Remove paper from active chapter
  const handleRemoveFromChapter = (paperId) => {
    const updatedChapters = chapters.map(c => {
      if (c.id === activeChapterId) {
        return { ...c, papers: c.papers.filter(id => id !== paperId) };
      }
      return c;
    });
    onUpdateWorkspace({ ...thesisData, chapters: updatedChapters });
    setSelectedPaperIds(prev => prev.filter(id => id !== paperId));
  };

  // Save personal note
  const handleSaveNote = (paperId) => {
    const updatedNotes = { ...notes, [paperId]: tempNoteText };
    onUpdateWorkspace({ ...thesisData, notes: updatedNotes });
    setEditingNoteId(null);
  };

  // Generate Literature Review
  const handleGenerateReview = async () => {
    const papersToInclude = savedPapers.filter(p => selectedPaperIds.includes(p.id));
    if (papersToInclude.length === 0) {
      alert('Lütfen literatür taramasına dahil edilecek en az bir makale seçin (Kutucukları işaretleyin).');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await generateLiteratureReview({
        papers: papersToInclude,
        thesisTopic: thesisTopic || activeChapter?.name || 'Tez Literatür Taraması',
        language
      });
      setReviewResult(res);
    } catch (err) {
      alert('Literatür taraması oluşturulamadı: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download review as Markdown
  const handleDownloadMarkdown = () => {
    if (!reviewResult?.content) return;
    const blob = new Blob([reviewResult.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(thesisTopic || 'tez_literatur_taramasi').replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy review to clipboard
  const handleCopyReview = () => {
    if (!reviewResult?.content) return;
    navigator.clipboard.writeText(reviewResult.content);
    setCopiedReview(true);
    setTimeout(() => setCopiedReview(false), 2000);
  };

  return (
    <div className="thesis-view-container">
      {/* Sidebar: Chapters & Management */}
      <aside className="thesis-sidebar">
        <div className="thesis-sidebar-title">
          <BookOpen size={20} color="var(--primary)" />
          <span>Tez Bölümlerim</span>
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          {chapters.map(c => (
            <div
              key={c.id}
              className={`chapter-item ${c.id === activeChapterId ? 'active' : ''}`}
              onClick={() => setActiveChapterId(c.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', minWidth: 0, flex: 1 }}>
                <Folder size={16} style={{ flexShrink: 0 }} />
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {c.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                <span className="thesis-badge-count">{c.papers?.length || 0}</span>
                {chapters.length > 1 && (
                  <button
                    type="button"
                    className="chapter-delete-btn"
                    onClick={(e) => handleDeleteChapter(e, c.id, c.name)}
                    title={`"${c.name}" bölümünü sil`}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {showAddChapter ? (
          <form onSubmit={handleAddChapter} style={{ marginTop: '0.5rem' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Yeni Bölüm Adı (örn: Bölüm 4: Bulgular)..."
              value={newChapterTitle}
              onChange={e => setNewChapterTitle(e.target.value)}
              style={{
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '0.45rem 0.6rem',
                fontSize: '0.85rem',
                width: '100%',
                marginBottom: '0.5rem',
                background: '#fff'
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
                Ekle
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => setShowAddChapter(false)}
              >
                İptal
              </button>
            </div>
          </form>
        ) : (
          <button 
            className="btn-secondary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            onClick={() => setShowAddChapter(true)}
          >
            <PlusCircle size={15} />
            <span>Yeni Bölüm Ekle</span>
          </button>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            💡 <strong>İpucu:</strong> Arama ekranında beğendiğiniz makaleleri "Tezime Ekle" butonuyla buraya kaydedebilir, ardından tek tıkla tez bölümünüz için akademik literatür taraması üretebilirsiniz.
          </div>
        </div>
      </aside>

      {/* Main Panel: Papers in Chapter & Generator */}
      <main className="thesis-main-panel">
        <div className="thesis-header-actions">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ecfdf5', color: '#065f46', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.4rem' }}>
              <Sparkles size={12} />
              <span>Kitaplığım • Dr. Ekrem Kasapoğlu Tez Çalışma Alanı</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.8rem', color: 'var(--accent-navy)', margin: '0.2rem 0' }}>
              {activeChapter?.name || 'Bölüm Makaleleri'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Bu bölüme atanmış {chapterPapers.length} akademik makale bulunmaktadır.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {chapters.length > 1 && (
              <button 
                type="button"
                className="chapter-header-delete-btn" 
                onClick={(e) => handleDeleteChapter(e, activeChapter?.id, activeChapter?.name)}
                title={`"${activeChapter?.name}" bölümünü sil`}
              >
                <Trash2 size={13} />
                <span>Bu Bölümü Sil</span>
              </button>
            )}

            {savedPapers.length > 0 && (
              <button 
                className="btn-secondary" 
                onClick={() => downloadRISFile(savedPapers, 'tum_tez_kaynaklari_zotero.ris')}
                style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                title="Tez kütüphanenizdeki tüm makaleleri Zotero ve EndNote için .RIS dosyası olarak indirin"
              >
                <Download size={14} />
                <span>Tüm Kaynakları Zotero'ya Aktar (.RIS)</span>
              </button>
            )}

            {chapterPapers.length > 0 && (
              <button 
                className="btn-secondary" 
                onClick={handleSelectAllInChapter}
                style={{ fontSize: '0.85rem' }}
              >
                {chapterPapers.every(p => selectedPaperIds.includes(p.id)) 
                  ? 'Seçimi Kaldır' 
                  : 'Tümünü Seç'}
              </button>
            )}
          </div>
        </div>

        {/* Papers List */}
        {chapterPapers.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={44} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'var(--accent-navy)', marginBottom: '0.4rem' }}>Bu Bölümde Henüz Makale Yok</h3>
            <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
              Akademik Arama sekmesine gidip bir araştırma sorusu sorun ve ilginizi çeken makalelerdeki <strong>"Tezime Ekle"</strong> butonuna tıklayın.
            </p>
          </div>
        ) : (
          <div style={{ marginBottom: '2.5rem' }}>
            {chapterPapers.map(p => {
              const isSelected = selectedPaperIds.includes(p.id);
              const note = notes[p.id] || '';

              return (
                <div 
                  key={p.id}
                  style={{
                    background: '#ffffff',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1rem',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectPaper(p.id)}
                      style={{ marginTop: '0.35rem', cursor: 'pointer', width: '17px', height: '17px' }}
                      title="Literatür taraması oluşturucuya dahil et"
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        {p.studyType && (
                          <span className="badge badge-study" style={{ fontSize: '0.72rem' }}>
                            {p.studyType}
                          </span>
                        )}
                        {p.sampleSize && (
                          <span className="badge badge-sample" style={{ fontSize: '0.72rem' }}>
                            {p.sampleSize}
                          </span>
                        )}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {p.year} • {p.journal || 'Akademik Dergi'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--accent-navy)', marginBottom: '0.4rem' }}>
                        {p.title}
                      </h4>

                      {p.keyTakeaway && (
                        <p style={{ fontSize: '0.88rem', color: '#475569', fontStyle: 'italic', marginBottom: '0.6rem' }}>
                          "{p.keyTakeaway}"
                        </p>
                      )}

                      {/* Personal Note Box */}
                      {editingNoteId === p.id ? (
                        <div style={{ marginTop: '0.6rem' }}>
                          <textarea
                            value={tempNoteText}
                            onChange={e => setTempNoteText(e.target.value)}
                            placeholder="Tez araştırmanızla ilgili notunuzu yazın (örn: 2. bölümde metodoloji karşılaştırmasında referans verilecek)..."
                            style={{
                              width: '100%',
                              padding: '0.6rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-light)',
                              fontSize: '0.88rem',
                              fontFamily: 'inherit',
                              minHeight: '60px'
                            }}
                          />
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                            <button 
                              className="btn-primary" 
                              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                              onClick={() => handleSaveNote(p.id)}
                            >
                              Kaydet
                            </button>
                            <button 
                              className="btn-secondary" 
                              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                              onClick={() => setEditingNoteId(null)}
                            >
                              İptal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {note ? (
                            <div 
                              onClick={() => { setEditingNoteId(p.id); setTempNoteText(note); }}
                              style={{
                                background: '#fef9c3',
                                border: '1px solid #fef08a',
                                borderRadius: '6px',
                                padding: '0.4rem 0.75rem',
                                fontSize: '0.82rem',
                                color: '#854d0e',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                              }}
                              title="Notu düzenlemek için tıklayın"
                            >
                              <StickyNote size={14} />
                              <span><strong>Not:</strong> {note}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditingNoteId(p.id); setTempNoteText(''); }}
                              style={{
                                fontSize: '0.78rem',
                                color: 'var(--text-muted)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                            >
                              <StickyNote size={13} />
                              <span>+ Tez Notu Ekle</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Small Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                        <button 
                          onClick={() => onOpenCiteModal(p)}
                          style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Quote size={12} />
                          Atıf
                        </button>

                        {p.pdfUrl && (
                          <a 
                            href={p.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <FileText size={12} />
                            PDF Aç
                            <ExternalLink size={10} />
                          </a>
                        )}

                        <button 
                          onClick={() => handleRemoveFromChapter(p.id)}
                          style={{ fontSize: '0.8rem', color: '#ef4444', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          title="Bu makaleyi bu bölümden kaldır"
                        >
                          <Trash2 size={12} />
                          Kaldır
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Literature Review Generator Section */}
        {chapterPapers.length > 0 && (
          <div style={{
            background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)',
            border: '2px dashed var(--accent-teal)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.8rem',
            marginTop: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <Sparkles size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-navy)' }}>
                Otomatik Tez Literatür Taraması Üretici
              </h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Seçilen <strong>{selectedPaperIds.length}</strong> makaleyi akademik dilde (Giriş, Metodolojik Yaklaşımlar, Çelişkiler, Araştırma Boşluğu ve APA Kaynakça) sentezlenmiş tam bir tez alt bölümü taslağına dönüştürün.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.8rem', alignItems: 'center', marginBottom: '1.2rem' }}>
              <input
                type="text"
                className="search-input"
                placeholder="Tez Konunuz veya Alt Başlığınız (örn: Kreatin ve Bilişsel Bellek Performansı)..."
                value={thesisTopic}
                onChange={e => setThesisTopic(e.target.value)}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.65rem 1.2rem',
                  fontSize: '0.92rem'
                }}
              />

              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-light)',
                  background: '#fff',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <option value="tr">Türkçe Metin</option>
                <option value="en">English Academic</option>
              </select>

              <button
                className="btn-primary"
                onClick={handleGenerateReview}
                disabled={isGenerating || selectedPaperIds.length === 0}
                style={{ whiteSpace: 'nowrap' }}
              >
                <Sparkles size={16} />
                <span>{isGenerating ? 'Sentezleniyor...' : 'Literatür Taraması Üret'}</span>
              </button>
            </div>

            {/* Generated Review Output */}
            {reviewResult && (
              <div className="review-preview-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-navy)' }}>
                    {reviewResult.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button className="btn-secondary" onClick={handleCopyReview} style={{ fontSize: '0.85rem' }}>
                      {copiedReview ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      <span>{copiedReview ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
                    </button>
                    <button className="btn-primary" onClick={handleDownloadMarkdown} style={{ fontSize: '0.85rem' }}>
                      <Download size={14} />
                      <span>Markdown (.md) İndir</span>
                    </button>
                  </div>
                </div>

                <div className="review-preview-text">
                  {reviewResult.content}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Chapter Deletion Confirmation Modal */}
      {pendingDeleteChapter && (
        <div className="modal-overlay" onClick={() => setPendingDeleteChapter(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px', padding: '1.8rem', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
              <Trash2 size={26} />
            </div>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-navy)', marginBottom: '0.6rem' }}>
              Tez Bölümünü Sil
            </h3>
            
            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              <strong>"{pendingDeleteChapter.name}"</strong> bölümünü silmek istediğinize emin misiniz?
              {pendingDeleteChapter.paperCount > 0 ? (
                <span style={{ display: 'block', marginTop: '0.6rem', color: '#0d9488', fontWeight: 600, background: '#f0fdfa', padding: '0.5rem', borderRadius: '8px' }}>
                  ℹ️ Bu bölüme atanmış {pendingDeleteChapter.paperCount} akademik makale ana kütüphanenizde korunacaktır.
                </span>
              ) : (
                <span style={{ display: 'block', marginTop: '0.4rem', color: '#64748b' }}>
                  Bu bölüm kütüphanenizden güvenle kaldırılacaktır.
                </span>
              )}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setPendingDeleteChapter(null)}
                style={{ padding: '0.55rem 1.4rem', fontSize: '0.88rem' }}
              >
                Vazgeç
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={confirmDeleteChapter}
                style={{ background: '#dc2626', borderColor: '#dc2626', color: '#fff', padding: '0.55rem 1.4rem', fontSize: '0.88rem' }}
              >
                Evet, Bölümü Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
