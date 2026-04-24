'use client'
import { useEffect, useState, useCallback } from 'react'

function isUnpaid(shop: any): boolean {
  const hasSubscription = !!shop.lsSubscriptionId
  const hasActiveTrial = shop.planExpiresAt && new Date(shop.planExpiresAt) > new Date()
  return !hasSubscription && !hasActiveTrial
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

  const [copied, setCopied] = useState<string | null>(null)
  const copyId = useCallback((id: string) => {
    navigator.clipboard.writeText(id)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }, [])

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

      {/* Tabella negozi */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'rgba(255,255,255,0.7)' }}>Tutti i negozi</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['ID', 'Nome', 'Città', 'Piano', 'Stato', 'LS Sub ID', 'Clienti', 'Creato'].map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.shops?.map((shop: any) => (
                <tr key={shop.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <code style={{ fontSize: '0.7rem', color: '#a78bfa', background: 'rgba(167,139,250,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                        {shop.id.slice(0, 8)}…
                      </code>
                      <button
                        onClick={() => copyId(shop.id)}
                        title={shop.id}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === shop.id ? '#10b981' : 'rgba(255,255,255,0.3)', fontSize: '0.75rem', padding: '2px 4px' }}>
                        {copied === shop.id ? '✓' : '⎘'}
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap' }}>{shop.name}</td>
                  <td style={{ padding: '0.5rem 0.75rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{shop.city}</td>
                  <td style={{ padding: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700,
                      background: shop.plan === 'PRO' ? 'rgba(251,191,36,0.15)' : shop.plan === 'GROWTH' ? 'rgba(108,61,244,0.2)' : 'rgba(255,255,255,0.06)',
                      color: shop.plan === 'PRO' ? '#fbbf24' : shop.plan === 'GROWTH' ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                    }}>{shop.plan}</span>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '0.7rem', color: shop.approved ? (shop.suspended ? '#ef4444' : '#10b981') : '#f59e0b' }}>
                      {shop.suspended ? '🔴 Sospeso' : shop.approved ? '🟢 Attivo' : '🟡 In attesa'}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}>
                    {shop.lsSubscriptionId
                      ? <code style={{ fontSize: '0.68rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: 4 }}>{String(shop.lsSubscriptionId).slice(0, 10)}…</code>
                      : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>—</span>
                    }
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>{shop._count?.customers ?? 0}</td>
                  <td style={{ padding: '0.5rem 0.75rem', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
                    {new Date(shop.createdAt).toLocaleDateString('it-IT')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
