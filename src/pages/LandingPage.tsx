import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [count, setCount] = useState({ members: 0, questions: 0, exams: 0, accuracy: 0 });

  useEffect(() => {
    const targets = { members: 500, questions: 1000, exams: 50, accuracy: 99 };
    const duration = 2000;
    const steps = 60;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      setCount({
        members: Math.round(targets.members * progress),
        questions: Math.round(targets.questions * progress),
        exams: Math.round(targets.exams * progress),
        accuracy: Math.round(targets.accuracy * progress),
      });
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: '🎯', title: 'Smart Exams', teluguTitle: 'స్మార్ట్ పరీక్షలు', desc: 'AI-powered adaptive questioning system' },
    { icon: '🛡️', title: 'Anti-Cheat', teluguTitle: 'మోసం నిరోధక', desc: 'Tab-switch detection & fullscreen enforcement' },
    { icon: '📊', title: 'Analytics', teluguTitle: 'విశ్లేషణలు', desc: 'Real-time performance dashboards' },
    { icon: '🌐', title: 'Bilingual', teluguTitle: 'ద్విభాషా', desc: 'Full English & Telugu interface' },
    { icon: '📥', title: 'Excel Import', teluguTitle: 'ఎక్సెల్ దిగుమతి', desc: 'Bulk question upload via spreadsheets' },
    { icon: '📄', title: 'PDF Reports', teluguTitle: 'PDF నివేదికలు', desc: 'Instant certificate & result downloads' },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Animated background particles */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 60 + i * 20, height: 60 + i * 20,
            border: '1px solid rgba(0,200,255,0.08)',
            borderRadius: '50%',
            top: `${10 + i * 15}%`,
            left: `${5 + i * 14}%`,
            animation: `float ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}
      </div>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(9,12,16,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 48px', height: 60,
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={24} style={{ color: 'var(--color-accent-primary)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--color-accent-primary)', letterSpacing: '0.1em' }}>SRISOULTECH</span>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-outline" onClick={() => navigate('/admin/login')} style={{ fontSize: 12 }}>Admin Login</button>
        <button className="btn btn-primary" onClick={() => navigate('/member/login')} style={{ fontSize: 12 }}>Member Login</button>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 48px 80px', position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <div className="badge badge-cyan" style={{ marginBottom: 24, display: 'inline-flex' }}>
          ⚡ Powered by AI · Bilingual · Secure
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 16 }}>
          <span style={{ color: 'var(--color-text-primary)' }}>Smart Exams.</span>
          <br />
          <span style={{ color: 'var(--color-accent-primary)', textShadow: '0 0 30px rgba(0,200,255,0.4)' }}>Real Results.</span>
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
          మీ నైపుణ్యాన్ని పరీక్షించుకోండి — తెలుగులో & ఇంగ్లీష్‌లో
        </p>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 48, fontSize: 15 }}>
          The complete exam management platform for Sri Soul Tech members
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/member/login')} style={{ padding: '14px 32px', fontSize: 14 }}>
            🚀 Start Your Exam
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/admin/login')} style={{ padding: '14px 32px', fontSize: 14 }}>
            Admin Portal →
          </button>
        </div>
      </section>

      {/* Stats Strip */}
      <section style={{ background: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '32px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { label: 'Members', value: count.members + '+', color: 'var(--color-accent-primary)' },
            { label: 'Questions', value: count.questions + '+', color: 'var(--color-accent-success)' },
            { label: 'Exams Conducted', value: count.exams + '+', color: 'var(--color-accent-warm)' },
            { label: 'Accuracy Rate', value: count.accuracy + '%', color: 'var(--color-accent-primary)' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 800, color: stat.color, textShadow: `0 0 20px ${stat.color}40` }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, textAlign: 'center', marginBottom: 48, color: 'var(--color-text-primary)' }}>
          BUILT FOR <span style={{ color: 'var(--color-accent-primary)' }}>EXCELLENCE</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map(f => (
            <div key={f.title} className="card" style={{ padding: 28, cursor: 'default' }} onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,200,255,0.4)';
              (e.currentTarget as HTMLDivElement).style.background = 'var(--color-bg-elevated)';
            }} onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
              (e.currentTarget as HTMLDivElement).style.background = 'var(--color-bg-surface)';
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--color-accent-primary)', marginBottom: 2 }}>{f.title}</h3>
              <p style={{ fontSize: 11, color: 'var(--color-accent-primary)', opacity: 0.7, marginBottom: 8, fontFamily: 'var(--font-body)' }}>{f.teluguTitle}</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Strip */}
      <section style={{ background: 'linear-gradient(135deg, rgba(0,200,255,0.08), rgba(0,100,170,0.08))', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 16 }}>Ready to Test Your Knowledge?</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, fontFamily: 'var(--font-body)' }}>మీ పరీక్ష ప్రారంభించడానికి లాగిన్ అవ్వండి</p>
        <button className="btn btn-primary" onClick={() => navigate('/member/login')} style={{ padding: '14px 40px', fontSize: 14 }}>
          GET STARTED →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 48px', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-disabled)' }}>
          © 2026 SriSoulTech Exam Portal · All systems operational ✓
        </p>
      </footer>
    </div>
  );
}
