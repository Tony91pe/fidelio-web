'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ReferralPage() {
  const { referralCode } = useParams<{ referralCode: string }>()
  const [referrer, setReferrer] = useState<{ name: string; shopName: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/referral?code=${referralCode}`)
      .then(r => r.json())
      .then(d => { if (d.referrer) setReferrer(d.referrer) })
      .finally(() => setLoading(false))
  }, [referralCode])

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', color: 'white', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #7C3AED, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.75rem', fontWeight: 900 }}>F</div>

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Caricamento...</p>
        ) : referrer ? (
          <>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14, padding: '0.6rem 1.2rem', display: 'inline-block', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>🤝 Invito di {referrer.name}</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem', lineHeight: 1.2 }}>
              Unisciti al programma fedeltà di <span style={{ color: '#A78BFA' }}>{referrer.shopName}</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {referrer.name} ti ha invitato. Iscriviti gratuitamente e accumula punti ad ogni visita. Guadagni punti bonus subito!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { icon: '⭐', text: 'Punti bonus al primo check-in' },
                { icon: '🎁', text: 'Premi e sconti esclusivi' },
                { icon: '📱', text: 'Nessuna app da scaricare' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '0.75rem 1rem', textAlign: 'left' }}>
                  <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)' }}>{item.text}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/checkin/${referralCode}?ref=${referralCode}`}
              style={{ display: 'block', background: 'linear-gradient(135deg, #7C3AED, #3B82F6)', color: 'white', padding: '14px 24px', borderRadius: 14, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', marginBottom: '0.75rem', boxShadow: '0 8px 24px rgba(124,58,237,0.4)' }}>
              Iscriviti e guadagna punti →
            </Link>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>Gratis · Nessuna carta di credito</p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Link non valido</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>Questo codice referral non esiste o è scaduto.</p>
            <Link href="/" style={{ color: '#A78BFA', textDecoration: 'none', fontSize: '0.9rem' }}>← Torna alla home</Link>
          </>
        )}
      </div>
    </div>
  )
}
