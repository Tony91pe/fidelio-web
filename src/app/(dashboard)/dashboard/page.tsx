import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import VisitsChart from './VisitsChart'
import AIInsights from './AIInsights'
import { NotificationBell } from '@/components/dashboard/NotificationBell'

const EMOJI: Record<string, string> = {
  bar: '☕', restaurant: '🍕', hair: '✂️', beauty: '💅',
  gym: '💪', bakery: '🍰', clothing: '👗', bio: '🌿', other: '🏪',
}

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')
  if (userId === process.env.ADMIN_USER_ID) redirect('/admin')

  const user = await currentUser()
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })

  if (!shop) return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Benvenuto su Fidelio!</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>Crea il tuo negozio per iniziare</p>
      <Link href="/dashboard/shop"
        style={{ background: '#6C3DF4', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', textDecoration: 'none' }}>
        Crea il tuo negozio →
      </Link>
    </div>
  )

  const ago30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const [total, active, atRisk, pts, rewardCount, customerCount] = await Promise.all([
    db.customer.count({ where: { shopId: shop.id } }),
    db.customer.count({ where: { shopId: shop.id, lastVisitAt: { gte: ago30 } } }),
    db.customer.count({ where: { shopId: shop.id, lastVisitAt: { lt: ago30, not: null } } }),
    db.visit.aggregate({ where: { shopId: shop.id }, _sum: { points: true } }),
    db.reward.count({ where: { shopId: shop.id, active: true } }),
    db.customer.count({ where: { shopId: shop.id } }),
  ])

  // Checklist onboarding
  const onboardingSteps = [
    { label: 'Profilo negozio completato', done: !!(shop.logo && shop.address), link: '/dashboard/settings', icon: '🏪' },
    { label: 'Almeno un premio creato', done: rewardCount > 0, link: '/dashboard/rewards', icon: '🎁' },
    { label: 'Primo cliente acquisito', done: customerCount > 0, link: '/dashboard/customers/new', icon: '👤' },
    { label: 'QR code stampato', done: customerCount > 0, link: '/dashboard/qr', icon: '📱' },
  ]
  const onboardingDone = onboardingSteps.filter(s => s.done).length
  const showOnboarding = onboardingDone < onboardingSteps.length

  const kpis = [
    { label: 'Clienti totali', value: total, icon: '👥', color: '#6C3DF4', href: '/dashboard/customers' },
    { label: 'Attivi (30gg)', value: active, icon: '🔥', color: '#10B981', href: '/dashboard/analytics' },
    { label: 'A rischio', value: atRisk, icon: '⚠️', color: '#EF4444', href: '/dashboard/analytics' },
    { label: 'Punti distribuiti', value: (pts._sum.points || 0).toLocaleString('it-IT'), icon: '⭐', color: '#F59E0B', href: '/dashboard/analytics' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
            {EMOJI[shop.category] || '🏪'} {shop.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>Ciao {user?.firstName}! 👋</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <NotificationBell />
          <Link href="/dashboard/customers/new"
            style={{ background: '#6C3DF4', color: 'white', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
            + Aggiungi cliente
          </Link>
        </div>
      </div>

      {/* Onboarding checklist */}
      {showOnboarding && (
        <div style={{ background: 'rgba(108,61,244,0.08)', border: '1px solid rgba(108,61,244,0.25)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.2rem' }}>🚀 Inizia con Fidelio</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{onboardingDone}/{onboardingSteps.length} passaggi completati</p>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: '700' }}>
              {Math.round((onboardingDone / onboardingSteps.length) * 100)}%
            </div>
          </div>
          {/* Barra progresso */}
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ height: '100%', width: `${(onboardingDone / onboardingSteps.length) * 100}%`, background: 'linear-gradient(90deg,#6C3DF4,#A78BFA)', borderRadius: '2px', transition: 'width 0.5s' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.6rem' }}>
            {onboardingSteps.map(step => (
              <Link key={step.label} href={step.done ? '#' : step.link} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                  background: step.done ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${step.done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px',
                }}>
                  <span style={{ fontSize: '1.1rem' }}>{step.done ? '✅' : step.icon}</span>
                  <span style={{ fontSize: '0.82rem', color: step.done ? 'rgba(255,255,255,0.5)' : 'white', fontWeight: step.done ? '400' : '500', textDecoration: step.done ? 'line-through' : 'none' }}>
                    {step.label}
                  </span>
                  {!step.done && <span style={{ marginLeft: 'auto', color: '#A78BFA', fontSize: '0.75rem' }}>→</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {kpis.map(k => (
          <Link key={k.label} href={k.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.2rem', cursor: 'pointer', transition: 'border-color 0.2s' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{k.icon}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.2rem' }}>{k.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: k.color }}>{k.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Alert clienti a rischio */}
      {atRisk > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '0.9rem 1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
              <strong style={{ color: '#EF4444' }}>{atRisk} clienti</strong> non visitano da più di 30 giorni — considera una campagna winback
            </span>
          </div>
          <Link href="/dashboard/campaigns" style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Crea campagna →
          </Link>
        </div>
      )}

      {/* Grafico + AI Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>Visite ultimi 7 giorni</h3>
          <VisitsChart shopId={shop.id} />
        </div>
        <AIInsights />
      </div>
    </div>
  )
}
