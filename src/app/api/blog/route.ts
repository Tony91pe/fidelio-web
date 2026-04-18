import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: { id: true, slug: true, title: true, description: true, category: true, readTime: true, publishedAt: true },
  })
  return NextResponse.json(posts)
}
