'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function RecensionePage() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Errore')
      setSent(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '15px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'system-ui',
  }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', fontWeight: '500' }

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', color: 'white', fontFamily: 'system-ui', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white', marginBottom: '32px', justifyContent: 'center' }}>
          <span style={{ background: 'rgba(108,61,244,0.3)', borderRadius: '10px', padding: '6px 10px', fontWeight: 900, fontSize: '18px' }}>F</span>
          <span style={{ fontWeight: 800, fontSize: '18px' }}>Fidelio</span>
        </Link>

        {sent ? (
          <div style={{ textAlign: 'center', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '48px 32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🙏</div>
            <h2 style={{ fontWeight: 800, fontSize: '22px', marginBottom: '8px' }}>Grazie per la tua testimonianza!</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
              Sarà pubblicata sul sito dopo una breve revisione.
            </p>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
            <h1 style={{ fontWeight: 800, fontSize: '24px', marginBottom: '8px' }}>Lascia la tua testimonianza</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '28px', lineHeight: '1.6' }}>
              Raccontaci la tua esperienza con Fidelio. Sarà pubblicata nella home del sito.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Il tuo nome *</label>
                <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Es. Marco Rossi" required maxLength={60} />
              </div>
              <div>
                <label style={labelStyle}>Ruolo e città *</label>
                <input style={inputStyle} value={role} onChange={e => setRole(e.target.value)} placeholder="Es. Titolare bar — Milano" required maxLength={80} />
              </div>
              <div>
                <label style={labelStyle}>La tua esperienza con Fidelio * <span style={{ color: 'rgba(255,255,255,0.3)' }}>({text.length}/500)</span></label>
                <textarea
                  style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' } as React.CSSProperties}
                  value={text} onChange={e => setText(e.target.value)}
                  placeholder="Raccontaci come Fidelio ha migliorato il tuo negozio..."
                  required maxLength={500}
                />
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px', color: '#EF4444', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{ background: '#6C3DF4', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 700, fontSize: '15px', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Invio in corso...' : 'Invia testimonianza →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
