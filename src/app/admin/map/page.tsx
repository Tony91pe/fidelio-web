'use client'
import { useEffect, useState } from 'react'

export default function AdminMap() {
  const [shops, setShops] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin').then(r => r.json()).then(d => setShops(d.shops ?? []))
  }, [])

  const withCoords = shops.filter(s => s.lat && s.lng)
  const withoutCoords = shops.filter(s => !s.lat || !s.lng)

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>🗺️ Gestione Mappa</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{withCoords.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>Negozi con coordinate</div>
        </div>
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{withoutCoords.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>Negozi senza coordinate</div>
        </div>
      </div>

      {withoutCoords.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#f59e0b' }}>⚠️ Negozi senza coordinate (non visibili sulla mappa)</h2>
          {withoutCoords.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.85rem' }}>{s.name}</span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{s.address}, {s.city}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
