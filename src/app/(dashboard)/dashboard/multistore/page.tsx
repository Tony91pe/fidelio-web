'use client'
import { useState, useEffect } from 'react'
import UpgradeWall from '@/components/UpgradeWall'

type Branch = { id: string; name: string; address: string; city: string; customers: number; visits: number; approved: boolean }

const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 14px', color: 'white', width: '100%', outline: 'none', fontSize: '14px' }

export default function MultiStorePage() {
  const [plan, setPlan] = useState<string | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/shop/plan').then(r => r.json()).then(d => setPlan(d.plan))
    fetch('/api/shop/branches').then(r => r.json()).then(setBranches).catch(() => {})
  }, [])

  if (plan === null) return null
  if (plan !== 'PRO') return <UpgradeWall requiredPlan="PRO" currentPlan={plan} feature="Multi-sede" description="Gestisci più sedi dello stesso negozio da un unico account con dashboard centralizzata. Disponibile solo nel piano PRO." />

  const totalCustomers = branches.reduce((s, b) => s + b.customers, 0)
  const totalVisits = branches.reduce((s, b) => s + b.visits, 0)

  async function addBranch() {
    if (!name.trim() || !address.trim() || !city.trim()) return alert('Compila tutti i campi')
    setSaving(true)
    const res = await fetch('/api/shop/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, city }),
    })
    if (res.ok) {
      const b = await res.json()
      setBranches(prev => [...prev, { ...b, customers: 0, visits: 0 }])
      setName(''); setAddress(''); setCity(''); setShowForm(false)
    } else {
      const d = await res.json()
      alert(d.error)
    }
    setSaving(false)
  }

  return (
    <div style={{ color: 'white', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>🏢 Multi-sede</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>Dashboard centralizzata per tutte le tue sedi</p>

      {/* Riepilogo aggregato */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Sedi totali', value: branches.length, icon: '🏪' },
          { label: 'Clienti totali', value: totalCustomers, icon: '👥' },
          { label: 'Visite totali', value: totalVisits, icon: '📊' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a78bfa' }}>{s.value.toLocaleString('it-IT')}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Lista sedi */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p style={{ fontWeight: 700 }}>Le tue sedi</p>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '0.83rem' }}>
          + Aggiungi sede
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: '1.5rem', marginBottom: '1rem' }}>
          <p style={{ fontWeight: 700, marginBottom: '1rem', color: '#a78bfa' }}>Nuova sede</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input style={inp} placeholder="Nome sede (es. Fidelio Roma)" value={name} onChange={e => setName(e.target.value)} />
            <input style={inp} placeholder="Indirizzo" value={address} onChange={e => setAddress(e.target.value)} />
            <input style={inp} placeholder="Città" value={city} onChange={e => setCity(e.target.value)} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={addBranch} disabled={saving} style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>
                {saving ? 'Creazione...' : 'Crea sede'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: 'rgba(255,255,255,0.07)', color: 'white', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {branches.map((b, i) => (
          <div key={b.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <p style={{ fontWeight: 700 }}>{b.name}</p>
                {i === 0 && <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(124,58,237,0.2)', color: '#a78bfa', padding: '2px 8px', borderRadius: 100 }}>Sede principale</span>}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{b.address}, {b.city}</p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 800, fontSize: '1.2rem', color: '#a78bfa' }}>{b.customers}</p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>clienti</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 800, fontSize: '1.2rem', color: '#60a5fa' }}>{b.visits}</p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>visite</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
