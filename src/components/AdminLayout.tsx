import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Bell, Globe, LogOut, Menu, X, LayoutDashboard, Users, BookOpen, ClipboardList, BarChart3, Send } from 'lucide-react';

import { notificationsApi } from '../lib/api/notifications';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
}

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', teluguLabel: 'డ్యాష్‌బోర్డ్' },
  { to: '/admin/members', icon: Users, label: 'Members', teluguLabel: 'సభ్యులు' },
  { to: '/admin/exams', icon: ClipboardList, label: 'Exams', teluguLabel: 'పరీక్షలు' },
  { to: '/admin/questions', icon: BookOpen, label: 'Question Bank', teluguLabel: 'ప్రశ్న బ్యాంక్' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', teluguLabel: 'విశ్లేషణలు' },
  { to: '/admin/notifications', icon: Send, label: 'Notifications', teluguLabel: 'నోటిఫికేషన్లు' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lang, setLang] = useState<'en' | 'te'>('en');
  const [tickerPos, setTickerPos] = useState(0);
  const [tickerMessages, setTickerMessages] = useState<string[]>(['Loading announcements...']);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTicker() {
      try {
        const msgs = await notificationsApi.getTicker();
        if (msgs && msgs.length > 0) {
          setTickerMessages(msgs.map((m: any) => lang === 'te' && m.message_te ? m.message_te : m.message));
        } else {
          setTickerMessages(['Welcome to Sri Soul Tech Portal']);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchTicker();
  }, [lang]);

  useEffect(() => {
    const interval = setInterval(() => setTickerPos(p => (p + 1) % tickerMessages.length), 4000);
    return () => clearInterval(interval);
  }, [tickerMessages.length]);

  const handleLogout = () => navigate('/');

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 64,
        background: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--color-accent-primary), #0066aa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: '#003546',
          }}>S</div>
          {sidebarOpen && (
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--color-accent-primary)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
              SRISOULTECH
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 6,
              color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
              background: isActive ? 'rgba(0,200,255,0.08)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
              textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden',
              fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
            })}>
              <item.icon size={18} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span>{lang === 'en' ? item.label : item.teluguLabel}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: 16, borderTop: '1px solid var(--color-border)' }}>
          <button onClick={() => setSidebarOpen(o => !o)} className="btn btn-outline" style={{ padding: '8px', width: '100%', justifyContent: 'center' }}>
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <header style={{
          height: 60, background: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
        }}>
          {/* Ticker */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              borderLeft: '2px solid var(--color-accent-primary)',
              paddingLeft: 12,
            }}>
              <span key={tickerPos} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-secondary)', animation: 'fadeIn 0.5s ease' }}>
                {tickerMessages[tickerPos]}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setLang(l => l === 'en' ? 'te' : 'en')}
              style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '4px 10px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Globe size={12} />{lang === 'en' ? 'EN | తె' : 'తె | EN'}
            </button>
            <div style={{ position: 'relative' }}>
              <Bell size={18} style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }} />
              <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--color-accent-warm)', color: '#000', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700 }}>3</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #00c8ff33, #00c8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--color-accent-primary)' }}>A</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--color-text-secondary)' }}>Admin</span>
            </div>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-disabled)' }}>
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
