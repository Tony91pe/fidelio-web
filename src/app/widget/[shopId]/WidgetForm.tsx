'use client'
import { useState } from 'react'

export default function WidgetForm({ shopId, shopName, primaryColor = '#6C3DF4' }: {
  shopId: string
  shopName: string
  primaryColor?: string
}) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [points, setPoints] = useState(0)
  const [error, setError] = useState('')

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    background: '#fff', color: '#111',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, shopId }),
      })
      const data = await res.json()
      if (res.ok) {
        setPoints(data.pointsEarned)
        setStep('success')
      } else {
        setError(data.error ?? 'Errore durante la registrazione')
      }
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') return (
    <div style={{ textAlign: 'center', padding: '1.5rem 1rem', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
      <p style={{ fontWeight: '700', fontSize: '1rem', color: '#111', marginBottom: '0.25rem' }}>
        Benvenuto in {shopName}!
      </p>
      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        Hai ricevuto <strong style={{ color: primaryColor }}>{points} punti</strong> di benvenuto.
      </p>
      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '1rem' }}>
        Mostra il QR in negozio per accumulare punti ad ogni visita.
      </p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', fontFamily: 'system-ui,sans-serif' }}>
      <p style={{ fontWeight: '700', fontSize: '0.95rem', color: '#111', marginBottom: '0.75rem', textAlign: 'center' }}>
        🏆 Iscriviti al programma fedeltà
      </p>
      <input style={{ ...inp, marginBottom: '8px' }} placeholder="Il tuo nome" value={name}
        onChange={e => setName(e.target.value)} required />
      <input style={{ ...inp, marginBottom: '12px' }} type="email" placeholder="La tua email" value={email}
        onChange={e => setEmail(e.target.value)} required />
      {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '8px', textAlign: 'center' }}>{error}</p>}
      <button type="submit" disabled={loading} style={{
        width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
        background: primaryColor, color: 'white', fontWeight: '700', fontSize: '14px',
        cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
      }}>
        {loading ? 'Iscrizione...' : 'Inizia ad accumulare punti'}
      </button>
      <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px', textAlign: 'center', lineHeight: '1.4' }}>
        Powered by <a href="https://www.getfidelio.app" target="_blank" rel="noopener noreferrer"
          style={{ color: primaryColor, textDecoration: 'none', fontWeight: '600' }}>Fidelio</a>
      </p>
    </form>
  )
}
