'use client'
import { useEffect, useState } from 'react'

export default function AdminPlans() {
  const [data, setData] = useState<any>(null)
  const [working, setWorking] = useState(false)
  const [giftMonths, setGiftMonths] = useState<Record<string, number>>({})

  async function load() {
    const r = await fetch('/api/admin')
    if (r.ok) setData(await r.json())
  }

  useEffect(() => { load() }, [])

  async function changePlan(shopId: string, plan: string) {
    setWorking(true)
    await fetch('/api/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shopId, action: 'changePlan', plan }) })
    await load()
    setWorking(false)
  }

  async function giftPlan(shopId: string) {
    setWorking(true)
    const months = giftMonths[shopId] ?? 1
    await fetch('/api/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shopId, action: 'giftMonths', months }) })
    await load()
    setWorking(false)
  }

  const PLAN_COLOR: Record<string, string> = { STARTER: '#6b7280', GROWTH: '#7c3aed', PRO: '#f97316' }

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>💰 Gestione Piani</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        STARTER €19 · GROWTH €39 · PRO €79
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(data?.shops ?? []).map((shop: any) => (
          <div key={shop.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <p style={{ fontWeight: 600 }}>{shop.name}</p>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{shop.city}</p>
              </div>
              <span style={{ background: `${PLAN_COLOR[shop.plan]}22`, color: PLAN_COLOR[shop.plan], border: `1px solid ${PLAN_COLOR[shop.plan]}44`, padding: '3px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700 }}>
                {shop.plan}
                {shop.planExpiresAt && <span style={{ opacity: 0.7 }}> · scade {new Date(shop.planExpiresAt).toLocaleDateString('it-IT')}</span>}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {['STARTER', 'GROWTH', 'PRO'].map(p => (
                <button key={p} disabled={working || shop.plan === p} onClick={() => changePlan(shop.id, p)}
                  style={{ background: shop.plan === p ? PLAN_COLOR[p] : 'rgba(255,255,255,0.07)', border: `1px solid ${shop.plan === p ? PLAN_COLOR[p] : 'rgba(255,255,255,0.1)'}`, color: 'white', borderRadius: 8, padding: '5px 14px', cursor: shop.plan === p ? 'default' : 'pointer', fontSize: '0.78rem', fontWeight: 700, opacity: working ? 0.6 : 1 }}>
                  {p}
                </button>
              ))}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto' }}>
                <input type="number" min={1} max={24} value={giftMonths[shop.id] ?? 1}
                  onChange={e => setGiftMonths(prev => ({ ...prev, [shop.id]: Number(e.target.value) }))}
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '5px 10px', color: 'white', width: 60, outline: 'none', fontSize: '0.82rem', textAlign: 'center' }} />
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>mesi</span>
                <button disabled={working} onClick={() => giftPlan(shop.id)}
                  style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                  🎁 Regala Growth
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
