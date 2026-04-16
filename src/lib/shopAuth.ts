import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fidelio-secret-change-in-production'

export interface ShopJwtPayload {
  shopId: string
  email: string
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function getShopFromRequest(req: Request): Promise<
  | { shop: NonNullable<Awaited<ReturnType<typeof db.shop.findFirst>>>; payload: ShopJwtPayload; error?: never }
  | { error: NextResponse; shop?: never; payload?: never }
> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return { error: NextResponse.json({ error: 'Non autorizzato' }, { status: 401, headers: corsHeaders }) }
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as ShopJwtPayload
    const shop = await db.shop.findFirst({ where: { id: payload.shopId } })
    if (!shop) {
      return { error: NextResponse.json({ error: 'Negozio non trovato' }, { status: 404, headers: corsHeaders }) }
    }
    if (shop.suspended) {
      return { error: NextResponse.json({ error: 'Account sospeso' }, { status: 403, headers: corsHeaders }) }
    }
    return { shop, payload }
  } catch {
    return { error: NextResponse.json({ error: 'Token non valido' }, { status: 401, headers: corsHeaders }) }
  }
}

export function shopResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders })
}
