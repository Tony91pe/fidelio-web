'use client'
import { useEffect, useState } from 'react'

function isUnpaid(shop: any): boolean {
  const hasPaddle = !!shop.stripeId
  const hasActiveTrial = shop.planExpiresAt && new Date(shop.planExpiresAt) > new Date()
  return !hasPaddle && !hasActiveTrial
}

type GiftState = { months: number; plan: string }

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [giftOpen, setGiftOpen] = useState<string | null>(null)
  const [giftState, setGiftState] = useState<GiftState>({ months: 3, plan: 'GROWTH' })
  const [emailLoading, setEmailLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin').then(r => r.json()).then(setData)
  }, [])

  async function giftMonths(shopId: string) {
    setActionLoading(shopId)
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId, action: 'giftMonths', months: giftState.months, plan: giftState.plan }),
    })
    const fresh = await fetch('/api/admin').then(r => r.json())
    setData(fresh)
    setActionLoading(null)
    setGiftOpen(null)
  }

  async function downgradeToStarter(shopId: string) {
    setActionLoading(shopId)
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId, action: 'changePlan', plan: 'STARTER' }),
    })
    const fresh = await fetch('/api/admin').then(r => r.json())
    setData(fresh)
    setActionLoading(null)
  }

  async function sendPaymentEmail(shop: any) {
    if (!shop.ownerEmail) { alert('Email negozio non trovata — aggiorna prima il profilo del negozio'); return }
    setEmailLoading(shop.id)
    try {
      const res = await fetch('/api/admin/contact-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: shop.id, shopName: shop.name, ownerEmail: shop.ownerEmail }),
      })
      const json = await res.json()
      if (!res.ok) { alert(`Errore: ${json.error ?? 'Invio fallito'}`); return }
      alert(`✅ Email inviata a ${shop.ownerEmail}`)
    } catch {
      alert('Errore di rete durante l\'invio')
    } finally {
      setEmailLoading(null)
    }
  }

  const mrr = data?.shops?.reduce((acc: number, s: any) => {
    if (!isUnpaid(s)) {
      if (s.plan === 'STARTER') return acc + 19
      if (s.plan === 'GROWTH') return acc + 39
      if (s.plan === 'PRO') return acc + 79
    }
    return acc
  }, 0) ?? 0

  const unpaidShops: any[] = data?.shops?.filter(isUnpaid) ?? []

  const stats = [
    { label: 'MRR Reale', value: `€${mrr}`, icon: '💰', color: '#10b981' },
    { label: 'Negozi totali', value: data?.shops?.length ?? '...', icon: '🏪', color: '#7c3aed' },
    { label: 'Abbonati attivi', value: data?.shops?.filter((s: any) => !isUnpaid(s) && s.plan !== 'STARTER').length ?? '...', icon: '⚡', color: '#f97316' },
    { label: 'In attesa approv.', value: data?.shops?.filter((s: any) => !s.approved).length ?? '...', icon: '⏳', color: '#f59e0b' },
    { label: 'Clienti totali', value: data?.totalCustomers ?? '...', icon: '👥', color: '#06b6d4' },
    { label: 'Clienti PWA', value: data?.pwaCustomers?.length ?? '...', icon: '📱', color: '#8b5cf6' },
    { label: 'Visite totali', value: data?.totalVisits ?? '...', icon: '📊', color: '#ec4899' },
    { label: 'Sospesi', value: data?.shops?.filter((s: any) => s.suspended).length ?? '...', icon: '🔴', color: '#ef4444' },
  ]

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>📊 Dashboard</h1>

      {unpaidShops.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fca5a5' }}>
              {unpaidShops.length} negozio{unpaidShops.length > 1 ? 'i' : ''} con piano a pagamento senza abbonamento attivo
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {unpaidShops.map((shop: any) => (
              <div key={shop.id} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: '0.75rem 1rem' }}>
                {/* Row principale */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{shop.name}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginLeft: '0.5rem' }}>{shop.city}</span>
                    {shop.ownerEmail && (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginLeft: '0.5rem' }}>{shop.ownerEmail}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', padding: '2px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700 }}>
                      {shop.plan}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                      {shop.planExpiresAt ? `scaduto ${new Date(shop.planExpiresAt).toLocaleDateString('it-IT')}` : 'nessun pagamento'}
                    </span>
                    <button
                      onClick={() => { setGiftOpen(giftOpen === shop.id ? null : shop.id); setGiftState({ months: 3, plan: 'GROWTH' }) }}
                      style={{ background: 'rgba(108,61,244,0.3)', color: '#a78bfa', border: '1px solid rgba(108,61,244,0.4)', padding: '3px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                      🎁 Regala mesi
                    </button>
                    <button
                      disabled={emailLoading === shop.id}
                      onClick={() => sendPaymentEmail(shop)}
                      style={{ background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', padding: '3px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', opacity: emailLoading === shop.id ? 0.5 : 1 }}>
                      {emailLoading === shop.id ? '...' : '✉️ Contatta'}
                    </button>
                    <button
                      disabled={actionLoading === shop.id}
                      onClick={() => downgradeToStarter(shop.id)}
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', opacity: actionLoading === shop.id ? 0.5 : 1 }}>
                      Downgrada
                    </button>
                  </div>
                </div>

                {/* Pannello regalo mesi */}
                {giftOpen === shop.id && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(108,61,244,0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Mesi:</span>
                    {[1, 2, 3, 6, 12].map(m => (
                      <button key={m} onClick={() => setGiftState(s => ({ ...s, months: m }))}
                        style={{ padding: '3px 10px', borderRadius: 8, border: '1px solid rgba(108,61,244,0.4)', background: giftState.months === m ? '#6C3DF4' : 'transparent', color: 'white', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                        {m}
                      </button>
                    ))}
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginLeft: '0.5rem' }}>Piano:</span>
                    {['STARTER', 'GROWTH', 'PRO'].map(p => (
                      <button key={p} onClick={() => setGiftState(s => ({ ...s, plan: p }))}
                        style={{ padding: '3px 10px', borderRadius: 8, border: '1px solid rgba(108,61,244,0.4)', background: giftState.plan === p ? '#6C3DF4' : 'transparent', color: 'white', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={actionLoading === shop.id}
                      onClick={() => giftMonths(shop.id)}
                      style={{ marginLeft: 'auto', background: '#6C3DF4', color: 'white', border: 'none', padding: '4px 14px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', opacity: actionLoading === shop.id ? 0.5 : 1 }}>
                      {actionLoading === shop.id ? '...' : `✓ Regala ${giftState.months} mes${giftState.months === 1 ? 'e' : 'i'} ${giftState.plan}`}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: stat.color }} />
            <div style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>{stat.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
