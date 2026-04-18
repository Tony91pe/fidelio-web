import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await db.blogPost.findFirst({ where: { slug, published: true } })
  if (!post) return {}
  return {
    title: `${post.title} — Fidelio Blog`,
    description: post.description,
    alternates: { canonical: `https://www.getfidelio.app/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.getfidelio.app/blog/${slug}`,
      type: 'article',
    },
  }
}

function renderContent(content: string) {
  const lines = content.trim().split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} style={{ fontSize: '1.4rem', fontWeight: '800', margin: '2rem 0 0.75rem', color: '#fff' }}>{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} style={{ fontSize: '1.1rem', fontWeight: '700', margin: '1.5rem 0 0.5rem', color: '#A78BFA' }}>{line.slice(4)}</h3>)
    } else if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin: '0.5rem 0 1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {items.map((item, j) => (
            <li key={j} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.65' }}
              dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong style="color:white">$1</strong>') }} />
          ))}
        </ul>
      )
      continue
    } else if (line.trim() === '') {
      // skip blank
    } else {
      const html = line
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color:white">$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#A78BFA;text-decoration:none">$1</a>')
      elements.push(
        <p key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.97rem', lineHeight: '1.75', margin: '0 0 0.75rem' }}
          dangerouslySetInnerHTML={{ __html: html }} />
      )
    }
    i++
  }
  return elements
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await db.blogPost.findFirst({ where: { slug, published: true } })
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
    author: { '@type': 'Organization', name: 'Fidelio' },
    publisher: { '@type': 'Organization', name: 'Fidelio', url: 'https://www.getfidelio.app' },
  }

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: '#0D0D1A', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(13,13,26,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
        <Link href="/" style={{ fontSize: '1.3rem', fontWeight: '800', textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/favicon.svg" alt="Fidelio" width={26} height={26} style={{ borderRadius: 6 }} />
          Fidelio
        </Link>
        <Link href="/register" style={{ background: '#6C3DF4', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '100px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
          Inizia ora
        </Link>
      </nav>

      <article style={{ maxWidth: '700px', margin: '0 auto', padding: '7rem 1.5rem 5rem' }}>
        <Link href="/blog" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-block', marginBottom: '2rem' }}>
          ← Tutti gli articoli
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(108,61,244,0.15)', color: '#A78BFA', padding: '0.2rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' }}>
            {post.category}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>· {post.readTime} di lettura</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: '800', lineHeight: '1.2', marginBottom: '1.25rem' }}>{post.title}</h1>
        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2rem' }}>
          {post.description}
        </p>

        <div>{renderContent(post.content)}</div>

        <div style={{ marginTop: '3rem', background: 'rgba(108,61,244,0.12)', border: '1px solid rgba(108,61,244,0.3)', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚀</div>
          <h3 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Pronto a fidelizzare i tuoi clienti?</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Setup in 10 minuti. Garanzia rimborso 14 giorni.</p>
          <Link href="/register" style={{ background: '#6C3DF4', color: 'white', padding: '0.8rem 2rem', borderRadius: '100px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem', display: 'inline-block' }}>
            Inizia ora →
          </Link>
        </div>
      </article>
    </div>
  )
}
