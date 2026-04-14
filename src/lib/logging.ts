import { db } from '@/lib/db'

export interface LogEvent {
  eventType: string
  userId?: string
  shopId?: string
  customerId?: string
  action: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export async function logEvent(event: LogEvent) {
  try {
    const created = await db.log.create({
      data: {
        eventType: event.eventType,
        userId: event.userId,
        shopId: event.shopId,
        customerId: event.customerId,
        action: event.action,
        metadata: event.metadata,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
      },
    })
    return created
  } catch (error) {
    console.error('Logging failed:', error)
  }
}

export async function getLogsForShop(shopId: string, limit: number = 100) {
  return await db.log.findMany({
    where: { shopId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getAuditTrail(shopId: string, startDate: Date, endDate: Date) {
  return await db.log.findMany({
    where: {
      shopId,
      createdAt: { gte: startDate, lte: endDate },
    },
    orderBy: { createdAt: 'desc' },
  })
}
