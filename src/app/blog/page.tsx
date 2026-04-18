import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog — Fidelio: strategie di fidelizzazione per negozi',
  description: 'Guide pratiche su come fidelizzare i clienti del tuo negozio. Strategie per bar, ristoranti, parrucchieri e negozi italiani.',
  alternates: { canonical: 'https://www.getfidelio.app/blog' },
  openGraph: {
    title: 'Blog Fidelio — Fidelizzazione clienti per negozi italiani',
    description: 'Guide pratiche su come far tornare i clienti ogni giorno.',
    url: 'https://www.getfidelio.app/blog',
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Bar & Caffetterie': '#F59E0B',
  'Saloni & Barbieri': '#8B5CF6',
  'Ristorazione': '#EF4444',
  'Strategia': '#10B981',
}

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: { id: true, slug: true, title: true, description: true, category: true, readTime: true, publishedAt: true },
  })

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: '#0D0D1A', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(13,13,26,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
        <Link href="/" style={{ fontSize: '1.3rem', fontWeight: '800', textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/favicon.svg" alt="Fidelio" width={26} height={26} style={{ borderRadius: 6 }} />
          Fidelio
        </Link>
        <Link href="/register" style={{ background: '#6C3DF4', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '100px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
          Inizia ora
        </Link>
      </nav>

      <div style={{ paddingTop: '7rem', paddingBottom: '2rem', textAlign: 'center', background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(108,61,244,0.2) 0%, transparent 70%)', padding: '7rem 1.5rem 3rem' }}>
        <div style={{ display: 'inline-block', background: 'rgba(108,61,244,0.15)', border: '1px solid rgba(108,61,244,0.3)', padding: '0.3rem 1rem', borderRadius: '100px', fontSize: '0.8rem', color: '#A78BFA', fontWeight: '600', marginBottom: '1rem' }}>
          Risorse gratuite
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: '800', marginBottom: '0.75rem' }}>
          Come fidelizzare i tuoi clienti
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: '1.7' }}>
          Guide pratiche per negozi, bar, ristoranti e saloni italiani.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 6rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {posts.map(post => {
          const catColor = CATEGORY_COLORS[post.category] || '#6C3DF4'
          return (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', transition: 'border-color 0.2s', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ background: `${catColor}20`, color: catColor, padding: '0.2rem 0.7rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' }}>
                    {post.category}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>· {post.readTime} di lettura</span>
                </div>
                <h2 style={{ fontWeight: '800', fontSize: '1.15rem', marginBottom: '0.5rem', color: '#fff' }}>{post.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 1rem' }}>{post.description}</p>
                <span style={{ color: '#A78BFA', fontSize: '0.875rem', fontWeight: '600' }}>Leggi l&apos;articolo →</span>
              </article>
            </Link>
          )
        })}
        {posts.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', paddingTop: '3rem' }}>Nessun articolo pubblicato.</p>
        )}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '1.5rem 2rem', textAlign: 'center' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.85rem' }}>← Torna alla home</Link>
      </div>
    </div>
  )
}
