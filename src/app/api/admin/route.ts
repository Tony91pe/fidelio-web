import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Resend } from 'resend'
import { clearMapCache } from '@/lib/mapService'
import { logEvent } from '@/lib/logging'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID
const resend = new Resend(process.env.RESEND_API_KEY)

async function requireAdmin() {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) return false
  return true
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const [shops, totalCustomers, totalVisits, pwaCustomers, otpCodes] = await Promise.all([
    db.shop.findMany({
      include: { _count: { select: { customers: true, visits: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    db.customer.count(),
    db.visit.count(),
    db.customer.findMany({
      distinct: ['email'],
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { id: true, email: true, name: true, code: true, points: true, totalVisits: true, createdAt: true }
    }),
    db.otpCode.count(),
  ])

  return NextResponse.json({ shops, totalCustomers, totalVisits, pwaCustomers, otpCodes })
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { action, target, subject, body } = await req.json()

  if (action === 'sendEmail') {
    const shops = await db.shop.findMany({ select: { ownerId: true, plan: true, approved: true } })

    let filtered = shops
    if (target === 'paying') filtered = shops.filter(s => s.plan !== 'STARTER')
    if (target === 'pending') filtered = shops.filter(s => !s.approved)

    const ownerIds = [...new Set(filtered.map(s => s.ownerId))]

    const clerk = await clerkClient()
    const emails: string[] = []
    for (const userId of ownerIds) {
      try {
        const user = await clerk.users.getUser(userId)
        const email = user.emailAddresses[0]?.emailAddress
        if (email) emails.push(email)
      } catch {}
    }

    if (emails.length > 0) {
      await resend.emails.send({
        from: 'Fidelio <noreply@fidelio.it>',
        to: emails,
        subject,
        text: body,
      })
    }

    return NextResponse.json({ ok: true, sent: emails.length })
  }

  return NextResponse.json({ error: 'Azione non valida' }, { status: 400 })
}

export async function PATCH(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { shopId, action, plan, months } = await req.json()

  if (action === 'changePlan') {
    clearMapCache()
    const { userId } = await auth()
    await logEvent({ eventType: 'PLAN_CHANGED_ADMIN', userId: userId ?? undefined, shopId, action: `Piano cambiato a ${plan}`, metadata: { plan } })
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { plan } }))
  }
  if (action === 'giftTrial') {
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 6)
    const { userId } = await auth()
    await logEvent({ eventType: 'TRIAL_ACTIVATED', userId: userId ?? undefined, shopId, action: 'Trial fondatore 6 mesi regalato', metadata: { plan: 'GROWTH', months: 6 } })
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { plan: 'GROWTH', planExpiresAt: expiresAt } }))
  }
  if (action === 'giftMonths') {
    const giftedPlan = ['STARTER', 'GROWTH', 'PRO'].includes(plan) ? plan : 'GROWTH'
    const shop = await db.shop.findUnique({ where: { id: shopId } })
    const base = shop?.planExpiresAt && shop.planExpiresAt > new Date() ? shop.planExpiresAt : new Date()
    const planExpiresAt = new Date(base)
    planExpiresAt.setMonth(planExpiresAt.getMonth() + months)
    const { userId } = await auth()
    await logEvent({ eventType: 'TRIAL_ACTIVATED', userId: userId ?? undefined, shopId, action: `Regalati ${months} mesi ${giftedPlan}`, metadata: { plan: giftedPlan, months } })
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { planExpiresAt, plan: giftedPlan } }))
  }
  if (action === 'suspend') {
    clearMapCache()
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { suspended: true } }))
  }
  if (action === 'unsuspend') {
    clearMapCache()
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { suspended: false } }))
  }
  if (action === 'approve') {
    clearMapCache()
    const { userId } = await auth()
    const trial14 = new Date()
    trial14.setDate(trial14.getDate() + 14)
    const shop = await db.shop.update({ where: { id: shopId }, data: { approved: true, planExpiresAt: trial14 } })
    await logEvent({ eventType: 'SHOP_APPROVED', userId: userId ?? undefined, shopId, action: 'Negozio approvato', metadata: {} })
    if (shop.ownerEmail) {
      try {
        await resend.emails.send({
          from: 'Fidelio <noreply@getfidelio.app>',
          to: shop.ownerEmail,
          subject: `🎉 ${shop.name} è stato approvato su Fidelio!`,
          html: `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0D0D1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D1A;padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="background:linear-gradient(135deg,#4A1FB8,#6C3DF4);border-radius:16px 16px 0 0;padding:28px 40px;text-align:center">
  <span style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px">F</span>&nbsp;<span style="font-size:22px;font-weight:800;color:#fff">Fidelio</span>
</td></tr>
<tr><td style="background:#13131F;padding:40px;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07)">
  <h2 style="margin:0 0 12px;font-size:26px;font-weight:800;color:#fff">Il tuo negozio è live! 🎉</h2>
  <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6">Complimenti! <strong style="color:#fff">${shop.name}</strong> è stato approvato e il programma fedeltà è attivo.</p>
  <div style="background:rgba(108,61,244,0.12);border:1px solid rgba(108,61,244,0.3);border-radius:12px;padding:20px;margin:0 0 24px">
    <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#A78BFA">I prossimi 3 passi:</p>
    <p style="margin:0 0 10px;font-size:14px;color:rgba(255,255,255,0.7)">🖨️ <strong style="color:#fff">Stampa il QR code</strong> — vai su Dashboard → Scanner e stampalo per la cassa</p>
    <p style="margin:0 0 10px;font-size:14px;color:rgba(255,255,255,0.7)">🎁 <strong style="color:#fff">Crea il primo premio</strong> — va in Dashboard → Premi e aggiungi un incentivo</p>
    <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.7)">👋 <strong style="color:#fff">Presenta Fidelio ai clienti</strong> — mostra il QR e spiega come funziona</p>
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto"><tr>
    <td style="border-radius:12px;background:#6C3DF4"><a href="https://www.getfidelio.app/dashboard" style="display:inline-block;padding:14px 28px;color:#fff;font-size:15px;font-weight:700;text-decoration:none">Vai alla dashboard →</a></td>
  </tr></table>
</td></tr>
<tr><td style="background:#0D0D1A;border-radius:0 0 16px 16px;border:1px solid rgba(255,255,255,0.06);border-top:none;padding:20px 40px;text-align:center">
  <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25)">© 2026 Fidelio · <a href="https://www.getfidelio.app" style="color:#A78BFA;text-decoration:none">getfidelio.app</a></p>
</td></tr>
</table></td></tr></table></body></html>`,
        })
      } catch {}
    }
    return NextResponse.json(shop)
  }
  if (action === 'unapprove') {
    clearMapCache()
    return NextResponse.json(await db.shop.update({ where: { id: shopId }, data: { approved: false } }))
  }
  if (action === 'forceLogout') {
    const shop = await db.shop.findUnique({ where: { id: shopId } })
    if (shop?.ownerId) {
      try {
        await fetch(`https://api.clerk.com/v1/users/${shop.ownerId}/sessions`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
        })
      } catch { /* ignora errori Clerk */ }
    }
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Azione non valida' }, { status: 400 })
}

export async function DELETE(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { shopId, deleteCustomers = true } = await req.json()

  // Elimina sempre visite, premi, campagne, gift card, offerte del negozio
  await db.visit.deleteMany({ where: { shopId } })
  await db.redemption.deleteMany({ where: { reward: { shopId } } })
  await db.reward.deleteMany({ where: { shopId } })
  await db.campaign.deleteMany({ where: { shopId } })
  await db.giftCard.deleteMany({ where: { shopId } })
  await db.offer.deleteMany({ where: { shopId } })

  if (deleteCustomers) {
    // Elimina anche tutti i clienti associati al negozio
    await db.customer.deleteMany({ where: { shopId } })
  } else {
    // Mantieni i clienti nel DB ma scollega il riferimento al negozio
    // (shopId diventa null — i clienti rimangono accessibili come archivio)
    await db.customer.updateMany({ where: { shopId }, data: { shopId: null as unknown as string } })
  }

  clearMapCache()
  await db.shop.delete({ where: { id: shopId } })
  return NextResponse.json({ ok: true })
}