import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

const JWT_SECRET = process.env.JWT_SECRET || 'fidelio-secret-change-in-production'

export async function POST(req: Request) {
  const { email, code } = await req.json()
  if (!email || !code) {
    return NextResponse.json({ error: 'Email e codice richiesti' }, { status: 400, headers: corsHeaders })
  }
  const stored = await db.otpCode.findFirst({ where: { email }, orderBy: { createdAt: 'desc' } })
  if (!stored) {
    return NextResponse.json({ error: 'Codice non trovato o scaduto' }, { status: 400, headers: corsHeaders })
  }
  if (new Date() > stored.expires) {
    await db.otpCode.deleteMany({ where: { email } })
    return NextResponse.json({ error: 'Codice scaduto. Richiedi un nuovo codice.' }, { status: 400, headers: corsHeaders })
  }
  if (stored.code !== code) {
    return NextResponse.json({ error: 'Codice non valido' }, { status: 400, headers: corsHeaders })
  }
  await db.otpCode.deleteMany({ where: { email } })

  let customer = await db.customer.findFirst({ where: { email } })
  const isNewUser = !customer

  if (!customer) {
    const newCode = `FID-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    const firstShop = await db.shop.findFirst({ where: { suspended: false } })
    if (!firstShop) {
      return NextResponse.json({ error: 'Nessun negozio disponibile' }, { status: 400, headers: corsHeaders })
    }
    customer = await db.customer.create({
      data: { email, name: email.split('@')[0], code: newCode, shopId: firstShop.id, points: 0 },
    })
  }

  const token = jwt.sign({ customerId: customer.id, email: customer.email }, JWT_SECRET, { expiresIn: '30d' })

  return NextResponse.json({
    token,
    isNewUser,
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      code: customer.code,
      points: customer.points,
      totalVisits: customer.totalVisits,
      lastVisitAt: customer.lastVisitAt,
      birthday: customer.birthday,
    },
  }, { headers: corsHeaders })
}
