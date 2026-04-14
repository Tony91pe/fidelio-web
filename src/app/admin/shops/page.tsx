'use client'
import { useEffect, useState } from 'react'

type Shop = {
  id: string; name: string; category: string; city: string
  plan: string; suspended: boolean; approved: boolean
  createdAt: string; ownerId: string
  _count: { customers: number; visits: number }
}

export default function AdminShops() {
  const [shops, setShops] = useState<Shop[]>([])
  const [search, setSearch] = useState('')
  const [working, setWorking] = useState(false)

  async function load() {
    const r = await fetch('/api/admin')
    if (r.ok) { const d = await r.json(); setShops(d.shops) }
  }

  useEffect(() => { load() }, [])

  async function action(shopId: string, payload: object) {
    setWorking(true)
    await fetch('/api/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shopId, ...payload }) })
    await load()
    setWorking(false)
  }

  const filtered = shops.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  )

  const s = { background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }
  const inp = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: '0.85rem', outline: 'none' }

  return (
    <div style={s}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>🏪 Gestione Negozi</h1>
      <input placeholder="🔍 Cerca..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ ...inp, marginBottom: '1.5rem', width: 300 }} />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {['Nome', 'Città', 'Piano', 'Clienti', 'Stato', 'Approvato', 'Registrato', 'Azioni'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(shop => (
              <tr key={shop.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{shop.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.5)' }}>{shop.city}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', padding: '2px 8px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700 }}>{shop.plan}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.5)' }}>{shop._count.customers}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ color: shop.suspended ? '#ef4444' : '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>{shop.suspended ? '● Sospeso' : '● Attivo'}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {shop.approved ? <span style={{ color: '#10b981' }}>✓</span> : <span style={{ color: '#f59e0b' }}>⏳</span>}
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{new Date(shop.createdAt).toLocaleDateString('it-IT')}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {!shop.approved && <button disabled={working} onClick={() => action(shop.id, { action: 'approve' })} style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Approva</button>}
                    {!shop.suspended && <button disabled={working} onClick={() => action(shop.id, { action: 'suspend' })} style={{ background: 'rgba(249,115,22,0.2)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Sospendi</button>}
                    {shop.suspended && <button disabled={working} onClick={() => action(shop.id, { action: 'unsuspend' })} style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Riattiva</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
