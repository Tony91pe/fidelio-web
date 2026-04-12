import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Email non valida' }, { status: 400, headers: corsHeaders })
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expires = new Date(Date.now() + 10 * 60 * 1000)

  // Elimina vecchi codici per questa email
  await db.otpCode.deleteMany({ where: { email } })

  // Salva nuovo codice nel DB
  await db.otpCode.create({
    data: { email, code, expires }
  })

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `Il tuo codice Fidelio: ${code}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #7C3AED, #3B82F6); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; font-size: 28px; margin: 0 0 8px;">Fidelio</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">La tua carta fedeltà digitale</p>
          </div>
          <h2 style="color: #1a1a2e; font-size: 20px; margin-bottom: 8px;">Il tuo codice di accesso</h2>
          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">Usa questo codice per accedere a Fidelio. Valido per 10 minuti.</p>
          <div style="background: #f5f5f5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-family: monospace; font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #7C3AED;">${code}</span>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">Non hai richiesto questo codice? Ignora questa email.</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('OTP email error:', err)
  }

  return NextResponse.json({ ok: true }, { headers: corsHeaders })
}