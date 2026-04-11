'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

const navItems = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/dashboard/customers', icon: '👥', label: 'Clienti' },
  { href: '/dashboard/rewards', icon: '🎁', label: 'Premi' },
  { href: '/dashboard/campaigns', icon: '📧', label: 'Campagne' },
  { href: '/dashboard/analytics', icon: '📈', label: 'Analytics' },
  { href: '/dashboard/settings', icon: '⚙️', label: 'Impostazioni' },
{ href: '/dashboard/qr', icon: '📱', label: 'QR Code' },
{ href: '/dashboard/giftcards', icon: '🎁', label: 'Carte Regalo' },
{ href: '/dashboard/upgrade', icon: '⚡', label: 'Upgrade Piano' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-white/3 border-r border-white/6 flex flex-col p-4">
      <Link href="/" className="flex items-center gap-2 px-3 mb-6">
        <div className="w-2 h-2 rounded-full bg-[#6C3DF4]"></div>
        <span className="text-xl font-bold">Fidelio</span>
      </Link>

      <div className="bg-[#6C3DF4]/10 border border-[#6C3DF4]/20 rounded-xl px-3 py-2 mb-6">
        <p className="text-sm font-bold">Il mio negozio</p>
        <p className="text-xs text-[#A78BFA]">Piano Starter</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === item.href
                ? 'bg-[#6C3DF4]/15 text-white'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 px-3 py-2 mt-4 border-t border-white/6 pt-4">
        <UserButton />
        <span className="text-sm text-white/50">Account</span>
      </div>
    </aside>
  )
}
