'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/dashboard/customers', icon: '👥', label: 'Clienti' },
  { href: '/dashboard/rewards', icon: '🎁', label: 'Premi' },
  { href: '/dashboard/campaigns', icon: '📧', label: 'Campagne' },
  { href: '/dashboard/analytics', icon: '📈', label: 'Analytics' },
  { href: '/dashboard/qr', icon: '📱', label: 'QR Code' },
  { href: '/dashboard/giftcards', icon: '🎀', label: 'Carte Regalo' },
  { href: '/dashboard/settings', icon: '⚙️', label: 'Impostazioni' },
  { href: '/dashboard/upgrade', icon: '⚡', label: 'Upgrade Piano' },
  { href: '/admin', icon: '🛡️', label: 'Admin' },
]

const mobileMain = [
  { href: '/dashboard', icon: '📊', label: 'Home' },
  { href: '/dashboard/customers', icon: '👥', label: 'Clienti' },
  { href: '/dashboard/qr', icon: '📱', label: 'QR' },
  { href: '/dashboard/analytics', icon: '📈', label: 'Stats' },
]

const mobileExtra = [
  { href: '/dashboard/rewards', icon: '🎁', label: 'Premi' },
  { href: '/dashboard/campaigns', icon: '📧', label: 'Campagne' },
  { href: '/dashboard/giftcards', icon: '🎀', label: 'Carte Regalo' },
  { href: '/dashboard/settings', icon: '⚙️', label: 'Impostazioni' },
  { href: '/dashboard/upgrade', icon: '⚡', label: 'Upgrade' },
  { href: '/admin', icon: '🛡️', label: 'Admin' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 min-h-screen bg-white/3 border-r border-white/6 flex-col p-4">
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
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === item.href ? 'bg-[#6C3DF4]/15 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}>
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

      {/* Menu "Altro" mobile */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute bottom-16 left-0 right-0 bg-[#1a1a2e] border-t border-white/10 rounded-t-2xl p-4"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="grid grid-cols-3 gap-3">
              {mobileExtra.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl text-xs font-medium ${
                    pathname === item.href ? 'bg-[#6C3DF4]/20 text-white' : 'text-white/60 bg-white/5'
                  }`}>
                  <span className="text-2xl">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navbar mobile in basso */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F0F1A] border-t border-white/10 flex justify-around items-center px-2 py-2">
        {mobileMain.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-xs ${
              pathname === item.href ? 'text-[#6C3DF4]' : 'text-white/40'
            }`}>
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-xs text-white/40">
          <span className="text-xl">☰</span>
          Altro
        </button>
      </nav>
    </>
  )
}
