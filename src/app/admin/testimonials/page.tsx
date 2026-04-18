'use client'
import { useEffect, useState } from 'react'

interface Testimonial {
  id: string
  name: string
  role: string
  text: string
  approved: boolean
  createdAt: string
}

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/testimonials')
      if (!r.ok) throw new Error('Errore caricamento')
      const data = await r.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function toggle(id: string, approved: boolean) {
    setWorking(id)
    await fetch('/api/admin/testimonials', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved }),
    })
    setItems(prev => prev.map(t => t.id === id ? { ...t, approved } : t))
    setWorking(null)
  }

  async function remove(id: string) {
    if (!confirm('Eliminare questa recensione?')) return
    setWorking(id)
    await fetch('/api/admin/testimonials', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setItems(prev => prev.filter(t => t.id !== id))
    setWorking(null)
  }

  const pending = items.filter(t => !t.approved)
  const approved = items.filter(t => t.approved)

  return (
    <div style={{ padding: '2rem', maxWidth: 800 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Recensioni</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
          Gestisci le testimonianze inviate da{' '}
          <span style={{ color: '#A78BFA' }}>getfidelio.app/recensione</span>
        </p>
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>Caricamento...</div>
      ) : (
        <>
          {/* In attesa */}
          {pending.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>In attesa di approvazione</h2>
                <span style={{ background: '#F59E0B', color: '#000', borderRadius: '100px', padding: '0 8px', fontSize: '11px', fontWeight: 800 }}>{pending.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {pending.map(t => (
                  <Card key={t.id} t={t} working={working} onApprove={() => toggle(t.id, true)} onDelete={() => remove(t.id)} />
                ))}
              </div>
            </div>
          )}

          {/* Approvate */}
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
              Pubblicate sul sito <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>({approved.length})</span>
            </h2>
            {approved.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', padding: '1.5rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12 }}>
                Nessuna recensione approvata ancora
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {approved.map(t => (
                  <Card key={t.id} t={t} working={working} onRevoke={() => toggle(t.id, false)} onDelete={() => remove(t.id)} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function Card({ t, working, onApprove, onRevoke, onDelete }: {
  t: Testimonial
  working: string | null
  onApprove?: () => void
  onRevoke?: () => void
  onDelete?: () => void
}) {
  const isWorking = working === t.id
  return (
    <div style={{
      background: t.approved ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${t.approved ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 14, padding: '1.25rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{t.role}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: '1.6', margin: '0 0 0.5rem', fontStyle: 'italic' }}>
            &ldquo;{t.text}&rdquo;
          </p>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
            {new Date(t.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          {onApprove && (
            <button onClick={onApprove} disabled={isWorking}
              style={{ background: '#10B981', color: 'white', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', opacity: isWorking ? 0.6 : 1 }}>
              ✓ Approva
            </button>
          )}
          {onRevoke && (
            <button onClick={onRevoke} disabled={isWorking}
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', opacity: isWorking ? 0.6 : 1 }}>
              Nascondi
            </button>
          )}
          <button onClick={onDelete} disabled={isWorking}
            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', opacity: isWorking ? 0.6 : 1 }}>
            🗑
          </button>
        </div>
      </div>
    </div>
  )
}
