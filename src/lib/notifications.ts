import { sendEmail } from '@/lib/email'
import { sendPushNotification } from '@/lib/push'
import { FEATURES_BY_PLAN } from '@/lib/plans'

export interface NotificationPayload {
  userId?: string
  email?: string
  customerId?: string
  type: 'email' | 'push' | 'both'
  subject?: string
  template: string
  data: Record<string, any>
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
    if (payload.customerId) {
      await sendPushNotification(payload.customerId, payload.template, payload.data)
    }
  }
}

export function getNotificationTypeByPlan(plan: string): 'email' | 'push' | 'both' {
  if (plan === 'PRO' || plan === 'GROWTH') return 'both'
  return 'email'
}
