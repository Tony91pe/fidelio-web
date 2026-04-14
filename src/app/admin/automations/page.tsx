'use client'

export default function AdminAutomations() {
  const automations = [
    { name: 'Email compleanno', trigger: 'Birthday', status: 'GROWTH+', active: true },
    { name: 'Winback clienti inattivi', trigger: '30 giorni senza visita', status: 'GROWTH+', active: true },
    { name: 'Benvenuto nuovi clienti', trigger: 'Prima registrazione', status: 'GROWTH+', active: true },
    { name: 'Premio raggiunto', trigger: 'Soglia punti', status: 'GROWTH+', active: true },
    { name: 'Campagna marketing', trigger: 'Manuale', status: 'PRO', active: false },
    { name: 'Flussi condizionali', trigger: 'Custom', status: 'PRO', active: false },
  ]

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>🤖 Automazioni</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {automations.map(a => (
          <div key={a.name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{a.name}</p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Trigger: {a.trigger}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', padding: '2px 8px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700 }}>{a.status}</span>
              <span style={{ color: a.active ? '#10b981' : 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontWeight: 600 }}>{a.active ? '● Attivo' : '● Inattivo'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
