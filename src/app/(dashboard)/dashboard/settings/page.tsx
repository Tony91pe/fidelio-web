'use client'
import { useState, useEffect } from 'react'

type ShopSettings = {
  id: string
  name: string
  phone: string
  address: string
  city: string
  lat: number | null
  lng: number | null
  pointsSystem: string
  pointsPerVisit: number
  pointsPerEuro: number
  rewardThreshold: number
  rewardDescription: string
  welcomePoints: number
  primaryColor: string
  plan: string
}

const inp: React.CSSProperties = {
  background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',
  borderRadius:'10px',padding:'10px 14px',color:'white',width:'100%',outline:'none',fontSize:'14px',marginBottom:'8px'
}

const PRESET_COLORS = ['#7C3AED','#3B82F6','#10B981','#F59E0B','#EF4444','#EC4899','#F97316','#06B6D4','#6366F1','#14B8A6']

export default function SettingsPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [geocoding, setGeocoding] = useState(false)

  useEffect(() => {
    fetch('/api/shop/settings').then(r => r.json()).then(setSettings).finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    try {
      await fetch('/api/shop/settings', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(settings),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally { setSaving(false) }
  }

  async function handleGeocode() {
    if (!settings?.address || !settings?.city) return
    setGeocoding(true)
    try {
      const q = encodeURIComponent(`${settings.address}, ${settings.city}, Italy`)
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`, {
        headers: { 'User-Agent': 'Fidelio/1.0' }
      })
      const data = await res.json()
      if (data.length > 0) {
        setSettings({...settings, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon)})
      }
    } finally { setGeocoding(false) }
  }

  if (loading) return <div style={{textAlign:'center',padding:'2rem',color:'rgba(255,255,255,0.5)'}}>Caricamento...</div>
  if (!settings) return <div style={{textAlign:'center',padding:'2rem',color:'rgba(255,255,255,0.5)'}}>Errore nel caricamento</div>

  const isGrowth = settings.plan === 'GROWTH' || settings.plan === 'PRO'

  return (
    <div>
      <h1 style={{fontSize:'1.5rem',fontWeight:'700',marginBottom:'0.5rem'}}>Impostazioni</h1>
      <p style={{color:'rgba(255,255,255,0.4)',marginBottom:'2rem'}}>Configura il tuo negozio e il sistema punti</p>

      <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:'1.5rem',maxWidth:'600px'}}>

        {/* Info negozio */}
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.5rem'}}>
          <h3 style={{fontWeight:'700',marginBottom:'1rem'}}>Info negozio</h3>
          <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.3rem'}}>Nome negozio</label>
          <input style={inp} value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} required />
          <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.3rem'}}>Telefono</label>
          <input style={inp} value={settings.phone || ''} onChange={e => setSettings({...settings, phone: e.target.value})} />
          <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.3rem'}}>Indirizzo</label>
          <input style={inp} value={settings.address || ''} onChange={e => setSettings({...settings, address: e.target.value})} />
          <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.3rem'}}>Città</label>
          <input style={inp} value={settings.city || ''} onChange={e => setSettings({...settings, city: e.target.value})} />

          <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.3rem'}}>Posizione sulla mappa</label>
          <div style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
            <input
              style={{...inp, marginBottom:0, flex:1}}
              type="number" step="0.0001" placeholder="Latitudine (es. 42.4618)"
              value={settings.lat || ''}
              onChange={e => setSettings({...settings, lat: parseFloat(e.target.value) || null})}
            />
            <input
              style={{...inp, marginBottom:0, flex:1}}
              type="number" step="0.0001" placeholder="Longitudine (es. 14.2136)"
              value={settings.lng || ''}
              onChange={e => setSettings({...settings, lng: parseFloat(e.target.value) || null})}
            />
          </div>
          <button
            type="button"
            onClick={handleGeocode}
            disabled={geocoding}
            style={{background:'rgba(108,61,244,0.2)',border:'1px solid rgba(108,61,244,0.4)',borderRadius:'10px',padding:'8px 16px',color:'#A78BFA',cursor:'pointer',fontSize:'13px',marginBottom:'8px',opacity:geocoding?0.6:1}}
          >
            {geocoding ? 'Rilevamento...' : '📍 Rileva automaticamente da indirizzo'}
          </button>
          {settings.lat && settings.lng && (
            <p style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)'}}>
              ✓ Posizione impostata: {settings.lat.toFixed(4)}, {settings.lng.toFixed(4)}
            </p>
          )}
        </div>

        {/* Branding colori — GROWTH+ */}
        <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${isGrowth ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,borderRadius:'16px',padding:'1.5rem',opacity:isGrowth?1:0.5}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
            <h3 style={{fontWeight:'700'}}>Branding personalizzato</h3>
            {!isGrowth && <span style={{fontSize:'0.75rem',fontWeight:700,background:'rgba(124,58,237,0.15)',color:'#a78bfa',padding:'3px 10px',borderRadius:100}}>GROWTH</span>}
          </div>
          {isGrowth ? (
            <>
              <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.5rem'}}>Colore principale</label>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px'}}>
                {PRESET_COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setSettings({...settings, primaryColor: c})}
                    style={{width:32,height:32,borderRadius:'50%',background:c,border:settings.primaryColor===c?'3px solid white':'3px solid transparent',cursor:'pointer',outline:'none'}} />
                ))}
              </div>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <input type="color" value={settings.primaryColor || '#7C3AED'}
                  onChange={e => setSettings({...settings, primaryColor: e.target.value})}
                  style={{width:40,height:40,borderRadius:8,border:'none',cursor:'pointer',background:'transparent'}} />
                <input style={{...inp,marginBottom:0,flex:1}} value={settings.primaryColor || '#7C3AED'}
                  onChange={e => setSettings({...settings, primaryColor: e.target.value})} placeholder="#7C3AED" />
                <div style={{width:40,height:40,borderRadius:8,background:settings.primaryColor||'#7C3AED',flexShrink:0}} />
              </div>
            </>
          ) : (
            <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.3)'}}>Personalizza logo e colori del tuo negozio. Disponibile dal piano Growth.</p>
          )}
        </div>

        {/* Sistema punti */}
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.5rem'}}>
          <h3 style={{fontWeight:'700',marginBottom:'1rem'}}>Sistema punti</h3>
          <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.5rem'}}>Come assegni i punti?</label>
          <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',marginBottom:'1rem'}}>
            {[
              {value:'per_visit', label:'Punti per visita', desc:'Ogni visita = X punti fissi'},
              {value:'per_euro', label:'Punti per euro speso', desc:'1 punto ogni X euro di spesa'},
              {value:'combined', label:'Combinato', desc:'Punti fissi + punti per spesa'},
            ].map(opt => (
              <div key={opt.value} onClick={() => setSettings({...settings, pointsSystem: opt.value})}
                style={{background:settings.pointsSystem===opt.value?'rgba(108,61,244,0.2)':'rgba(255,255,255,0.03)',
                border:`1px solid ${settings.pointsSystem===opt.value?'rgba(108,61,244,0.4)':'rgba(255,255,255,0.08)'}`,
                borderRadius:'10px',padding:'0.75rem 1rem',cursor:'pointer'}}>
                <div style={{fontWeight:'600',fontSize:'0.9rem'}}>{opt.label}</div>
                <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.5)'}}>{opt.desc}</div>
              </div>
            ))}
          </div>

          {(settings.pointsSystem === 'per_visit' || settings.pointsSystem === 'combined') && (
            <>
              <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.3rem'}}>Punti per visita</label>
              <input style={inp} type="number" min="1" value={settings.pointsPerVisit}
                onChange={e => setSettings({...settings, pointsPerVisit: parseInt(e.target.value)})} />
            </>
          )}

          {(settings.pointsSystem === 'per_euro' || settings.pointsSystem === 'combined') && (
            <>
              <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.3rem'}}>Punti per euro speso</label>
              <input style={inp} type="number" min="0.1" step="0.1" value={settings.pointsPerEuro}
                onChange={e => setSettings({...settings, pointsPerEuro: parseFloat(e.target.value)})} />
            </>
          )}
        </div>

        {/* Premio */}
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.5rem'}}>
          <h3 style={{fontWeight:'700',marginBottom:'1rem'}}>Premio</h3>
          <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.3rem'}}>Punti necessari per il premio</label>
          <input style={inp} type="number" min="1" value={settings.rewardThreshold}
            onChange={e => setSettings({...settings, rewardThreshold: parseInt(e.target.value)})} />
          <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.3rem'}}>Descrizione premio</label>
          <input style={inp} placeholder="Es. Caffè gratis, 10% di sconto..." value={settings.rewardDescription}
            onChange={e => setSettings({...settings, rewardDescription: e.target.value})} />
          <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.3rem'}}>Punti di benvenuto</label>
          <input style={inp} type="number" min="0" value={settings.welcomePoints}
            onChange={e => setSettings({...settings, welcomePoints: parseInt(e.target.value)})} />
        </div>

        <button type="submit" disabled={saving}
          style={{background:'#6C3DF4',color:'white',padding:'14px',borderRadius:'12px',fontWeight:'700',
          border:'none',cursor:'pointer',opacity:saving?0.7:1,fontSize:'15px'}}>
          {saving ? 'Salvataggio...' : saved ? '✓ Salvato!' : 'Salva impostazioni'}
        </button>
      </form>
    </div>
  )
}
