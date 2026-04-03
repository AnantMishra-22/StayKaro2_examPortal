import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockQuestions } from '../data/mockData';
import { Flag, X, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

const TOTAL_TIME = 23 * 60 + 47; // seconds

export default function LiveExam() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [warnings, setWarnings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [lang, setLang] = useState<'en' | 'te'>('en');
  const [showSubmit, setShowSubmit] = useState(false);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  // Anti-cheat
  useEffect(() => {
    const handler = () => {
      if (document.hidden) {
        const w = warnings + 1;
        setWarnings(w);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 4000);
        if (w >= 3) setShowSubmit(true);
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [warnings]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft < 300;
  const q = mockQuestions[current % mockQuestions.length];

  const statusOf = (i: number) => {
    if (i === current) return 'current';
    if (marked.has(i)) return 'marked';
    if (answers[i] !== undefined) return 'answered';
    return 'unanswered';
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'current': return 'var(--color-accent-primary)';
      case 'answered': return 'var(--color-accent-success)';
      case 'marked': return 'var(--color-accent-warm)';
      default: return 'var(--color-bg-highest)';
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-base)', overflow: 'hidden' }}>
      {/* Anti-cheat warning toast */}
      {showWarning && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 200, animation: 'fadeIn 0.3s ease', background: 'rgba(255,157,0,0.12)', border: '1px solid rgba(255,157,0,0.5)', borderRadius: 8, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={16} style={{ color: 'var(--color-accent-warm)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--color-accent-warm)' }}>
            ⚠ Tab switching detected (Warning {warnings}/3)
          </span>
        </div>
      )}

      {/* Top Bar */}
      <div style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--color-accent-primary)', letterSpacing: '0.08em' }}>CS FUNDAMENTALS</div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 4, background: 'var(--color-bg-highest)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((current + 1) / mockQuestions.length) * 100}%`, background: 'var(--color-accent-primary)', transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Question {current + 1} of {mockQuestions.length}
          </div>
        </div>

        {/* Timer */}
        <div style={{ background: isWarning ? 'rgba(255,157,0,0.1)' : 'var(--color-bg-elevated)', border: `1px solid ${isWarning ? 'rgba(255,157,0,0.4)' : 'var(--color-border)'}`, borderRadius: 6, padding: '8px 16px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-secondary)', marginBottom: 2 }}>TIME LEFT</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: isWarning ? 'var(--color-accent-warm)' : 'var(--color-text-primary)', animation: isWarning ? 'pulse-amber 1.5s infinite' : 'none' }}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Language toggle */}
        <button onClick={() => setLang(l => l === 'en' ? 'te' : 'en')} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '6px 12px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 11 }}>
          {lang === 'en' ? '🌐 EN | తె' : '🌐 తె | EN'}
        </button>

        {warnings > 0 && (
          <div style={{ background: 'rgba(255,61,90,0.1)', border: '1px solid rgba(255,61,90,0.3)', borderRadius: 4, padding: '6px 12px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--color-accent-danger)' }}>⚠ {warnings} WARNING{warnings > 1 ? 'S' : ''}</span>
          </div>
        )}
      </div>

      {/* Main content + Sidebar */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Question Area */}
        <div style={{ flex: 1, padding: 32, overflow: 'auto' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Question number */}
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--color-accent-primary)', marginBottom: 16 }}>
              QUESTION {String(current + 1).padStart(2, '0')}
            </div>

            {/* Question text */}
            <div className="card" style={{ padding: 28, marginBottom: 24, borderLeft: '3px solid var(--color-accent-primary)' }}>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--color-text-primary)', marginBottom: lang === 'te' ? 12 : 0 }}>
                {q.text}
              </p>
              {lang === 'te' && (
                <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
                  {q.teluguText}
                </p>
              )}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {q.options.map((opt, i) => {
                const isSelected = answers[current] === i;
                return (
                  <button key={i} onClick={() => setAnswers(a => ({ ...a, [current]: i }))}
                    style={{
                      textAlign: 'left', padding: '16px 20px',
                      background: isSelected ? 'rgba(0,200,255,0.08)' : 'var(--color-bg-surface)',
                      border: `1px solid ${isSelected ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
                      borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: 16,
                      boxShadow: isSelected ? 'var(--shadow-glow-cyan)' : 'none',
                    }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                      background: isSelected ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
                      color: isSelected ? '#003546' : 'var(--color-text-secondary)',
                    }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span style={{ fontSize: 14, color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', lineHeight: 1.5 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right navigator */}
        <div style={{ width: 260, background: 'var(--color-bg-surface)', borderLeft: '1px solid var(--color-border)', padding: 20, overflow: 'auto', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 16 }}>QUESTION NAVIGATOR</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 24 }}>
            {mockQuestions.map((_, i) => {
              const status = statusOf(i);
              return (
                <button key={i} onClick={() => setCurrent(i)}
                  style={{ aspectRatio: '1', border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, background: statusColor(status), color: status === 'current' || status === 'answered' || status === 'marked' ? '#fff' : 'var(--color-text-disabled)', boxShadow: status === 'current' ? 'var(--shadow-glow-cyan)' : 'none', transition: 'all 0.15s' }}>
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {[
              { color: 'var(--color-accent-primary)', label: 'Current' },
              { color: 'var(--color-accent-success)', label: 'Answered' },
              { color: 'var(--color-accent-warm)', label: 'Marked' },
              { color: 'var(--color-bg-highest)', label: 'Not visited' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: l.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-secondary)' }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ background: 'var(--color-bg-elevated)', borderRadius: 6, padding: 16, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, textAlign: 'center' }}>
              <div><div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-accent-success)' }}>{Object.keys(answers).length}</div><div style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>Answered</div></div>
              <div><div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-accent-warm)' }}>{marked.size}</div><div style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>Marked</div></div>
            </div>
          </div>

          {/* Submit */}
          <button onClick={() => setShowSubmit(true)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 12 }}>
            SUBMIT EXAM →
          </button>
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{ background: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={() => setMarked(m => { const s = new Set(m); s.has(current) ? s.delete(current) : s.add(current); return s; })} className="btn btn-amber" style={{ fontSize: 12, padding: '8px 16px' }}>
          <Flag size={13} /> {marked.has(current) ? 'UNMARK' : 'MARK FOR REVIEW'}
        </button>
        {answers[current] !== undefined && (
          <button onClick={() => setAnswers(a => { const n = { ...a }; delete n[current]; return n; })} className="btn btn-outline" style={{ fontSize: 12, padding: '8px 16px', color: 'var(--color-accent-danger)', borderColor: 'rgba(255,61,90,0.3)' }}>
            <X size={13} /> CLEAR
          </button>
        )}
        <div style={{ flex: 1 }} />
        <button onClick={() => setCurrent(c => Math.max(0, c - 1))} className="btn btn-outline" disabled={current === 0} style={{ fontSize: 12 }}>
          <ChevronLeft size={14} /> PREV
        </button>
        <button onClick={() => setCurrent(c => Math.min(mockQuestions.length - 1, c + 1))} className="btn btn-outline" style={{ fontSize: 12 }}>
          NEXT <ChevronRight size={14} />
        </button>
      </div>

      {/* Submit modal */}
      {showSubmit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div className="card" style={{ width: 400, padding: 32, animation: 'fadeIn 0.3s ease', borderColor: 'rgba(0,200,255,0.3)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 12, color: 'var(--color-accent-primary)' }}>SUBMIT EXAM?</h2>
            <div style={{ marginBottom: 24, color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
              <div>Questions answered: <span style={{ color: 'var(--color-accent-success)', fontFamily: 'var(--font-display)' }}>{Object.keys(answers).length}/{mockQuestions.length}</span></div>
              <div>Marked for review: <span style={{ color: 'var(--color-accent-warm)', fontFamily: 'var(--font-display)' }}>{marked.size}</span></div>
              {mockQuestions.length - Object.keys(answers).length > 0 && (
                <div>Unanswered: <span style={{ color: 'var(--color-accent-danger)', fontFamily: 'var(--font-display)' }}>{mockQuestions.length - Object.keys(answers).length}</span></div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" onClick={() => navigate('/member/results/1')} style={{ flex: 1, justifyContent: 'center' }}>CONFIRM SUBMIT</button>
              <button className="btn btn-outline" onClick={() => setShowSubmit(false)} style={{ flex: 1, justifyContent: 'center' }}>CONTINUE EXAM</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
