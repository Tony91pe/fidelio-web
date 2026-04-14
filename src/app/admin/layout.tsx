import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/users", label: "Utenti", icon: "👥" },
    { href: "/admin/plans", label: "Piani", icon: "💰" },
    { href: "/admin/shops", label: "Negozi", icon: "🏪" },
    { href: "/admin/qr", label: "QR Codes", icon: "📱" },
    { href: "/admin/automations", label: "Automazioni", icon: "🤖" },
    { href: "/admin/notifications", label: "Notifiche", icon: "🔔" },
    { href: "/admin/images", label: "Immagini", icon: "🖼️" },
    { href: "/admin/map", label: "Mappa", icon: "🗺️" },
    { href: "/admin/logs", label: "Logs", icon: "📋" },
    { href: "/admin/security", label: "Sicurezza", icon: "🔒" },
    { href: "/admin/legal", label: "Legale", icon: "⚖️" },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#080B14', color: 'white', fontFamily: 'system-ui' }}>
      <div style={{ width: 220, background: '#0D1117', borderRight: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto', flexShrink: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🛡️</div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Fidelio Admin</span>
        </div>
        <nav style={{ padding: '0.75rem' }}>
          {menuItems.map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', borderRadius: 8, textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.1rem', transition: 'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'white' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 'auto' }}>
          <Link href="/admin" style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Pannello principale</Link>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', background: '#080B14' }}>
        {children}
      </div>
    </div>
  )
}
