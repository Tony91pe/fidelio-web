import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createHmac } from 'crypto'

const SECRET = process.env.JWT_SECRET || 'fidelio-secret'

export function generateUnsubscribeToken(email: string): string {
  return createHmac('sha256', SECRET).update(email).digest('hex').slice(0, 16)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  if (!email || !token) {
    return new NextResponse('Link non valido', { status: 400, headers: { 'Content-Type': 'text/html' } })
  }

  const expected = generateUnsubscribeToken(email)
  if (token !== expected) {
    return new NextResponse('Link non valido o scaduto', { status: 400, headers: { 'Content-Type': 'text/html' } })
  }

  await db.customer.updateMany({
    where: { email },
    data: { unsubscribed: true },
  })

  return new NextResponse(`<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"><title>Disiscritto — Fidelio</title>
<style>body{margin:0;background:#0D0D1A;color:white;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}</style>
</head>
<body>
<div>
  <div style="font-size:3rem;margin-bottom:1rem">✅</div>
  <h1 style="font-size:1.5rem;font-weight:800;margin-bottom:0.5rem">Disiscritto con successo</h1>
  <p style="color:rgba(255,255,255,0.5);margin-bottom:2rem">Non riceverai più email da Fidelio per l'indirizzo <strong>${email}</strong></p>
  <a href="https://www.getfidelio.app" style="color:#A78BFA">Torna alla home</a>
</div>
</body></html>`, { headers: { 'Content-Type': 'text/html' } })
}
