import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { logEvent } from '@/lib/logging'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(':')
  return new Promise((resolve) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) resolve(false)
      else resolve(derivedKey.toString('hex') === key)
    })
  })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(req: Request) {
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) {
    return NextResponse.json({ error: 'Configurazione server mancante' }, { status: 500, headers: corsHeaders })
  }

  const body = await req.json().catch(() => null)
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'Email e password richieste' }, { status: 400, headers: corsHeaders })
  }

  const { email, password } = body

  const customer = await db.customer.findFirst({ where: { email } })
  if (!customer || !customer.passwordHash) {
    return NextResponse.json({ error: 'Account non trovato o password non impostata' }, { status: 401, headers: corsHeaders })
  }

  const valid = await verifyPassword(password, customer.passwordHash)
  if (!valid) {
    await logEvent({ eventType: 'AUTH_FAILED', action: `Login password errata per ${email}`, metadata: { email } })
    return NextResponse.json({ error: 'Email o password non corretti' }, { status: 401, headers: corsHeaders })
  }

  const token = jwt.sign({ customerId: customer.id, email: customer.email }, JWT_SECRET, { expiresIn: '30d' })

  await logEvent({
    eventType: 'CUSTOMER_LOGIN',
    customerId: customer.id,
    action: `Login con password: ${email}`,
    metadata: { email },
  })

  return NextResponse.json({
    token,
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
