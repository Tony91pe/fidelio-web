'use client'

export default function AdminLegal() {
  const docs = [
    { title: 'Privacy Policy', href: '/privacy', status: '✓ Online' },
    { title: 'Termini di Servizio', href: '/termini', status: '✓ Online' },
    { title: 'Cookie Policy', href: '/privacy#cookies', status: '✓ Online' },
  ]

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>⚖️ Documenti Legali</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 600 }}>
        {docs.map(doc => (
          <div key={doc.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{doc.title}</p>
              <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 600 }}>{doc.status}</span>
            </div>
            <a href={doc.href} target="_blank" rel="noreferrer"
              style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, padding: '6px 14px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
              Visualizza →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
