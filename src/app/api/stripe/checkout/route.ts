import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  const { plan } = await req.json()

  const priceMap: Record<string, string | undefined> = {
    starter: process.env.STRIPE_STARTER_PRICE_ID,
    growth: process.env.STRIPE_GROWTH_PRICE_ID,
    pro: process.env.STRIPE_PRO_PRICE_ID,
  }

  const priceId = priceMap[plan]
  if (!priceId) return NextResponse.json({ error: 'Piano non valido' }, { status: 400 })

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: process.env.NEXT_PUBLIC_APP_URL + '/dashboard?upgraded=true',
    cancel_url: process.env.NEXT_PUBLIC_APP_URL + '/dashboard/upgrade',
    metadata: { shopId: shop.id, plan: plan.toUpperCase() },
  })

  return NextResponse.json({ url: session.url })
}