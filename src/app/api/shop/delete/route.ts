import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) return NextResponse.json({ error: 'Negozio non trovato' }, { status: 404 })

  // Recupera ID clienti per eliminare le relazioni dipendenti
  const customers = await db.customer.findMany({ where: { shopId: shop.id }, select: { id: true } })
  const customerIds = customers.map(c => c.id)

  // Elimina tutti i dati del negozio nell'ordine corretto (rispetta FK)
  await db.$transaction([
    db.redemption.deleteMany({ where: { customerId: { in: customerIds } } }),
    db.visit.deleteMany({ where: { shopId: shop.id } }),
    db.customer.deleteMany({ where: { shopId: shop.id } }),
    db.reward.deleteMany({ where: { shopId: shop.id } }),
    db.campaign.deleteMany({ where: { shopId: shop.id } }),
    db.giftCard.deleteMany({ where: { shopId: shop.id } }),
    db.offer.deleteMany({ where: { shopId: shop.id } }),
    db.shop.delete({ where: { id: shop.id } }),
  ])

  // Elimina utente Clerk
  const clerk = await clerkClient()
  await clerk.users.deleteUser(userId)

  return NextResponse.json({ ok: true })
}
