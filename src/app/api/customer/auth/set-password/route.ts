import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'
import { getCustomerFromToken } from '@/lib/customerAuth'
import { logEvent } from '@/lib/logging'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(`${salt}:${derivedKey.toString('hex')}`)
    })
  })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(req: Request) {
  const payload = getCustomerFromToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401, headers: corsHeaders })
  }

  const body = await req.json().catch(() => null)
  if (!body?.password || typeof body.password !== 'string' || body.password.length < 8) {
    return NextResponse.json({ error: 'La password deve essere di almeno 8 caratteri' }, { status: 400, headers: corsHeaders })
  }

  const passwordHash = await hashPassword(body.password)

  await db.customer.updateMany({
    where: { email: payload.email },
    data: { passwordHash },
  })

  await logEvent({
    eventType: 'CUSTOMER_SET_PASSWORD',
    customerId: payload.customerId,
    action: `Password impostata per ${payload.email}`,
    metadata: { email: payload.email },
  })

  return NextResponse.json({ success: true }, { headers: corsHeaders })
}
