import { db } from '@/lib/db'
import { logEvent } from '@/lib/logging'

export async function giftPlan(shopId: string, plan: 'STARTER' | 'GROWTH' | 'PRO', months: number, adminUserId: string) {
  const shop = await db.shop.findUnique({ where: { id: shopId } })
  if (!shop) throw new Error('Shop not found')

  const currentExpiresAt = shop.planExpiresAt || new Date()
  const newExpiresAt = new Date(currentExpiresAt.getTime() + months * 30 * 24 * 60 * 60 * 1000)

  const updated = await db.shop.update({
    where: { id: shopId },
    data: {
      plan,
      planExpiresAt: newExpiresAt,
    },
  })

  await logEvent({
    eventType: 'PLAN_GIFTED',
    userId: adminUserId,
    shopId,
    action: `Gifted ${months} months of ${plan}`,
    metadata: { plan, months, newExpiresAt },
  })

  return { success: true, plan, months, newExpiresAt }
}
