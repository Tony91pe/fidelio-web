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
  const auth = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!auth) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401, headers: corsHeaders })

  try {
    const payload = jwt.verify(auth, JWT_SECRET) as { customerId: string }
    const { name, birthday } = await req.json()

    const customer = await db.customer.update({
      where: { id: payload.customerId },
      data: {
        ...(name && { name }),
        ...(birthday && { birthday: new Date(birthday) }),
      }
    })

    return NextResponse.json({ ok: true, customer }, { headers: corsHeaders })
  } catch {
    return NextResponse.json({ error: 'Token non valido' }, { status: 401, headers: corsHeaders })
  }
}
