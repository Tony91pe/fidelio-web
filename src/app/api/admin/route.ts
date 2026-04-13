import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

export async function GET() {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

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
      take: 50,
      select: { id: true, email: true, name: true, code: true, points: true, totalVisits: true, createdAt: true }
    }),
    db.otpCode.count(),
  ])

  return NextResponse.json({ shops, totalCustomers, totalVisits, pwaCustomers, otpCodes })
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
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
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
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
