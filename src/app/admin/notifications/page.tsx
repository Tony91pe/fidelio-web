'use client'
import { useEffect, useState } from 'react'

export default function AdminNotifications() {
  const [data, setData] = useState<any>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [target, setTarget] = useState('all')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetch('/api/admin').then(r => r.json()).then(setData)
  }, [])

  async function sendEmail() {
    setSending(true)
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sendEmail', target, subject, body })
    })
    setSending(false)
    setDone(true)
    setTimeout(() => { setDone(false); setSubject(''); setBody('') }, 2000)
  }

  const inp = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: '0.85rem', outline: 'none', width: '100%' }

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>🔔 Notifiche & Email</h1>
      <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>Destinatari</label>
          <select value={target} onChange={e => setTarget(e.target.value)} style={{ ...inp }}>
            <option value="all">Tutti i negozi ({data?.shops?.length ?? '...'})</option>
            <option value="paying">Solo piani paganti ({data?.shops?.filter((s: any) => s.plan !== 'STARTER').length ?? '...'})</option>
            <option value="pending">In attesa di approvazione ({data?.shops?.filter((s: any) => !s.approved).length ?? '...'})</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>Oggetto</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Oggetto email..." style={inp} />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>Messaggio</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Scrivi il messaggio..." rows={6} style={{ ...inp, resize: 'vertical' }} />
        </div>
        <button disabled={sending || !subject || !body} onClick={sendEmail}
          style={{ background: done ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.3)', border: `1px solid ${done ? 'rgba(16,185,129,0.5)' : 'rgba(124,58,237,0.5)'}`, color: done ? '#10b981' : '#a78bfa', borderRadius: 10, padding: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', opacity: (sending || !subject || !body) ? 0.5 : 1 }}>
          {done ? '✓ Inviata!' : sending ? 'Invio in corso...' : '✉️ Invia Email'}
        </button>
      </div>
    </div>
  )
}
