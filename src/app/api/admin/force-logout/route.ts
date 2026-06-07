import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { logEvent } from '@/lib/logging'

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

  const clerk = await clerkClient()

  // Revoca tutte le sessioni attive dell'utente
  const { data: sessions } = await clerk.sessions.getSessionList({
    userId: targetUserId,
    status: 'active',
  })

  await Promise.all(sessions.map(s => clerk.sessions.revokeSession(s.id)))

  await logEvent({
    eventType: 'ADMIN_FORCE_LOGOUT',
    userId,
    action: `Force logout per utente ${targetUserId} (${sessions.length} sessioni revocate)`,
    metadata: { targetUserId, sessionsRevoked: sessions.length },
  })

  return NextResponse.json({
    success: true,
    sessionsRevoked: sessions.length,
    message: `${sessions.length} sessione${sessions.length !== 1 ? 'i' : ''} revocata${sessions.length !== 1 ? 'e' : ''}`,
  })
}
