'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FounderPage() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null)
  const [applying, setApplying] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/shop/apply-founder')
      .then(r => r.json())
      .then(d => setSpotsLeft(d.spotsLeft))
  }, [])

  async function apply() {
    setApplying(true)
    setError(null)
    try {
      const res = await fetch('/api/shop/apply-founder', { method: 'POST' })
      const d = await res.json()
      if (res.ok) {
        setDone(true)
        setTimeout(() => router.push('/dashboard'), 2500)
      } else {
        setError(d.error)
      }
    } finally {
      setApplying(false)
    }
  }

  if (!isLoaded) return null

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>← Torna alla home</Link>

        <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#7C3AED,#3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 36, fontWeight: 900 }}>F</div>
          <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Piano Fondatore</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Piano Growth gratuito per 6 mesi + badge esclusivo Negozio Fondatore
          </p>
        </div>

        {/* Contatore posti */}
        <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 14, padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: spotsLeft !== null && i < Math.ceil((spotsLeft / 50) * 10) ? '#A78BFA' : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>
          <span style={{ color: 'white', fontWeight: 700 }}>
            {spotsLeft === null ? '...' : spotsLeft === 0 ? 'Posti esauriti' : `${spotsLeft} post${spotsLeft === 1 ? 'o' : 'i'} rimanent${spotsLeft === 1 ? 'e' : 'i'}`}
          </span>
        </div>

        {/* Benefici */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
          {[
            '✅ Piano Growth gratis per 6 mesi (valore €234)',
            '✅ QR dinamico con anti-frode',
            '✅ Gift card, automazioni email, analytics',
            '✅ Ruoli staff (commesso, manager)',
            '✅ Badge esclusivo "Negozio Fondatore"',
            '✅ Supporto prioritario',
          ].map(b => (
            <p key={b} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', marginBottom: '0.6rem', lineHeight: 1.5 }}>{b}</p>
          ))}
        </div>

        {done ? (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 14, padding: '1.5rem', color: '#10B981', fontWeight: 700, fontSize: '1.1rem' }}>
            ✅ Piano fondatore attivato! Reindirizzamento alla dashboard...
          </div>
        ) : !isSignedIn ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/register?redirect_url=/fondatore"
              style={{ background: '#7C3AED', color: 'white', padding: '14px 24px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: '1rem', display: 'block' }}>
              Registrati e attiva il piano fondatore
            </Link>
            <Link href="/login?redirect_url=/fondatore"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', padding: '12px 24px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>
              Hai già un account? Accedi
            </Link>
          </div>
        ) : spotsLeft === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>I posti da fondatore sono esauriti.</p>
        ) : (
          <div>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#ef4444', fontSize: '0.88rem' }}>
                {error}
              </div>
            )}
            <button onClick={apply} disabled={applying}
              style={{ background: '#7C3AED', color: 'white', padding: '14px 32px', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%', opacity: applying ? 0.7 : 1 }}>
              {applying ? 'Attivazione in corso...' : 'Attiva piano fondatore gratuito'}
            </button>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
              Nessuna carta di credito richiesta. Piano Growth attivo per 6 mesi.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
