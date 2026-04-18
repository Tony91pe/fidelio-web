import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await db.blogPost.findFirst({ where: { slug, published: true } })
  if (!post) return NextResponse.json({ error: 'Non trovato' }, { status: 404 })
  return NextResponse.json(post)
}
