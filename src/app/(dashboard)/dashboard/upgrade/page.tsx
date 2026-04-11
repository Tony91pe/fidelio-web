'use client'
import { useState } from 'react'

const plans = [
  {
    id: 'growth',
    name: 'Growth',
    price: '29',
    features: ['Fino a 2.000 clienti', 'Tutte le campagne email', 'AI suggerimenti', 'Analytics avanzate'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '79',
    features: ['Clienti illimitati', 'AI avanzata', 'Export dati', '5 negozi'],
  },
]

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(planId: string) {
    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
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
    <div>
      <div style={{textAlign:'center', marginBottom:'3rem'}}>
        <h1 style={{fontSize:'2rem', fontWeight:'700', marginBottom:'0.5rem'}}>Potenzia Fidelio</h1>
        <p style={{color:'rgba(255,255,255,0.5)'}}>Scegli il piano giusto per il tuo negozio</p>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', maxWidth:'700px', margin:'0 auto'}}>
        {plans.map(plan => (
          <div key={plan.id} style={{
            background: plan.id === 'growth' ? 'rgba(108,61,244,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${plan.id === 'growth' ? 'rgba(108,61,244,0.4)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '20px',
            padding: '2rem',
          }}>
            {plan.id === 'growth' && (
              <div style={{background:'#6C3DF4', color:'white', padding:'0.2rem 0.8rem',
                borderRadius:'100px', fontSize:'0.7rem', fontWeight:'700',
                display:'inline-block', marginBottom:'1rem'}}>
                PIU SCELTO
              </div>
            )}
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', marginBottom:'0.3rem'}}>{plan.name}</h2>
            <div style={{fontSize:'2.5rem', fontWeight:'800', marginBottom:'1.5rem'}}>
              {plan.price}<span style={{fontSize:'1rem', color:'rgba(255,255,255,0.5)'}}> euro/mese</span>
            </div>
            <ul style={{listStyle:'none', padding:0, marginBottom:'1.5rem'}}>
              {plan.features.map(f => (
                <li key={f} style={{fontSize:'0.85rem', color:'rgba(255,255,255,0.7)',
                  marginBottom:'0.5rem', display:'flex', gap:'0.5rem'}}>
                  <span style={{color:'#10B981'}}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={loading === plan.id}
              style={{width:'100%', background: plan.id === 'growth' ? '#6C3DF4' : 'transparent',
                color:'white', padding:'12px', borderRadius:'12px', fontWeight:'700',
                border: plan.id === 'pro' ? '1px solid rgba(255,255,255,0.2)' : 'none',
                cursor:'pointer', opacity: loading === plan.id ? 0.7 : 1}}>
              {loading === plan.id ? 'Reindirizzamento...' : `Passa a ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}