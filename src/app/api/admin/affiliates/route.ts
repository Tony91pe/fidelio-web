import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

async function checkAdmin() {
  const { userId } = await auth()
  return userId === process.env.ADMIN_USER_ID
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const affiliates = await db.affiliate.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      referrals: {
        include: { affiliate: false },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  // Arricchisci con nome negozio
  const shopIds = affiliates.flatMap(a => a.referrals.map(r => r.shopId))
  const shops = shopIds.length
    ? await db.shop.findMany({ where: { id: { in: shopIds } }, select: { id: true, name: true, ownerEmail: true, plan: true } })
    : []
  const shopMap = Object.fromEntries(shops.map(s => [s.id, s]))

  return NextResponse.json(affiliates.map(a => ({
    ...a,
    referrals: a.referrals.map(r => ({ ...r, shop: shopMap[r.shopId] ?? null })),
  })))
}

export async function POST(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const body = await req.json()
  const { name, email, code, commissionType, commissionAmount, commissionMonths, notes } = body
  if (!name || !email || !code) return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
  const affiliate = await db.affiliate.create({
    data: { name, email, code: code.toUpperCase(), commissionType: commissionType || 'MONTHLY', commissionAmount: parseFloat(commissionAmount) || 0, commissionMonths: parseInt(commissionMonths) || 0, notes },
  })
  return NextResponse.json(affiliate)
}

export async function PATCH(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const body = await req.json()
  const { id, action, ...data } = body

  if (action === 'addReferral') {
    const ref = await db.affiliateReferral.upsert({
      where: { shopId: data.shopId },
      update: { affiliateId: id, notes: data.notes },
      create: { affiliateId: id, shopId: data.shopId, notes: data.notes },
    })
    return NextResponse.json(ref)
  }

  if (action === 'markPaid') {
    const ref = await db.affiliateReferral.update({
      where: { id: data.referralId },
      data: { commissionPaid: true, paidAt: new Date() },
    })
    return NextResponse.json(ref)
  }

  if (action === 'markUnpaid') {
    const ref = await db.affiliateReferral.update({
      where: { id: data.referralId },
      data: { commissionPaid: false, paidAt: null },
    })
    return NextResponse.json(ref)
  }

  const affiliate = await db.affiliate.update({ where: { id }, data })
  return NextResponse.json(affiliate)
}

export async function DELETE(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const { id, referralId } = await req.json()
  if (referralId) {
    await db.affiliateReferral.delete({ where: { id: referralId } })
  } else {
    await db.affiliate.delete({ where: { id } })
  }
  return NextResponse.json({ ok: true })
}
