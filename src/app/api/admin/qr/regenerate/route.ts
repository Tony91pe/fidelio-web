import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSecureQRCode } from '@/lib/qr'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { shopId } = body

  const newCode = generateSecureQRCode()
  await logEvent({ eventType: 'QR_REGENERATED', userId, action: 'QR regenerated', metadata: { shopId } })

  return NextResponse.json({ qrCode: newCode })
}
