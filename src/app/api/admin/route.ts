import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Resend } from 'resend'

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
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { plan } }))
  }
  if (action === 'giftMonths') {
    const shop = await db.shop.findUnique({ where: { id: shopId } })
    const base = shop?.planExpiresAt && shop.planExpiresAt > new Date() ? shop.planExpiresAt : new Date()
    const planExpiresAt = new Date(base)
    planExpiresAt.setMonth(planExpiresAt.getMonth() + months)
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { planExpiresAt, plan: 'GROWTH' } }))
  }
  if (action === 'suspend') {
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { suspended: true } }))
  }
  if (action === 'unsuspend') {
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { suspended: false } }))
  }
  if (action === 'approve') {
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { approved: true } }))
  }
  if (action === 'unapprove') {
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { approved: false } }))
  }
  return NextResponse.json({ error: 'Azione non valida' }, { status: 400 })
}

export async function DELETE(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { shopId } = await req.json()
  await db.visit.deleteMany({ where: { shopId } })
  await db.redemption.deleteMany({ where: { reward: { shopId } } })
  await db.reward.deleteMany({ where: { shopId } })
  await db.campaign.deleteMany({ where: { shopId } })
  await db.giftCard.deleteMany({ where: { shopId } })
  await db.customer.deleteMany({ where: { shopId } })
  await db.shop.delete({ where: { id: shopId } })
  return NextResponse.json({ ok: true })
}