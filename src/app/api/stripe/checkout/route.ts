import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { plan } = await req.json()

  const priceId = plan === 'growth'
    ? process.env.STRIPE_GROWTH_PRICE_ID
    : process.env.STRIPE_PRO_PRICE_ID

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: process.env.NEXT_PUBLIC_APP_URL + '/dashboard?success=true',
    cancel_url: process.env.NEXT_PUBLIC_APP_URL + '/dashboard/upgrade',
    metadata: { userId, plan },
  })

  return NextResponse.json({ url: session.url })
}