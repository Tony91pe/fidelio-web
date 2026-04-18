import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const PADDLE_API = process.env.PADDLE_SANDBOX === 'true'
  ? 'https://sandbox-api.paddle.com'
  : 'https://api.paddle.com'

const priceMap: Record<string, string | undefined> = {
  starter: process.env.PADDLE_STARTER_PRICE_ID,
  growth:  process.env.PADDLE_GROWTH_PRICE_ID,
  pro:     process.env.PADDLE_PRO_PRICE_ID,
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  const { plan } = await req.json()
  const priceId = priceMap[plan?.toLowerCase()]
  if (!priceId) return NextResponse.json({ error: 'Piano non valido' }, { status: 400 })

  const res = await fetch(`${PADDLE_API}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ price_id: priceId, quantity: 1 }],
      checkout: {
        url: process.env.NEXT_PUBLIC_APP_URL + '/dashboard?upgraded=true',
      },
      custom_data: { shopId: shop.id, plan: plan.toUpperCase() },
    }),
  })

  const data = await res.json()
  const checkoutUrl = data?.data?.checkout?.url

  if (!checkoutUrl) {
    console.error('[paddle/checkout] errore:', JSON.stringify(data))
    return NextResponse.json({ error: 'Errore Paddle' }, { status: 500 })
  }

  return NextResponse.json({ url: checkoutUrl })
}
