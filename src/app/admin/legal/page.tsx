'use client'

export default function AdminLegal() {
  const docs = [
    { title: 'Privacy Policy', href: '/privacy', status: '✓ Online' },
    { title: 'Termini di Servizio', href: '/termini', status: '✓ Online' },
    { title: 'Cookie Policy', href: '/cookie-policy', status: '✓ Online' },
    { title: 'Refund Policy', href: '/rimborsi', status: '✓ Online' },
    { title: 'Pricing', href: '/pricing', status: '✓ Online' },
  ]

  const internal = [
    { title: '📋 Registro Trattamenti GDPR', href: '/admin/gdpr', desc: 'Art. 30 GDPR — documento interno riservato', status: '✓ Compilato' },
    { title: '📄 Data Processing Agreement (DPA)', href: '/admin/dpa', desc: 'Art. 28 GDPR — accordo con i negozi clienti', status: '✓ Versione 1.0' },
  ]

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>⚖️ Documenti Legali</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pagine pubbliche</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 600, marginBottom: '2rem' }}>
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

      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Documenti interni</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 600 }}>
        {internal.map(doc => (
          <div key={doc.title} style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{doc.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginBottom: '0.25rem' }}>{doc.desc}</p>
              <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 600 }}>{doc.status}</span>
            </div>
            <a href={doc.href}
              style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, padding: '6px 14px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
              Apri →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
