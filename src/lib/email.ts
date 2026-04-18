import { Resend } from 'resend'
import { createHmac } from 'crypto'

const FROM = 'Fidelio <noreply@getfidelio.app>'

export function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY)
}

function unsubscribeUrl(email: string) {
  const secret = process.env.JWT_SECRET || 'fidelio-secret'
  const token = createHmac('sha256', secret).update(email).digest('hex').slice(0, 16)
  return `https://www.getfidelio.app/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
}

function baseTemplate(content: string, { preheader = '', unsubscribeEmail = '' }: { preheader?: string; unsubscribeEmail?: string } = {}) {
  return `<!DOCTYPE html>
<html lang="it" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <title>Fidelio</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0D0D1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D0D1A;padding:32px 16px">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">

      <!-- LOGO HEADER -->
      <tr><td style="background:linear-gradient(135deg,#4A1FB8 0%,#6C3DF4 50%,#8B5CF6 100%);border-radius:16px 16px 0 0;padding:28px 40px;text-align:center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 14px;display:inline-block">
                <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px">F</span>
              </td>
              <td style="padding-left:10px;vertical-align:middle">
                <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px">Fidelio</span>
              </td>
            </tr></table>
          </td>
        </tr></table>
      </td></tr>

      <!-- BODY -->
      <tr><td style="background:#13131F;padding:40px;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07)">
        ${content}
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#0D0D1A;border-radius:0 0 16px 16px;border:1px solid rgba(255,255,255,0.06);border-top:none;padding:24px 40px;text-align:center">
        <p style="margin:0 0 8px;font-size:12px;color:rgba(255,255,255,0.25)">
          © 2026 Fidelio · Servizio di Antonio Piersante
        </p>
        <p style="margin:0 0 8px;font-size:12px">
          <a href="https://www.getfidelio.app" style="color:#A78BFA;text-decoration:none">getfidelio.app</a>
          &nbsp;·&nbsp;
          <a href="https://www.getfidelio.app/privacy" style="color:rgba(255,255,255,0.3);text-decoration:none">Privacy</a>
          &nbsp;·&nbsp;
          <a href="https://www.getfidelio.app/termini" style="color:rgba(255,255,255,0.3);text-decoration:none">Termini</a>
        </p>
        ${unsubscribeEmail ? `<p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2)">Non vuoi più ricevere email? <a href="${unsubscribeUrl(unsubscribeEmail)}" style="color:rgba(255,255,255,0.35);text-decoration:underline">Disiscriviti</a></p>` : ''}
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`
}

function ctaButton(text: string, href: string, color = '#6C3DF4') {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr>
    <td style="border-radius:12px;background:${color}">
      <a href="${href}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px">${text}</a>
    </td>
  </tr></table>`
}

function pointsBadge(points: number, label = 'punti accreditati') {
  return `<div style="background:rgba(108,61,244,0.12);border:1px solid rgba(108,61,244,0.3);border-radius:16px;padding:24px;text-align:center;margin:20px 0">
    <div style="font-size:52px;font-weight:900;color:#A78BFA;line-height:1;margin-bottom:6px">${points.toLocaleString('it-IT')}</div>
    <div style="color:rgba(255,255,255,0.5);font-size:13px;font-weight:500">${label}</div>
  </div>`
}

export async function sendWelcomeEmail(to: string, customerName: string, shopName: string, points: number) {
  const resend = getResendClient()
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Benvenuto da ${shopName}! 🎉 Hai ${points} punti di benvenuto`,
    html: baseTemplate(`
      <h2 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2">Benvenuto, ${customerName}! 🎉</h2>
      <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6">
        Sei entrato nel programma fedeltà di <strong style="color:#ffffff">${shopName}</strong>.<br>
        Come regalo di benvenuto hai già <strong style="color:#A78BFA">${points} punti</strong> sul tuo account!
      </p>
      ${pointsBadge(points, 'punti di benvenuto')}
      <p style="margin:0 0 6px;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6">
        Ad ogni visita accumuli nuovi punti. Quando ne hai abbastanza puoi riscattare premi esclusivi direttamente in negozio.
      </p>
    `, { preheader: `Hai ${points} punti di benvenuto da ${shopName}!`, unsubscribeEmail: to }),
  })
}

export async function sendWinbackEmail(to: string, customerName: string, shopName: string, points: number, days: number) {
  const resend = getResendClient()
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${customerName}, ci manchi! 👋 I tuoi ${points} punti ti aspettano`,
    html: baseTemplate(`
      <h2 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2">Ci manchi, ${customerName}! 👋</h2>
      <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6">
        Sono passati <strong style="color:#ffffff">${days} giorni</strong> dall'ultima tua visita da <strong style="color:#ffffff">${shopName}</strong>.<br>
        I tuoi punti sono ancora lì che ti aspettano.
      </p>
      ${pointsBadge(points, 'punti disponibili')}
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6">
        Torna a trovarci — ogni visita vale punti extra e ti avvicina al prossimo premio.
      </p>
    `, { preheader: `${days} giorni di assenza — i tuoi ${points} punti ti aspettano da ${shopName}`, unsubscribeEmail: to }),
  })
}

