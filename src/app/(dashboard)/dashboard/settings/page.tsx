'use client'
import { useState, useEffect, useCallback } from 'react'

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
  emailNotificationsEnabled: boolean
  pushNotificationsEnabled: boolean
}

const inp: React.CSSProperties = {
  background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',
  borderRadius:'10px',padding:'10px 14px',color:'white',width:'100%',outline:'none',fontSize:'14px',marginBottom:'8px'
}

const PRESET_COLORS = ['#7C3AED','#3B82F6','#10B981','#F59E0B','#EF4444','#EC4899','#F97316','#06B6D4','#6366F1','#14B8A6']

type Integrations = { woocommerceWebhookUrl: string; woocommerceWebhookSecret: string }

export default function SettingsPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [geocoding, setGeocoding] = useState(false)
  const [integrations, setIntegrations] = useState<Integrations | null>(null)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)

  const copyToClipboard = useCallback(async (text: string, type: 'url' | 'secret') => {
    await navigator.clipboard.writeText(text)
    if (type === 'url') { setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 2000) }
    else { setCopiedSecret(true); setTimeout(() => setCopiedSecret(false), 2000) }
  }, [])

  useEffect(() => {
    fetch('/api/shop/settings').then(r => r.json()).then(setSettings).finally(() => setLoading(false))
    fetch('/api/shop/integrations').then(r => r.json()).then(setIntegrations)
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

      {/* Notifiche */}
      <div style={{maxWidth:'600px',marginTop:'2rem'}}>
        <h2 style={{fontSize:'1.2rem',fontWeight:'700',marginBottom:'0.4rem'}}>Notifiche ai clienti</h2>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.85rem',marginBottom:'1.5rem'}}>Scegli quali notifiche inviare automaticamente ai tuoi clienti</p>
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
          {([
            { key: 'emailNotificationsEnabled', icon: '✉️', label: 'Email transazionali', desc: 'Invia email al cliente dopo ogni timbro (+punti, vicino al premio)' },
            { key: 'pushNotificationsEnabled', icon: '🔔', label: 'Notifiche push', desc: 'Invia notifiche push ai clienti che usano la app Fidelio' },
          ] as { key: keyof ShopSettings; icon: string; label: string; desc: string }[]).map(item => (
            <div key={item.key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem'}}>
                <span style={{fontSize:'1.2rem',marginTop:'2px'}}>{item.icon}</span>
                <div>
                  <div style={{fontWeight:'600',fontSize:'0.9rem'}}>{item.label}</div>
                  <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.4)',marginTop:'2px'}}>{item.desc}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const newVal = !settings[item.key]
                  setSettings({...settings, [item.key]: newVal})
                  await fetch('/api/shop/settings', {
                    method: 'PUT',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({ [item.key]: newVal }),
                  })
                }}
                style={{
                  flexShrink:0, width:'48px', height:'26px', borderRadius:'100px', border:'none', cursor:'pointer',
                  background: settings[item.key] ? '#6C3DF4' : 'rgba(255,255,255,0.12)',
                  position:'relative', transition:'background 0.2s',
                }}
              >
                <span style={{
                  position:'absolute', top:'3px',
                  left: settings[item.key] ? '24px' : '3px',
                  width:'20px', height:'20px', borderRadius:'50%',
                  background:'white', transition:'left 0.2s', display:'block',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Abbonamento */}
      <CancelSubscriptionSection />

      {/* Privacy e dati */}
      <DeletionSection />

      {/* Integrazioni */}
      <div style={{maxWidth:'600px',marginTop:'2rem'}}>
        <h2 style={{fontSize:'1.2rem',fontWeight:'700',marginBottom:'1.5rem'}}>Integrazioni e-commerce</h2>

        {/* WooCommerce */}
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.5rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'1rem'}}>
            <div style={{width:40,height:40,borderRadius:'10px',background:'rgba(150,88,210,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem'}}>🛒</div>
            <div>
              <div style={{fontWeight:'700'}}>WooCommerce</div>
              <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.4)'}}>Assegna punti automaticamente ad ogni ordine completato</div>
            </div>
          </div>

          <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)',marginBottom:'1.2rem',lineHeight:1.6}}>
            Vai su <strong style={{color:'rgba(255,255,255,0.8)'}}>WooCommerce → Impostazioni → Avanzate → Webhook</strong> e crea un nuovo webhook con questi parametri:
          </p>

          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <div>
              <label style={{display:'block',fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Topic</label>
              <div style={{background:'rgba(255,255,255,0.06)',borderRadius:'8px',padding:'10px 14px',fontSize:'13px',color:'rgba(255,255,255,0.7)',fontFamily:'monospace'}}>
                Order updated
              </div>
            </div>

            <div>
              <label style={{display:'block',fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.05em'}}>URL webhook</label>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <div style={{flex:1,background:'rgba(255,255,255,0.06)',borderRadius:'8px',padding:'10px 14px',fontSize:'12px',color:'rgba(255,255,255,0.7)',fontFamily:'monospace',wordBreak:'break-all'}}>
                  {integrations?.woocommerceWebhookUrl ?? '—'}
                </div>
                <button
                  type="button"
                  onClick={() => integrations && copyToClipboard(integrations.woocommerceWebhookUrl, 'url')}
                  style={{flexShrink:0,background:'rgba(108,61,244,0.2)',border:'1px solid rgba(108,61,244,0.3)',borderRadius:'8px',padding:'10px 14px',color:'#A78BFA',cursor:'pointer',fontSize:'13px',whiteSpace:'nowrap'}}
                >
                  {copiedUrl ? '✓ Copiato' : 'Copia'}
                </button>
              </div>
            </div>

            <div>
              <label style={{display:'block',fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Secret</label>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <div style={{flex:1,background:'rgba(255,255,255,0.06)',borderRadius:'8px',padding:'10px 14px',fontSize:'12px',color:'rgba(255,255,255,0.7)',fontFamily:'monospace',wordBreak:'break-all'}}>
                  {integrations?.woocommerceWebhookSecret ? '••••••••••••••••' : '—'}
                </div>
                <button
                  type="button"
                  onClick={() => integrations && copyToClipboard(integrations.woocommerceWebhookSecret, 'secret')}
                  style={{flexShrink:0,background:'rgba(108,61,244,0.2)',border:'1px solid rgba(108,61,244,0.3)',borderRadius:'8px',padding:'10px 14px',color:'#A78BFA',cursor:'pointer',fontSize:'13px',whiteSpace:'nowrap'}}
                >
                  {copiedSecret ? '✓ Copiato' : 'Copia'}
                </button>
              </div>
            </div>
          </div>

          <div style={{marginTop:'1.2rem',padding:'12px',background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:'10px',fontSize:'0.8rem',color:'rgba(16,185,129,0.8)',lineHeight:1.6}}>
            Il cliente deve essere registrato su Fidelio con la stessa email usata su WooCommerce per ricevere i punti.
          </div>
        </div>
      </div>
    </div>
  )
}

function DeletionSection() {
  const [step, setStep] = useState<'idle' | 'confirm' | 'deleting' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleDelete() {
    if (step === 'idle') { setStep('confirm'); return }
    setStep('deleting')
    try {
      const res = await fetch('/api/shop/delete', { method: 'DELETE' })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.error || 'Errore imprevisto')
        setStep('error')
        return
      }
      setStep('done')
      setTimeout(() => { window.location.href = '/' }, 2000)
    } catch {
      setError('Errore di rete')
      setStep('error')
    }
  }

  return (
    <div style={{maxWidth:'600px',marginTop:'2rem'}}>
      <h2 style={{fontSize:'1.2rem',fontWeight:'700',marginBottom:'1.5rem'}}>Privacy e dati</h2>
      <div style={{background:'rgba(239,68,68,0.05)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:'16px',padding:'1.5rem'}}>
        <h3 style={{fontWeight:'700',marginBottom:'0.4rem',fontSize:'1rem'}}>Cancellazione account e dati</h3>
        <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)',lineHeight:'1.6',marginBottom:'1.25rem'}}>
          Elimina il tuo account e tutti i dati associati (negozio, clienti, storico punti) ai sensi dell&apos;art. 17 GDPR.
          L&apos;operazione è <strong style={{color:'rgba(255,255,255,0.7)'}}>immediata e irreversibile</strong>.
          Se hai un abbonamento attivo, disdici prima dal pannello del tuo provider di pagamento.
        </p>

        {step === 'done' && (
          <div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:'10px',padding:'12px',fontSize:'0.85rem',color:'#10B981'}}>
            ✓ Account eliminato. Reindirizzamento in corso...
          </div>
        )}

        {step === 'error' && (
          <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'10px',padding:'12px',fontSize:'0.85rem',color:'#EF4444',marginBottom:'1rem'}}>
            Errore: {error}
          </div>
        )}

        {step === 'confirm' && (
          <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'10px',padding:'12px',fontSize:'0.83rem',color:'rgba(239,68,68,0.9)',marginBottom:'1rem',lineHeight:'1.6'}}>
            ⚠️ Stai per eliminare <strong>definitivamente</strong> il tuo account, tutti i clienti, le visite, i premi e lo storico. Non sarà possibile recuperare nulla. Sei sicuro?
          </div>
        )}

        {step !== 'done' && step !== 'deleting' && (
          <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
            <button
              onClick={handleDelete}
              style={{background: step === 'confirm' ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.08)', color:'#EF4444',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'10px',padding:'10px 18px',fontWeight:'600',fontSize:'0.85rem',cursor:'pointer'}}
            >
              {step === 'confirm' ? '⚠️ Sì, elimina tutto definitivamente' : 'Elimina account e tutti i dati'}
            </button>
            {step === 'confirm' && (
              <button onClick={() => setStep('idle')} style={{background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.5)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'10px 18px',fontWeight:'600',fontSize:'0.85rem',cursor:'pointer'}}>
                Annulla
              </button>
            )}
          </div>
        )}

        {step === 'deleting' && (
          <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.4)'}}>Eliminazione in corso...</p>
        )}
      </div>
    </div>
  )
}

