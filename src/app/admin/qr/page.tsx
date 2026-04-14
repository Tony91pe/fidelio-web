'use client'
import { useEffect, useState } from 'react'

export default function AdminQR() {
  const [shops, setShops] = useState<any[]>([])
  const [working, setWorking] = useState<string | null>(null)
  const [qrResult, setQrResult] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/admin').then(r => r.json()).then(d => setShops(d.shops ?? []))
  }, [])

  async function regenerateQR(shopId: string) {
    setWorking(shopId)
    const r = await fetch('/api/admin/qr/regenerate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId })
    })
    const d = await r.json()
    if (d.qrCode) setQrResult(prev => ({ ...prev, [shopId]: d.qrCode }))
    setWorking(null)
  }

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>📱 Gestione QR Code</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {shops.map(shop => (
          <div key={shop.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{shop.name}</p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{shop.city} · {shop.plan}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {qrResult[shop.id] && <img src={qrResult[shop.id]} alt="QR" style={{ width: 60, height: 60 }} />}
              <button disabled={working === shop.id} onClick={() => regenerateQR(shop.id)}
                style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, opacity: working === shop.id ? 0.6 : 1 }}>
                {working === shop.id ? '...' : '🔄 Rigenera QR'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
