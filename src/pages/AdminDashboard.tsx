import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Users, BookOpen, BarChart3, AlertTriangle, Plus, Download, Send, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { membersApi } from '../lib/api/members';
import { examsApi } from '../lib/api/exams';
import { supabase } from '../lib/supabase';
import { subscribeActivityFeed, unsubscribe } from '../lib/realtime';

const StatCard = ({ label, value, sub, color, icon: Icon }: { label: string; value: string | number; sub: string; color: string; icon: React.ElementType }) => (
  <div className="card" style={{ padding: 24, borderTop: `2px solid ${color}`, transition: 'all 0.2s' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ background: `${color}18`, borderRadius: 8, padding: 10 }}>
        <Icon size={20} style={{ color }} />
      </div>
      <TrendingUp size={14} style={{ color: 'var(--color-accent-success)' }} />
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginTop: 6 }}>{label}</div>
    <div style={{ fontSize: 12, color: 'var(--color-accent-success)', marginTop: 4, fontFamily: 'var(--font-body)' }}>{sub}</div>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [membersData, examsData, statsRes, activityRes] = await Promise.all([
        membersApi.getAll(),
        examsApi.getAll(),
        supabase.from('v_admin_stats').select('*').single(),
        supabase.from('activity_feed').select('*').order('created_at', { ascending: false }).limit(6)
      ]);
      setMembers(membersData || []);
      setExams(examsData || []);
      setAdminStats(statsRes.data);
      setActivityFeed(activityRes.data || []);
      setLoading(false);
    }
    loadData();

    const channel = subscribeActivityFeed((newEvent) => {
      setActivityFeed(prev => [newEvent, ...prev].slice(0, 6));
    });

    return () => unsubscribe(channel);
  }, []);

  const stats = [
    { label: 'TOTAL MEMBERS', value: adminStats?.total_members || 0, sub: `${adminStats?.active_members || 0} active`, color: 'var(--color-accent-primary)', icon: Users },
    { label: 'ACTIVE EXAMS', value: adminStats?.open_exams || 0, sub: 'currently open', color: 'var(--color-accent-warm)', icon: BookOpen },
    { label: 'AVG SCORE', value: `${adminStats?.avg_score || 0}%`, sub: 'all submitted exams', color: 'var(--color-accent-success)', icon: BarChart3 },
    { label: 'PENDING REVIEW', value: adminStats?.pending_requests || 0, sub: 'retry requests', color: 'var(--color-accent-danger)', icon: AlertTriangle },
  ];

  if (loading) return <AdminLayout><div className="loading-screen text-white text-center py-20">Loading dashboard...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '0.05em' }}>
              GOOD MORNING, <span style={{ color: 'var(--color-accent-primary)' }}>ADMIN 👋</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4, fontFamily: 'var(--font-body)' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={() => navigate('/admin/exams/create')}><Plus size={14} /> Create Exam</button>
            <button className="btn btn-outline" onClick={() => navigate('/admin/analytics')}><Download size={14} /> Export Results</button>
            <button className="btn btn-amber" onClick={() => navigate('/admin/notifications')}><Send size={14} /> Notify</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Members + Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          {/* Members table */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.08em', color: 'var(--color-accent-primary)' }}>RECENT MEMBERS</h2>
              <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => navigate('/admin/members')}>View All →</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-elevated)' }}>
                  {['Code', 'Name', 'Exams', 'Avg', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--color-text-disabled)', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.slice(0, 6).map((m, i) => (
                  <tr key={m.id} style={{ borderTop: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-accent-primary)' }}>{m.member_code}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{m.full_name}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--color-accent-primary)' }}>{m.exams_taken}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: 13, color: m.avg_score >= 75 ? 'var(--color-accent-success)' : m.avg_score >= 50 ? 'var(--color-accent-warm)' : 'var(--color-accent-danger)' }}>{m.avg_score}%</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge badge-${m.status === 'active' ? 'active' : m.status === 'pending' ? 'pending' : 'muted'}`}>{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Activity Feed */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.08em', color: 'var(--color-accent-primary)' }}>LIVE ACTIVITY</h2>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activityFeed.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-accent-primary)', whiteSpace: 'nowrap', paddingTop: 2 }}>
                    {new Date(a.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.event_type === 'complete' ? 'var(--color-accent-success)' : a.event_type === 'start' ? 'var(--color-accent-primary)' : 'var(--color-accent-warm)', marginTop: 5, flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{a.description}</div>
                </div>
              ))}
            </div>

            {/* Upcoming Exams mini */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 12 }}>RECENT EXAMS</div>
              {exams.slice(0, 3).map((e) => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 12 }}>{e.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{e.total_questions}Q · {e.duration_minutes}min</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-accent-warm)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    <Clock size={12} /> {e.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
