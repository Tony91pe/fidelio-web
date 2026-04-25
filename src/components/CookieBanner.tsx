'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

const GA_ID = 'G-C9T26YPYCH'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function CookieBanner() {
  const [show, setShow] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [analyticsToggle, setAnalyticsToggle] = useState(false)
  const pathname = usePathname()

  // Track SPA route changes
  useEffect(() => {
    if (!analyticsEnabled || !window.gtag) return
    window.gtag('config', GA_ID, { page_path: pathname })
  }, [pathname, analyticsEnabled])

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (consent === 'accepted') {
      setAnalyticsEnabled(true)
    } else if (consent === 'custom') {
      const prefs = JSON.parse(localStorage.getItem('cookie_prefs') || '{}')
      setAnalyticsEnabled(!!prefs.analytics)
    } else if (!consent) {
      setTimeout(() => setShow(true), 1000)
    }
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    setAnalyticsEnabled(true)
    setShow(false)
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined')
    setShow(false)
  }

  function saveCustom() {
    localStorage.setItem('cookie_consent', 'custom')
    localStorage.setItem('cookie_prefs', JSON.stringify({ analytics: analyticsToggle }))
    setAnalyticsEnabled(analyticsToggle)
    setShow(false)
  }

  return (
    <>
      {analyticsEnabled && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="gtag-consent" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}

      {show && (
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
            Usiamo cookie tecnici necessari e, con il tuo consenso, cookie analitici (Google Analytics) per migliorare il sito.{' '}
            <a href="/privacy" style={{ color: '#A78BFA', textDecoration: 'none' }}>Privacy Policy</a>{' '}·{' '}
            <a href="/cookie-policy" style={{ color: '#A78BFA', textDecoration: 'none' }}>Cookie Policy</a>
          </p>

          {customizing && (
            <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'white', margin: 0 }}>Cookie tecnici</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Sessione, autenticazione — sempre attivi</p>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.2)', color: '#10B981', fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '100px' }}>
                  Sempre attivi
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'white', margin: 0 }}>Google Analytics</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Statistiche di navigazione anonime</p>
                </div>
                <button
                  onClick={() => setAnalyticsToggle(v => !v)}
                  style={{
                    width: 40, height: 22, borderRadius: 100, border: 'none', cursor: 'pointer',
                    background: analyticsToggle ? '#7C3AED' : 'rgba(255,255,255,0.15)',
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 3, left: analyticsToggle ? 21 : 3,
                    width: 16, height: 16, borderRadius: '50%', background: 'white',
                    transition: 'left 0.2s', display: 'block',
                  }} />
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={accept} style={{
              flex: 2, minWidth: 120, background: '#7C3AED', color: 'white',
              border: 'none', borderRadius: '10px', padding: '0.6rem',
              fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
            }}>
              Accetta tutto
            </button>
            <button onClick={decline} style={{
              flex: 2, minWidth: 120, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.6rem',
              fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
            }}>
              Solo necessari
            </button>
            {!customizing ? (
              <button onClick={() => setCustomizing(true)} style={{
                flex: 1, minWidth: 90, background: 'transparent', color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.6rem',
                fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer',
              }}>
                Personalizza
              </button>
            ) : (
              <button onClick={saveCustom} style={{
                flex: 1, minWidth: 90, background: 'rgba(108,61,244,0.2)', color: '#A78BFA',
                border: '1px solid rgba(108,61,244,0.3)', borderRadius: '10px', padding: '0.6rem',
                fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer',
              }}>
                Salva scelta
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
