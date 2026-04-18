'use client'
import { useEffect, useState } from 'react'

const CHECKS = [
  { key: 'api', label: 'API', endpoint: '/api/shops' },
  { key: 'auth', label: 'Autenticazione', endpoint: null },
]

type Status = 'ok' | 'error' | 'checking'

export default function StatusPage() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({
    api: 'checking',
    auth: 'ok',
    db: 'checking',
  })
  const [checkedAt, setCheckedAt] = useState<string>('')

  useEffect(() => {
    async function check() {
      const results: Record<string, Status> = { auth: 'ok' }
      try {
        const r = await fetch('/api/shops?limit=1', { signal: AbortSignal.timeout(5000) })
        results.api = r.ok ? 'ok' : 'error'
        results.db = r.ok ? 'ok' : 'error'
      } catch {
        results.api = 'error'
        results.db = 'error'
      }
      setStatuses(results)
      setCheckedAt(new Date().toLocaleTimeString('it-IT'))
    }
    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [])

  const allOk = Object.values(statuses).every(s => s === 'ok')

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', color: 'white', fontFamily: 'system-ui', padding: '48px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px', fontSize: '20px', fontWeight: 900 }}>F</span>
            <span style={{ fontSize: '22px', fontWeight: 800 }}>Fidelio Status</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: allOk ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${allOk ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: '100px', padding: '8px 20px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: allOk ? '#10B981' : '#EF4444',
              boxShadow: `0 0 8px ${allOk ? '#10B981' : '#EF4444'}`,
            }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: allOk ? '#10B981' : '#EF4444' }}>
              {allOk ? 'Tutti i sistemi operativi' : 'Problemi in corso'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {[
            { key: 'api', label: 'API Principale', desc: 'Endpoint REST' },
            { key: 'db', label: 'Database', desc: 'PostgreSQL / Neon' },
            { key: 'auth', label: 'Autenticazione', desc: 'Clerk' },
          ].map(({ key, label, desc }) => {
            const status = statuses[key] || 'checking'
            return (
              <div key={key} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: status === 'ok' ? '#10B981' : status === 'error' ? '#EF4444' : '#F59E0B',
                    animation: status === 'checking' ? 'pulse 1.5s infinite' : 'none',
                  }} />
                  <span style={{
                    fontSize: '13px', fontWeight: 600,
                    color: status === 'ok' ? '#10B981' : status === 'error' ? '#EF4444' : '#F59E0B',
                  }}>
                    {status === 'ok' ? 'Operativo' : status === 'error' ? 'Errore' : 'Verifica...'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {checkedAt && (
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
            Ultimo aggiornamento: {checkedAt} · aggiornamento automatico ogni 60s
          </p>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  )
}
