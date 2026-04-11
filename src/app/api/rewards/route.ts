import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
export async function GET() {
const { userId } = await auth()
if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
const shop = await db.shop.findFirst({ where: { ownerId: userId } })
if (!shop) return NextResponse.json([])
return NextResponse.json(await db.reward.findMany({
where: { shopId: shop.id, active: true }, orderBy: { pointsCost: 'asc' }
}))
}
export async function POST(req: Request) {
const { userId } = await auth()
if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
const shop = await db.shop.findFirst({ where: { ownerId: userId } })
if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
const { title, description, pointsCost } = await req.json()
return NextResponse.json(await db.reward.create({
data: { title, description, pointsCost, shopId: shop.id }
}))
}
