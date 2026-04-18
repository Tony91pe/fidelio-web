'use client'
import { useState, useEffect } from 'react'
import UpgradeWall from '@/components/UpgradeWall'

const segments = [
  { id: 'all', label: 'Tutti i clienti', desc: 'Tutti i clienti registrati' },
  { id: 'active', label: 'Clienti attivi', desc: 'Chi ha visitato negli ultimi 30 giorni' },
  { id: 'atrisk', label: 'A rischio abbandono', desc: 'Chi non viene da più di 30 giorni' }
]
const templates = [
  { subject: 'Offerta speciale per te!', body: 'Abbiamo una sorpresa per te. Vieni a trovarci!' },
  { subject: 'Ci manchi! Torna a trovarci', body: 'È da un po\' che non ci vedi. I tuoi punti ti aspettano!' },
  { subject: 'Novità per te', body: 'Abbiamo delle novità che non vediamo l\'ora di condividere!' },
]

const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px', padding: '10px 14px', color: 'white',
  width: '100%', outline: 'none', fontSize: '14px', marginBottom: '8px'
}

export default function CampaignsPage() {
  const [plan, setPlan] = useState<string | null>(null)
  const [segment, setSegment] = useState('all')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; total: number } | null>(null)

  useEffect(() => {
    fetch('/api/shop/plan').then(r => r.json()).then(d => setPlan(d.plan))
  }, [])

  if (plan === null) return null

  if (plan !== 'PRO') {
    return (
      <UpgradeWall
        requiredPlan="PRO"
        currentPlan={plan}
        feature="Campagne Email"
        description="Invia email mirate ai tuoi clienti segmentati per farli tornare nel negozio. Disponibile dal piano Pro."
      />
    )
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!confirm('Inviare la campagna?')) return
    setSending(true)
    try {
      const res = await fetch('/api/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, body, segment }) })
      if (!res.ok) throw new Error('Failed to send campaign')
      setResult(await res.json())
    } catch (err) {
      console.error('Error sending campaign:', err)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Campagne Email</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>Invia email ai tuoi clienti per farli tornare</p>

      {result && (
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>✓</span>
          <p style={{ fontWeight: '600', color: '#10B981' }}>{result.sent} email inviate su {result.total} clienti!</p>
          <button onClick={() => setResult(null)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
        <form onSubmit={handleSend}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: '600', marginBottom: '0.75rem' }}>Destinatari</p>
            {segments.map(s => (
              <div key={s.id} onClick={() => setSegment(s.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '0.5rem', cursor: 'pointer', background: segment === s.id ? 'rgba(108,61,244,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${segment === s.id ? 'rgba(108,61,244,0.35)' : 'rgba(255,255,255,0.08)'}` }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${segment === s.id ? '#6C3DF4' : 'rgba(255,255,255,0.3)'}`, background: segment === s.id ? '#6C3DF4' : 'transparent', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{s.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Oggetto</p>
            <input style={inp} placeholder="Oggetto dell'email..." value={subject} onChange={e => setSubject(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Messaggio</p>
            <textarea style={{ ...inp, resize: 'vertical', minHeight: 120 } as React.CSSProperties} placeholder="Scrivi il messaggio..." value={body} onChange={e => setBody(e.target.value)} required />
          </div>
          <button type="submit" disabled={sending} style={{ background: '#6C3DF4', color: 'white', padding: '12px 28px', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '0.95rem', opacity: sending ? 0.7 : 1 }}>
            {sending ? 'Invio in corso...' : '✉️ Invia campagna'}
          </button>
        </form>

        <div>
          <p style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Template rapidi</p>
          {templates.map((t, i) => (
            <div key={i} onClick={() => { setSubject(t.subject); setBody(t.body) }} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '0.9rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
              <p style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.2rem' }}>{t.subject}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{t.body.substring(0, 50)}...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
