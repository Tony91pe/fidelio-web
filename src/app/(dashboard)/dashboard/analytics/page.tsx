'use client'
import { useState, useEffect } from 'react'

type Analytics = {
  totalCustomers: number
  totalPoints: number
  totalRedeemed: number
  recentVisits: number
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics')
        if (!res.ok) throw new Error('Failed to fetch analytics')
        const data = await res.json()
        setAnalytics(data)
      } catch (err) {
        console.error('Error loading analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return <div style={{textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.5)'}}>Caricamento...</div>
  }

  if (!analytics) {
    return <div style={{textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.5)'}}>Errore nel caricamento</div>
  }

  const stats = [
    { label: 'Clienti totali', value: analytics.totalCustomers, icon: '👥' },
    { label: 'Punti distribuiti', value: analytics.totalPoints, icon: '⭐' },
    { label: 'Punti riscattati', value: analytics.totalRedeemed, icon: '✅' },
    { label: 'Visite ultimi 30gg', value: analytics.recentVisits, icon: '📊' },
  ]

  return (
    <div>
      <div style={{marginBottom:'2rem'}}>
        <h1 style={{fontSize:'1.5rem', fontWeight:'700'}}>Analytics</h1>
        <p style={{color:'rgba(255,255,255,0.4)'}}>Statistiche del vostro negozio</p>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'2rem'}}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{
            background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:'16px',
            padding:'1.5rem'
          }}>
            <div style={{fontSize:'2rem', marginBottom:'0.5rem'}}>{stat.icon}</div>
            <p style={{color:'rgba(255,255,255,0.5)', fontSize:'0.85rem', marginBottom:'0.5rem'}}>{stat.label}</p>
            <div style={{fontSize:'2rem', fontWeight:'700'}}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
