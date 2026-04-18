import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  const isAdmin = !!(userId && userId === process.env.ADMIN_USER_ID)
  return NextResponse.json({ isAdmin })
}
