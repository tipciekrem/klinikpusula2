import React, { useState } from 'react';
import { Sparkles, HelpCircle, ArrowRight, BookMarked, Search, CheckCircle } from 'lucide-react';
import { refineTopic } from '../services/api';

export default function HypothesisHelper({ onTriggerSearch }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRefine = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const data = await refineTopic(topic.trim());
      setResult(data);
    } catch (err) {
      alert('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.35rem 0.9rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.8rem' }}>
          <Sparkles size={15} />
          Tez Metodolojisi & Hipotez Asistanı
        </div>
        <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.4rem', color: 'var(--accent-navy)', marginBottom: '0.8rem' }}>
          Tez Konunuzu Akademik Soru ve Hipotezlere Dönüştürün
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          Aklınızdaki ham çalışma konusunu yazın; yapay zeka birincil araştırma sorusu, alt sorular, H0/H1 hipotezleri ve literatür arama terimleri önersin.
        </p>
      </div>

      <div className="search-bar-wrapper" style={{ marginBottom: '2rem' }}>
        <form className="search-input-form" onSubmit={handleRefine}>
          <HelpCircle size={22} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Tez konunuzu veya araştırma alanınızı yazın (örn: Mobil sağlık uygulamalarının diyabet yönetiminde hasta uyumuna etkisi)..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button 
            type="submit" 
            className="search-submit-btn"
            disabled={loading || !topic.trim()}
          >
            <span>{loading ? 'Analiz Ediliyor...' : 'Hipotez Türet'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {result && (
        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          {/* Primary Question */}
          <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
            <span className="hypo-badge">Birincil Araştırma Sorusu (Primary Research Question)</span>
            <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-editorial)', color: 'var(--accent-navy)', marginTop: '0.4rem', lineHeight: '1.4' }}>
              "{result.primaryQuestion}"
            </h3>
          </div>

          {/* Sub Questions */}
          <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#334155', marginBottom: '0.8rem' }}>
              Alt Araştırma Soruları (Sub-Questions):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {result.subQuestions.map((sq, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: '#1e293b' }}>
                  <CheckCircle size={17} style={{ color: 'var(--accent-teal)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <span>{sq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hypotheses */}
          <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#334155', marginBottom: '0.8rem' }}>
              Test Edilebilir Hipotezler (Hypothesis Set):
            </h4>
            <div className="hypothesis-grid">
              {result.hypotheses.map((h, idx) => (
                <div key={idx} className="hypo-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.95rem' }}>{h.code}:</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.type}</span>
                  </div>
                  <p className="hypo-statement">{h.statement}</p>
                  <button
                    type="button"
                    onClick={() => onTriggerSearch(h.statement)}
                    className="btn-secondary"
                    style={{
                      marginTop: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.82rem',
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      fontWeight: '600'
                    }}
                  >
                    <Search size={14} />
                    <span>Bu Hipotez İçin Literatürü & Makaleleri Tara</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Search Queries */}
          <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#334155', marginBottom: '0.8rem' }}>
              KlinikPusula İçin Tavsiye Edilen Akademik Arama Terimleri:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {result.recommendedQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onTriggerSearch(q)}
                  className="example-pill"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  title="KlinikPusula arama motorunda anında tara"
                >
                  <Search size={13} />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Thesis Chapter Structure */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#334155', marginBottom: '0.8rem' }}>
              Önerilen Tez Bölüm Taslağı (YÖK ve Uluslararası Standart):
            </h4>
            <ol style={{ paddingLeft: '1.2rem', fontSize: '0.92rem', color: '#475569', lineHeight: '1.8' }}>
              {result.thesisChapterStructure.map((chap, idx) => (
                <li key={idx}><strong>Bölüm {idx + 1}:</strong> {chap}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
