'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const MAX_FOUNDERS = 50

export function FounderCounter() {
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/shop/apply-founder')
      .then(r => r.json())
      .then(data => setSpotsLeft(typeof data.spotsLeft === 'number' ? data.spotsLeft : null))
      .catch(() => setSpotsLeft(null))
  }, [])

  return (
    <div style={{ background: 'linear-gradient(135deg,#6C3DF4,#FF6B35)', padding: '3rem 2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
        Sei tra i primi 50 negozi?
      </h2>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '100px', padding: '0.4rem 1.2rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: spotsLeft !== null && i < Math.ceil((spotsLeft / MAX_FOUNDERS) * 10)
                ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)'
            }} />
          ))}
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>
          {spotsLeft === null ? 'Caricamento...' :
            spotsLeft === 0 ? 'Posti esauriti' :
              `${spotsLeft} post${spotsLeft === 1 ? 'o' : 'i'} rimast${spotsLeft === 1 ? 'o' : 'i'}`}
        </span>
      </div>
      <p style={{ opacity: 0.9, marginBottom: '2rem' }}>
        Piano Growth gratis per 6 mesi + badge Negozio Fondatore esclusivo
      </p>

      {/* Badge preview */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <img
          src="/badge-fondatore.svg"
          alt="Badge Negozio Fondatore Fidelio"
          width={130}
          height={130}
          style={{ filter: 'drop-shadow(0 0 24px rgba(167,139,250,0.6))', borderRadius: '50%' }}
        />
        <p style={{ opacity: 0.7, fontSize: '0.82rem', margin: 0 }}>
          Il badge esclusivo che riceverai per il tuo negozio
        </p>
      </div>

      <Link href={spotsLeft === 0 ? '#' : '/fondatore'} style={{
        background: 'white', color: '#6C3DF4',
        padding: '0.9rem 2rem', borderRadius: '100px', textDecoration: 'none',
        fontWeight: '700', fontSize: '1rem',
        opacity: spotsLeft === 0 ? 0.5 : 1,
        pointerEvents: spotsLeft === 0 ? 'none' : 'auto',
      }}>
        {spotsLeft === 0 ? 'Posti esauriti' : 'Candidati come fondatore'}
      </Link>
    </div>
  )
}
