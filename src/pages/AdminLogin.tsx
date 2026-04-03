import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, Shield, AlertCircle, ChevronRight } from 'lucide-react';

export default function AdminLogin() {
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
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Scan line animation */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--color-accent-primary), transparent)', opacity: 0.4, animation: 'scan-line 4s linear infinite' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 440, animation: 'fadeIn 0.5s ease' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg, var(--color-accent-primary), #003d5b)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--shadow-glow-cyan)' }}>
            <Shield size={24} style={{ color: '#fff' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--color-accent-primary)' }}>
            ADMIN PORTAL
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4, fontFamily: 'var(--font-body)' }}>SriSoulTech Exam System</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 32, boxShadow: 'var(--shadow-card)' }}>
          {error && (
            <div style={{ background: 'rgba(255,61,90,0.08)', border: '1px solid rgba(255,61,90,0.3)', borderRadius: 6, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={16} style={{ color: 'var(--color-accent-danger)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--color-accent-danger)', fontFamily: 'var(--font-body)' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 8 }}>ADMIN EMAIL</label>
              <input className="input" type="email" placeholder="admin@srisoultech.com" value={form.email}
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

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 13, marginTop: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 14, height: 14, border: '2px solid #003546', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite', display: 'inline-block' }} />
                  AUTHENTICATING...
                </span>
              ) : 'SECURE LOGIN →'}
            </button>
          </form>

          {/* Hint */}
          <div style={{ marginTop: 20, padding: '10px 14px', background: 'rgba(0,200,255,0.04)', borderRadius: 6, border: '1px solid rgba(0,200,255,0.1)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-disabled)' }}>Test: realadmin@srisoultech.com / password123</p>
          </div>
        </div>

        {/* Member login link */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => navigate('/member/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, margin: '0 auto' }}>
            Member Login <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
