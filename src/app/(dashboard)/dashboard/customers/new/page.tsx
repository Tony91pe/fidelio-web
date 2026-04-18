'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputStyle = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px',
  padding: '12px 16px',
  color: 'white',
  width: '100%',
  outline: 'none',
  fontSize: '14px',
}

export default function NewCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', birthday: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) router.push('/dashboard/customers')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">➕ Nuovo cliente</h1>
      <p className="text-white/50 mb-8">Aggiungi manualmente un cliente al tuo negozio</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-white/60 mb-1 block">Nome completo *</label>
          <input style={inputStyle} placeholder="Es. Mario Rossi"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>
        <div>
          <label className="text-sm text-white/60 mb-1 block">Email *</label>
          <input style={inputStyle} type="email" placeholder="mario@email.it"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        </div>
        <div>
          <label className="text-sm text-white/60 mb-1 block">Telefono</label>
          <input style={inputStyle} placeholder="Es. 333 1234567"
            value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>
        <div>
          <label className="text-sm text-white/60 mb-1 block">Data di nascita</label>
          <input style={{...inputStyle, colorScheme:'dark'}} type="date"
            value={form.birthday} onChange={e => setForm({...form, birthday: e.target.value})} />
        </div>

        <div style={{display:'flex', gap:'1rem', marginTop:'8px'}}>
          <button type="button" onClick={() => router.back()}
            style={{flex:1, background:'transparent', color:'white', padding:'14px',
              borderRadius:'12px', fontWeight:'600', border:'1px solid rgba(255,255,255,0.15)', cursor:'pointer'}}>
            Annulla
          </button>
          <button type="submit" disabled={loading}
            style={{flex:2, background:'#6C3DF4', color:'white', padding:'14px',
              borderRadius:'12px', fontWeight:'600', border:'none', cursor:'pointer',
              opacity: loading ? 0.6 : 1, fontSize:'15px'}}>
            {loading ? 'Salvataggio...' : '✓ Salva cliente'}
          </button>
        </div>
      </form>
    </div>
  )
}
