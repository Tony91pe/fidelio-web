import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyCronSecret } from '@/lib/cronAuth'
import { getResendClient } from '@/lib/email'

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0D0D1A;font-family:system-ui,sans-serif;color:#fff">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px">
<table width="560" cellpadding="0" cellspacing="0" style="background:#161627;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
  <tr><td style="background:linear-gradient(135deg,#6C3DF4,#4F28C4);padding:32px 40px;text-align:center">
    <span style="font-size:28px;font-weight:800;color:#fff">● Fidelio</span>
  </td></tr>
  <tr><td style="padding:40px">${content}</td></tr>
  <tr><td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center">
    <p style="font-size:12px;color:rgba(255,255,255,0.3);margin:0">
      © 2026 Fidelio · <a href="https://www.getfidelio.app" style="color:#A78BFA;text-decoration:none">getfidelio.app</a>
    </p>
  </td></tr>
</table></td></tr></table></body></html>`
}

export async function GET(req: Request) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const resend = getResendClient()
  const now = new Date()
  let sent = 0

  const in30 = new Date(now)
  in30.setDate(in30.getDate() + 30)
  const in30start = new Date(in30)
  in30start.setHours(0, 0, 0, 0)
  const in30end = new Date(in30)
  in30end.setHours(23, 59, 59, 999)

  const in7 = new Date(now)
  in7.setDate(in7.getDate() + 7)
  const in7start = new Date(in7)
  in7start.setHours(0, 0, 0, 0)
  const in7end = new Date(in7)
  in7end.setHours(23, 59, 59, 999)

  const expiring = await db.shop.findMany({
    where: {
      plan: { not: 'STARTER' },
      paddleCustomerId: null,
      planExpiresAt: { not: null },
      OR: [
        { planExpiresAt: { gte: in30start, lte: in30end } },
        { planExpiresAt: { gte: in7start, lte: in7end } },
      ],
    },
    select: { id: true, name: true, planExpiresAt: true, isFounder: true, ownerEmail: true },
  })

  for (const shop of expiring) {
    if (!shop.planExpiresAt || !shop.ownerEmail) continue

    const daysLeft = Math.ceil((new Date(shop.planExpiresAt).getTime() - now.getTime()) / 86400000)
    const isUrgent = daysLeft <= 7
    const label = shop.isFounder ? 'fondatore' : 'di prova'

    try {
      await resend.emails.send({
        from: 'Fidelio <noreply@getfidelio.app>',
        to: shop.ownerEmail,
        subject: isUrgent
          ? `⚠️ Il tuo piano ${label} scade tra ${daysLeft} giorni — abbonati ora`
          : `Il tuo piano ${label} scade tra 30 giorni`,
        html: baseTemplate(`
          <h2 style="margin:0 0 16px;font-size:22px;font-weight:800">
            ${isUrgent ? '⚠️' : '⏰'} Il tuo piano scade tra ${daysLeft} giorn${daysLeft === 1 ? 'o' : 'i'}
          </h2>
          <p style="color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 24px">
            Ciao! Il tuo piano ${label} per <strong style="color:#fff">${shop.name}</strong> scade il
            <strong style="color:#fff">${new Date(shop.planExpiresAt).toLocaleDateString('it-IT')}</strong>.
          </p>
          ${isUrgent ? `
          <div style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:16px;margin-bottom:24px">
            <p style="color:#fca5a5;margin:0;font-weight:700">Dopo la scadenza perderai accesso alla dashboard e alle funzionalità avanzate.</p>
          </div>` : `
          <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:16px;margin-bottom:24px">
            <p style="color:#fbbf24;margin:0">Hai ancora 30 giorni — ma ti consigliamo di attivare l'abbonamento adesso per non rischiare interruzioni.</p>
          </div>`}
          <a href="https://www.getfidelio.app/dashboard/upgrade"
             style="display:inline-block;background:#6C3DF4;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px">
            Abbonati ora →
          </a>
          <p style="color:rgba(255,255,255,0.4);font-size:13px;margin-top:24px">
            Hai domande? Scrivi a <a href="mailto:support@getfidelio.app" style="color:#A78BFA">support@getfidelio.app</a>
          </p>
        `),
      })
      sent++
    } catch {}
  }

  return NextResponse.json({ ok: true, sent })
}
