import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { membersApi } from '../lib/api/members';
import { sessionsApi } from '../lib/api/sessions';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { Trophy, TrendingUp, Star, Target } from 'lucide-react';

export default function Analytics() {
  const { profile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const lb = await membersApi.getLeaderboard();
        setLeaderboard(lb || []);
        if (profile?.role === 'member') {
          const res = await sessionsApi.getMemberResults(profile.id);
          setResults(res || []);
        } else {
          // If admin, just fetch all results
          const res = await sessionsApi.getAllResults();
          setResults(res || []);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, [profile]);

  const getBarColor = (c: string) => c === 'danger' ? 'var(--color-accent-danger)' : c === 'warning' ? 'var(--color-accent-warm)' : 'var(--color-accent-success)';

  // Derived data
  const scoreHistory = results.slice(0, 10).reverse().map(r => ({ exam: r.exam_title || 'Exam', score: r.score }));
  // Mocking radar and weak topics for now until detailed backend logic
  const radarData = [
    { subject: 'Math', A: 85 }, { subject: 'Physics', A: 72 }, { subject: 'Chemistry', A: 68 },
    { subject: 'CS', A: 91 }, { subject: 'Biology', A: 55 },
  ];
  const weakTopics = [
    { topic: 'Data Structures', score: 45, color: 'danger' },
    { topic: 'Calculus', score: 62, color: 'warning' },
  ];

  const avgScore = results.length > 0 ? (results.reduce((a, b) => a + b.score, 0) / results.length).toFixed(1) : '0';
  const highScore = results.length > 0 ? Math.max(...results.map(r => r.score)) : 0;
  const userRank = leaderboard.findIndex(l => l.member_code === profile?.member_code) + 1;

  if (loading) return <AdminLayout><div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading analytics...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            Dashboard <span style={{ color: 'var(--color-accent-primary)' }}>/</span> Analytics
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.05em' }}>
            📊 <span style={{ color: 'var(--color-accent-primary)' }}>PERFORMANCE</span> ANALYTICS
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4 }}>
            {profile?.role === 'admin' ? 'Company Global Stats' : `${profile?.full_name} (${profile?.member_code})`}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'TOTAL EXAMS', value: results.length.toString(), icon: Target, color: 'var(--color-accent-primary)' },
            { label: 'AVG SCORE', value: `${avgScore}%`, icon: Star, color: 'var(--color-accent-success)' },
            { label: 'HIGHEST SCORE', value: `${highScore}%`, icon: TrendingUp, color: 'var(--color-accent-success)' },
            { label: 'CURRENT RANK', value: userRank > 0 ? `#${userRank}` : 'Unranked', icon: Trophy, color: 'var(--color-accent-warm)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: 20, borderTop: `2px solid ${s.color}` }}>
              <s.icon size={18} style={{ color: s.color, marginBottom: 10 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 24 }}>
          {/* Line chart */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.08em', color: 'var(--color-accent-primary)', marginBottom: 20 }}>SCORE HISTORY</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={scoreHistory.length > 0 ? scoreHistory : [{ exam: 'None', score: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="exam" tick={{ fill: '#4a5568', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#4a5568', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f1419', border: '1px solid #1e2a38', borderRadius: 6, color: '#e8f0f8' }} />
                <Line type="monotone" dataKey="score" stroke="#00c8ff" strokeWidth={2} dot={{ fill: '#00c8ff', r: 4 }} activeDot={{ r: 6, fill: '#00e887' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Radar chart */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.08em', color: 'var(--color-accent-primary)', marginBottom: 20 }}>SUBJECT STRENGTH</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#7a9bb8', fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="#00c8ff" fill="#00c8ff" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weak Topics + Leaderboard */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Weak topics */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.08em', color: 'var(--color-accent-primary)', marginBottom: 20 }}>FOCUS AREAS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {weakTopics.map(t => (
                <div key={t.topic}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{t.topic}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: getBarColor(t.color) }}>{t.score}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--color-bg-highest)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${t.score}%`, background: getBarColor(t.color), borderRadius: 3, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.08em', color: 'var(--color-accent-primary)' }}>🏆 TOP PERFORMERS</h3>
            </div>
            <div>
              {leaderboard.length === 0 && <div style={{ padding: 20, color: 'var(--color-text-disabled)', fontSize: 13 }}>No rankings yet.</div>}
              {leaderboard.slice(0, 8).map((m, i) => {
                const rank = i + 1;
                return (
                  <div key={rank} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                    borderBottom: i < 7 ? '1px solid var(--color-border)' : 'none',
                    background: m.member_code === profile?.member_code ? 'rgba(0,200,255,0.05)' : 'transparent',
                    borderLeft: m.member_code === profile?.member_code ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
                  }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, width: 24, textAlign: 'center', color: rank <= 3 ? 'var(--color-accent-warm)' : 'var(--color-text-disabled)' }}>
                      {rank <= 3 ? ['👑', '🥈', '🥉'][rank - 1] : rank}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: m.member_code === profile?.member_code ? 'var(--color-accent-primary)' : 'var(--color-text-primary)' }}>{m.full_name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-disabled)' }}>{m.member_code}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: m.avg_score >= 80 ? 'var(--color-accent-success)' : 'var(--color-accent-warm)' }}>{m.avg_score}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
