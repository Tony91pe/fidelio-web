import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { logEvent } from '@/lib/logging'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const MAX_ATTEMPTS = 5

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(req: Request) {
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) {
    return NextResponse.json({ error: 'Configurazione server mancante' }, { status: 500, headers: corsHeaders })
  }

  const body = await req.json().catch(() => null)
  if (!body?.email || !body?.code) {
    return NextResponse.json({ error: 'Email e codice richiesti' }, { status: 400, headers: corsHeaders })
  }

  const { email, code } = body

  const stored = await db.otpCode.findFirst({ where: { email, type: 'customer' }, orderBy: { createdAt: 'desc' } })
  if (!stored) {
    return NextResponse.json({ error: 'Codice non trovato o scaduto' }, { status: 400, headers: corsHeaders })
  }
  if (new Date() > stored.expires) {
    await db.otpCode.deleteMany({ where: { email, type: 'customer' } })
    return NextResponse.json({ error: 'Codice scaduto. Richiedi un nuovo codice.' }, { status: 400, headers: corsHeaders })
  }

  if (stored.attempts >= MAX_ATTEMPTS) {
    await db.otpCode.deleteMany({ where: { email, type: 'customer' } })
    await logEvent({ eventType: 'AUTH_BLOCKED', action: 'OTP bloccato per troppi tentativi', metadata: { email } })
    return NextResponse.json({ error: 'Troppi tentativi. Richiedi un nuovo codice.' }, { status: 429, headers: corsHeaders })
  }

  if (stored.code !== code) {
    await db.otpCode.update({ where: { id: stored.id }, data: { attempts: { increment: 1 } } })
    const remaining = MAX_ATTEMPTS - stored.attempts - 1
    await logEvent({ eventType: 'AUTH_FAILED', action: 'OTP errato', metadata: { email, attemptsLeft: remaining } })
    return NextResponse.json(
      { error: `Codice non valido. ${remaining > 0 ? `${remaining} tentativi rimasti.` : 'Richiedi un nuovo codice.'}` },
      { status: 400, headers: corsHeaders }
    )
  }

  await db.otpCode.deleteMany({ where: { email, type: 'customer' } })

  let customer = await db.customer.findFirst({ where: { email } })
  const isNewUser = !customer

  if (!customer) {
    const newCode = `FID-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    customer = await db.customer.create({
      data: { email, name: email.split('@')[0], code: newCode, points: 0 },
    })
  }

  const token = jwt.sign({ customerId: customer.id, email: customer.email }, JWT_SECRET, { expiresIn: '30d' })

  await logEvent({
    eventType: isNewUser ? 'CUSTOMER_REGISTERED' : 'CUSTOMER_LOGIN',
    customerId: customer.id,
    action: isNewUser ? `Nuovo cliente registrato: ${email}` : `Login cliente: ${email}`,
    metadata: { email },
  })

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
