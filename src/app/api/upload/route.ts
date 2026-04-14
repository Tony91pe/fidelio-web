import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const form = await req.formData()
  const file = form.get('file') as File
  if (!file) return NextResponse.json({ error: 'Nessun file' }, { status: 400 })
  const blob = await put(`logos/${userId}-${Date.now()}.${file.name.split('.').pop()}`, file, { access: 'public' })
  return NextResponse.json({ url: blob.url })
}
