import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Resend } from 'resend'
import { clearMapCache } from '@/lib/mapService'
import { logEvent } from '@/lib/logging'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID
const resend = new Resend(process.env.RESEND_API_KEY)

async function requireAdmin() {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) return false
  return true
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const [shops, totalCustomers, totalVisits, pwaCustomers, otpCodes] = await Promise.all([
    db.shop.findMany({
      include: { _count: { select: { customers: true, visits: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    db.customer.count(),
    db.visit.count(),
    db.customer.findMany({
      distinct: ['email'],
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { id: true, email: true, name: true, code: true, points: true, totalVisits: true, createdAt: true }
    }),
    db.otpCode.count(),
  ])

  return NextResponse.json({ shops, totalCustomers, totalVisits, pwaCustomers, otpCodes })
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { action, target, subject, body } = await req.json()

  if (action === 'sendEmail') {
    const shops = await db.shop.findMany({ select: { ownerId: true, plan: true, approved: true } })

    let filtered = shops
    if (target === 'paying') filtered = shops.filter(s => s.plan !== 'STARTER')
    if (target === 'pending') filtered = shops.filter(s => !s.approved)

    const ownerIds = [...new Set(filtered.map(s => s.ownerId))]

    const clerk = await clerkClient()
    const emails: string[] = []
    for (const userId of ownerIds) {
      try {
        const user = await clerk.users.getUser(userId)
        const email = user.emailAddresses[0]?.emailAddress
        if (email) emails.push(email)
      } catch {}
    }

    if (emails.length > 0) {
      await resend.emails.send({
        from: 'Fidelio <noreply@fidelio.it>',
        to: emails,
        subject,
        text: body,
      })
    }

    return NextResponse.json({ ok: true, sent: emails.length })
  }

  return NextResponse.json({ error: 'Azione non valida' }, { status: 400 })
}

export async function PATCH(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { shopId, action, plan, months } = await req.json()

  if (action === 'changePlan') {
    clearMapCache()
    const { userId } = await auth()
    await logEvent({ eventType: 'PLAN_CHANGED_ADMIN', userId: userId ?? undefined, shopId, action: `Piano cambiato a ${plan}`, metadata: { plan } })
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { plan } }))
  }
  if (action === 'giftTrial') {
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 6)
    const { userId } = await auth()
    await logEvent({ eventType: 'TRIAL_ACTIVATED', userId: userId ?? undefined, shopId, action: 'Trial fondatore 6 mesi regalato', metadata: { plan: 'GROWTH', months: 6 } })
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { plan: 'GROWTH', planExpiresAt: expiresAt, isFounder: true } }))
  }
  if (action === 'giftMonths') {
    const giftedPlan = ['STARTER', 'GROWTH', 'PRO'].includes(plan) ? plan : 'GROWTH'
    const shop = await db.shop.findUnique({ where: { id: shopId } })
    const base = shop?.planExpiresAt && shop.planExpiresAt > new Date() ? shop.planExpiresAt : new Date()
    const planExpiresAt = new Date(base)
    planExpiresAt.setMonth(planExpiresAt.getMonth() + months)
    const { userId } = await auth()
    await logEvent({ eventType: 'TRIAL_ACTIVATED', userId: userId ?? undefined, shopId, action: `Regalati ${months} mesi ${giftedPlan}`, metadata: { plan: giftedPlan, months } })
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { planExpiresAt, plan: giftedPlan } }))
  }
  if (action === 'suspend') {
    clearMapCache()
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { suspended: true } }))
  }
  if (action === 'unsuspend') {
    clearMapCache()
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { suspended: false } }))
  }
  if (action === 'approve') {
    clearMapCache()
    const { userId } = await auth()
    await logEvent({ eventType: 'SHOP_APPROVED', userId: userId ?? undefined, shopId, action: 'Negozio approvato', metadata: {} })
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { approved: true } }))
  }
  if (action === 'unapprove') {
    clearMapCache()
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { approved: false } }))
  }
  if (action === 'forceLogout') {
    const shop = await db.shop.findUnique({ where: { id: shopId } })
    if (shop?.ownerId) {
      try {
        await fetch(`https://api.clerk.com/v1/users/${shop.ownerId}/sessions`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
        })
      } catch { /* ignora errori Clerk */ }
    }
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Azione non valida' }, { status: 400 })
}

export async function DELETE(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { shopId, deleteCustomers = true } = await req.json()

  // Elimina sempre visite, premi, campagne, gift card, offerte del negozio
  await db.visit.deleteMany({ where: { shopId } })
  await db.redemption.deleteMany({ where: { reward: { shopId } } })
  await db.reward.deleteMany({ where: { shopId } })
  await db.campaign.deleteMany({ where: { shopId } })
  await db.giftCard.deleteMany({ where: { shopId } })
  await db.offer.deleteMany({ where: { shopId } })

  if (deleteCustomers) {
    // Elimina anche tutti i clienti associati al negozio
    await db.customer.deleteMany({ where: { shopId } })
  } else {
    // Mantieni i clienti nel DB ma scollega il riferimento al negozio
    // (shopId diventa null — i clienti rimangono accessibili come archivio)
    await db.customer.updateMany({ where: { shopId }, data: { shopId: null as unknown as string } })
  }

  clearMapCache()
  await db.shop.delete({ where: { id: shopId } })
  return NextResponse.json({ ok: true })
}