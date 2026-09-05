import React, { useState } from 'react';
import { Upload, X, FileText, Check, Sparkles } from 'lucide-react';
import { uploadPrivateDoc } from '../services/api';

export default function PrivateDocModal({ chapters = [], onClose, onDocUploaded }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]?.id || 'chap-1');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTitle(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      setContent(event.target.result || '');
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Lütfen bir başlık ve belge içeriği girin.');
      return;
    }

    setLoading(true);
    try {
      const res = await uploadPrivateDoc({
        filename: `${title.trim()}.txt`,
        title: title.trim(),
        content: content.trim(),
        chapterId: selectedChapter
      });
      alert('Özel belgeniz başarıyla tez kütüphanenize eklendi!');
      if (onDocUploaded) onDocUploaded(res.document);
      onClose();
    } catch (err) {
      alert('Belge yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} color="var(--primary)" />
            <h3 className="modal-title">Özel Belge & PDF Notu Yükle</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Bilgisayarınızdaki özel tez notlarınızı veya makale metinlerinizi yükleyin; KlinikPusula bu belgeleri 250M açık makale ile birlikte indekslesin.
            </p>

            <div style={{
              border: '2px dashed var(--border-light)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              marginBottom: '1.2rem',
              background: '#f8fafc',
              cursor: 'pointer'
            }}>
              <FileText size={32} style={{ color: 'var(--text-light)', margin: '0 auto 0.6rem' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent-navy)', marginBottom: '0.3rem' }}>
                Dosya Seçin (TXT, MD, PDF Notları)
              </div>
              <input
                type="file"
                accept=".txt,.md,.text"
                onChange={handleFileUpload}
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Belge / Not Başlığı:
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Örn: 2026 Saha Verileri ve Pilot Test Notları..."
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Atanacak Tez Bölümü:
              </label>
              <select
                value={selectedChapter}
                onChange={e => setSelectedChapter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.9rem',
                  background: '#fff'
                }}
              >
                {chapters.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Belge İçeriği / Not Metni:
              </label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={5}
                placeholder="Metni buraya yapıştırın veya dosya yükleyin..."
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit'
                }}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Yükleniyor...' : 'Kütüphaneme Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
