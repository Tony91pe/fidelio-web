'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const categories = [
  { value: 'bar', label: '☕ Bar & Caffetteria' },
  { value: 'restaurant', label: '🍕 Ristorante & Pizzeria' },
  { value: 'hair', label: '✂️ Parrucchiere & Barbiere' },
  { value: 'beauty', label: '💅 Estetica & Beauty' },
  { value: 'gym', label: '💪 Palestra & Fitness' },
  { value: 'bakery', label: '🍰 Pasticceria' },
  { value: 'clothing', label: '👗 Abbigliamento' },
  { value: 'bio', label: '🌿 Bio & Salute' },
  { value: 'other', label: '🏪 Altro' },
]

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

export default function CreateShopPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '', category: '', address: '', city: '', phone: '',
  })

  const selectedCat = categories.find(c => c.value === form.category)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.category) { alert('Seleziona una categoria'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Crea il tuo negozio</h1>
      <p className="text-white/50 mb-8">Configura il tuo profilo su Fidelio</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-white/60 mb-1 block">Nome negozio *</label>
          <input style={inputStyle} placeholder="Es. Bar Roma"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>

        <div style={{position:'relative'}}>
          <label className="text-sm text-white/60 mb-1 block">Categoria *</label>
          <div
            onClick={() => setOpen(!open)}
            style={{...inputStyle, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center'}}
          >
            <span style={{color: selectedCat ? 'white' : 'rgba(255,255,255,0.3)'}}>
              {selectedCat ? selectedCat.label : 'Seleziona categoria'}
            </span>
            <span style={{color:'rgba(255,255,255,0.4)'}}>▾</span>
          </div>
          {open && (
            <div style={{
              position:'absolute', top:'calc(100% + 4px)', left:0, right:0, zIndex:50,
              background:'#1a1a2e', border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:'12px', overflow:'hidden', boxShadow:'0 10px 30px rgba(0,0,0,0.5)'
            }}>
              {categories.map(c => (
                <div
                  key={c.value}
                  onClick={() => { setForm({...form, category: c.value}); setOpen(false) }}
                  style={{
                    padding:'12px 16px', cursor:'pointer', color:'white', fontSize:'14px',
                    background: form.category === c.value ? 'rgba(108,61,244,0.2)' : 'transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = form.category === c.value ? 'rgba(108,61,244,0.2)' : 'transparent')}
                >
                  {c.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1 block">Città *</label>
          <input style={inputStyle} placeholder="Es. Roma"
            value={form.city} onChange={e => setForm({...form, city: e.target.value})} required />
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1 block">Indirizzo *</label>
          <input style={inputStyle} placeholder="Es. Via Roma 1"
            value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1 block">Telefono</label>
          <input style={inputStyle} placeholder="Es. 06 1234567"
            value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>

        <button type="submit" disabled={loading}
          style={{background:'#6C3DF4', color:'white', padding:'14px', borderRadius:'12px',
            fontWeight:'600', border:'none', cursor:'pointer', marginTop:'8px',
            opacity: loading ? 0.6 : 1, fontSize:'15px'}}>
          {loading ? 'Creazione in corso...' : 'Crea negozio →'}
        </button>
      </form>
    </div>
  )
}
