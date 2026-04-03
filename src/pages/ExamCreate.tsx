import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { examsApi } from '../lib/api/exams';
import { questionsApi } from '../lib/api/questions';

const STEPS = ['Basic Info', 'Questions', 'Settings', 'Review'];

export default function ExamCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [form, setForm] = useState({
    titleEn: '', titleTe: '', subject: '', questions: 50, duration: 60,
    shuffle: true, shuffleOptions: false,
    permission: 'all', difficulty: { easy: 40, medium: 40, hard: 20 },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    questionsApi.getSubjects().then((res: any) => setSubjects(res || []));
  }, []);

  const update = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const publishExam = async () => {
    setLoading(true);
    try {
      await examsApi.create({
        title: form.titleEn || 'Untitled',
        title_te: form.titleTe,
        subject_id: form.subject || undefined,
        total_questions: form.questions,
        duration_minutes: form.duration,
        shuffle_questions: form.shuffle,
        shuffle_options: form.shuffleOptions,
        permission_type: form.permission as 'all' | 'selected',
        difficulty_easy_pct: form.difficulty.easy,
        difficulty_med_pct: form.difficulty.medium,
        difficulty_hard_pct: form.difficulty.hard
      });
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to create exam');
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 1100, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
          <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 12 }}>Dashboard</button>
          <ChevronRight size={12} />
          <span>Exams</span>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--color-accent-primary)' }}>Create New Exam</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.05em', marginBottom: 32 }}>
          ✏️ <span style={{ color: 'var(--color-accent-primary)' }}>CREATE</span> NEW EXAM
        </h1>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i < step ? 'var(--color-accent-success)' : i === step ? 'var(--color-accent-primary)' : 'var(--color-bg-highest)',
                  color: i <= step ? '#003546' : 'var(--color-text-disabled)',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                  boxShadow: i === step ? 'var(--shadow-glow-cyan)' : 'none',
                  transition: 'all 0.3s',
                }}>
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: i === step ? 'var(--color-accent-primary)' : i < step ? 'var(--color-accent-success)' : 'var(--color-text-disabled)', letterSpacing: '0.05em' }}>{s.toUpperCase()}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? 'var(--color-accent-success)' : 'var(--color-bg-highest)', margin: '0 16px', transition: 'background 0.3s' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
          {/* Form */}
          <div className="card" style={{ padding: 32 }}>
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--color-accent-primary)', marginBottom: 4 }}>BASIC INFORMATION</h2>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 8 }}>EXAM TITLE (ENGLISH)</label>
                  <input className="input" placeholder="e.g. CS Fundamentals" value={form.titleEn} onChange={e => update('titleEn', e.target.value)} />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 8 }}>EXAM TITLE (TELUGU — పరీక్ష పేరు)</label>
                  <input className="input" placeholder="ఉదా: కంప్యూటర్ సైన్స్ ప్రాథమిక అంశాలు" value={form.titleTe} onChange={e => update('titleTe', e.target.value)} />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 8 }}>SUBJECT</label>
                  <select className="input" value={form.subject} onChange={e => update('subject', e.target.value)}>
                    <option value="">Select subject...</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 8 }}>TOTAL QUESTIONS</label>
                    <input className="input" type="number" min={1} max={200} value={form.questions} onChange={e => update('questions', parseInt(e.target.value))} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 8 }}>TIME LIMIT (MINUTES)</label>
                    <input className="input" type="number" min={5} max={300} value={form.duration} onChange={e => update('duration', parseInt(e.target.value))} />
                  </div>
                </div>

                {/* Difficulty sliders */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 16 }}>DIFFICULTY MIX</label>
                  {[
                    { key: 'easy', label: 'Easy', color: 'var(--color-accent-success)' },
                    { key: 'medium', label: 'Medium', color: 'var(--color-accent-warm)' },
                    { key: 'hard', label: 'Hard', color: 'var(--color-accent-danger)' },
                  ].map(d => (
                    <div key={d.key} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: d.color }}>{d.label}</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: d.color }}>{form.difficulty[d.key as keyof typeof form.difficulty]}%</span>
                      </div>
                      <input type="range" min={0} max={100} value={form.difficulty[d.key as keyof typeof form.difficulty]}
                        onChange={e => update('difficulty', { ...form.difficulty, [d.key]: parseInt(e.target.value) })}
                        style={{ width: '100%', accentColor: d.color }} />
                    </div>
                  ))}
                </div>

                {/* Toggles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { key: 'shuffle', label: 'Shuffle Questions', val: form.shuffle },
                    { key: 'shuffleOptions', label: 'Shuffle Options', val: form.shuffleOptions },
                  ].map(t => (
                    <div key={t.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-elevated)', padding: '14px 16px', borderRadius: 6 }}>
                      <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{t.label}</span>
                      <button onClick={() => update(t.key, !t.val)} style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: t.val ? 'var(--color-accent-primary)' : 'var(--color-bg-highest)', transition: 'background 0.2s', position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: t.val ? 23 : 3, transition: 'left 0.2s' }} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Permission */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 12 }}>PERMISSION</label>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {[{ val: 'all', label: 'All Members' }, { val: 'selected', label: 'Selected Members Only' }].map(p => (
                      <label key={p.val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: form.permission === p.val ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                        <input type="radio" name="permission" value={p.val} checked={form.permission === p.val} onChange={() => update('permission', p.val)} style={{ accentColor: 'var(--color-accent-primary)' }} />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step > 0 && step < 3 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--color-text-disabled)', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 40 }}>🚧</div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>STEP {step + 1}: {STEPS[step].toUpperCase()}</span>
                <span style={{ fontSize: 13 }}>Continue flow — placeholder for step {step + 1}</span>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--color-accent-success)', marginBottom: 4 }}>✓ EXAM READY TO PUBLISH</h2>
                {[
                  { label: 'Title', val: form.titleEn || '(not set)' },
                  { label: 'Telugu Title', val: form.titleTe || '(not set)' },
                  { label: 'Subject ID', val: form.subject || '(not set)' },
                  { label: 'Questions', val: form.questions },
                  { label: 'Duration', val: `${form.duration} minutes` },
                  { label: 'Permission', val: form.permission === 'all' ? 'All Members' : 'Selected Members' },
                  { label: 'Difficulty', val: `Easy ${form.difficulty.easy}% / Medium ${form.difficulty.medium}% / Hard ${form.difficulty.hard}%` },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--color-text-secondary)' }}>{r.label}</span>
                    <span style={{ fontSize: 13, color: 'var(--color-text-primary)', textAlign: 'right', maxWidth: 280 }}>{String(r.val)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action bar */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
              {step > 0 && <button className="btn btn-outline" onClick={() => setStep(s => s - 1)} style={{ fontSize: 12, opacity: loading ? 0.5 : 1 }} disabled={loading}><ChevronLeft size={14} /> BACK</button>}
              {step < STEPS.length - 1
                ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} style={{ fontSize: 12 }}>CONTINUE <ChevronRight size={14} /></button>
                : <button className="btn btn-primary" onClick={publishExam} disabled={loading} style={{ fontSize: 12 }}>{loading ? 'PUBLISHING...' : '🚀 PUBLISH EXAM'}</button>
              }
            </div>
          </div>

          {/* Preview sidebar */}
          <div className="card" style={{ padding: 20, height: 'fit-content', position: 'sticky', top: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-accent-primary)', marginBottom: 16 }}>EXAM PREVIEW</h3>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{form.titleEn || 'Untitled Exam'}</div>
            {form.titleTe && <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12, fontFamily: 'var(--font-body)' }}>{form.titleTe}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {[
                { label: 'Subject', val: subjects.find(s => s.id === form.subject)?.name || '—' },
                { label: 'Duration', val: `${form.duration} min` },
                { label: 'Total Questions', val: form.questions },
                { label: 'Permission', val: form.permission === 'all' ? 'Open to All' : 'Selected Only' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-disabled)' }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{r.val}</span>
                </div>
              ))}
            </div>

            {/* Mini donut bars */}
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 10 }}>DIFFICULTY BREAKDOWN</div>
            {[
              { label: 'Easy', pct: form.difficulty.easy, color: 'var(--color-accent-success)' },
              { label: 'Med', pct: form.difficulty.medium, color: 'var(--color-accent-warm)' },
              { label: 'Hard', pct: form.difficulty.hard, color: 'var(--color-accent-danger)' },
            ].map(d => (
              <div key={d.label} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11 }}>
                  <span style={{ color: d.color }}>{d.label}</span>
                  <span style={{ color: d.color, fontFamily: 'var(--font-mono)' }}>{d.pct}%</span>
                </div>
                <div style={{ height: 4, background: 'var(--color-bg-highest)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: 2, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
