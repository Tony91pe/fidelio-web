import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const VARIANT_MAP: Record<string, string> = {
  starter: '1569256',
  growth:  '1569260',
  pro:     '1569263',
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  const { plan } = await req.json()
  const variantId = VARIANT_MAP[plan?.toLowerCase()]
  if (!variantId) return NextResponse.json({ error: 'Piano non valido' }, { status: 400 })

  const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            custom: { shopId: shop.id, plan: plan.toUpperCase() },
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
          },
        },
        relationships: {
          store:   { data: { type: 'stores',   id: process.env.LEMONSQUEEZY_STORE_ID } },
          variant: { data: { type: 'variants', id: variantId } },
        },
      },
    }),
  })

  const data = await res.json()
  const url = data?.data?.attributes?.url

  if (!url) {
    console.error('[ls/checkout] errore:', JSON.stringify(data))
    return NextResponse.json({ error: 'Errore LemonSqueezy' }, { status: 500 })
  }

  return NextResponse.json({ url })
}
