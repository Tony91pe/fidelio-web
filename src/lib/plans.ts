export const FEATURES_BY_PLAN = {
  STARTER: [
    'digital_card', 'qr_static', 'points_basic', 'points_history',
    'dashboard_basic', 'rewards_max3', 'email_basic', 'support_email'
  ],
  GROWTH: [
    'digital_card', 'qr_static', 'points_basic', 'points_history',
    'dashboard_basic', 'email_basic', 'support_email',
    'rewards_unlimited', 'qr_dynamic', 'automations_basic',
    'push_notifications', 'segmentation', 'analytics_advanced',
    'multi_device', 'support_priority'
  ],
  PRO: [
    'digital_card', 'qr_static', 'points_basic', 'points_history',
    'dashboard_basic', 'email_basic', 'support_email',
    'rewards_unlimited', 'qr_dynamic', 'automations_basic',
    'push_notifications', 'segmentation', 'analytics_advanced',
    'multi_device', 'support_priority',
    'automations_advanced', 'campaigns', 'staff_roles',
    'multi_location', 'api_access', 'predictive_analytics', 'support_premium'
  ],
} as const

export type Feature = typeof FEATURES_BY_PLAN['PRO'][number]
export type Plan = keyof typeof FEATURES_BY_PLAN

export function hasFeature(plan: string, feature: Feature): boolean {
  const p = plan.toUpperCase() as Plan
  return (FEATURES_BY_PLAN[p] ?? FEATURES_BY_PLAN.STARTER).includes(feature as any)
}

export function getMaxRewards(plan: string): number {
  if (plan === 'STARTER') return 3
  return Infinity
}

// Trial fondatori: 6 mesi Growth gratis
export function isFounderTrial(shop: { plan: string; planExpiresAt: Date | null; createdAt: Date }): boolean {
  if (shop.plan !== 'GROWTH') return false
  if (!shop.planExpiresAt) return false
  const diffMonths = (shop.planExpiresAt.getTime() - shop.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
  return diffMonths >= 5.5
}
