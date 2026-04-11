import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getResendClient } from '@/lib/email'

const resend = getResendClient()

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })
  const { subject, body, segment } = await req.json()
  const ago30 = new Date(Date.now()-30*24*60*60*1000)
  let customers
  if (segment==='atrisk') customers = await db.customer.findMany({where:{shopId:shop.id,lastVisitAt:{lt:ago30}}})
  else if (segment==='active') customers = await db.customer.findMany({where:{shopId:shop.id,lastVisitAt:{gte:ago30}}})
  else customers = await db.customer.findMany({where:{shopId:shop.id}})
  let sent = 0
  for (const c of customers) {
    try {
      await resend.emails.send({
        from: shop.name + ' via Fidelio <noreply@resend.dev>',
        to: c.email, subject,
        html: '<div style="font-family:sans-serif;padding:2rem"><p>Ciao ' + c.name + '!</p><div>' + body + '</div><p style="color:#555;font-size:0.85rem;margin-top:2rem">Hai ' + c.points + ' punti da usare.</p></div>',
      })
      sent++
    } catch (error) {
      console.error(`Failed to send email to ${c.email}:`, error)
    }
  }
  return NextResponse.json({ sent, total: customers.length })
}
