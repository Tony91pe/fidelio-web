import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { forceLogout } from '@/lib/passwordManagement'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { userId: targetUserId } = body

  if (!targetUserId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  try {
    const result = await forceLogout(targetUserId, userId)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
