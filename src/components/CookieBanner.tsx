'use client'

import { useState, useEffect } from 'react'

export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookie_consent')
    if (!accepted) setTimeout(() => setShow(true), 1000)
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    setShow(false)
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', bottom: '1rem', left: '1rem', right: '1rem',
      zIndex: 9999, maxWidth: '480px', margin: '0 auto',
      background: 'rgba(18,18,32,0.98)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px', padding: '1.25rem',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <p style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.4rem' }}>🍪 Cookie e Privacy</p>
      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5', marginBottom: '1rem' }}>
        Utilizziamo cookie tecnici necessari al funzionamento del sito. Nessun dato viene venduto a terzi.{' '}
        <a href="/privacy" style={{ color: '#A78BFA', textDecoration: 'none' }}>Privacy Policy</a>
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={accept} style={{
          flex: 1, background: '#7C3AED', color: 'white',
          border: 'none', borderRadius: '10px', padding: '0.6rem',
          fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
        }}>
          Accetta
        </button>
        <button onClick={decline} style={{
          flex: 1, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.6rem',
          fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
        }}>
          Solo necessari
        </button>
      </div>
    </div>
  )
}
