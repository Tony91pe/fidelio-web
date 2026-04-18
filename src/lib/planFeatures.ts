// Compatibility shim — all logic lives in plans.ts
export type { Plan } from './plans'
export { PLAN_LABELS, PLAN_PRICES, PLAN_COLORS, getMaxRewards } from './plans'
import { hasFeature as _has, getMaxRewards, minPlanFor as _minPlanFor } from './plans'
import type { Plan } from './plans'

export interface PlanFeatures {
  maxRewards: number
  giftCards: boolean
  offers: boolean
  pushNotifications: boolean
  advancedAnalytics: boolean
  campaigns: boolean
  aiInsights: boolean
  automations: boolean
}

export function getFeatures(plan: Plan | string | null | undefined): PlanFeatures {
  return {
    maxRewards:         getMaxRewards(plan),
    giftCards:          _has(plan, 'gift_cards'),
    offers:             _has(plan, 'offers'),
    pushNotifications:  _has(plan, 'push_notifications'),
    advancedAnalytics:  _has(plan, 'analytics_advanced'),
    campaigns:          _has(plan, 'campaigns'),
    aiInsights:         _has(plan, 'ai_insights'),
    automations:        _has(plan, 'automations_basic'),
  }
}

export function hasFeature(plan: Plan | string | null | undefined, feature: keyof PlanFeatures): boolean {
  const f = getFeatures(plan)
  const val = f[feature]
  return typeof val === 'boolean' ? val : (val as number) > 0
}

export function minPlanFor(feature: keyof PlanFeatures): Plan {
  if (getFeatures('STARTER')[feature]) return 'STARTER'
  if (getFeatures('GROWTH')[feature]) return 'GROWTH'
  return 'PRO'
}

// Legacy alias
export function requiresPlan(feature: keyof PlanFeatures, plan: Plan | string | null | undefined): Plan | null {
  const required = minPlanFor(feature)
  if (required === 'STARTER') return null
  const p = plan as Plan
  if (required === 'GROWTH' && (p === 'GROWTH' || p === 'PRO')) return null
  if (required === 'PRO' && p === 'PRO') return null
  return required
}
