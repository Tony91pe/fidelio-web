'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Reward = { id: string; title: string; description: string; pointsCost: number }

const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px', padding: '10px 14px', color: 'white',
  width: '100%', outline: 'none', fontSize: '14px', marginBottom: '8px'
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [plan, setPlan] = useState<string>('STARTER')
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', pointsCost: '100' })
  const [planError, setPlanError] = useState('')

  const maxRewards = plan === 'STARTER' ? 1 : Infinity
  const isAtLimit = plan === 'STARTER' && rewards.length >= 1

  useEffect(() => {
    fetch('/api/shop/plan').then(r => r.json()).then(d => setPlan(d.plan))
    fetch('/api/rewards')
      .then(r => r.json())
      .then(setRewards)
      .catch(err => console.error('Error loading rewards:', err))
  }, [])

  async function createReward(e: React.FormEvent) {
    e.preventDefault()
    setPlanError('')
    setCreating(true)
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pointsCost: parseInt(form.pointsCost) }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.planLimit) setPlanError(data.error)
        return
      }
      setRewards([data, ...rewards])
      setForm({ title: '', description: '', pointsCost: '100' })
      setShowForm(false)
    } catch (err) {
      console.error('Error creating reward:', err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Premi</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>I premi riscattabili dai clienti</p>
        </div>
        <button
          onClick={() => { if (!isAtLimit) setShowForm(!showForm) }}
          disabled={isAtLimit}
          style={{
            background: isAtLimit ? 'rgba(255,255,255,0.05)' : '#6C3DF4',
            color: isAtLimit ? 'rgba(255,255,255,0.3)' : 'white',
            padding: '10px 20px', borderRadius: '10px', fontWeight: '600',
            border: isAtLimit ? '1px solid rgba(255,255,255,0.1)' : 'none',
            cursor: isAtLimit ? 'not-allowed' : 'pointer',
          }}>
          {isAtLimit ? '🔒 Limite raggiunto' : '+ Nuovo premio'}
        </button>
      </div>

      {/* Banner limite piano STARTER */}
      {plan === 'STARTER' && (
        <div style={{
          background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: 20 }}>🏆</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                Piano Starter: {rewards.length}/{maxRewards} premi attivi
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                Passa a Growth per premi illimitati
              </p>
            </div>
          </div>
          {isAtLimit && (
            <Link href="/dashboard/upgrade" style={{
              background: '#7c3aed', color: 'white', padding: '8px 18px',
              borderRadius: 10, fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', flexShrink: 0
            }}>
              Aggiorna piano →
            </Link>
          )}
          {!isAtLimit && (
            <div style={{ display: 'flex', gap: 4 }}>
              {[...Array(maxRewards)].map((_, i) => (
                <div key={i} style={{
                  width: 20, height: 6, borderRadius: 3,
                  background: i < rewards.length ? '#7c3aed' : 'rgba(255,255,255,0.1)'
                }} />
              ))}
            </div>
          )}
        </div>
      )}

      {planError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#EF4444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{planError}</span>
          <Link href="/dashboard/upgrade" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none', fontSize: '0.8rem' }}>Aggiorna →</Link>
        </div>
      )}

      {showForm && (
        <form onSubmit={createReward} style={{ background: 'rgba(108,61,244,0.1)', border: '1px solid rgba(108,61,244,0.25)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>Nuovo premio</h3>
          <input style={inp} placeholder="Nome premio (es. Caffè gratis)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input style={inp} placeholder="Descrizione (opzionale)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input style={inp} type="number" placeholder="Punti necessari" value={form.pointsCost} onChange={e => setForm({ ...form, pointsCost: e.target.value })} />
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '8px' }}>
            <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: 'transparent', color: 'white', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>
              Annulla
            </button>
            <button type="submit" disabled={creating} style={{ flex: 2, background: '#6C3DF4', color: 'white', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
              {creating ? 'Creazione...' : 'Crea premio'}
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '1rem' }}>
        {rewards.map(r => (
          <div key={r.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎁</span>
              <span style={{ background: 'rgba(108,61,244,0.2)', color: '#A78BFA', padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700' }}>
                {r.pointsCost} pt
              </span>
            </div>
            <h3 style={{ fontWeight: '700', marginBottom: '0.3rem' }}>{r.title}</h3>
            {r.description && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{r.description}</p>}
          </div>
        ))}
        {rewards.length === 0 && !showForm && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>🎁</p>
            <p style={{ fontWeight: '600' }}>Nessun premio ancora</p>
          </div>
        )}
      </div>
    </div>
  )
}
