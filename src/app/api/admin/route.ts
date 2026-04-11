import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

export async function GET() {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const [shops, totalCustomers, totalVisits] = await Promise.all([
    db.shop.findMany({
      include: { _count: { select: { customers: true, visits: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    db.customer.count(),
    db.visit.count(),
  ])
  return NextResponse.json({ shops, totalCustomers, totalVisits })
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const { shopId, action, plan, months } = await req.json()
  if (action === 'changePlan') {
    const shop = await db.shop.update({ where: { id: shopId }, data: { plan } })
    return NextResponse.json(shop)
  }
  if (action === 'giftMonths') {
    const shop = await db.shop.findUnique({ where: { id: shopId } })
    const base = shop?.planExpiresAt && shop.planExpiresAt > new Date() ? shop.planExpiresAt : new Date()
    const planExpiresAt = new Date(base)
    planExpiresAt.setMonth(planExpiresAt.getMonth() + months)
    const updated = await db.shop.update({ where: { id: shopId }, data: { planExpiresAt, plan: 'GROWTH' } })
    return NextResponse.json(updated)
  }
  if (action === 'suspend') {
    const shop = await db.shop.update({ where: { id: shopId }, data: { suspended: true } })
    return NextResponse.json(shop)
  }
  if (action === 'unsuspend') {
    const shop = await db.shop.update({ where: { id: shopId }, data: { suspended: false } })
    return NextResponse.json(shop)
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
