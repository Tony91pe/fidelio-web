import { db } from '@/lib/db'
import { Stripe } from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function upgradeDowngradePlan(shopId: string, newPlan: 'STARTER' | 'GROWTH' | 'PRO') {
  const shop = await db.shop.findUnique({ where: { id: shopId } })
  if (!shop) throw new Error('Shop not found')

  const planPricingMonthly: Record<string, number> = { STARTER: 0, GROWTH: 2900, PRO: 9900 }
  const planPricingYearly: Record<string, number> = { STARTER: 0, GROWTH: 29900, PRO: 99900 }

  if (newPlan === 'STARTER') {
    await db.shop.update({
      where: { id: shopId },
      data: { plan: newPlan, planExpiresAt: null, stripeId: null },
    })
    return { success: true, plan: newPlan }
  }

  const oldPrice = planPricingMonthly[shop.plan.toUpperCase()] || 0
  const newPrice = planPricingMonthly[newPlan]
  const dailyOldPrice = oldPrice / 30
  const remainingDays = shop.planExpiresAt ? Math.max(0, (shop.planExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0

  const prorationCredit = remainingDays * dailyOldPrice
  const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  if (shop.stripeId && shop.plan !== 'STARTER') {
    await stripe.customers.update(shop.stripeId, {
      metadata: { shopId, plan: newPlan }
    })
  }

  const updated = await db.shop.update({
    where: { id: shopId },
    data: { plan: newPlan, planExpiresAt: newExpiresAt },
  })

  return { success: true, plan: newPlan, prorationCredit, expiresAt: newExpiresAt }
}

export async function checkPlanExpiry() {
  const expiredShops = await db.shop.findMany({
    where: { planExpiresAt: { lte: new Date() }, plan: { not: 'STARTER' } },
  })

  for (const shop of expiredShops) {
    await db.shop.update({
      where: { id: shop.id },
      data: { plan: 'STARTER', planExpiresAt: null },
    })
  }

  return { downgraded: expiredShops.length }
}

export async function activateFounderTrial(shopId: string) {
  const expiresAt = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
  const updated = await db.shop.update({
    where: { id: shopId },
    data: { plan: 'GROWTH', planExpiresAt: expiresAt },
  })
  return { success: true, plan: 'GROWTH', expiresAt }
}
