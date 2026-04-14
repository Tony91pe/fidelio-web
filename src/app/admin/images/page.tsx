'use client'
import { useEffect, useState } from 'react'

export default function AdminImages() {
  const [shops, setShops] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin').then(r => r.json()).then(d => setShops(d.shops ?? []))
  }, [])

  const withLogo = shops.filter(s => s.logo)
  const withoutLogo = shops.filter(s => !s.logo)

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>🖼️ Gestione Immagini</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{withLogo.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>Negozi con logo</div>
        </div>
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{withoutLogo.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>Negozi senza logo</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {withLogo.map(s => (
          <div key={s.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
            <img src={s.logo} alt={s.name} style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', margin: '0 auto 0.75rem' }} />
            <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{s.city}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