export async function sendBirthdayEmail(to: string, customerName: string, shopName: string, bonusPoints: number) {
  const resend = getResendClient()
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Buon compleanno ${customerName}! 🎂 Un regalo da ${shopName}`,
    html: baseTemplate(`
      <h2 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2">Buon compleanno! 🎂</h2>
      <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6">
        Ciao <strong style="color:#ffffff">${customerName}</strong>,<br>
        tutto il team di <strong style="color:#ffffff">${shopName}</strong> ti augura una splendida giornata!<br>
        Per festeggiare insieme ti abbiamo regalato dei punti extra.
      </p>
      <div style="background:linear-gradient(135deg,rgba(108,61,244,0.18),rgba(255,107,53,0.12));border:1px solid rgba(108,61,244,0.3);border-radius:16px;padding:24px;text-align:center;margin:20px 0">
        <div style="font-size:40px;margin-bottom:10px">🎁</div>
        <div style="font-size:48px;font-weight:900;color:#A78BFA;line-height:1;margin-bottom:6px">+${bonusPoints}</div>
        <div style="color:rgba(255,255,255,0.5);font-size:13px;font-weight:500">punti regalo di compleanno</div>
      </div>
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6">
        Vieni a trovarci e usa i tuoi punti per qualcosa di speciale. Sei il benvenuto! 🥂
      </p>
    `, { preheader: `+${bonusPoints} punti di compleanno da ${shopName} — buon compleanno!`, unsubscribeEmail: to }),
  })
}

export async function sendRewardEmail(to: string, customerName: string, shopName: string, rewardTitle: string) {
  const resend = getResendClient()
  return resend.emails.send({
    from: FROM,
    to,
    subject: `🎁 Premio sbloccato! "${rewardTitle}" da ${shopName}`,
    html: baseTemplate(`
      <h2 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2">Hai sbloccato un premio! 🎁</h2>
      <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6">
        Complimenti <strong style="color:#ffffff">${customerName}</strong>!<br>
        Hai accumulato abbastanza punti da <strong style="color:#ffffff">${shopName}</strong> per riscattare:
      </p>
      <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:16px;padding:20px;text-align:center;margin:20px 0">
        <div style="font-size:36px;margin-bottom:8px">🏆</div>
        <div style="font-size:20px;font-weight:800;color:#10B981">${rewardTitle}</div>
      </div>
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6">
        Mostra questa email in negozio oppure usa l'app Fidelio per riscattare il tuo premio.
      </p>
    `, { preheader: `Hai sbloccato "${rewardTitle}" da ${shopName}!`, unsubscribeEmail: to }),
  })
}

export async function sendGiftCardEmail(to: string, recipientName: string, shopName: string, code: string, value: number | null, description: string | null, dedica: string | null) {
  const resend = getResendClient()
  const valueStr = value != null ? `€${value.toFixed(2)}` : description || 'Carta Regalo'
  return resend.emails.send({
    from: FROM,
    to,
    subject: `🎁 Hai ricevuto una carta regalo da ${shopName}!`,
    html: baseTemplate(`
      <h2 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2">Hai ricevuto una carta regalo! 🎁</h2>
      <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6">
        Ciao <strong style="color:#ffffff">${recipientName}</strong>,<br>
        <strong style="color:#ffffff">${shopName}</strong> ti ha inviato una carta regalo.
      </p>
      ${dedica ? `<div style="border-left:3px solid #6C3DF4;padding:12px 16px;margin:0 0 20px;background:rgba(108,61,244,0.08);border-radius:0 8px 8px 0"><p style="margin:0;font-size:14px;color:rgba(255,255,255,0.7);font-style:italic">"${dedica}"</p></div>` : ''}
      <div style="background:linear-gradient(135deg,#2d1b69,#1a0a4e);border:1px solid rgba(108,61,244,0.4);border-radius:16px;padding:24px;margin:20px 0;text-align:center">
        <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">Il tuo codice</div>
        <div style="font-family:monospace;font-size:28px;font-weight:800;color:#c4b5fd;letter-spacing:4px">${code.match(/.{1,4}/g)?.join('  ') ?? code}</div>
        ${description ? `<div style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:10px">${description}</div>` : ''}
        ${value != null ? `<div style="font-size:22px;font-weight:800;color:#A78BFA;margin-top:8px">${valueStr}</div>` : ''}
      </div>
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6">
        Mostra il codice in negozio da <strong style="color:rgba(255,255,255,0.6)">${shopName}</strong> per utilizzare la carta regalo.
      </p>
    `, { preheader: `Carta regalo ${valueStr} da ${shopName} — codice: ${code}` }),
  })
}

export async function sendEmail({ to, subject, data }: {
  to: string
  subject: string
  template?: string
  data: Record<string, unknown>
}) {
  const resend = getResendClient()
  return resend.emails.send({
    from: FROM,
    to,
    subject,
    html: baseTemplate(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#ffffff">${data.title || subject}</h2>
      <p style="color:rgba(255,255,255,0.7);line-height:1.7;margin:0;font-size:15px">${data.message || ''}</p>
    `),
  })
}
