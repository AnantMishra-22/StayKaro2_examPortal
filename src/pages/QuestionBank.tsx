import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { questionsApi } from '../lib/api/questions';
import { Plus, Upload, Download, Search, ChevronRight } from 'lucide-react';

export default function QuestionBank() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubjects() {
      const data = await questionsApi.getSubjects();
      setSubjects(data || []);
      if (data && data.length > 0 && !activeCategory) {
        setActiveCategory(data[0].id);
      }
    }
    loadSubjects();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      setLoading(true);
      questionsApi.getAll({ subjectId: activeCategory, search })
        .then((data: any) => setQuestions(data || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [activeCategory, search]);

  const diffColor = (d: string) => d === 'Easy' ? 'badge-active' : d === 'Medium' ? 'badge-pending' : 'badge-danger';

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file.name);
  };

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.05em' }}>
              📚 <span style={{ color: 'var(--color-accent-primary)' }}>QUESTION</span> BANK
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4 }}>Manage subjects and topics</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" style={{ fontSize: 12 }}><Download size={13} /> Export</button>
            <button className="btn btn-primary" style={{ fontSize: 12 }}><Plus size={13} /> Add Question</button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-disabled)' }} />
          <input className="input" type="text" placeholder="Search questions... (Press enter)" value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>

        {/* 3-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: 16, height: 'calc(100vh - 280px)' }}>
          {/* Left: Category tree */}
          <div className="card" style={{ overflow: 'auto' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>CATEGORIES</span>
            </div>
            <div style={{ padding: 8 }}>
              {subjects.map(sub => (
                <div key={sub.id}>
                  <button onClick={() => setActiveCategory(sub.id)}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: activeCategory === sub.id ? 'rgba(0,200,255,0.1)' : 'transparent', color: activeCategory === sub.id ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)', fontFamily: 'var(--font-display)', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: activeCategory === sub.id ? '2px solid var(--color-accent-primary)' : '2px solid transparent', transition: 'all 0.2s' }}>
                    <span>{sub.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7 }}>{sub.questions?.[0]?.count || 0}</span>
                  </button>
                  {activeCategory === sub.id && sub.topics?.map((topic: any) => (
                    <button key={topic.id} style={{ width: '100%', textAlign: 'left', padding: '7px 12px 7px 24px', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--color-text-disabled)', fontSize: 12, display: 'flex', justifyContent: 'space-between', borderRadius: 4, transition: 'all 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)'}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-disabled)'}>
                      <span><ChevronRight size={10} style={{ display: 'inline', marginRight: 4 }} />{topic.name}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Center: Questions */}
          <div className="card" style={{ overflow: 'auto' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>
                {subjects.find(c => c.id === activeCategory)?.name?.toUpperCase() || 'SELECT A'} QUESTIONS
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-accent-primary)' }}>
                {questions.length} questions
              </span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {loading ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-text-disabled)' }}>Loading...</div>
              ) : questions.map((q) => (
                <div key={q.id} className="card" style={{ padding: '18px 20px', borderLeft: '2px solid var(--color-accent-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className={`badge ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                      <span className="badge badge-muted">{q.topics?.name || 'No topic'}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--color-text-primary)', marginBottom: 6, lineHeight: 1.5 }}>{q.text}</p>
                  {q.text_te && <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 14, fontFamily: 'var(--font-body)' }}>{q.text_te}</p>}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {q.options.map((opt: string, oi: number) => (
                      <div key={oi} style={{ padding: '6px 10px', borderRadius: 4, background: oi === q.correct_index ? 'rgba(0,232,135,0.08)' : 'var(--color-bg-elevated)', border: `1px solid ${oi === q.correct_index ? 'rgba(0,232,135,0.3)' : 'transparent'}`, fontSize: 12, color: oi === q.correct_index ? 'var(--color-accent-success)' : 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, opacity: 0.7 }}>{String.fromCharCode(65 + oi)}.</span> {opt}
                        {oi === q.correct_index && <span style={{ marginLeft: 'auto', fontSize: 10 }}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Excel Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--color-accent-primary)', marginBottom: 16 }}>📥 EXCEL IMPORT</h3>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragging ? 'var(--color-accent-primary)' : 'rgba(0,200,255,0.2)'}`,
                  borderRadius: 8, padding: '32px 16px', textAlign: 'center', cursor: 'pointer',
                  background: dragging ? 'rgba(0,200,255,0.04)' : 'transparent',
                  transition: 'all 0.2s', marginBottom: 12,
                }}>
                <Upload size={28} style={{ color: 'var(--color-accent-primary)', marginBottom: 10, opacity: 0.7 }} />
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                  Drag & drop Excel file
                </p>
                <p style={{ fontSize: 11, color: 'var(--color-text-disabled)' }}>.xlsx / .xls supported</p>
                {uploadedFile && (
                  <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(0,232,135,0.08)', border: '1px solid rgba(0,232,135,0.2)', borderRadius: 4, fontSize: 12, color: 'var(--color-accent-success)' }}>
                    ✓ {uploadedFile}
                  </div>
                )}
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
                <Upload size={13} /> Browse File
              </button>
            </div>

            {/* Template preview */}
            <div className="card" style={{ padding: 16, overflow: 'auto' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 12 }}>TEMPLATE FORMAT</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg-elevated)' }}>
                    {['Question', 'A', 'B', 'C', 'D', 'Ans', 'Diff'].map(h => (
                      <th key={h} style={{ padding: '6px 8px', fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--color-text-disabled)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '5px 8px', color: 'var(--color-text-secondary)', fontSize: 10 }}>What is...</td>
                    <td style={{ padding: '5px 8px', color: 'var(--color-text-secondary)', fontSize: 10 }}>Opt A</td>
                    <td style={{ padding: '5px 8px', color: 'var(--color-accent-success)', fontSize: 10 }}>Opt B</td>
                    <td style={{ padding: '5px 8px', color: 'var(--color-text-secondary)', fontSize: 10 }}>Opt C</td>
                    <td style={{ padding: '5px 8px', color: 'var(--color-text-secondary)', fontSize: 10 }}>Opt D</td>
                    <td style={{ padding: '5px 8px', color: 'var(--color-accent-success)', fontSize: 10 }}>B</td>
                    <td style={{ padding: '5px 8px', color: 'var(--color-accent-warm)', fontSize: 10 }}>Med</td>
                  </tr>
                </tbody>
              </table>
              <button className="btn btn-outline" style={{ marginTop: 12, width: '100%', justifyContent: 'center', fontSize: 11 }}>
                <Download size={12} /> Download Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
