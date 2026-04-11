import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
function generateCode() {
return Math.random().toString(36).substring(2,8).toUpperCase()
}
export async function POST(req: Request) {
const { userId } = await auth()
if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
const shop = await db.shop.findFirst({ where: { ownerId: userId } })
if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
const { points } = await req.json()
const giftCard = await db.giftCard.create({
data: { code: generateCode(), points, shopId: shop.id }
})
return NextResponse.json(giftCard)
}
export async function GET() {
const { userId } = await auth()
if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
const shop = await db.shop.findFirst({ where: { ownerId: userId } })
if (!shop) return NextResponse.json([])
const cards = await db.giftCard.findMany({
where: { shopId: shop.id }, orderBy: { createdAt: 'desc' }
})
return NextResponse.json(cards)
}