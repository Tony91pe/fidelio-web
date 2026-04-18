import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export interface CustomerJwtPayload {
  customerId: string
  email: string
}

export async function getCustomerFromRequest(req: Request): Promise<
  | { customer: NonNullable<Awaited<ReturnType<typeof db.customer.findUnique>>>; payload: CustomerJwtPayload; error?: never }
  | { error: NextResponse; customer?: never; payload?: never }
> {
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) {
    return { error: NextResponse.json({ error: 'Configurazione server mancante' }, { status: 500, headers: corsHeaders }) }
  }

  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return { error: NextResponse.json({ error: 'Non autorizzato' }, { status: 401, headers: corsHeaders }) }
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as CustomerJwtPayload
    const customer = await db.customer.findUnique({ where: { id: payload.customerId } })
    if (!customer) {
      return { error: NextResponse.json({ error: 'Cliente non trovato' }, { status: 404, headers: corsHeaders }) }
    }
    return { customer, payload }
  } catch {
    return { error: NextResponse.json({ error: 'Token non valido' }, { status: 401, headers: corsHeaders }) }
  }
}
