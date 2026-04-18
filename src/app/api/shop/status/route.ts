import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ status: 'no-shop' })
    const shop = await db.shop.findFirst({ where: { ownerId: userId } })
    if (!shop) return NextResponse.json({ status: 'no-shop' })
    if (!shop.approved) return NextResponse.json({ status: 'pending' })
    const hasPayment = !!shop.stripeId || (!!shop.planExpiresAt && new Date(shop.planExpiresAt) > new Date())
    if (!hasPayment) return NextResponse.json({ status: 'unpaid', plan: shop.plan })
    return NextResponse.json({ status: 'approved' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
