import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getResendClient } from '@/lib/email'
import { logEvent } from '@/lib/logging'

const FROM = 'Fidelio <noreply@getfidelio.app>'

function wrap(content: string, preheader = '') {
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0D0D1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#ffffff">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden">${preheader}</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D1A;padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="background:linear-gradient(135deg,#4A1FB8,#6C3DF4);border-radius:16px 16px 0 0;padding:24px 40px;text-align:center">
  <span style="font-size:20px;font-weight:900;color:#fff">F</span>&nbsp;<span style="font-size:20px;font-weight:800;color:#fff">Fidelio</span>
</td></tr>
<tr><td style="background:#13131F;padding:36px 40px;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07)">
${content}
</td></tr>
<tr><td style="background:#0D0D1A;border-radius:0 0 16px 16px;border:1px solid rgba(255,255,255,0.06);border-top:none;padding:20px 40px;text-align:center">
  <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25)">© 2026 Fidelio · <a href="https://www.getfidelio.app" style="color:#A78BFA;text-decoration:none">getfidelio.app</a></p>
</td></tr>
</table></td></tr></table></body></html>`
}

function daysSince(date: Date) {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
}

const SEQUENCES = [
  {
    day: 1,
    key: 'onboarding_day1',
    subject: '🚀 Come ottenere il primo cliente con Fidelio',
    getBody: (shopName: string) => `
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#fff">Il tuo negozio è pronto! 🎉</h2>
      <p style="color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 20px">
        Ciao! Il negozio <strong style="color:#fff">${shopName}</strong> è attivo su Fidelio.<br>
        Ecco come acquisire il tuo primo cliente fedele oggi stesso:
      </p>
      <div style="margin:0 0 16px">
        ${step('1', '🖨️ Stampa il QR code', 'Vai su <strong>Dashboard → QR Code</strong> e stampa o mostra il QR alla cassa. I clienti lo scansionano e si registrano in 10 secondi.', '#6C3DF4')}
        ${step('2', '🎁 Crea il primo premio', 'Vai su <strong>Dashboard → Premi</strong> e crea un incentivo allettante. Es: "Caffè gratis ogni 10 visite". I clienti con un obiettivo tornano.', '#10B981')}
        ${step('3', '👋 Presenta Fidelio ai clienti', 'Dì ai tuoi clienti: "Con Fidelio accumuli punti ad ogni visita e guadagni premi". La parola del negoziante vale più di qualsiasi pubblicità.', '#F59E0B')}
      </div>
      <a href="https://www.getfidelio.app/dashboard" style="display:inline-block;background:#6C3DF4;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700">Vai alla dashboard →</a>
    `,
  },
  {
    day: 3,
    key: 'onboarding_day3',
    subject: '💡 3 trucchi per aumentare le visite del 30%',
    getBody: (shopName: string) => `
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#fff">Come sfruttare al massimo Fidelio 💡</h2>
      <p style="color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 20px">
        Sono passati 3 giorni. Ecco 3 strategie che i negozi di successo usano con Fidelio:
      </p>
      <div style="margin:0 0 16px">
        ${tip('🎯', 'Premio a sorpresa', 'Ogni tanto assegna punti doppi senza preavviso. I clienti che li ricevono diventano i tuoi migliori ambassador.')}
        ${tip('📱', 'Usa le automazioni', 'Fidelio invia automaticamente email di compleanno e messaggi di rientro a chi non torna. Attivale in <strong>Dashboard → Automazioni</strong>.')}
        ${tip('📊', 'Controlla i clienti a rischio', 'In <strong>Dashboard → Analytics</strong> vedi chi non torna da 30+ giorni. Crea una campagna personalizzata per riportarli.')}
      </div>
      <a href="https://www.getfidelio.app/dashboard/automations" style="display:inline-block;background:#6C3DF4;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700">Attiva le automazioni →</a>
    `,
  },
  {
    day: 7,
    key: 'onboarding_day7',
    subject: '📊 Com\'è andato il tuo primo mese? + consiglio pro',
    getBody: (shopName: string) => `
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#fff">Una settimana con Fidelio 🗓️</h2>
      <p style="color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 20px">
        Hai completato la tua prima settimana! Ecco il consiglio pro che fa la differenza:
      </p>
      <div style="background:rgba(108,61,244,0.12);border:1px solid rgba(108,61,244,0.3);border-radius:12px;padding:20px;margin:0 0 20px">
        <p style="font-size:13px;font-weight:700;color:#A78BFA;margin:0 0 8px">💎 CONSIGLIO PRO</p>
        <p style="color:rgba(255,255,255,0.8);line-height:1.7;margin:0">
          I negozi con il <strong style="color:#fff">tasso di retention più alto</strong> hanno una cosa in comune:
          mandano un messaggio personalizzato ai clienti che non tornano dopo 2 settimane.
          Vai in <strong style="color:#fff">Dashboard → Campagne</strong> e crea il tuo primo messaggio di rientro.
        </p>
      </div>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0 0 16px">
        Hai domande o vuoi un consiglio personalizzato? Rispondi a questa email — leggo tutti i messaggi.
      </p>
      <a href="https://www.getfidelio.app/dashboard/campaigns" style="display:inline-block;background:#6C3DF4;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700">Crea la tua campagna →</a>
    `,
  },
]

function step(num: string, title: string, desc: string, color: string) {
  return `<div style="display:flex;gap:12px;margin-bottom:14px;align-items:flex-start">
    <div style="min-width:28px;height:28px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:white">${num}</div>
    <div><p style="font-weight:700;margin:0 0 3px;color:#fff">${title}</p><p style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.5;margin:0">${desc}</p></div>
  </div>`
}

function tip(icon: string, title: string, desc: string) {
  return `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px;margin-bottom:10px">
    <p style="font-weight:700;margin:0 0 4px;color:#fff">${icon} ${title}</p>
    <p style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.5;margin:0">${desc}</p>
  </div>`
}

export async function GET(req: Request) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const resend = getResendClient()
  let sent = 0

  const shops = await db.shop.findMany({
    where: { approved: true, ownerEmail: { not: null } },
    select: { id: true, name: true, ownerEmail: true, createdAt: true },
  })

  for (const shop of shops) {
    if (!shop.ownerEmail) continue
    const age = daysSince(shop.createdAt)

    for (const seq of SEQUENCES) {
      if (age < seq.day) continue
      if (age > seq.day + 2) continue // finestra di 3 giorni

      // Controlla se già inviata
      const alreadySent = await db.log.findFirst({
        where: { shopId: shop.id, eventType: 'ONBOARDING_EMAIL', action: seq.key },
      })
      if (alreadySent) continue

      try {
        await resend.emails.send({
          from: FROM,
          to: shop.ownerEmail,
          subject: seq.subject,
          html: wrap(seq.getBody(shop.name)),
        })

        await logEvent({
          eventType: 'ONBOARDING_EMAIL',
          shopId: shop.id,
          action: seq.key,
          metadata: { day: seq.day, email: shop.ownerEmail },
        })
        sent++
      } catch (err) {
        console.error(`[Onboarding] Errore invio ${seq.key} a ${shop.ownerEmail}:`, err)
      }
    }
  }

  return NextResponse.json({ ok: true, sent })
}
