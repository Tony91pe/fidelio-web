import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/users', label: 'Utenti', icon: '👥' },
  { href: '/admin/plans', label: 'Piani', icon: '💰' },
  { href: '/admin/shops', label: 'Negozi', icon: '🏪' },
  { href: '/admin/qr', label: 'QR Codes', icon: '📱' },
  { href: '/admin/automations', label: 'Automazioni', icon: '🤖' },
  { href: '/admin/notifications', label: 'Notifiche', icon: '🔔' },
  { href: '/admin/images', label: 'Immagini', icon: '🖼️' },
  { href: '/admin/map', label: 'Mappa', icon: '🗺️' },
  { href: '/admin/logs', label: 'Logs', icon: '📋' },
  { href: '/admin/security', label: 'Sicurezza', icon: '🔒' },
  { href: '/admin/legal', label: 'Legale', icon: '⚖️' },
  { href: '/admin/testimonials', label: 'Recensioni', icon: '⭐' },
  { href: '/admin/blog', label: 'Blog', icon: '📝' },
  { href: '/admin/affiliates', label: 'Affiliati', icon: '🤝' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) redirect('/')

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#080B14', color: 'white', fontFamily: 'system-ui' }}>
      <div style={{ width: 220, background: '#0D1117', borderRight: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto', flexShrink: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #7C3AED, #3B82F6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>F</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Fidelio</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>ADMIN CONSOLE</div>
          </div>
        </div>
        <nav style={{ padding: '0.75rem' }}>
          {menuItems.map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', borderRadius: 8, textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.1rem' }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/admin" style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Pannello principale</Link>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', background: '#080B14' }}>
        {children}
      </div>
    </div>
  )
}
