'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getTier, getTierProgress, getPointsToNextTier } from '@/lib/tiers'

type PortalData = {
  customer: {
    name: string
    points: number
    totalVisits: number
    lastVisitAt: string | null
    referralCode: string | null
    createdAt: string
  }
  shop: {
    id: string
    name: string
    logo: string | null
    primaryColor: string
    category: string
    city: string
    rewards: { id: string; title: string; description: string | null; pointsCost: number }[]
  }
  visits: { points: number; note: string | null; createdAt: string; amount: number | null }[]
}

export default function CustomerPortal() {
  const { code } = useParams<{ code: string }>()
  const [data, setData] = useState<PortalData | null>(null)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/portal/${code}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setData)
      .catch(() => setError(true))
  }, [code])

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h1 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Card non trovata</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Il codice non è valido o è scaduto.</p>
      </div>
    </div>
  )

  if (!data) return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#7C3AED', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const { customer, shop, visits } = data
  const color = shop.primaryColor
  const tier = getTier(customer.points)
  const progress = getTierProgress(customer.points)
  const toNext = getPointsToNextTier(customer.points)
  const referralUrl = `https://www.getfidelio.app/r/${customer.referralCode}`

  function copyReferral() {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header shop */}
      <div style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)`, borderBottom: `1px solid ${color}33`, padding: '1.5rem 1.25rem 1.25rem' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {shop.logo
            ? <img src={shop.logo} alt={shop.name} style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', border: `2px solid ${color}55` }} />
            : <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}33`, border: `2px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, color }}>{shop.name[0]}</div>
          }
          <div>
            <p style={{ fontWeight: 800, fontSize: '1.05rem' }}>{shop.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{shop.city}</p>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem' }}>powered by</span><br />
            <span style={{ color, fontWeight: 700 }}>Fidelio</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '1.25rem' }}>

        {/* Card punti + tier */}
        <div style={{ background: `linear-gradient(135deg, ${color}22, ${color}0A)`, border: `1px solid ${color}44`, borderRadius: 20, padding: '1.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.2rem' }}>Ciao,</p>
              <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>{customer.name}</p>
            </div>
            <div style={{ background: tier.bg, border: `1px solid ${tier.color}44`, borderRadius: 100, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.9rem' }}>{tier.emoji}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: tier.color }}>{tier.name}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '3rem', fontWeight: 900, color, lineHeight: 1 }}>{customer.points.toLocaleString('it-IT')}</span>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>punti</span>
          </div>

          {/* Progress bar tier */}
          <div style={{ marginBottom: '0.4rem' }}>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${tier.color})`, borderRadius: 100, transition: 'width 0.6s ease' }} />
            </div>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>
            {toNext !== null ? `${toNext} punti per raggiungere ${['Silver','Gold','Platinum'][['Bronze','Silver','Gold'].indexOf(tier.name)] ?? 'il livello successivo'}` : '🏆 Hai raggiunto il livello massimo!'}
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color }}>{customer.totalVisits}</p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>visite</p>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>
                {customer.lastVisitAt ? new Date(customer.lastVisitAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }) : '—'}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>ultima visita</p>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>{shop.rewards.length}</p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>premi</p>
            </div>
          </div>
        </div>

        {/* Premi disponibili */}
        {shop.rewards.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Premi disponibili</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {shop.rewards.map(r => {
                const canRedeem = customer.points >= r.pointsCost
                return (
                  <div key={r.id} style={{ background: canRedeem ? `${color}11` : 'rgba(255,255,255,0.03)', border: `1px solid ${canRedeem ? color + '33' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, padding: '0.9rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: canRedeem ? `${color}22` : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>🎁</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.88rem', color: canRedeem ? 'white' : 'rgba(255,255,255,0.5)' }}>{r.title}</p>
                      <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>{r.pointsCost} punti</p>
                    </div>
                    {canRedeem
                      ? <span style={{ fontSize: '0.7rem', fontWeight: 700, color, background: `${color}22`, padding: '3px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>✓ Riscattabile</span>
                      : <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>-{r.pointsCost - customer.points} pt</span>
                    }
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Referral */}
        {customer.referralCode && (
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: '1rem 1.1rem', marginBottom: '1rem' }}>
            <p style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🤝 Invita un amico
            </p>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
              Condividi il tuo link e guadagna punti bonus quando un amico si iscrive!
            </p>
            <button
              onClick={copyReferral}
              style={{ width: '100%', background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '0.6rem', color: copied ? '#10B981' : 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              {copied ? '✓ Link copiato!' : `🔗 Copia link referral`}
            </button>
          </div>
        )}

        {/* Storico visite */}
        {visits.length > 0 && (
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Ultime visite</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {visits.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{v.note ?? 'Visita al negozio'}</p>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{new Date(v.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: '2-digit' })}</p>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: v.points >= 0 ? '#10B981' : '#ef4444' }}>
                    {v.points >= 0 ? '+' : ''}{v.points} pt
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>
          Powered by <a href="https://www.getfidelio.app" style={{ color: color, textDecoration: 'none', fontWeight: 600 }}>Fidelio</a>
        </p>
      </div>
    </div>
  )
}
