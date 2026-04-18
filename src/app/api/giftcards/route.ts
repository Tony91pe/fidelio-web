import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'
import { hasFeature } from '@/lib/planFeatures'

function generateCode() {
  return randomBytes(6).toString('hex').toUpperCase()
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  if (!hasFeature(shop.plan, 'giftCards')) {
    return NextResponse.json({ error: 'Le gift card richiedono il piano Growth o superiore.', planRequired: 'GROWTH', currentPlan: shop.plan }, { status: 403 })
  }
  const { value, description, recipientName, recipientEmail, dedica } = await req.json()
  const giftCard = await db.giftCard.create({
    data: {
      code: generateCode(),
      points: 0,
      value: value ? parseFloat(value) : null,
      remainingValue: value ? parseFloat(value) : null,
      description,
      dedica: dedica || null,
      customerName: recipientName || null,
      customerEmail: recipientEmail || null,
      shopId: shop.id,
    }
  })
  return NextResponse.json(giftCard)
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ cards: [], shop: null })
  const shopInfo = { name: shop.name, logo: shop.logo, city: shop.city }
  if (!hasFeature(shop.plan, 'giftCards')) return NextResponse.json({ cards: [], shop: shopInfo })
  const cards = await db.giftCard.findMany({
    where: { shopId: shop.id }, orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json({ cards, shop: shopInfo })
}
