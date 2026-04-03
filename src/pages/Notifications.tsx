import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { notificationsApi } from '../lib/api/notifications';
import { Send, CheckCircle, Bell } from 'lucide-react';

export default function Notifications() {
  const [recipients, setRecipients] = useState<'all' | 'selected'>('all');
  const [message, setMessage] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [schedule, setSchedule] = useState<'now' | 'later'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [lang, setLang] = useState<'en' | 'te'>('en');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      // Just showing overall history to admin (no particular filter available offhand without member target)
      // So assuming we can just query notifications table
    } catch(e) { }
  }

  const handleSend = async () => {
    if (!messageTitle || !message) return;
    setLoading(true);
    try {
      await notificationsApi.send({
        title: messageTitle,
        message: message,
        recipient_type: recipients === 'all' ? 'all' : 'selected'
      });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setMessage('');
      setMessageTitle('');
    } catch (e) {
      console.error(e);
      alert('Failed to send notification');
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.05em' }}>
            🔔 <span style={{ color: 'var(--color-accent-primary)' }}>NOTIFICATION</span> CENTER
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4 }}>Broadcast messages to members</p>
        </div>

        {/* 2-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 24 }}>
          {/* Compose */}
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--color-accent-primary)', marginBottom: 20 }}>COMPOSE MESSAGE</h3>

            {/* Recipients */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 10 }}>RECIPIENTS</label>
              <div style={{ display: 'flex', gap: 12 }}>
                {(['all', 'selected'] as const).map(r => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '10px 16px', borderRadius: 6, background: recipients === r ? 'rgba(0,200,255,0.08)' : 'var(--color-bg-elevated)', border: `1px solid ${recipients === r ? 'var(--color-accent-primary)' : 'var(--color-border)'}`, flex: 1, transition: 'all 0.2s' }}>
                    <input type="radio" name="recipients" value={r} checked={recipients === r} onChange={() => setRecipients(r)} style={{ accentColor: 'var(--color-accent-primary)' }} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 12 }}>{r === 'all' ? 'All Members' : 'Selected Only'}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{r === 'all' ? '142 members' : 'Pick specific'}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 8 }}>NOTIFICATION TITLE</label>
              <input className="input" placeholder="e.g. Results Published" value={messageTitle} onChange={e => setMessageTitle(e.target.value)} />
            </div>

            {/* Message */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>MESSAGE</label>
                <button onClick={() => setLang(l => l === 'en' ? 'te' : 'en')} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', color: 'var(--color-accent-primary)', fontFamily: 'var(--font-display)', fontSize: 10 }}>
                  🌐 {lang === 'en' ? 'EN | తె' : 'తె | EN'}
                </button>
              </div>
              <textarea className="input" rows={4} placeholder={lang === 'en' ? 'Type your message here...' : 'మీ సందేశం ఇక్కడ టైప్ చేయండి...'} value={message} onChange={e => setMessage(e.target.value)} style={{ resize: 'vertical', fontFamily: lang === 'te' ? 'var(--font-body)' : 'var(--font-body)' }} />
              <div style={{ fontSize: 11, color: 'var(--color-text-disabled)', marginTop: 4, textAlign: 'right' }}>{message.length} characters</div>
            </div>

            {/* Schedule */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 10 }}>SEND TIMING</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['now', 'later'] as const).map(s => (
                  <button key={s} onClick={() => setSchedule(s)} style={{ flex: 1, padding: '10px', borderRadius: 6, border: `1px solid ${schedule === s ? 'var(--color-accent-primary)' : 'var(--color-border)'}`, background: schedule === s ? 'rgba(0,200,255,0.08)' : 'var(--color-bg-elevated)', cursor: 'pointer', color: schedule === s ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)', fontFamily: 'var(--font-display)', fontSize: 12, transition: 'all 0.2s' }}>
                    {s === 'now' ? '🚀 Send Now' : '📅 Schedule Later'}
                  </button>
                ))}
              </div>
              {schedule === 'later' && (
                <input className="input" type="datetime-local" style={{ marginTop: 10 }} value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />
              )}
            </div>

            <button onClick={handleSend} disabled={loading} className={`btn ${sent ? 'btn-outline' : 'btn-primary'}`}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 13, opacity: loading ? 0.5 : 1 }}>
              {sent ? <><CheckCircle size={14} /> SENT SUCCESSFULLY!</> : <><Send size={14} /> {loading ? 'SENDING...' : schedule === 'now' ? 'SEND NOTIFICATION →' : 'SCHEDULE NOTIFICATION →'}</>}
            </button>
          </div>

          {/* Preview */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--color-accent-primary)', marginBottom: 20 }}>PREVIEW</h3>

            {/* Notification preview card */}
            <div style={{ background: 'var(--color-bg-elevated)', borderLeft: '3px solid var(--color-accent-warm)', borderRadius: 6, padding: '16px 18px', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,157,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={15} style={{ color: 'var(--color-accent-warm)' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--color-text-primary)' }}>{messageTitle || 'Notification Title'}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-disabled)' }}>SriSoulTech Portal · just now</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {message || 'Your notification message will appear here...'}
              </p>
            </div>

            {/* Delivery stats */}
            <div style={{ background: 'var(--color-bg-elevated)', borderRadius: 6, padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 12 }}>DELIVERY STATS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--color-accent-primary)' }}>{recipients === 'all' ? 142 : '—'}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Recipients</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--color-accent-success)' }}>{schedule === 'now' ? 'Instant' : scheduledDate ? 'Scheduled' : '—'}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--color-accent-primary)' }}>NOTIFICATION HISTORY</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-elevated)' }}>
                {['Date', 'Recipients', 'Message Preview', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 20px', fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--color-text-disabled)', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: 'var(--color-text-disabled)' }}>No history yet.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
