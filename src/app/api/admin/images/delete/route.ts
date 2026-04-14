import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { deleteImage } from '@/lib/imageHandler'
import { logEvent } from '@/lib/logging'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { filename, shopId } = body

  try {
    await deleteImage(filename)
    await logEvent({ eventType: 'IMAGE_DELETED', userId, action: 'Image deleted', metadata: { shopId, filename } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
