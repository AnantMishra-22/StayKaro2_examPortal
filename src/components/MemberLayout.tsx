
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Trophy } from 'lucide-react';

interface MemberLayoutProps {
  children: React.ReactNode;
  memberName?: string;
  memberCode?: string;
  rank?: number;
}

export default function MemberLayout({ children, memberName = 'Ravi Kumar', memberCode = 'SST-0042', rank = 3 }: MemberLayoutProps) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top navbar */}
      <header style={{
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 32px',
        height: 64,
        display: 'flex', alignItems: 'center', gap: 20,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 6, background: 'linear-gradient(135deg, var(--color-accent-primary), #0055aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: '#003546' }}>S</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--color-accent-primary)', letterSpacing: '0.08em' }}>SRISOULTECH</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Member info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--color-text-primary)' }}>{memberName}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-accent-primary)' }}>{memberCode}</div>
          </div>
          <div style={{ background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.3)', borderRadius: 4, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Trophy size={13} style={{ color: 'var(--color-accent-warm)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--color-accent-primary)' }}>#{rank}</span>
          </div>
          <div style={{ position: 'relative' }}>
            <Bell size={18} style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }} />
            <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--color-accent-warm)', color: '#000', borderRadius: '50%', width: 14, height: 14, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700 }}>2</span>
          </div>
          <button onClick={() => navigate('/member/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-disabled)' }}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: 32, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  );
}
