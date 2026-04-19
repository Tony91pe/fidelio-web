import { db } from '@/lib/db'

export async function upgradeDowngradePlan(shopId: string, newPlan: 'STARTER' | 'GROWTH' | 'PRO') {
  const shop = await db.shop.findUnique({ where: { id: shopId } })
  if (!shop) throw new Error('Shop non trovato')

  await db.shop.update({
    where: { id: shopId },
    data: {
      plan: newPlan,
      planExpiresAt: null,
      ...(newPlan === 'STARTER' ? { paddleCustomerId: null } : {}),
    },
  })

  return { success: true, plan: newPlan }
}

export async function activateFounderTrial(shopId: string) {
  const expiresAt = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
  await db.shop.update({
    where: { id: shopId },
    data: { plan: 'GROWTH', planExpiresAt: expiresAt, isFounder: true },
  })
  return { success: true, plan: 'GROWTH', expiresAt }
}
