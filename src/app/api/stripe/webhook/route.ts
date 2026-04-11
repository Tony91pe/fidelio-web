import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook invalido' }, { status: 400 })
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const metadata = (session as any).metadata
    const { shopId, plan } = metadata
    await db.shop.update({
      where: { id: shopId },
      data: {
        plan: plan.toUpperCase() as 'GROWTH' | 'PRO',
        stripeId: (session as any).customer as string,
      }
    })
  }
  return NextResponse.json({ ok: true })
}
