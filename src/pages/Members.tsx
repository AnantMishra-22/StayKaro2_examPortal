import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { membersApi } from '../lib/api/members';
import { Search, Plus, Upload, Download, Edit2, Trash2, Camera, CheckSquare } from 'lucide-react';

export default function Members() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await membersApi.getAll({ status: filter, search });
        setMembers(data || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, [filter, search]);

  const toggleSelect = (id: string) => setSelected(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const statusClass = (s: string) => s === 'active' ? 'badge-active' : s === 'pending' ? 'badge-pending' : 'badge-muted';

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.05em' }}>
              👥 <span style={{ color: 'var(--color-accent-primary)' }}>MEMBER</span> MANAGEMENT
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4 }}>{members.length} members loaded</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" style={{ fontSize: 12 }}><Upload size={13} /> Import Excel</button>
            <button className="btn btn-outline" style={{ fontSize: 12 }}><Download size={13} /> Export List</button>
            <button className="btn btn-primary" style={{ fontSize: 12 }}><Plus size={13} /> Add Member</button>
          </div>
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-disabled)' }} />
            <input className="input" type="text" placeholder="Search by name, member code, or email... (Press Enter)" value={search}
              onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'active', 'inactive', 'pending'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: filter === f ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                color: filter === f ? '#003546' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
                textTransform: 'capitalize' as const, transition: 'all 0.2s',
              }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
            ))}
          </div>
          <select className="input" style={{ width: 180 }}>
            <option>Sort by: Last Active</option>
            <option>Sort by: Name</option>
            <option>Sort by: Score</option>
            <option>Sort by: Rank</option>
          </select>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', background: 'rgba(0,200,255,0.06)', border: '1px solid rgba(0,200,255,0.2)', borderTop: '2px solid var(--color-accent-primary)', borderRadius: '6px 6px 0 0', marginBottom: -1 }}>
            <CheckSquare size={16} style={{ color: 'var(--color-accent-primary)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--color-accent-primary)' }}>{selected.size} members selected</span>
            <div style={{ flex: 1 }} />
            <button className="btn btn-outline" style={{ fontSize: 11, padding: '6px 14px' }}><Download size={12} /> Export Selected</button>
            <button className="btn btn-danger" style={{ fontSize: 11, padding: '6px 14px' }}><Trash2 size={12} /> Delete Selected</button>
          </div>
        )}

        {/* Table */}
        <div className="card" style={{ overflow: 'hidden', borderRadius: selected.size > 0 ? '0 0 8px 8px' : 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-elevated)' }}>
                <th style={{ padding: '12px 16px', width: 40 }}>
                  <input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(members.map(m => m.id)) : new Set())}
                    style={{ accentColor: 'var(--color-accent-primary)', cursor: 'pointer' }} />
                </th>
                {['Member', 'Code', 'Email', 'Exams', 'Last Updated', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--color-text-disabled)', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-disabled)' }}>Loading members...</td></tr>
              ) : members.map((m, i) => (
                <tr key={m.id}
                  style={{ borderTop: '1px solid var(--color-border)', background: selected.has(m.id) ? 'rgba(0,200,255,0.04)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', transition: 'background 0.15s' }}
                  onMouseEnter={e => { if (!selected.has(m.id)) (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (!selected.has(m.id)) (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'; }}>
                  <td style={{ padding: '12px 16px' }}>
                    <input type="checkbox" checked={selected.has(m.id)} onChange={() => toggleSelect(m.id)}
                      style={{ accentColor: 'var(--color-accent-primary)', cursor: 'pointer' }} />
                  </td>
                  <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, rgba(0,200,255,0.2), rgba(0,80,120,0.3))`, border: '1px solid rgba(0,200,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--color-accent-primary)', flexShrink: 0 }}>
                      {m.full_name?.charAt(0) || '?'}
                    </div>
                    <span style={{ fontSize: 13 }}>{m.full_name}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-accent-primary)' }}>{m.member_code}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--color-text-secondary)' }}>{m.email}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--color-accent-primary)' }}>{m.exams_taken}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-secondary)' }}>{new Date(m.updated_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px' }}><span className={`badge ${statusClass(m.status)}`}>{m.status}</span></td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[
                        { icon: Edit2, label: 'Edit', color: 'var(--color-accent-primary)' },
                        { icon: Camera, label: 'Photo', color: 'var(--color-text-secondary)' },
                        { icon: Trash2, label: 'Delete', color: 'var(--color-accent-danger)' },
                      ].map(a => (
                        <button key={a.label} title={a.label} onClick={a.label === 'Delete' ? async () => { if(confirm('Sure?')) { await membersApi.delete(m.id); setMembers(members.filter(x => x.id !== m.id)); } } : undefined} style={{ background: 'none', border: 'none', cursor: 'pointer', color: a.color, padding: 4, borderRadius: 4, transition: 'all 0.15s', opacity: 0.7 }}
                          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
                          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'}>
                          <a.icon size={14} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, color: 'var(--color-text-secondary)', fontSize: 13 }}>
          <span>Loaded {members.length} members</span>
        </div>
      </div>
    </AdminLayout>
  );
}
