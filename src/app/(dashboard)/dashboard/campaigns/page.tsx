'use client'
import { useState, useEffect } from 'react'

type SegmentCount = { segment: string; count: number }

const SEGMENTS = [
  { id: 'all',        icon: '👥', label: 'Tutti i clienti',        desc: 'Ogni cliente registrato nel negozio' },
  { id: 'active',     icon: '🟢', label: 'Clienti attivi',          desc: 'Chi ha visitato negli ultimi 30 giorni' },
  { id: 'atrisk',     icon: '🔴', label: 'A rischio abbandono',      desc: 'Nessuna visita da oltre 30 giorni' },
  { id: 'nearreward', icon: '🏆', label: 'Vicino al premio',         desc: 'Hanno almeno il 70% dei punti necessari' },
  { id: 'top',        icon: '⭐', label: 'Top 50 clienti',           desc: 'I 50 con più visite in assoluto' },
  { id: 'birthday',   icon: '🎂', label: 'Compleanni questo mese',   desc: 'Clienti che compiono gli anni questo mese' },
]

const TEMPLATES = [
  { icon: '🔥', label: 'Offerta speciale',    subject: 'Un\'offerta esclusiva per te 🎁', body: 'Abbiamo pensato a te! Vieni a trovarci questa settimana e avrai una sorpresa speciale. Ti aspettiamo!' },
  { icon: '💌', label: 'Ci manchi',            subject: 'Ci manchi! I tuoi punti ti aspettano', body: 'È da un po\' che non ci vedi. I tuoi punti ti stanno aspettando — vieni a riscattarli o ad accumularne di nuovi!' },
  { icon: '🎉', label: 'Novità',               subject: 'Novità in arrivo al negozio!', body: 'Abbiamo delle novità fantastiche per te. Vieni a scoprirle di persona — non vediamo l\'ora di mostrartele!' },
  { icon: '🎂', label: 'Buon compleanno',      subject: '🎂 Buon compleanno da noi!', body: 'Tanti auguri di buon compleanno! Per festeggiare insieme abbiamo una sorpresa per te. Vieni a trovarci questo mese!' },
  { icon: '⭐', label: 'Ringraziamento VIP',   subject: 'Grazie per essere un cliente speciale ❤️', body: 'Sei uno dei nostri clienti più fedeli e vogliamo dirtelo. Grazie per la tua fiducia — hai un regalo che ti aspetta!' },
]

const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px', padding: '10px 14px', color: 'white',
  width: '100%', outline: 'none', fontSize: '14px', marginBottom: '8px', fontFamily: 'inherit',
}

export default function CampaignsPage() {
  const [plan, setPlan] = useState<string | null>(null)
  const [counts, setCounts] = useState<SegmentCount[]>([])
  const [segment, setSegment] = useState('atrisk')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; total: number } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/shop/plan').then(r => r.json()).then(d => setPlan(d.plan))
    fetch('/api/campaigns').then(r => r.json()).then(d => { if (Array.isArray(d)) setCounts(d) })
  }, [])

  if (plan === null) return null

  const isPro = plan === 'PRO'
  const selectedCount = counts.find(c => c.segment === segment)?.count ?? '—'

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!confirm(`Inviare la campagna a ${selectedCount} clienti?`)) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, segment }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Errore durante l\'invio'); return }
      setResult(data)
      setSubject('')
      setBody('')
    } finally { setSending(false) }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '860px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>Campagne Email</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Invia messaggi mirati ai tuoi clienti segmentati</p>
        </div>
        {!isPro && (
          <div style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '10px', padding: '0.5rem 1rem', fontSize: '0.82rem', color: '#F97316', fontWeight: '700' }}>
            🔒 Piano PRO richiesto
          </div>
        )}
      </div>

      {result && (
        <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>✅</span>
          <p style={{ fontWeight: '700', color: '#10B981', margin: 0 }}>
            Campagna inviata! <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>{result.sent} email su {result.total} clienti</span>
          </p>
          <button onClick={() => setResult(null)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '0.9rem 1.25rem', marginBottom: '1.5rem', color: '#EF4444', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'start' }}>

        {/* Form principale */}
        <form onSubmit={handleSend} style={{ opacity: isPro ? 1 : 0.45, pointerEvents: isPro ? 'auto' : 'none' }}>

          {/* Segmento */}
          <p style={{ fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>1 — Seleziona destinatari</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem' }}>
            {SEGMENTS.map(s => {
              const cnt = counts.find(c => c.segment === s.id)?.count
              const active = segment === s.id
              return (
                <div key={s.id} onClick={() => setSegment(s.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 1rem', borderRadius: '12px', cursor: 'pointer', background: active ? 'rgba(108,61,244,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? 'rgba(108,61,244,0.4)' : 'rgba(255,255,255,0.07)'}`, transition: 'all 0.15s' }}>
                  <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '700', fontSize: '0.88rem', margin: 0, color: active ? 'white' : 'rgba(255,255,255,0.7)' }}>{s.label}</p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>{s.desc}</p>
                  </div>
                  {cnt !== undefined && (
                    <span style={{ background: active ? 'rgba(108,61,244,0.3)' : 'rgba(255,255,255,0.06)', color: active ? '#A78BFA' : 'rgba(255,255,255,0.4)', borderRadius: '999px', padding: '2px 10px', fontSize: '0.78rem', fontWeight: '700', flexShrink: 0 }}>
                      {cnt}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Oggetto */}
          <p style={{ fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>2 — Scrivi il messaggio</p>
          <input style={inp} placeholder="Oggetto dell'email..." value={subject} onChange={e => setSubject(e.target.value)} required />
          <textarea style={{ ...inp, resize: 'vertical', minHeight: '130px' } as React.CSSProperties}
            placeholder="Scrivi il tuo messaggio..." value={body} onChange={e => setBody(e.target.value)} required />

          <button type="submit" disabled={sending || !isPro} style={{
            width: '100%', background: '#6C3DF4', color: 'white', padding: '13px', borderRadius: '12px',
            fontWeight: '800', border: 'none', cursor: 'pointer', fontSize: '0.95rem',
            opacity: sending ? 0.7 : 1, marginTop: '0.5rem',
          }}>
            {sending ? 'Invio in corso...' : `✉️ Invia a ${selectedCount} clienti`}
          </button>

          {!isPro && (
            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.75rem' }}>
              Passa al piano PRO per inviare campagne →{' '}
              <a href="/dashboard/upgrade" style={{ color: '#A78BFA', textDecoration: 'none', fontWeight: '700' }}>Upgrade</a>
            </p>
          )}
        </form>

        {/* Template rapidi */}
        <div>
          <p style={{ fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>Template rapidi</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {TEMPLATES.map((t, i) => (
              <div key={i} onClick={() => { setSubject(t.subject); setBody(t.body) }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '0.9rem 1rem', cursor: 'pointer', transition: 'border-color 0.15s' }}>
                <p style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{t.icon}</span> {t.label}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.76rem', margin: 0, lineHeight: '1.4' }}>
                  {t.body.slice(0, 55)}...
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem' }}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', lineHeight: '1.6', margin: 0 }}>
              💡 Le email mostrano automaticamente i punti attuali del cliente e il nome del negozio.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
