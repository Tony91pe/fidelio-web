import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'Email richiesta' }, { status: 400 })

  const customers = await db.customer.findMany({ where: { email } })
  if (!customers.length) return NextResponse.json([])

  const shopIds = customers.map((c) => c.shopId).filter((id): id is string => id !== null)

  const giftCards = await db.giftCard.findMany({
    where: {
      shopId: { in: shopIds },
      OR: [
        { customerEmail: email },
        { customerEmail: null },
      ],
    },
    include: { shop: { select: { name: true, logo: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    giftCards.map((gc) => ({
      id: gc.id,
      code: gc.code,
      points: gc.points,
      value: gc.value,
      remainingValue: gc.remainingValue,
      description: gc.description,
      dedica: gc.dedica,
      customerName: gc.customerName,
      used: gc.used,
      shopName: gc.shop?.name ?? '',
      shopLogo: gc.shop?.logo ?? null,
      shopId: gc.shopId,
      createdAt: gc.createdAt,
    }))
  )
}
