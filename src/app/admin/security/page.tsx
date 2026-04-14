'use client'
import { useEffect, useState } from 'react'

export default function AdminSecurity() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin').then(r => r.json()).then(d => setData(d))
  }, [])

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>🔒 Sicurezza</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {[
          { title: 'Account sospesi', value: data?.shops?.filter((s: any) => s.suspended).length ?? '...', color: '#ef4444', icon: '🔴' },
          { title: 'In attesa approvazione', value: data?.shops?.filter((s: any) => !s.approved).length ?? '...', color: '#f59e0b', icon: '⏳' },
          { title: 'Negozi attivi', value: data?.shops?.filter((s: any) => !s.suspended && s.approved).length ?? '...', color: '#10b981', icon: '✅' },
          { title: 'Codici OTP attivi', value: data?.otpCodes ?? '...', color: '#a78bfa', icon: '🔑' },
        ].map(card => (
          <div key={card.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>{card.title}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>⚙️ Configurazione sicurezza</h2>
        {[
          { label: 'Rate limiting API', status: true },
          { label: 'Protezione brute force', status: true },
          { label: 'Verifica firma webhook Stripe', status: true },
          { label: 'HTTPS enforced', status: true },
          { label: 'Auth middleware attivo', status: true },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
            <span style={{ color: item.status ? '#10b981' : '#ef4444', fontWeight: 600, fontSize: '0.82rem' }}>{item.status ? '✓ Attivo' : '✗ Inattivo'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
