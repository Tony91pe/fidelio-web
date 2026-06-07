import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Resend } from 'resend'
import { corsHeaders } from '@/lib/shopAuth'
import { randomUUID } from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const { email, shopName, category, city } = body ?? {}

  if (!email || !email.includes('@') || !shopName || !category || !city) {
    return NextResponse.json({ error: 'Compila tutti i campi richiesti' }, { status: 400, headers: corsHeaders })
  }

  const existing = await db.shop.findFirst({ where: { ownerEmail: email } })
  if (existing) {
    return NextResponse.json(
      { error: 'Email già associata a un negozio. Usa il login.', alreadyExists: true },
      { status: 409, headers: corsHeaders }
    )
  }

  await db.shop.create({
    data: {
      name: shopName,
      category,
      city,
      address: city,
      ownerEmail: email,
      ownerId: randomUUID(),
      approved: true,
      onboardingCompleted: false,
    },
  })

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expires = new Date(Date.now() + 10 * 60 * 1000)

  await db.otpCode.deleteMany({ where: { email, type: 'shop' } })
  await db.otpCode.create({ data: { email, code, expires, type: 'shop' } })

  try {
    await resend.emails.send({
      from: 'Fidelio <noreply@getfidelio.app>',
      to: email,
      subject: `Benvenuto su Fidelio! Il tuo codice: ${code}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #10B981, #0EA5E9); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; font-size: 28px; margin: 0 0 8px;">🏪 Fidelio</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 14px;">Portale Negozio</p>
          </div>
          <h2 style="color: #1a1a2e; font-size: 20px; margin-bottom: 8px;">Benvenuto, ${shopName}!</h2>
          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">Il tuo negozio è stato creato. Usa questo codice per accedere. Valido per 10 minuti.</p>
          <div style="background: #f0fdf4; border: 2px solid #10B981; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-family: monospace; font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #10B981;">${code}</span>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">Non hai richiesto questo codice? Ignora questa email.</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Register OTP email error:', err)
  }

  return NextResponse.json({ ok: true }, { headers: corsHeaders })
}
