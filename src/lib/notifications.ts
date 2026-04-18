import { sendEmail } from '@/lib/email'
import { sendPushNotification } from '@/lib/push'
import { db } from '@/lib/db'

export interface NotificationPayload {
  userId?: string
  email?: string
  customerId?: string
  type: 'email' | 'push' | 'both'
  subject?: string
  template: string
  data: Record<string, unknown>
  shopId?: string
}

export async function notifyUser(payload: NotificationPayload) {
  if (payload.type === 'email' || payload.type === 'both') {
    if (payload.email) {
      await sendEmail({
        to: payload.email,
        subject: payload.subject || 'Notifica',
        template: payload.template,
        data: payload.data,
      })
    }
  }

  if (payload.type === 'push' || payload.type === 'both') {
    const email = payload.email
    if (email) {
      const subscriptions = await db.pushSubscription.findMany({
        where: { email },
      })
      for (const sub of subscriptions) {
        await sendPushNotification(
          { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
          {
            title: payload.subject || 'Fidelio',
            body: String(payload.data.message || ''),
            icon: '/favicon.svg',
          }
        )
      }
    }
  }
}

export function getNotificationTypeByPlan(plan: string): 'email' | 'push' | 'both' {
  if (plan === 'PRO' || plan === 'GROWTH') return 'both'
  return 'email'
}
