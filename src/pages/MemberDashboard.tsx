import { useState, useEffect } from 'react';
import MemberLayout from '../components/MemberLayout';
import { useAuth } from '../context/AuthContext';
import { membersApi } from '../lib/api/members';
import { examsApi } from '../lib/api/exams';
import { sessionsApi } from '../lib/api/sessions';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Trophy, Star, ChevronRight, Play } from 'lucide-react';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [rank, setRank] = useState<number>(0);
  const [countdown] = useState('02:45:12'); // Mock countdown for upcoming exam

  useEffect(() => {
    async function loadData() {
      try {
        if (!profile?.id) return;
        
        // Load available exams
        const allExams = await examsApi.getAll();
        // Just show open exams or ones assigned to member (simplified to just open for UI)
        setExams(allExams?.filter((e: any) => e.status === 'open' || e.status === 'published') || []);

        // Load member results
        const res = await sessionsApi.getMemberResults(profile.id);
        setResults(res || []);

        // Load leaderboard to find rank
        const lb = await membersApi.getLeaderboard();
        const userRank = lb?.findIndex((r: any) => r.member_code === profile.member_code) + 1;
        setRank(userRank || 0);

      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [profile]);

  const getScoreColor = (score: number) => score >= 80 ? 'var(--color-accent-success)' : score >= 50 ? 'var(--color-accent-warm)' : 'var(--color-accent-danger)';

  return (
    <MemberLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Welcome Hero Card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,200,255,0.15), rgba(0,100,170,0.08))', border: '1px solid rgba(0,200,255,0.2)', borderRadius: 8, padding: '32px 40px', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '0.03em', marginBottom: 4 }}>
              Welcome back, <span style={{ color: 'var(--color-accent-primary)' }}>{profile?.full_name?.split(' ')[0] || 'Member'}! 👋</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
              Ready for today's exam? మీరు సిద్ధంగా ఉన్నారా?
            </p>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'Total Exams', value: profile?.exams_taken || 0, icon: BookOpen, color: 'var(--color-accent-primary)' },
              { label: 'Rank', value: rank > 0 ? `#${rank}` : 'N/A', icon: Trophy, color: 'var(--color-accent-warm)' },
              { label: 'Avg Score', value: `${profile?.avg_score || 0}%`, icon: Star, color: 'var(--color-accent-success)' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '16px 24px', backdropFilter: 'blur(10px)' }}>
                <s.icon size={18} style={{ color: s.color, marginBottom: 6 }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Left column */}
          <div>
            {/* Available Exams */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '0.08em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                🎯 <span style={{ color: 'var(--color-text-primary)' }}>AVAILABLE EXAMS</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {exams.length === 0 && <div className="card" style={{ padding: 20, color: 'var(--color-text-disabled)' }}>No exams currently available.</div>}
                {exams.map(exam => (
                  <div key={exam.id} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, borderTop: '2px solid var(--color-accent-primary)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>{exam.title}</span>
                        <span className={`badge ${exam.permission_type === 'all' ? 'badge-active' : 'badge-cyan'}`}>
                          {exam.permission_type === 'all' ? 'OPEN TO ALL' : 'ASSIGNED TO YOU'}
                        </span>
                        <span className="badge badge-pending">Standard</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, color: 'var(--color-text-secondary)', fontSize: 13 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} />{exam.duration_minutes} min</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={12} />{exam.total_questions} Questions</span>
                        <span>{exam.subjects?.name || 'General'}</span>
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/exam/live')} style={{ fontSize: 12, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Play size={13} /> START →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Results */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '0.08em', marginBottom: 16 }}>📋 MY RECENT RESULTS</h2>
              <div className="card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-elevated)' }}>
                      {['Exam', 'Score', 'Date', ''].map(h => (
                        <th key={h} style={{ padding: '10px 16px', fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--color-text-disabled)', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.length === 0 && <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: 'var(--color-text-disabled)' }}>No results found.</td></tr>}
                    {results.slice(0, 5).map((r, i) => (
                      <tr key={r.id || i} style={{ borderTop: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '12px 16px', fontSize: 13 }}>{r.exam_title || 'Exam'}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: getScoreColor(r.score) }}>{r.score}%</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                          {r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : '-'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button className="btn btn-outline" onClick={() => navigate('/member/analytics')} style={{ padding: '4px 12px', fontSize: 11 }}>View →</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Upcoming exam card */}
            <div className="card" style={{ padding: 24, borderTop: '2px solid var(--color-accent-warm)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-accent-warm)', marginBottom: 12 }}>⏰ UPCOMING EXAM</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 6 }}>{exams[0]?.title || 'TBD'}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 16 }}>Available soon</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--color-accent-warm)', animation: 'pulse-amber 1.5s infinite' }}>{countdown}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>hours remaining</div>
            </div>

            {/* Quick links */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 16 }}>QUICK ACTIONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'View All Results', icon: Trophy, to: '/member/analytics' },
                  { label: 'Download Certificate', icon: Star, to: '#' },
                  { label: 'View Leaderboard', icon: ChevronRight, to: '/member/analytics' },
                ].map(a => (
                  <button key={a.label} onClick={() => navigate(a.to)} className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', fontSize: 12 }}>
                    <a.icon size={13} /> {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress mini-chart */}
            {results.length > 0 && (
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 16 }}>SCORE TREND</div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 80 }}>
                  {results.slice(0, 6).reverse().map((r, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: '100%', background: r.score >= 75 ? 'var(--color-accent-success)' : r.score >= 50 ? 'var(--color-accent-warm)' : 'var(--color-accent-danger)', height: `${Math.max(r.score * 0.7, 5)}%`, borderRadius: '2px 2px 0 0', opacity: 0.8, minHeight: 8 }} />
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                  <button className="btn btn-outline" onClick={() => navigate('/member/analytics')} style={{ fontSize: 11, padding: '6px 14px' }}>Full Analytics →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
