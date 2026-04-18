'use client'
import { useEffect, useState } from 'react'

type Shop = { id: string; name: string; city: string }
type Customer = { id: string; name: string; email: string; code: string; points: number; totalVisits: number; createdAt: string }

const inp = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '9px 14px', color: 'white', fontSize: '0.85rem', outline: 'none', width: '100%', fontFamily: 'inherit' }

export default function AdminUsers() {
  const [shops, setShops] = useState<Shop[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [working, setWorking] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [form, setForm] = useState({ name: '', email: '', shopId: '', points: '0', birthday: '' })

  async function load() {
    const r = await fetch('/api/admin')
    if (r.ok) {
      const d = await r.json()
      setShops(d.shops ?? [])
      setCustomers(d.pwaCustomers ?? [])
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    setWorking(true)
    const res = await fetch('/api/admin/create-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, points: parseInt(form.points) || 0 }),
    })
    const data = await res.json()
    setWorking(false)
    if (!res.ok) { setFormError(data.error || 'Errore'); return }
    setFormSuccess(`✅ Cliente "${data.customer.name}" creato con codice ${data.customer.code}`)
    setForm({ name: '', email: '', shopId: '', points: '0', birthday: '' })
    await load()
    setTimeout(() => { setFormSuccess(''); setShowForm(false) }, 3000)
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>👥 Clienti PWA</h1>
        <button onClick={() => { setShowForm(v => !v); setFormError(''); setFormSuccess('') }}
          style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.35)', borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
          {showForm ? '✕ Annulla' : '+ Nuovo cliente'}
        </button>
      </div>

      {/* Form nuovo cliente */}
      {showForm && (
        <div style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: '1.75rem', marginBottom: '2rem', animation: 'fadeIn 0.2s ease' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: '#a78bfa' }}>Aggiungi cliente a un negozio</h2>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nome *</label>
                <input style={inp} placeholder="Mario Rossi" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email *</label>
                <input style={inp} type="email" placeholder="mario@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Negozio *</label>
                <select style={{ ...inp }} value={form.shopId} onChange={e => setForm(p => ({ ...p, shopId: e.target.value }))} required>
                  <option value="">— Seleziona negozio —</option>
                  {shops.map(s => <option key={s.id} value={s.id}>{s.name} ({s.city})</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Punti iniziali</label>
                <input style={inp} type="number" min="0" placeholder="0" value={form.points} onChange={e => setForm(p => ({ ...p, points: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Data di nascita</label>
                <input style={{ ...inp, colorScheme: 'dark' }} type="date" value={form.birthday} onChange={e => setForm(p => ({ ...p, birthday: e.target.value }))} />
              </div>
            </div>
            {formError && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.75rem' }}>⚠️ {formError}</p>}
            {formSuccess && <p style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{formSuccess}</p>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" disabled={working}
                style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: working ? 'default' : 'pointer', fontWeight: 700, fontSize: '0.85rem', opacity: working ? 0.7 : 1 }}>
                {working ? 'Creazione...' : '✓ Crea cliente'}
              </button>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>
                Il codice QR viene generato automaticamente
              </p>
            </div>
          </form>
        </div>
      )}

      {/* Ricerca */}
      <input placeholder="🔍 Cerca per nome, email o codice..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ ...inp, marginBottom: '1.25rem', width: 350 }} />

      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1.25rem' }}>
        {filtered.length} clienti trovati
      </p>

      {/* Tabella */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                {['Nome', 'Email', 'Codice', 'Punti', 'Visite', 'Registrato'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.5)' }}>{c.email}</td>
                  <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#a78bfa' }}>{c.code}</td>
                  <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{c.points}</td>
                  <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{c.totalVisits}</td>
                  <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{new Date(c.createdAt).toLocaleDateString('it-IT')}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>Nessun cliente trovato</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px) } to { opacity: 1; transform: translateY(0) } }`}</style>
    </div>
  )
}
