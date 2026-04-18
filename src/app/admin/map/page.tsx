'use client'
import { useEffect, useState } from 'react'

export default function AdminMap() {
  const [shops, setShops] = useState<any[]>([])
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeResult, setGeocodeResult] = useState<{ updated: number; failed: number; total: number } | null>(null)

  async function load() {
    fetch('/api/admin').then(r => r.json()).then(d => setShops(d.shops ?? []))
  }

  useEffect(() => { load() }, [])

  async function geocodeAll() {
    setGeocoding(true)
    setGeocodeResult(null)
    const res = await fetch('/api/admin/shops/coordinates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ geocodeAll: true }),
    })
    const data = await res.json()
    setGeocodeResult(data)
    setGeocoding(false)
    await load()
  }

  const withCoords = shops.filter(s => s.lat && s.lng)
  const withoutCoords = shops.filter(s => !s.lat || !s.lng)

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>🗺️ Gestione Mappa</h1>
        {withoutCoords.length > 0 && (
          <button
            onClick={geocodeAll}
            disabled={geocoding}
            style={{
              background: geocoding ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.3)',
              border: '1px solid rgba(124,58,237,0.5)',
              color: '#a78bfa',
              borderRadius: 10,
              padding: '8px 18px',
              cursor: geocoding ? 'default' : 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              opacity: geocoding ? 0.7 : 1,
            }}
          >
            {geocoding ? `⏳ Geocodifica in corso... (rispetta rate limit)` : `📍 Geocodifica tutti (${withoutCoords.length} mancanti)`}
          </button>
        )}
      </div>

      {geocodeResult && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          ✅ Completato: <strong style={{ color: '#10b981' }}>{geocodeResult.updated}</strong> aggiornati,{' '}
          <strong style={{ color: '#f87171' }}>{geocodeResult.failed}</strong> falliti su {geocodeResult.total} totali
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{withCoords.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>Negozi sulla mappa ✓</div>
        </div>
        <div style={{ background: withoutCoords.length > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.05)', border: `1px solid ${withoutCoords.length > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.15)'}`, borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: withoutCoords.length > 0 ? '#ef4444' : '#10b981' }}>{withoutCoords.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>Senza coordinate</div>
        </div>
      </div>

      {withoutCoords.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#f59e0b' }}>⚠️ Negozi non visibili sulla mappa</h2>
          {withoutCoords.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.name}</span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{s.address}, {s.city}</span>
            </div>
          ))}
        </div>
      )}

      {withoutCoords.length === 0 && shops.length > 0 && (
        <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
          ✅ Tutti i negozi hanno le coordinate e sono visibili sulla mappa
        </div>
      )}
    </div>
  )
}
