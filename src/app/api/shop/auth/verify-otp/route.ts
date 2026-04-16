import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { corsHeaders } from '@/lib/shopAuth'

const JWT_SECRET = process.env.JWT_SECRET || 'fidelio-secret-change-in-production'

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(req: Request) {
  const { email, code } = await req.json()

  if (!email || !code) {
    return NextResponse.json({ error: 'Email e codice richiesti' }, { status: 400, headers: corsHeaders })
  }

  const stored = await db.otpCode.findFirst({
    where: { email, type: 'shop' },
    orderBy: { createdAt: 'desc' },
  })

  if (!stored) {
    return NextResponse.json({ error: 'Codice non trovato o scaduto' }, { status: 400, headers: corsHeaders })
  }
  if (new Date() > stored.expires) {
    await db.otpCode.deleteMany({ where: { email, type: 'shop' } })
    return NextResponse.json({ error: 'Codice scaduto. Richiedi un nuovo codice.' }, { status: 400, headers: corsHeaders })
  }
  if (stored.code !== code) {
    return NextResponse.json({ error: 'Codice non valido' }, { status: 400, headers: corsHeaders })
  }

  await db.otpCode.deleteMany({ where: { email, type: 'shop' } })

  const shop = await db.shop.findFirst({ where: { ownerEmail: email } })
  if (!shop) {
    return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404, headers: corsHeaders })
  }
  if (shop.suspended) {
    return NextResponse.json({ error: 'Account sospeso. Contatta il supporto.' }, { status: 403, headers: corsHeaders })
  }

  const token = jwt.sign({ shopId: shop.id, email }, JWT_SECRET, { expiresIn: '30d' })

  return NextResponse.json({
    token,
    shopUser: {
      id: shop.ownerId,
      shopId: shop.id,
      email,
      name: shop.name,
      role: 'owner',
    },
    shop: {
      id: shop.id,
      name: shop.name,
      category: shop.category,
      address: shop.address,
      city: shop.city,
      phone: shop.phone,
      logo: shop.logo,
      rewardThreshold: shop.rewardThreshold,
      rewardDescription: shop.rewardDescription,
      pointsSystem: shop.pointsSystem,
      pointsPerVisit: shop.pointsPerVisit,
      pointsPerEuro: shop.pointsPerEuro,
      welcomePoints: shop.welcomePoints,
    },
  }, { headers: corsHeaders })
}
