'use client'
import { useEffect, useState } from 'react'

export default function AdminUsers() {
  const [data, setData] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [working, setWorking] = useState(false)

  async function load() {
    const r = await fetch('/api/admin')
    if (r.ok) setData(await r.json())
  }

  useEffect(() => { load() }, [])

  async function action(shopId: string, payload: object) {
    setWorking(true)
    await fetch('/api/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shopId, ...payload }) })
    await load()
    setWorking(false)
  }

  const shops = (data?.shops ?? []).filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.ownerId.toLowerCase().includes(search.toLowerCase())
  )

  const inp = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: '0.85rem', outline: 'none' }

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>👥 Gestione Utenti</h1>
      <input placeholder="🔍 Cerca per nome o owner ID..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ ...inp, marginBottom: '1.5rem', width: 350 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {shops.map((shop: any) => (
          <div key={shop.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{shop.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{shop.ownerId}</p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>{shop.city} · {shop.plan}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button disabled={working} onClick={() => action(shop.id, { action: 'resetPassword', shopOwnerId: shop.ownerId })}
                style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                🔑 Reset Password
              </button>
              <button disabled={working} onClick={() => action(shop.id, { action: 'forceLogout', shopOwnerId: shop.ownerId })}
                style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                🚪 Logout
              </button>
              {!shop.approved && <button disabled={working} onClick={() => action(shop.id, { action: 'approve' })}
                style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                ✓ Approva
              </button>}
              {!shop.suspended && <button disabled={working} onClick={() => action(shop.id, { action: 'suspend' })}
                style={{ background: 'rgba(249,115,22,0.2)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                ⚠️ Sospendi
              </button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
