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
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', category: '', street: '', civicNumber: '', city: '', phone: '', ownerEmail: '' })

  const selectedCat = categories.find(c => c.value === form.category)

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.category) { alert('Seleziona una categoria'); return }
    if (!form.ownerEmail.trim()) { alert('Inserisci la tua email di contatto'); return }
    setLoading(true)
    try {
      let logoUrl: string | null = null
      if (logoFile) {
        const fd = new FormData()
        fd.append('file', logoFile)
        const r = await fetch('/api/upload', { method: 'POST', body: fd })
        const d = await r.json()
        logoUrl = d.url ?? null
      }
      const { street, civicNumber, ...rest } = form
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rest,
          logo: logoUrl,
          address: `${street}, ${civicNumber}`.trim().replace(/,\s*$/, ''),
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error ?? 'Errore durante la creazione')
        return
      }
      router.push('/dashboard')
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
          <label className="text-sm text-white/60 mb-1 block">Logo negozio</label>
          <label style={{ cursor: 'pointer', display: 'block' }}>
            <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1rem', padding: '10px 16px' }}>
              {logoPreview
                ? <img src={logoPreview} alt="logo" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                : <div style={{ width: 48, height: 48, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏪</div>
              }
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                {logoPreview ? 'Cambia logo' : 'Carica logo (opzionale)'}
              </span>
            </div>
            <input type="file" accept="image/*" onChange={handleLogo} style={{ display: 'none' }} />
          </label>
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1 block">Nome negozio *</label>
          <input style={inputStyle} placeholder="Es. Bar Roma"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>

        <div style={{position:'relative'}}>
          <label className="text-sm text-white/60 mb-1 block">Categoria *</label>
          <div onClick={() => setOpen(!open)}
            style={{...inputStyle, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <span style={{color: selectedCat ? 'white' : 'rgba(255,255,255,0.3)'}}>
              {selectedCat ? selectedCat.label : 'Seleziona categoria'}
            </span>
            <span style={{color:'rgba(255,255,255,0.4)'}}>▾</span>
          </div>
          {open && (
            <div style={{position:'absolute', top:'calc(100% + 4px)', left:0, right:0, zIndex:50,
              background:'#1a1a2e', border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:'12px', overflow:'hidden', boxShadow:'0 10px 30px rgba(0,0,0,0.5)'}}>
              {categories.map(c => (
                <div key={c.value}
                  onClick={() => { setForm({...form, category: c.value}); setOpen(false) }}
                  style={{padding:'12px 16px', cursor:'pointer', color:'white', fontSize:'14px',
                    background: form.category === c.value ? 'rgba(108,61,244,0.2)' : 'transparent'}}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = form.category === c.value ? 'rgba(108,61,244,0.2)' : 'transparent')}>
                  {c.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1 block">Email di contatto *</label>
          <input style={inputStyle} type="email" placeholder="Es. info@mionegozio.it"
            value={form.ownerEmail} onChange={e => setForm({...form, ownerEmail: e.target.value})} required />
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>Usata per notifiche e comunicazioni importanti</p>
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1 block">Città *</label>
          <input style={inputStyle} placeholder="Es. Roma"
            value={form.city} onChange={e => setForm({...form, city: e.target.value})} required />
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1 block">Via / Piazza *</label>
          <input style={inputStyle} placeholder="Es. Via Roma"
            value={form.street} onChange={e => setForm({...form, street: e.target.value})} required />
        </div>
        <div>
          <label className="text-sm text-white/60 mb-1 block">Numero civico *</label>
          <input style={inputStyle} placeholder="Es. 12"
            value={form.civicNumber} onChange={e => setForm({...form, civicNumber: e.target.value})} required />
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
