'use client'
import { useState, useEffect } from 'react'
import UpgradeWall from '@/components/UpgradeWall'

type Offer = { id: string; title: string; description: string; expiresAt: string | null; active: boolean }

const s = {
  inp: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 14px', color: 'white', width: '100%', outline: 'none', fontSize: '14px' } as React.CSSProperties,
  btn: (primary?: boolean) => ({ background: primary ? '#7C3AED' : 'rgba(255,255,255,0.07)', color: 'white', border: primary ? 'none' : '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }) as React.CSSProperties,
}

export default function OffersPage() {
  const [plan, setPlan] = useState<string | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [expires, setExpires] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/shop/plan').then(r => r.json()).then(d => setPlan(d.plan))
    fetch('/api/shop/offers').then(r => r.json()).then(setOffers).catch(() => {})
  }, [])

  if (plan === null) return null
  if (plan === 'STARTER') return <UpgradeWall requiredPlan="GROWTH" currentPlan={plan} feature="Offerte" description="Crea offerte e promozioni visibili ai clienti nella PWA. Disponibile dal piano Growth." />

  async function create() {
    if (!title.trim() || !desc.trim()) return alert('Compila titolo e descrizione')
    setSaving(true)
    const res = await fetch('/api/shop/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: desc, expiresAt: expires || null }),
    })
    if (res.ok) {
      const o = await res.json()
      setOffers(prev => [o, ...prev])
      setTitle(''); setDesc(''); setExpires('')
    }
    setSaving(false)
  }

  async function toggle(id: string, active: boolean) {
    await fetch(`/api/shop/offers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !active }) })
    setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !active } : o))
  }

  async function remove(id: string) {
    if (!confirm('Eliminare questa offerta?')) return
    await fetch(`/api/shop/offers/${id}`, { method: 'DELETE' })
    setOffers(prev => prev.filter(o => o.id !== id))
  }

  return (
    <div style={{ color: 'white', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>🔥 Offerte</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>Promozioni visibili ai clienti nell'app</p>

      {/* Form nuova offerta */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem', marginBottom: '2rem' }}>
        <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Nuova offerta</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input style={s.inp} placeholder="Titolo (es. -20% su tutto)" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea style={{ ...s.inp, minHeight: 80, resize: 'vertical' }} placeholder="Descrizione dell'offerta" value={desc} onChange={e => setDesc(e.target.value)} />
          <input style={s.inp} type="date" value={expires} onChange={e => setExpires(e.target.value)} title="Scadenza (opzionale)" />
          <button style={s.btn(true)} onClick={create} disabled={saving}>{saving ? 'Salvataggio...' : 'Pubblica offerta'}</button>
        </div>
      </div>

      {/* Lista offerte */}
      {offers.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem' }}>Nessuna offerta ancora</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {offers.map(o => (
            <div key={o.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${o.active ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{o.title}</p>
                <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>{o.description}</p>
                {o.expiresAt && <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>Scade: {new Date(o.expiresAt).toLocaleDateString('it-IT')}</p>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: o.active ? '#10b981' : 'rgba(255,255,255,0.3)' }}>{o.active ? '● Attiva' : '● Inattiva'}</span>
                <button style={s.btn()} onClick={() => toggle(o.id, o.active)}>{o.active ? 'Disattiva' : 'Attiva'}</button>
                <button style={{ ...s.btn(), color: '#ef4444' }} onClick={() => remove(o.id)}>Elimina</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
