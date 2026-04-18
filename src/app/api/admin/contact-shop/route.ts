import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getResendClient } from '@/lib/email'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { shopName, ownerEmail } = await req.json()
  if (!ownerEmail) return NextResponse.json({ error: 'Email mancante' }, { status: 400 })

  const resend = getResendClient()

  try {
  const result = await resend.emails.send({
    from: 'Fidelio <noreply@getfidelio.app>',
    to: ownerEmail,
    subject: `Completa il tuo abbonamento Fidelio — ${shopName}`,
    html: `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0D0D1A;font-family:system-ui,sans-serif;color:#fff">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px">
<table width="560" cellpadding="0" cellspacing="0" style="background:#161627;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
  <tr><td style="background:linear-gradient(135deg,#6C3DF4,#4F28C4);padding:32px 40px;text-align:center">
    <span style="font-size:28px;font-weight:800;color:#fff">● Fidelio</span>
  </td></tr>
  <tr><td style="padding:40px">
    <h2 style="margin:0 0 16px;font-size:22px;font-weight:800">Ciao! 👋</h2>
    <p style="color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 16px">
      Il tuo negozio <strong style="color:#fff">${shopName}</strong> è registrato su Fidelio ma non hai ancora un abbonamento attivo.
    </p>
    <p style="color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 28px">
      Per continuare ad usare la dashboard e tutte le funzionalità (punti fedeltà, QR dinamico, gift card e molto altro) scegli il piano più adatto a te.
    </p>
    <div style="background:rgba(108,61,244,0.1);border:1px solid rgba(108,61,244,0.3);border-radius:12px;padding:20px;margin-bottom:28px">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;padding:8px">
            <div style="font-weight:800;font-size:0.9rem">STARTER</div>
            <div style="font-size:1.4rem;font-weight:800;margin:4px 0">€19<span style="font-size:0.7rem;color:rgba(255,255,255,0.4)">/mese</span></div>
            <div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">QR statico, punti base</div>
          </td>
          <td style="text-align:center;padding:8px;background:rgba(108,61,244,0.2);border-radius:10px">
            <div style="font-weight:800;font-size:0.9rem;color:#A78BFA">GROWTH ⭐</div>
            <div style="font-size:1.4rem;font-weight:800;margin:4px 0;color:#A78BFA">€39<span style="font-size:0.7rem;color:rgba(255,255,255,0.4)">/mese</span></div>
            <div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">QR dinamico, gift card</div>
          </td>
          <td style="text-align:center;padding:8px">
            <div style="font-weight:800;font-size:0.9rem">PRO</div>
            <div style="font-size:1.4rem;font-weight:800;margin:4px 0">€79<span style="font-size:0.7rem;color:rgba(255,255,255,0.4)">/mese</span></div>
            <div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">Multi-sede, API</div>
          </td>
        </tr>
      </table>
    </div>
    <a href="https://www.getfidelio.app/dashboard/upgrade"
       style="display:inline-block;background:#6C3DF4;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px">
      Scegli il tuo piano →
    </a>
    <p style="color:rgba(255,255,255,0.4);font-size:13px;margin-top:24px">
      Hai domande? Scrivi a <a href="mailto:support@getfidelio.app" style="color:#A78BFA">support@getfidelio.app</a>
    </p>
  </td></tr>
  <tr><td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center">
    <p style="font-size:12px;color:rgba(255,255,255,0.3);margin:0">
      © 2026 Fidelio · <a href="https://www.getfidelio.app" style="color:#A78BFA;text-decoration:none">getfidelio.app</a>
    </p>
  </td></tr>
</table></td></tr></table></body></html>`,
  })
  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Errore invio email' }, { status: 500 })
  }
}
