'use client'
import { useEffect, useState } from 'react'
import UpgradeWall from '@/components/UpgradeWall'

const AUTOMATIONS = [
  { id: 'welcome', name: 'Email di benvenuto', desc: 'Inviata al nuovo cliente alla prima registrazione con i punti di benvenuto', plan: 'GROWTH', icon: '👋' },
  { id: 'points', name: 'Email punti assegnati', desc: 'Inviata ogni volta che vengono assegnati punti al cliente', plan: 'GROWTH', icon: '⭐' },
  { id: 'birthday', name: 'Email compleanno', desc: 'Inviata il giorno del compleanno con punti bonus o un messaggio speciale', plan: 'GROWTH', icon: '🎂' },
  { id: 'winback', name: 'Winback clienti inattivi', desc: 'Inviata ai clienti che non visitano da N giorni per farli tornare', plan: 'GROWTH', icon: '🔄' },
  { id: 'reward', name: 'Premio disponibile', desc: 'Notifica quando il cliente raggiunge la soglia punti per un premio', plan: 'GROWTH', icon: '🎁' },
  { id: 'campaign_manual', name: 'Campagne marketing manuali', desc: 'Invia comunicazioni a segmenti specifici di clienti quando vuoi', plan: 'PRO', icon: '📧' },
  { id: 'triggers', name: 'Flussi condizionali avanzati', desc: 'Automazioni basate su trigger complessi (es. X visite in Y giorni)', plan: 'PRO', icon: '🤖' },
]

const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10, padding: '9px 13px', color: 'white', outline: 'none', fontSize: '14px', width: '80px'
}

export default function AutomationsPage() {
  const [plan, setPlan] = useState<string | null>(null)
  const [winbackDays, setWinbackDays] = useState(30)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/shop/plan').then(r => r.json()).then(d => setPlan(d.plan))
    fetch('/api/shop/settings').then(r => r.json()).then(d => {
      if (d.winbackDays) setWinbackDays(d.winbackDays)
    })
  }, [])

  if (plan === null) return null
  if (plan === 'STARTER') return <UpgradeWall requiredPlan="GROWTH" currentPlan={plan} feature="Automazioni" description="Email automatiche di compleanno, winback e molto altro. Disponibile dal piano Growth." />

  const isPro = plan === 'PRO'

  const available = AUTOMATIONS.filter(a => {
    if (a.plan === 'GROWTH') return plan === 'GROWTH' || plan === 'PRO'
    if (a.plan === 'PRO') return plan === 'PRO'
    return true
  })
  const locked = AUTOMATIONS.filter(a => !available.includes(a))

  async function saveConfig() {
    setSaving(true)
    await fetch('/api/shop/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winbackDays })
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setSaving(false)
  }

  return (
    <div style={{ color: 'white', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>🤖 Automazioni</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>Email e azioni automatiche basate sul comportamento dei clienti</p>

      <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
        ✅ Le automazioni attive si avviano automaticamente — non è necessaria nessuna configurazione manuale.
      </div>

      {/* Configurazione winback */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Configurazione Winback</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Invia winback dopo</span>
          <input type="number" style={inp} min={7} max={180} value={winbackDays}
            onChange={e => setWinbackDays(parseInt(e.target.value) || 30)} />
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>giorni di inattività</span>
          <button onClick={saveConfig} disabled={saving}
            style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            {saving ? '...' : saved ? '✓ Salvato' : 'Salva'}
          </button>
        </div>
      </div>

      {/* PRO: config avanzata */}
      {isPro && (
        <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <p style={{ fontWeight: 700 }}>Configurazione PRO</p>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(249,115,22,0.2)', color: '#f97316', padding: '2px 8px', borderRadius: 100 }}>PRO</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Campagne manuali', href: '/dashboard/campaigns', desc: 'Gestisci campagne email verso segmenti di clienti' },
              { label: 'Trigger per visite', desc: 'Email dopo X visite consecutive — configurazione automatica', badge: '● Attivo' },
              { label: 'Trigger per punti soglia', desc: 'Notifica quando il cliente supera una soglia punti personalizzata', badge: '● Attivo' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</p>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem' }}>{item.desc}</p>
                </div>
                {item.href ? (
                  <a href={item.href} style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 8, padding: '5px 12px', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    Apri →
                  </a>
                ) : (
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: 100, whiteSpace: 'nowrap' }}>{item.badge}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Attive sul tuo piano</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {available.map(a => (
          <div key={a.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{a.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <p style={{ fontWeight: 600 }}>{a.name}</p>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: 100 }}>● Attiva</span>
              </div>
              <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)' }}>
                {a.id === 'winback' ? `Inviata ai clienti inattivi da più di ${winbackDays} giorni` : a.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {locked.length > 0 && (
        <>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Disponibili con Piano PRO</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {locked.map(a => (
              <div key={a.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', opacity: 0.5 }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <p style={{ fontWeight: 600 }}>{a.name}</p>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(249,115,22,0.15)', color: '#f97316', padding: '2px 8px', borderRadius: 100 }}>PRO</span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)' }}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
