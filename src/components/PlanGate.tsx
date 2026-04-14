'use client'
import { usePlan } from '@/hooks/usePlan'
import { Feature } from '@/lib/plans'
import Link from 'next/link'

export function PlanGate({ feature, children }: { feature: Feature; children: React.ReactNode }) {
  const { can, loading } = usePlan()
  if (loading) return null
  if (can(feature)) return <>{children}</>
  return (
    <div style={{ background: 'rgba(108,61,244,0.1)', border: '1px solid rgba(108,61,244,0.3)', borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
      <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>🔒 Funzione non disponibile</p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1rem' }}>Questa funzione richiede un piano superiore.</p>
      <Link href="/dashboard/upgrade" style={{ background: '#6C3DF4', color: 'white', padding: '8px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
        Upgrade →
      </Link>
    </div>
  )
}
