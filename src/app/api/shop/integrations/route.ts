import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({
    where: { ownerId: userId },
    select: { id: true, pointsPerEuro: true, website: true },
  })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  const widgetSnippet = `<iframe
  src="https://www.getfidelio.app/widget/${shop.id}"
  width="100%"
  height="220"
  frameborder="0"
  style="border-radius:12px;border:1px solid #e5e7eb;"
  title="Programma Fedeltà"
></iframe>`

  return NextResponse.json({
    shopId: shop.id,
    pointsPerEuro: shop.pointsPerEuro ?? 1,
    website: shop.website,
    woocommerceWebhookUrl: 'https://www.getfidelio.app/api/webhooks/woocommerce',
    woocommerceWebhookSecret: process.env.WOOCOMMERCE_WEBHOOK_SECRET ?? '',
    prestashopWebhookUrl: 'https://www.getfidelio.app/api/webhooks/prestashop',
    prestashopWebhookSecret: process.env.PRESTASHOP_WEBHOOK_SECRET ?? '',
    widgetSnippet,
  })
}
