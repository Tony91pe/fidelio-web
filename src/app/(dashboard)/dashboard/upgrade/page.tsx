'use client'
import { useState, useEffect } from 'react'

const PLANS = [
  {
    id: 'starter',
    dbId: 'STARTER',
    name: 'Starter',
    price: '19',
    color: '#6B7280',
    gradient: 'linear-gradient(135deg, #374151, #1F2937)',
    features: [
      { label: 'Clienti illimitati', ok: true },
      { label: 'Fino a 3 premi fedeltà', ok: true },
      { label: 'Scanner QR check-in', ok: true },
      { label: 'Statistiche base', ok: true },
      { label: 'Gift Card', ok: false },
      { label: 'Offerte speciali', ok: false },
      { label: 'Analytics avanzate', ok: false },
      { label: 'Notifiche push', ok: false },
      { label: 'Campagne email', ok: false },
      { label: 'AI Insights', ok: false },
    ],
  },
  {
    id: 'growth',
    dbId: 'GROWTH',
    name: 'Growth',
    price: '39',
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #5B21B6, #2D1B69)',
    popular: true,
    features: [
      { label: 'Clienti illimitati', ok: true },
      { label: 'Premi fedeltà illimitati', ok: true },
      { label: 'Scanner QR check-in', ok: true },
      { label: 'Statistiche base', ok: true },
      { label: 'Gift Card', ok: true },
      { label: 'Offerte speciali', ok: true },
      { label: 'Analytics avanzate', ok: true },
      { label: 'Notifiche push', ok: true },
      { label: 'Campagne email', ok: false },
      { label: 'AI Insights', ok: false },
    ],
  },
  {
    id: 'pro',
    dbId: 'PRO',
    name: 'Pro',
    price: '79',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #C2410C, #7C2D12)',
    features: [
      { label: 'Clienti illimitati', ok: true },
      { label: 'Premi fedeltà illimitati', ok: true },
      { label: 'Scanner QR check-in', ok: true },
      { label: 'Statistiche base', ok: true },
      { label: 'Gift Card', ok: true },
      { label: 'Offerte speciali', ok: true },
      { label: 'Analytics avanzate', ok: true },
      { label: 'Notifiche push', ok: true },
      { label: 'Campagne email', ok: true },
      { label: 'AI Insights', ok: true },
    ],
  },
]

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState<string>('STARTER')
  const [billingPortalUrl, setPortalUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/lemonsqueezy/subscription')
      .then(r => r.json())
      .then(d => {
        if (d.plan) setCurrentPlan(d.plan)
        if (d.billingPortalUrl) setPortalUrl(d.billingPortalUrl)
      })
      .catch(() => {})
  }, [])

  async function handleUpgrade(planId: string) {
    setLoading(planId)
    try {
      const res = await fetch('/api/lemonsqueezy/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem',
          background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)',
        }}>⚡</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>Scegli il tuo piano</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
          Piano attuale:{' '}
          <span style={{ fontWeight: 700, color: currentPlan === 'PRO' ? '#F97316' : currentPlan === 'GROWTH' ? '#7C3AED' : '#9CA3AF' }}>
            {currentPlan}
          </span>
        </p>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {PLANS.map(plan => {
          const isCurrent = plan.dbId === currentPlan
          const isDowngrade = PLANS.findIndex(p => p.dbId === currentPlan) > PLANS.findIndex(p => p.id === plan.id)

          return (
            <div
              key={plan.id}
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                border: isCurrent ? `2px solid ${plan.color}` : `1px solid ${plan.color}33`,
                background: isCurrent
                  ? `${plan.gradient}, rgba(0,0,0,0.3)`
                  : 'rgba(255,255,255,0.03)',
              }}
            >
              {/* Badge */}
              {plan.popular && !isCurrent && (
                <div style={{
                  textAlign: 'center', padding: '6px', fontSize: '0.7rem',
                  fontWeight: 800, letterSpacing: '0.1em', background: plan.color, color: 'white',
                }}>
                  PIÙ SCELTO
                </div>
              )}
              {isCurrent && (
                <div style={{
                  textAlign: 'center', padding: '6px', fontSize: '0.7rem',
                  fontWeight: 800, letterSpacing: '0.1em', background: plan.color + 'CC', color: 'white',
                }}>
                  PIANO ATTUALE
                </div>
              )}

              <div style={{ padding: '1.5rem' }}>
                {/* Price */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: plan.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    {plan.name}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 900, color: isCurrent ? 'white' : plan.color }}>
                      €{plan.price}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>/mese</span>
                    {isCurrent && (
                      <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 10px', borderRadius: 10, fontSize: '0.72rem', fontWeight: 700 }}>
                        ✓ Attivo
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.25rem' }}>
                  {plan.features.map(f => (
                    <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: f.ok ? plan.color + '22' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${f.ok ? plan.color + '44' : 'rgba(255,255,255,0.08)'}`,
                      }}>
                        {f.ok
                          ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        }
                      </div>
                      <span style={{ fontSize: '0.83rem', color: f.ok ? (isCurrent ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.7)') : 'rgba(255,255,255,0.25)' }}>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {isCurrent ? (
                  <div style={{
                    width: '100%', padding: '12px', borderRadius: 12, textAlign: 'center',
                    fontSize: '0.875rem', fontWeight: 600,
                    background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)',
                  }}>
                    Piano in uso
                  </div>
                ) : isDowngrade ? (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={!!loading}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 12, cursor: 'pointer',
                      fontSize: '0.875rem', fontWeight: 600,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.4)', opacity: loading === plan.id ? 0.5 : 1,
                    }}
                  >
                    {loading === plan.id ? 'Reindirizzamento...' : `Passa a ${plan.name}`}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={!!loading}
                    style={{
                      width: '100%', padding: '13px', borderRadius: 12, cursor: 'pointer',
                      fontSize: '0.875rem', fontWeight: 700, color: 'white', border: 'none',
                      background: `linear-gradient(135deg, ${plan.color}, ${plan.color}AA)`,
                      boxShadow: `0 4px 16px ${plan.color}44`,
                      opacity: loading === plan.id ? 0.5 : 1,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    {loading === plan.id ? 'Reindirizzamento...' : `Upgrade a ${plan.name} →`}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Billing portal */}
      {billingPortalUrl && (
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
          Per gestire o cancellare l&apos;abbonamento vai al{' '}
          <a href={billingPortalUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#7C3AED', textDecoration: 'underline' }}>
            portale di fatturazione
          </a>
        </p>
      )}

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.15)' }}>
        Il pagamento viene gestito in modo sicuro tramite Lemon Squeezy
      </p>
    </div>
  )
}
