'use client'
import { useState, useEffect } from 'react'
import UpgradeWall from '@/components/UpgradeWall'

type Staff = { id: string; name: string; email: string; role: 'COMMESSO' | 'MANAGER'; createdAt: string }

const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 14px', color: 'white', width: '100%', outline: 'none', fontSize: '14px' }
const roleColor = { COMMESSO: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' }, MANAGER: { bg: 'rgba(124,58,237,0.15)', color: '#a78bfa' } }
const roleLabel = { COMMESSO: 'Commesso', MANAGER: 'Manager', OWNER: 'Owner' }

export default function StaffPage() {
  const [plan, setPlan] = useState<string | null>(null)
  const [staff, setStaff] = useState<Staff[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'COMMESSO' | 'MANAGER'>('COMMESSO')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/shop/plan').then(r => r.json()).then(d => setPlan(d.plan))
    fetch('/api/shop/staff').then(r => r.json()).then(d => Array.isArray(d) && setStaff(d)).catch(() => {})
  }, [])

  if (plan === null) return null
  if (plan === 'STARTER') return <UpgradeWall requiredPlan="GROWTH" currentPlan={plan} feature="Gestione Ruoli Staff" description="Aggiungi commessi e manager al tuo negozio con ruoli e permessi differenziati. Disponibile dal piano Growth." />

  async function add() {
    if (!name.trim() || !email.trim()) return alert('Inserisci nome ed email')
    setSaving(true)
    const res = await fetch('/api/shop/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, role }) })
    if (res.ok) {
      const m = await res.json()
      setStaff(prev => [...prev, m])
      setName(''); setEmail('')
    } else {
      const d = await res.json()
      alert(d.error)
    }
    setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Rimuovere questo membro dello staff?')) return
    await fetch('/api/shop/staff', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setStaff(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div style={{ color: 'white', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>👥 Ruoli Staff</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>Gestisci i membri del tuo team con ruoli e permessi differenziati</p>

      {/* Legenda ruoli */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { role: 'Owner', color: '#f97316', bg: 'rgba(249,115,22,0.1)', desc: 'Accesso completo, gestione piani e fatturazione' },
          { role: 'Manager', color: '#a78bfa', bg: 'rgba(124,58,237,0.1)', desc: 'Tutto tranne pagamenti e dati sensibili' },
          { role: 'Commesso', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', desc: 'Solo scanner QR e assegnazione punti' },
        ].map(r => (
          <div key={r.role} style={{ background: r.bg, border: `1px solid ${r.color}33`, borderRadius: 12, padding: '1rem' }}>
            <p style={{ fontWeight: 700, color: r.color, marginBottom: '0.4rem' }}>{r.role}</p>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Aggiungi staff */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem', marginBottom: '2rem' }}>
        <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Aggiungi membro staff</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '0.75rem', alignItems: 'end', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem' }}>Nome</p>
            <input style={inp} placeholder="Mario Rossi" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem' }}>Email</p>
            <input style={inp} type="email" placeholder="mario@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem' }}>Ruolo</p>
            <select style={{ ...inp, cursor: 'pointer' }} value={role} onChange={e => setRole(e.target.value as 'COMMESSO' | 'MANAGER')}>
              <option value="COMMESSO">Commesso</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>
          <button onClick={add} disabled={saving} style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
            {saving ? '...' : '+ Aggiungi'}
          </button>
        </div>
      </div>

      {/* Lista staff */}
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
        Team ({staff.length + 1} membri)
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Owner (sempre presente) */}
        <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 600 }}>Tu (proprietario)</p>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Accesso completo</p>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(249,115,22,0.2)', color: '#f97316', padding: '3px 10px', borderRadius: 100 }}>Owner</span>
        </div>

        {staff.map(m => (
          <div key={m.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{m.name}</p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{m.email}</p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, background: roleColor[m.role].bg, color: roleColor[m.role].color, padding: '3px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>
              {roleLabel[m.role]}
            </span>
            <button onClick={() => remove(m.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Rimuovi
            </button>
          </div>
        ))}

        {staff.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
            Nessun membro staff aggiunto ancora
          </div>
        )}
      </div>
    </div>
  )
}
