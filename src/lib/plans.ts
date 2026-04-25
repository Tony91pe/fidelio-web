// ─── Single source of truth for plan features ────────────────────────────────

export type Plan = 'STARTER' | 'GROWTH' | 'PRO'

export const PLAN_LABELS: Record<Plan, string> = {
  STARTER: 'Starter',
  GROWTH: 'Growth',
  PRO: 'Pro',
}

export const PLAN_PRICES: Record<Plan, string> = {
  STARTER: '19',
  GROWTH: '39',
  PRO: '79',
}

export const PLAN_COLORS: Record<Plan, string> = {
  STARTER: '#6b7280',
  GROWTH: '#7c3aed',
  PRO: '#f97316',
}

// ─── Feature keys ────────────────────────────────────────────────────────────
export const FEATURES_BY_PLAN = {
  STARTER: [
    'qr_static',
    'points_basic',
    'dashboard_basic',
    'customers_history',
    'email_welcome',
    'email_points',
    'profile_basic',
    'support_email',
    // max 1 premio — limitato via getMaxRewards()
    // branding Fidelio obbligatorio — NO branding_custom
  ] as const,

  GROWTH: [
    // tutto di STARTER
    'qr_static', 'points_basic', 'dashboard_basic', 'customers_history',
    'email_welcome', 'email_points', 'profile_basic', 'support_email',
    // GROWTH aggiunge
    'qr_dynamic',
    'antifraud',
    'rewards_unlimited',
    'gift_cards',
    'offers',
    'email_advanced',
    'push_notifications',
    'analytics_advanced',
    'dashboard_full',
    'roles',
    'branding_custom',
    'segmentation',
    'automations_basic',
    'support_priority',
  ] as const,

  PRO: [
    // tutto di GROWTH
    'qr_static', 'points_basic', 'dashboard_basic', 'customers_history',
    'email_welcome', 'email_points', 'profile_basic', 'support_email',
    'qr_dynamic', 'antifraud', 'rewards_unlimited', 'gift_cards', 'offers',
    'email_advanced', 'push_notifications', 'analytics_advanced', 'dashboard_full',
    'roles', 'branding_custom', 'segmentation', 'automations_basic', 'support_priority',
    // PRO aggiunge
    'multi_store',
    'automations_advanced',
    'api_access',
    'data_export',
    'reporting_advanced',
    'integrations',
    'campaigns',
    'ai_insights',
    'nps_analytics',
    'roles_advanced',
    'support_dedicated',
    'onboarding_assisted',
  ] as const,
} satisfies Record<Plan, readonly string[]>

export type Feature = typeof FEATURES_BY_PLAN['PRO'][number]

// ─── Reward limits ────────────────────────────────────────────────────────────
export const MAX_REWARDS: Record<Plan, number> = {
  STARTER: 1,
  GROWTH: Infinity,
  PRO: Infinity,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function resolvePlan(plan: string | null | undefined): Plan {
  return (plan as Plan) in FEATURES_BY_PLAN ? (plan as Plan) : 'STARTER'
}

export function hasFeature(plan: string | null | undefined, feature: Feature): boolean {
  return (FEATURES_BY_PLAN[resolvePlan(plan)] as readonly string[]).includes(feature)
}

export function getMaxRewards(plan: string | null | undefined): number {
  return MAX_REWARDS[resolvePlan(plan)]
}

/** Minimum plan that unlocks a feature */
export function minPlanFor(feature: Feature): Plan {
  if ((FEATURES_BY_PLAN.STARTER as readonly string[]).includes(feature)) return 'STARTER'
  if ((FEATURES_BY_PLAN.GROWTH as readonly string[]).includes(feature)) return 'GROWTH'
  return 'PRO'
}

// Founder trial: 6 mesi Growth gratis
export function isFounderTrial(shop: { plan: string; planExpiresAt: Date | null; createdAt: Date }): boolean {
  if (shop.plan !== 'GROWTH') return false
  if (!shop.planExpiresAt) return false
  const diffMonths = (shop.planExpiresAt.getTime() - shop.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
  return diffMonths >= 5.5
}
