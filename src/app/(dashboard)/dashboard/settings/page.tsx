'use client'
import { useState, useEffect } from 'react'

type ShopSettings = {
  id: string
  name: string
  email: string
  phone?: string
}

const inp: React.CSSProperties = {
  background:'rgba(255,255,255,0.07)',
  border:'1px solid rgba(255,255,255,0.12)',
  borderRadius:'10px',
  padding:'10px 14px',
  color:'white',
  width:'100%',
  outline:'none',
  fontSize:'14px',
  marginBottom:'8px'
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/shop/settings')
        if (!res.ok) throw new Error('Failed to fetch settings')
        const data = await res.json()
        setSettings(data)
      } catch (err) {
        console.error('Error loading settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    try {
      const res = await fetch('/api/shop/settings', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Failed to save settings')
      console.log('Impostazioni salvate')
    } catch (err) {
      console.error('Error saving settings:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div style={{textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.5)'}}>Caricamento...</div>
  }

  if (!settings) {
    return <div style={{textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.5)'}}>Errore nel caricamento</div>
  }

  return (
    <div>
      <div style={{marginBottom:'2rem'}}>
        <h1 style={{fontSize:'1.5rem', fontWeight:'700'}}>Impostazioni</h1>
        <p style={{color:'rgba(255,255,255,0.4)'}}>Gestisci le impostazioni del tuo negozio</p>
      </div>

      <form onSubmit={handleSave} style={{
        background:'rgba(255,255,255,0.04)',
        border:'1px solid rgba(255,255,255,0.08)',
        borderRadius:'16px',
        padding:'2rem',
        maxWidth:'500px'
      }}>
        <label style={{display:'block', marginBottom:'1rem'}}>
          <span style={{display:'block', fontSize:'0.9rem', fontWeight:'600', marginBottom:'0.5rem'}}>Nome negozio</span>
          <input
            type="text"
            style={inp}
            value={settings.name}
            onChange={e => setSettings({...settings, name: e.target.value})}
            required
          />
        </label>

        <label style={{display:'block', marginBottom:'1rem'}}>
          <span style={{display:'block', fontSize:'0.9rem', fontWeight:'600', marginBottom:'0.5rem'}}>Email</span>
          <input
            type="email"
            style={inp}
            value={settings.email}
            onChange={e => setSettings({...settings, email: e.target.value})}
            required
          />
        </label>

        <label style={{display:'block', marginBottom:'1.5rem'}}>
          <span style={{display:'block', fontSize:'0.9rem', fontWeight:'600', marginBottom:'0.5rem'}}>Telefono</span>
          <input
            type="tel"
            style={inp}
            value={settings.phone || ''}
            onChange={e => setSettings({...settings, phone: e.target.value})}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          style={{
            width:'100%',
            background:'#6C3DF4',
            color:'white',
            padding:'12px',
            borderRadius:'10px',
            fontWeight:'600',
            border:'none',
            cursor:'pointer',
            opacity: saving ? 0.7 : 1,
            transition:'opacity 0.2s'
          }}
        >
          {saving ? 'Salvataggio...' : 'Salva impostazioni'}
        </button>
      </form>
    </div>
  )
}
