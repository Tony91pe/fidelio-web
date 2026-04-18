'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import Link from 'next/link'

function ExpiryBanner({ planExpiresAt, isFounder, plan }: { planExpiresAt: string; isFounder: boolean; plan: string }) {
  const expires = new Date(planExpiresAt)
  const now = new Date()
  const daysLeft = Math.ceil((expires.getTime() - now.getTime()) / 86400000)

  if (daysLeft <= 0) {
    return (
      <div style={{ background: 'rgba(239,68,68,0.12)', borderBottom: '1px solid rgba(239,68,68,0.3)', padding: '10px 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.88rem' }}>⚠️ Il tuo piano {plan} è scaduto.</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Abbonati per continuare ad usare tutte le funzionalità.</span>
        <Link href="/dashboard/upgrade" style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', padding: '5px 14px', borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Abbonati ora →
        </Link>
      </div>
    )
  }

  if (daysLeft <= 14) {
    const label = isFounder ? `Il tuo periodo fondatore scade tra ${daysLeft} giorn${daysLeft === 1 ? 'o' : 'i'}.` : `Il tuo piano ${plan} scade tra ${daysLeft} giorn${daysLeft === 1 ? 'o' : 'i'}.`
    return (
      <div style={{ background: 'rgba(245,158,11,0.1)', borderBottom: '1px solid rgba(245,158,11,0.25)', padding: '10px 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.88rem' }}>⏰ {label}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Attiva un abbonamento per non perdere le funzionalità.</span>
        <Link href="/dashboard/upgrade" style={{ marginLeft: 'auto', background: '#f59e0b', color: '#0D0D1A', padding: '5px 14px', borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Abbonati ora →
        </Link>
      </div>
    )
  }

  if (isFounder && daysLeft <= 30) {
    return (
      <div style={{ background: 'rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.2)', padding: '10px 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.88rem' }}>🎁 Piano fondatore attivo — scade tra {daysLeft} giorni.</span>
        <Link href="/dashboard/upgrade" style={{ marginLeft: 'auto', color: '#a78bfa', padding: '5px 14px', borderRadius: 8, fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none', border: '1px solid rgba(124,58,237,0.3)', whiteSpace: 'nowrap' }}>
          Gestisci abbonamento →
        </Link>
      </div>
    )
  }

  return null
}

function UnpaidGate({ plan }: { plan: string }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0F0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '520px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg,#7C3AED,#3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px', fontWeight: '900' }}>F</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.75rem' }}>Completa il tuo abbonamento</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', marginBottom: '2rem' }}>
          Il tuo negozio è registrato e approvato. Per accedere alla dashboard scegli un piano e completa il pagamento.
        </p>
        <div style={{ background: 'rgba(108,61,244,0.1)', border: '1px solid rgba(108,61,244,0.3)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { name: 'STARTER', price: '19', desc: 'QR statico, punti base, 1 premio' },
              { name: 'GROWTH', price: '39', desc: 'QR dinamico, gift card, automazioni', featured: true },
              { name: 'PRO', price: '79', desc: 'Multi-sede, API, reportistica avanzata' },
            ].map(p => (
              <div key={p.name} style={{ flex: 1, minWidth: '140px', background: p.featured ? 'rgba(108,61,244,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${p.featured ? 'rgba(108,61,244,0.5)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontWeight: '800', marginBottom: '0.25rem' }}>{p.name}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: p.featured ? '#A78BFA' : 'white' }}>€{p.price}<span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>/mese</span></div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <Link href="/dashboard/upgrade" style={{ display: 'inline-block', background: '#7C3AED', color: 'white', padding: '0.9rem 2.5rem', borderRadius: '100px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', boxShadow: '0 0 30px rgba(108,61,244,0.4)' }}>
          Scegli il piano →
        </Link>
        <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
          Hai già un codice fondatore?{' '}
          <Link href="/fondatore" style={{ color: '#A78BFA', textDecoration: 'none' }}>Candidati qui</Link>
        </p>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'approved' | 'pending' | 'no-shop' | 'unpaid'>('loading')
  const [unpaidPlan, setUnpaidPlan] = useState<string>('STARTER')
  const [planInfo, setPlanInfo] = useState<{ plan: string; planExpiresAt: string | null; isFounder: boolean } | null>(null)

  useEffect(() => {
    fetch('/api/admin/check')
      .then(r => r.json())
      .then(data => {
        if (data.isAdmin) { router.replace('/admin'); return }
        return fetch('/api/shop/status')
          .then(r => r.json())
          .then(data => {
            setStatus(data.status)
            if (data.status === 'unpaid') setUnpaidPlan(data.plan ?? 'STARTER')
          })
          .catch(() => setStatus('no-shop'))
      })
      .catch(() => {
        fetch('/api/shop/status')
          .then(r => r.json())
          .then(data => {
            setStatus(data.status)
            if (data.status === 'unpaid') setUnpaidPlan(data.plan ?? 'STARTER')
          })
          .catch(() => setStatus('no-shop'))
      })

    fetch('/api/shop/plan')
      .then(r => r.json())
      .then(d => setPlanInfo({ plan: d.plan, planExpiresAt: d.planExpiresAt, isFounder: d.isFounder }))
  }, [router])

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#0F0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,#7C3AED,#3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px', fontWeight: '900' }}>F</div>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Caricamento...</p>
        </div>
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div style={{ minHeight: '100vh', background: '#0F0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg,#7C3AED,#3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px', fontWeight: '900' }}>F</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.75rem' }}>In attesa di approvazione</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', marginBottom: '2rem' }}>
            La tua registrazione è stata ricevuta. Il nostro team verificherà le informazioni del tuo negozio e ti darà accesso entro 24 ore.
          </p>
          <div style={{ background: 'rgba(108,61,244,0.1)', border: '1px solid rgba(108,61,244,0.3)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
              Riceverai una email a conferma dell&apos;approvazione. Nel frattempo puoi contattarci a{' '}
              <a href="mailto:support@getfidelio.app" style={{ color: '#A78BFA' }}>support@getfidelio.app</a>
            </p>
          </div>
          <a href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', textDecoration: 'none' }}>← Torna alla home</a>
        </div>
      </div>
    )
  }

  if (status === 'unpaid') {
    return <UnpaidGate plan={unpaidPlan} />
  }

  return (
    <div className="flex min-h-screen bg-[#0F0F1A] text-white flex-col">
      {planInfo?.planExpiresAt && (
        <ExpiryBanner
          planExpiresAt={planInfo.planExpiresAt}
          isFounder={planInfo.isFounder}
          plan={planInfo.plan}
        />
      )}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}
