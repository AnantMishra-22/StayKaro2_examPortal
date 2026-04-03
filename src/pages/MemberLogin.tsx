import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, UserCircle, ChevronRight, Trophy, BookOpen, Star } from 'lucide-react';

export default function MemberLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });

    if (authError) {
      setError(authError.message);
    } else {
      navigate('/member/dashboard');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Floating hexagons */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', width: 80 + i * 30, height: 80 + i * 30,
            border: '1px solid rgba(0,200,255,0.06)', borderRadius: 12,
            top: `${15 + i * 16}%`, left: `${5 + i * 18}%`,
            transform: 'rotate(30deg)',
            animation: `float ${5 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }} />
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 460, animation: 'fadeIn 0.5s ease' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,200,255,0.2), rgba(0,80,120,0.4))', border: '2px solid rgba(0,200,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--shadow-glow-cyan)' }}>
            <UserCircle size={32} style={{ color: 'var(--color-accent-primary)' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--color-accent-primary)' }}>
            MEMBER PORTAL
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 2, fontFamily: 'var(--font-body)' }}>SriSoulTech Exam System</p>
          <p style={{ color: 'var(--color-text-disabled)', fontSize: 12, marginTop: 2, fontFamily: 'var(--font-body)' }}>మీ పరీక్ష ప్రారంభించండి</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 32, boxShadow: 'var(--shadow-card)' }}>
          {error && (
            <div style={{ background: 'rgba(255,61,90,0.08)', border: '1px solid rgba(255,61,90,0.3)', borderRadius: 6, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: 'var(--color-accent-danger)' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 8 }}>MEMBER EMAIL</label>
              <input className="input" type="email" placeholder="member@srisoultech.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 8 }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPass ? 'text' : 'password'} placeholder="Enter password" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required style={{ paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Stats strip */}
            <div style={{ background: 'var(--color-bg-elevated)', borderRadius: 6, padding: '12px 16px', display: 'flex', justifyContent: 'space-around', gap: 12 }}>
              {[
                { icon: BookOpen, val: '12', label: 'Exams' },
                { icon: Trophy, val: '#3', label: 'Rank' },
                { icon: Star, val: '78.4%', label: 'Avg' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--color-accent-primary)' }}>{s.val}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--color-text-disabled)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 13, opacity: loading ? 0.7 : 1 }}>
              {loading ? <span>VERIFYING...</span> : 'START EXAM SESSION →'}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-disabled)' }}>Forgot PIN? </span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 12, textDecoration: 'underline', fontFamily: 'var(--font-body)' }}>
              Contact Admin
            </button>
          </div>

          {/* Demo hint */}
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(0,200,255,0.04)', borderRadius: 6, border: '1px solid rgba(0,200,255,0.1)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-disabled)' }}>Test: realmember@srisoultech.com / password123</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => navigate('/admin/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, margin: '0 auto' }}>
            Admin Login <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
