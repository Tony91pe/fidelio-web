import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

async function checkAdmin() {
  const { userId } = await auth()
  return userId === process.env.ADMIN_USER_ID
}

function toSlug(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const body = await req.json()
  const { title, description, category, readTime, content, published } = body
  if (!title || !content) return NextResponse.json({ error: 'Titolo e contenuto obbligatori' }, { status: 400 })

  const slug = toSlug(title)
  const post = await db.blogPost.create({
    data: {
      slug,
      title,
      description: description || '',
      category: category || 'Strategia',
      readTime: readTime || '5 min',
      content,
      published: !!published,
      publishedAt: published ? new Date() : null,
    },
  })
  return NextResponse.json(post)
}

export async function PATCH(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const body = await req.json()
  const { id, ...data } = body
  if (data.published && !data.publishedAt) data.publishedAt = new Date()
  const post = await db.blogPost.update({ where: { id }, data })
  return NextResponse.json(post)
}

export async function DELETE(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  const { id } = await req.json()
  await db.blogPost.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
