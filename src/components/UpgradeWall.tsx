'use client'
import Link from 'next/link'
import { Plan, PLAN_LABELS, PLAN_COLORS, PLAN_PRICES } from '@/lib/planFeatures'

interface UpgradeWallProps {
  requiredPlan: Plan
  currentPlan?: string
  feature: string
  description?: string
}

export default function UpgradeWall({ requiredPlan, currentPlan, feature, description }: UpgradeWallProps) {
  const color = PLAN_COLORS[requiredPlan]
  const label = PLAN_LABELS[requiredPlan]
  const price = PLAN_PRICES[requiredPlan]

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem' }}>
      <div style={{
        maxWidth: 480,
        width: '100%',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}33`,
        borderRadius: 24,
        padding: '2.5rem',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: 72, height: 72,
          background: color + '18',
          border: `1px solid ${color}33`,
          borderRadius: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, margin: '0 auto 1.5rem',
        }}>
          🔒
        </div>

        {/* Badge piano attuale */}
        {currentPlan && (
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 100,
              padding: '3px 12px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
            }}>
              Piano attuale: {PLAN_LABELS[currentPlan as Plan] ?? currentPlan}
            </span>
          </div>
        )}

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          {feature}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          {description ?? `Questa funzionalità richiede il piano ${label}. Aggiorna ora per sbloccarla.`}
        </p>

        {/* Plan card */}
        <div style={{
          background: color + '12',
          border: `1px solid ${color}44`,
          borderRadius: 16,
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            Piano {label}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.2rem' }}>
            €{price}<span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>/mese</span>
          </div>
        </div>

        <Link href="/dashboard/upgrade" style={{
          display: 'block',
          background: color,
          color: 'white',
          padding: '13px 24px',
          borderRadius: 12,
          fontWeight: 700,
          fontSize: '0.95rem',
          textDecoration: 'none',
          boxShadow: `0 4px 20px ${color}44`,
        }}>
          Aggiorna a {label} →
        </Link>

        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', marginTop: '1rem' }}>
          Puoi cambiare piano in qualsiasi momento
        </p>
      </div>
    </div>
  )
}