function CancelSubscriptionSection() {
  const [plan, setPlan] = useState<string>('STARTER')
  const [billingPortalUrl, setBillingPortalUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/paddle/cancel').then(r => r.json()).then(d => {
      setPlan(d.plan ?? 'STARTER')
      setBillingPortalUrl(d.billingPortalUrl ?? null)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return null

  return (
    <div style={{maxWidth:'600px',marginTop:'2rem'}}>
      <h2 style={{fontSize:'1.2rem',fontWeight:'700',marginBottom:'1.5rem'}}>Abbonamento</h2>
      <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.5rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',flexWrap:'wrap',gap:'0.5rem'}}>
          <div>
            <p style={{fontWeight:'700',marginBottom:'0.2rem'}}>Piano attivo: <span style={{color:'#A78BFA'}}>{plan}</span></p>
            <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.4)'}}>Gestisci pagamento, fatture e disdetta dal portale del tuo provider</p>
          </div>
        </div>

        {billingPortalUrl ? (
          <a href={billingPortalUrl} target="_blank" rel="noopener noreferrer"
            style={{display:'inline-block',background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.7)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'10px',padding:'10px 18px',fontWeight:'600',fontSize:'0.85rem',textDecoration:'none'}}>
            Gestisci abbonamento →
          </a>
        ) : (
          <a href="mailto:support@getfidelio.app?subject=Disdetta%20abbonamento"
            style={{display:'inline-block',background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.7)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'10px',padding:'10px 18px',fontWeight:'600',fontSize:'0.85rem',textDecoration:'none'}}>
            Richiedi disdetta via email →
          </a>
        )}
        <p style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.25)',marginTop:'0.75rem'}}>
          L&apos;abbonamento resterà attivo fino alla fine del periodo corrente già pagato.
        </p>
      </div>
    </div>
  )
}
