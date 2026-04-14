'use client'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin').then(r => r.json()).then(setData)
  }, [])

  const mrr = data?.shops?.reduce((acc: number, s: any) => {
    if (s.plan === 'GROWTH') return acc + 39
    if (s.plan === 'PRO') return acc + 79
    if (s.plan === 'STARTER') return acc + 19
    return acc
  }, 0) ?? 0

  const stats = [
    { label: 'MRR Stimato', value: `€${mrr}`, icon: '💰', color: '#10b981' },
    { label: 'Negozi totali', value: data?.shops?.length ?? '...', icon: '🏪', color: '#7c3aed' },
    { label: 'Piani paganti', value: data?.shops?.filter((s: any) => s.plan !== 'STARTER').length ?? '...', icon: '⚡', color: '#f97316' },
    { label: 'In attesa', value: data?.shops?.filter((s: any) => !s.approved).length ?? '...', icon: '⏳', color: '#f59e0b' },
    { label: 'Clienti totali', value: data?.totalCustomers ?? '...', icon: '👥', color: '#06b6d4' },
    { label: 'Clienti PWA', value: data?.pwaCustomers?.length ?? '...', icon: '📱', color: '#8b5cf6' },
    { label: 'Visite totali', value: data?.totalVisits ?? '...', icon: '📊', color: '#ec4899' },
    { label: 'Sospesi', value: data?.shops?.filter((s: any) => s.suspended).length ?? '...', icon: '🔴', color: '#ef4444' },
  ]

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>📊 Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: stat.color }} />
            <div style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>{stat.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
