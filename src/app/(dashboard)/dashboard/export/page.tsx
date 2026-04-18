'use client'
import { useState, useEffect } from 'react'
import UpgradeWall from '@/components/UpgradeWall'

type Stats = { customers: number; visits: number; totalPoints: number }

export default function ExportPage() {
  const [plan, setPlan] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetch('/api/shop/plan').then(r => r.json()).then(d => setPlan(d.plan))
    fetch('/api/shop/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  if (plan === null) return null
  if (plan !== 'PRO') return <UpgradeWall requiredPlan="PRO" currentPlan={plan} feature="Reportistica avanzata" description="Esporta i dati dei clienti in CSV, accedi a reportistica dettagliata e analisi avanzate. Disponibile solo nel piano PRO." />

  async function downloadCSV() {
    setDownloading(true)
    const res = await fetch('/api/shop/export')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = res.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') ?? 'clienti.csv'
    a.click()
    URL.revokeObjectURL(url)
    setDownloading(false)
  }

  return (
    <div style={{ color: 'white', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>📊 Reportistica avanzata</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>Esporta e analizza i dati del tuo negozio</p>

      {/* Statistiche riepilogo */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Clienti totali', value: stats.customers, icon: '👥' },
            { label: 'Visite totali', value: stats.visits, icon: '🏪' },
            { label: 'Punti distribuiti', value: stats.totalPoints ?? 0, icon: '⭐' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a78bfa' }}>{s.value.toLocaleString('it-IT')}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Export CSV */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>📥 Esporta clienti CSV</p>
            <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.4)' }}>Nome, email, telefono, punti, visite, data nascita, ultima visita</p>
          </div>
          <button
            onClick={downloadCSV}
            disabled={downloading}
            style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>
            {downloading ? 'Download...' : '⬇️ Scarica CSV'}
          </button>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>📋 Esporta visite CSV</p>
            <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.4)' }}>Storico completo delle visite con punti e importi</p>
          </div>
          <button
            onClick={async () => {
              setDownloading(true)
              window.open('/api/shop/export?type=visits', '_blank')
              setDownloading(false)
            }}
            style={{ background: 'rgba(255,255,255,0.07)', color: 'white', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>
            ⬇️ Scarica CSV
          </button>
        </div>
      </div>
    </div>
  )
}
