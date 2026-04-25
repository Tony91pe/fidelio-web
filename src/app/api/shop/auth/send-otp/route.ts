import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Resend } from 'resend'
import { corsHeaders } from '@/lib/shopAuth'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Email non valida' }, { status: 400, headers: corsHeaders })
  }

  // Verifica che l'email sia associata a un negozio (owner o staff)
  let shopName = 'Fidelio'
  const shop = await db.shop.findFirst({ where: { ownerEmail: email } })
  if (shop) {
    shopName = shop.name
  } else {
    const staff = await db.staffMember.findFirst({
      where: { email },
      include: { shop: { select: { name: true } } },
    })
    if (!staff) {
      return NextResponse.json(
        { error: 'Email non associata a nessun negozio Fidelio' },
        { status: 400, headers: corsHeaders }
      )
    }
    shopName = staff.shop.name
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expires = new Date(Date.now() + 10 * 60 * 1000)

  // Elimina vecchi OTP shop per questa email
  await db.otpCode.deleteMany({ where: { email, type: 'shop' } })

  // Salva nuovo OTP
  await db.otpCode.create({
    data: { email, code, expires, type: 'shop' }
  })

  try {
    await resend.emails.send({
      from: 'noreply@getfidelio.app',
      to: email,
      subject: `Accesso negozio Fidelio: ${code}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #10B981, #0EA5E9); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; font-size: 28px; margin: 0 0 8px;">🏪 Fidelio</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 14px;">Portale Negozio</p>
          </div>
          <h2 style="color: #1a1a2e; font-size: 20px; margin-bottom: 8px;">Accesso a ${shopName}</h2>
          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">Usa questo codice per accedere al portale del tuo negozio. Valido per 10 minuti.</p>
          <div style="background: #f0fdf4; border: 2px solid #10B981; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-family: monospace; font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #10B981;">${code}</span>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">Non hai richiesto questo codice? Ignora questa email.</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Shop OTP email error:', err)
  }

  return NextResponse.json({ ok: true }, { headers: corsHeaders })
}
