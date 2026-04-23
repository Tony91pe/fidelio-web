import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import WidgetForm from './WidgetForm'

export default async function WidgetPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params
  const shop = await db.shop.findUnique({
    where: { id: shopId },
    select: { id: true, name: true, approved: true },
  })
  if (!shop || !shop.approved) notFound()

  return (
    <html lang="it">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #fff; font-family: system-ui, sans-serif; }
        `}</style>
      </head>
      <body>
        <WidgetForm shopId={shop.id} shopName={shop.name} />
      </body>
    </html>
  )
}
