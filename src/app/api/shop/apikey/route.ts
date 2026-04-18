import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createHmac } from 'crypto'

function generateApiKey(shopId: string): string {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.CLERK_SECRET_KEY ?? 'fidelio-api-secret'
  const hash = createHmac('sha256', secret).update(shopId).digest('hex')
  return `fid_live_${hash.slice(0, 40)}`
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  if (shop.plan !== 'PRO') return NextResponse.json({ error: 'Richiede piano PRO' }, { status: 403 })

  return NextResponse.json({ apiKey: generateApiKey(shop.id), shopId: shop.id })
}
