import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { logEvent } from '@/lib/logging'
import crypto from 'crypto'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId || userId !== ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { userId: targetUserId } = await req.json()
  if (!targetUserId) {
    return NextResponse.json({ error: 'userId mancante' }, { status: 400 })
  }

  // Genera password temporanea sicura (12 char alfanumerici + simboli)
  const tempPassword = crypto.randomBytes(9).toString('base64url')

  const clerk = await clerkClient()
  await clerk.users.updateUser(targetUserId, { password: tempPassword })

  await logEvent({
    eventType: 'ADMIN_PASSWORD_RESET',
    userId,
    action: `Reset password per utente ${targetUserId}`,
    metadata: { targetUserId },
  })

  return NextResponse.json({ tempPassword, message: 'Password resettata con successo' })
}
