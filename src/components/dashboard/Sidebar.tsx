'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

type NavItem = { href: string; icon: string; label: string; minPlan?: 'GROWTH' | 'PRO' }

const navItems: NavItem[] = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/dashboard/customers', icon: '👥', label: 'Clienti' },
  { href: '/dashboard/rewards', icon: '🎁', label: 'Premi' },
  { href: '/dashboard/scanner', icon: '📷', label: 'Timbra Cliente' },
  { href: '/dashboard/qr', icon: '📱', label: 'QR Code' },
  { href: '/dashboard/analytics', icon: '📈', label: 'Analytics', minPlan: 'GROWTH' },
  { href: '/dashboard/giftcards', icon: '🎀', label: 'Carte Regalo', minPlan: 'GROWTH' },
  { href: '/dashboard/offers', icon: '🔥', label: 'Offerte', minPlan: 'GROWTH' },
  { href: '/dashboard/staff', icon: '👤', label: 'Staff', minPlan: 'GROWTH' },
  { href: '/dashboard/automations', icon: '🤖', label: 'Automazioni', minPlan: 'GROWTH' },
  { href: '/dashboard/integrations', icon: '🔌', label: 'Integrazioni', minPlan: 'GROWTH' },
  { href: '/dashboard/campaigns', icon: '📧', label: 'Campagne', minPlan: 'PRO' },
  { href: '/dashboard/multistore', icon: '🏢', label: 'Multi-sede', minPlan: 'PRO' },
  { href: '/dashboard/export', icon: '📥', label: 'Reportistica', minPlan: 'PRO' },
  { href: '/dashboard/api', icon: '🔑', label: 'API Access', minPlan: 'PRO' },
  { href: '/dashboard/settings', icon: '⚙️', label: 'Impostazioni' },
  { href: '/dashboard/upgrade', icon: '⚡', label: 'Upgrade Piano' },
]

const mobileMain: NavItem[] = [
  { href: '/dashboard', icon: '📊', label: 'Home' },
  { href: '/dashboard/customers', icon: '👥', label: 'Clienti' },
  { href: '/dashboard/scanner', icon: '📷', label: 'Timbra' },
  { href: '/dashboard/analytics', icon: '📈', label: 'Stats', minPlan: 'GROWTH' },
]

const mobileExtra: NavItem[] = [
  { href: '/dashboard/rewards', icon: '🎁', label: 'Premi' },
  { href: '/dashboard/qr', icon: '📱', label: 'QR Code' },
  { href: '/dashboard/giftcards', icon: '🎀', label: 'Gift Card', minPlan: 'GROWTH' },
  { href: '/dashboard/offers', icon: '🔥', label: 'Offerte', minPlan: 'GROWTH' },
  { href: '/dashboard/staff', icon: '👤', label: 'Staff', minPlan: 'GROWTH' },
  { href: '/dashboard/automations', icon: '🤖', label: 'Automazioni', minPlan: 'GROWTH' },
  { href: '/dashboard/integrations', icon: '🔌', label: 'Integrazioni', minPlan: 'GROWTH' },
  { href: '/dashboard/campaigns', icon: '📧', label: 'Campagne', minPlan: 'PRO' },
  { href: '/dashboard/multistore', icon: '🏢', label: 'Multi-sede', minPlan: 'PRO' },
  { href: '/dashboard/export', icon: '📥', label: 'Reportistica', minPlan: 'PRO' },
  { href: '/dashboard/api', icon: '🔑', label: 'API', minPlan: 'PRO' },
  { href: '/dashboard/settings', icon: '⚙️', label: 'Impostazioni' },
  { href: '/dashboard/upgrade', icon: '⚡', label: 'Upgrade' },
]

function isLocked(item: NavItem, plan: string): boolean {
  if (!item.minPlan) return false
  if (item.minPlan === 'GROWTH' && (plan === 'GROWTH' || plan === 'PRO')) return false
  if (item.minPlan === 'PRO' && plan === 'PRO') return false
  return true
}

export default function Sidebar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [plan, setPlan] = useState("STARTER")
  useEffect(() => { fetch("/api/shop/plan").then(r=>r.json()).then(d=>setPlan(d.plan)) }, [])

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 min-h-screen bg-white/3 border-r border-white/6 flex-col p-4">
        <Link href="/" className="flex items-center gap-2.5 px-3 mb-6">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}>F</div>
          <span className="text-xl font-bold">Fidelio</span>
        </Link>
        <div className="bg-[#6C3DF4]/10 border border-[#6C3DF4]/20 rounded-xl px-3 py-2 mb-6">
          <p className="text-sm font-bold">Il mio negozio</p>
          <p className="text-xs text-[#A78BFA]">Piano {plan}</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const locked = isLocked(item, plan)
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  pathname === item.href ? 'bg-[#6C3DF4]/15 text-white' : locked ? 'text-white/25' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}>
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {locked && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: item.minPlan === 'PRO' ? 'rgba(249,115,22,0.15)' : 'rgba(124,58,237,0.15)', color: item.minPlan === 'PRO' ? '#f97316' : '#7c3aed' }}>
                    {item.minPlan}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="mt-4 border-t border-white/6 pt-4 flex flex-col gap-1">
          <Link href="/docs" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
            <span>📄</span>
            <span>Docs API</span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2">
            <UserButton />
            <span className="text-sm text-white/50">Account</span>
          </div>
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
