import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { getCustomerFromRequest, corsHeaders } from '@/lib/customerAuth'
import { logEvent } from '@/lib/logging'

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
  const result = await getCustomerFromRequest(req)
  if (result.error) return result.error

  const body = await req.json().catch(() => null)
  if (!body?.password || typeof body.password !== 'string' || body.password.length < 8) {
    return NextResponse.json({ error: 'La password deve essere di almeno 8 caratteri' }, { status: 400, headers: corsHeaders })
  }

  const passwordHash = await hashPassword(body.password)

  await db.customer.update({
    where: { id: result.customer.id },
    data: { passwordHash },
  })

  await logEvent({
    eventType: 'CUSTOMER_SET_PASSWORD',
    customerId: result.customer.id,
    action: `Password impostata per ${result.customer.email}`,
    metadata: { email: result.customer.email },
  })

  return NextResponse.json({ success: true }, { headers: corsHeaders })
}
