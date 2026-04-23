import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendBirthdayEmail } from '@/lib/email'
import { verifyCronSecret } from '@/lib/cronAuth'

const BIRTHDAY_BONUS = 50

export async function GET(req: Request) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()

  const customers = await db.customer.findMany({
    where: {
      birthday: { not: null },
      shopId: { not: null },
      shop: { plan: { in: ['GROWTH', 'PRO'] }, birthdayEmailEnabled: true },
    },
    include: { shop: { select: { id: true, name: true } } },
  })

  const birthdayCustomers = customers.filter(c => {
    if (!c.birthday) return false
    const b = new Date(c.birthday)
    return b.getMonth() + 1 === month && b.getDate() === day
  })

  let sent = 0
  for (const customer of birthdayCustomers) {
    if (!customer.shopId || !customer.shop) continue
    try {
      await db.$transaction([
        db.customer.update({
          where: { id: customer.id },
          data: { points: { increment: BIRTHDAY_BONUS } },
        }),
        db.visit.create({
          data: {
            customerId: customer.id,
            shopId: customer.shopId,
            points: BIRTHDAY_BONUS,
            note: 'Bonus compleanno 🎂',
          },
        }),
      ])
      await sendBirthdayEmail(customer.email, customer.name, customer.shop.name, BIRTHDAY_BONUS)
      sent++
    } catch {}
  }

  return NextResponse.json({ ok: true, sent })
}
