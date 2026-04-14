'use client'
import { useEffect, useState } from 'react'
import { hasFeature, Feature } from '@/lib/plans'

export function usePlan() {
  const [plan, setPlan] = useState<string>('STARTER')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/shops/me')
      .then(r => r.json())
      .then(d => { if (d.plan) setPlan(d.plan) })
      .finally(() => setLoading(false))
  }, [])

  return {
    plan,
    loading,
    can: (feature: Feature) => hasFeature(plan, feature),
  }
}
