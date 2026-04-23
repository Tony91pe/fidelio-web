'use client'
import { useEffect, useState } from 'react'
import UpgradeWall from '@/components/UpgradeWall'

type Settings = {
  plan: string
  winbackDays: number
  emailNotificationsEnabled: boolean
  pushNotificationsEnabled: boolean
  birthdayEmailEnabled: boolean
  winbackEmailEnabled: boolean
}

const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10, padding: '9px 13px', color: 'white', outline: 'none', fontSize: '14px', width: '80px'
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)} style={{
      flexShrink: 0, width: '44px', height: '24px', borderRadius: '100px', border: 'none', cursor: 'pointer',
      background: value ? '#6C3DF4' : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 0.2s',
    }}>
      <span style={{
        position: 'absolute', top: '2px', left: value ? '22px' : '2px',
        width: '20px', height: '20px', borderRadius: '50%',
        background: 'white', transition: 'left 0.2s', display: 'block',
      }} />
    </button>
  )
}

function AutoCard({ icon, label, desc, active, onToggle, badge, note }: {
  icon: string; label: string; desc: string; active: boolean
  onToggle?: (v: boolean) => void; badge?: string; note?: string
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${active ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 12, padding: '1rem 1.25rem',
      display: 'flex', gap: '1rem', alignItems: 'center',
      opacity: active ? 1 : 0.55, transition: 'opacity 0.2s',
    }}>
      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</p>
          {badge && <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>{badge}</span>}
          <span style={{
            fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: 100,
            background: active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.08)',
            color: active ? '#10b981' : 'rgba(255,255,255,0.3)',
          }}>
            {active ? '● Attiva' : '○ Disattiva'}
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
        {note && <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: '3px' }}>{note}</p>}
      </div>
      {onToggle ? <Toggle value={active} onChange={onToggle} /> : <div style={{ width: '44px' }} />}
    </div>
  )
}

export default function AutomationsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [winbackDays, setWinbackDays] = useState(30)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/shop/plan').then(r => r.json()),
      fetch('/api/shop/settings').then(r => r.json()),
    ]).then(([planData, s]) => {
      setSettings({
        plan: planData.plan,
        winbackDays: s.winbackDays ?? 30,
        emailNotificationsEnabled: s.emailNotificationsEnabled ?? true,
        pushNotificationsEnabled: s.pushNotificationsEnabled ?? true,
        birthdayEmailEnabled: s.birthdayEmailEnabled ?? true,
        winbackEmailEnabled: s.winbackEmailEnabled ?? true,
      })
      setWinbackDays(s.winbackDays ?? 30)
    })
  }, [])

  if (!settings) return null
  if (settings.plan === 'STARTER') return (
    <UpgradeWall
      requiredPlan="GROWTH"
      currentPlan={settings.plan}
      feature="Automazioni"
      description="Email automatiche di compleanno, winback, punti e molto altro. Si attivano automaticamente al piano Growth."
    />
  )

  async function patch(data: Partial<Settings>) {
    setSettings(prev => prev ? { ...prev, ...data } : prev)
    await fetch('/api/shop/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  async function saveWinback() {
    setSaving(true)
    await patch({ winbackDays })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setSaving(false)
  }

  const isPro = settings.plan === 'PRO'

  return (
    <div style={{ color: 'white' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>🤖 Automazioni</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>
        Attive automaticamente con il tuo piano — puoi disattivare quelle che non vuoi
      </p>

      <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
        ✅ Le automazioni si attivano automaticamente all&apos;attivazione del piano — nessuna configurazione richiesta.
      </div>

      {/* GROWTH automations */}
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
        Piano Growth — attive sul tuo account
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        <AutoCard
          icon="👋" label="Email di benvenuto"
          desc="Inviata al nuovo cliente alla prima registrazione con i punti di benvenuto"
          active={settings.emailNotificationsEnabled}
          note="Sempre inclusa nelle email transazionali"
        />
        <AutoCard
          icon="⭐" label="Email punti assegnati"
          desc="Email al cliente dopo ogni timbro con il saldo punti e i punti mancanti al premio"
          active={settings.emailNotificationsEnabled}
          onToggle={v => patch({ emailNotificationsEnabled: v })}
        />
        <AutoCard
          icon="🏁" label="Email vicino al premio"
          desc="Inviata quando il cliente raggiunge l'80% della soglia — spinge la visita successiva"
          active={settings.emailNotificationsEnabled}
          note="Controllata insieme alle email punti assegnati"
        />
        <AutoCard
          icon="🔔" label="Notifiche push"
          desc="Push ai clienti che usano la app Fidelio — punti, premi disponibili"
          active={settings.pushNotificationsEnabled}
          onToggle={v => patch({ pushNotificationsEnabled: v })}
        />
        <AutoCard
          icon="🎂" label="Email di compleanno"
          desc="Inviata il giorno del compleanno con punti bonus automatici"
          active={settings.birthdayEmailEnabled}
          onToggle={v => patch({ birthdayEmailEnabled: v })}
        />
        <AutoCard
          icon="🔄" label="Winback clienti inattivi"
          desc={`Email ai clienti inattivi da più di ${winbackDays} giorni per farli tornare`}
          active={settings.winbackEmailEnabled}
          onToggle={v => patch({ winbackEmailEnabled: v })}
        />
      </div>

      {/* Winback config */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.25rem', marginBottom: '2rem' }}>
        <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>⚙️ Configurazione Winback</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Invia winback dopo</span>
          <input type="number" style={inp} min={7} max={180} value={winbackDays}
            onChange={e => setWinbackDays(parseInt(e.target.value) || 30)} />
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>giorni di inattività</span>
          <button onClick={saveWinback} disabled={saving}
            style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            {saving ? '...' : saved ? '✓ Salvato' : 'Salva'}
          </button>
        </div>
      </div>

      {/* PRO */}
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
        Piano PRO {!isPro && '— richiede upgrade'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <AutoCard
          icon="📧" label="Campagne marketing manuali"
          desc="Invia comunicazioni a segmenti specifici di clienti quando vuoi"
          active={isPro}
          badge={!isPro ? 'PRO' : undefined}
        />
        <AutoCard
          icon="🤖" label="Flussi condizionali avanzati"
          desc="Automazioni basate su trigger complessi (es. X visite in Y giorni)"
          active={isPro}
          badge={!isPro ? 'PRO' : undefined}
        />
      </div>

      {isPro && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <a href="/dashboard/campaigns" style={{ display: 'inline-block', background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 10, padding: '10px 20px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
            📧 Gestisci campagne manuali →
          </a>
        </div>
      )}
    </div>
  )
}
