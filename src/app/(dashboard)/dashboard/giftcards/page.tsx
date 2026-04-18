'use client'
import { useState, useEffect } from 'react'
import UpgradeWall from '@/components/UpgradeWall'

type GiftCard = {
  id: string
  code: string
  points: number
  value: number | null
  remainingValue: number | null
  description: string | null
  dedica: string | null
  customerName: string | null
  customerEmail: string | null
  used: boolean
  createdAt: string
}

type ShopInfo = { name: string; logo: string | null; city: string }

const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px', padding: '10px 14px', color: 'white', width: '100%', outline: 'none', fontSize: '14px',
}

function GiftCardVisual({ card, shop }: { card: GiftCard; shop: ShopInfo | null }) {
  const total = card.value ?? card.points
  const remaining = card.remainingValue ?? total
  const pct = card.used ? 0 : total > 0 ? Math.round((remaining / total) * 100) : 100

  return (
    <div style={{
      background: card.used
        ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
        : 'linear-gradient(135deg, #2d1b69, #1a0a4e, #0d0d2b)',
      border: card.used ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(108,61,244,0.4)',
      borderRadius: 16,
      padding: '1.25rem 1.5rem',
      opacity: card.used ? 0.55 : 1,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Cerchi decorativi */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(108,61,244,0.12)' }} />
      <div style={{ position: 'absolute', bottom: -20, left: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgba(108,61,244,0.08)' }} />

      {/* Header negozio */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', position: 'relative' }}>
        {shop?.logo
          ? <img src={shop.logo} alt={shop.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }} />
          : <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#6C3DF4,#4F28C4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: 'white' }}>
              {shop?.name?.[0] ?? '🏪'}
            </div>
        }
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'white' }}>{shop?.name ?? 'Negozio'}</div>
          {shop?.city && <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{shop.city}</div>}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{
            background: card.used ? 'rgba(255,255,255,0.08)' : 'rgba(108,61,244,0.3)',
            color: card.used ? 'rgba(255,255,255,0.4)' : '#a78bfa',
            border: `1px solid ${card.used ? 'rgba(255,255,255,0.1)' : 'rgba(108,61,244,0.4)'}`,
            padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700,
          }}>
            {card.used ? 'Esaurita' : 'Attiva'}
          </span>
        </div>
      </div>

      {/* Descrizione */}
      {card.description && (
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', position: 'relative' }}>
          🎁 {card.description}
        </div>
      )}

      {/* Destinatario */}
      {card.customerName && (
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', marginBottom: '0.5rem', position: 'relative' }}>
          👤 Per: <span style={{ color: '#c4b5fd', fontWeight: 600 }}>{card.customerName}</span>
          {card.customerEmail && <span style={{ color: 'rgba(255,255,255,0.35)', marginLeft: 4 }}>({card.customerEmail})</span>}
        </div>
      )}

      {/* Dedica */}
      {card.dedica && (
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginBottom: '0.75rem', position: 'relative', borderLeft: '2px solid rgba(108,61,244,0.4)', paddingLeft: '0.6rem' }}>
          "{card.dedica}"
        </div>
      )}

      {/* Codice */}
      <div style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.15em', color: card.used ? 'rgba(255,255,255,0.3)' : '#c4b5fd', marginBottom: '0.75rem', position: 'relative' }}>
        {card.code.match(/.{1,4}/g)?.join(' ') ?? card.code}
      </div>

      {/* Saldo e progress bar */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Valore</span>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: card.used ? 'rgba(255,255,255,0.3)' : 'white' }}>
            {card.used
              ? 'Esaurita'
              : card.value != null
                ? `€${remaining.toFixed(2)} / €${total.toFixed(2)}`
                : card.description ?? '—'}
          </span>
        </div>
        {card.value != null && (
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6C3DF4,#a78bfa)', borderRadius: 4, transition: 'width 0.3s' }} />
          </div>
        )}
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.4rem' }}>
          Creata il {new Date(card.createdAt).toLocaleDateString('it-IT')}
        </div>
      </div>
    </div>
  )
}

export default function GiftCardsPage() {
  const [plan, setPlan] = useState<string | null>(null)
  const [cards, setCards] = useState<GiftCard[]>([])
  const [shop, setShop] = useState<ShopInfo | null>(null)
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('50')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [dedica, setDedica] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetch('/api/shop/plan')
      .then(r => r.json())
      .then(d => setPlan(d.plan))
      .catch(() => setPlan('STARTER'))

    fetch('/api/giftcards')
      .then(r => r.json())
      .then(gc => {
        if (Array.isArray(gc)) {
          setCards(gc)
        } else {
          if (gc.cards) setCards(gc.cards)
          if (gc.shop?.name) setShop(gc.shop)
        }
      })
      .catch(() => {})

    fetch('/api/shop/settings')
      .then(r => r.json())
      .then(s => {
        if (s?.name) {
          setShop(prev => prev ?? { name: s.name, logo: s.logo ?? null, city: s.city ?? '' })
        }
      })
      .catch(() => {})
  }, [])

  if (plan === null) return null

  if (plan === 'STARTER') {
    return (
      <UpgradeWall
        requiredPlan="GROWTH"
        currentPlan={plan}
        feature="Carte Regalo"
        description="Crea buoni regalo personalizzati per i tuoi clienti. Disponibile dal piano Growth."
      />
    )
  }

  async function createCard() {
    if (!description.trim()) { alert('Inserisci una descrizione'); return }
    setCreating(true)
    try {
      const res = await fetch('/api/giftcards', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, description, recipientName, recipientEmail, dedica }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCards([data, ...cards])
      setDescription('')
      setRecipientName('')
      setRecipientEmail('')
      setDedica('')
    } catch {}
    finally { setCreating(false) }
  }

  const previewCard: GiftCard = {
    id: 'preview', code: 'XXXX XXXX',
    points: 0, value: parseFloat(value) || null, remainingValue: parseFloat(value) || null,
    description, dedica: dedica || null,
    customerName: recipientName || null, customerEmail: recipientEmail || null,
    used: false, createdAt: new Date().toISOString(),
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Carte Regalo</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>Crea buoni regalo personalizzati per i tuoi clienti</p>

      <div style={{ background: 'rgba(108,61,244,0.1)', border: '1px solid rgba(108,61,244,0.25)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>Crea nuova carta regalo</h3>

        <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>Descrizione del regalo *</label>
        <input style={{ ...inp, marginBottom: '1rem' }} placeholder="Es. 10 colazioni, Cena per 2, Buono spesa..." value={description} onChange={e => setDescription(e.target.value)} />

        <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>Valore in €</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['10', '20', '50', '100', '200'].map(v => (
            <button key={v} onClick={() => setValue(v)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: value === v ? '#6C3DF4' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
              €{v}
            </button>
          ))}
          <input
            type="number" min="1" placeholder="Altro..."
            value={['10','20','50','100','200'].includes(value) ? '' : value}
            onChange={e => setValue(e.target.value)}
            style={{ ...inp, width: '100px' }}
          />
        </div>

        <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>Per chi è il regalo</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input style={{ ...inp }} placeholder="Nome destinatario" value={recipientName} onChange={e => setRecipientName(e.target.value)} />
          <input style={{ ...inp }} placeholder="Email (opzionale)" type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} />
        </div>

        <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>Dedica</label>
        <textarea
          style={{ ...inp, marginBottom: '1rem', resize: 'vertical', minHeight: '70px' }}
          placeholder="Scrivi una dedica personalizzata..."
          value={dedica}
          onChange={e => setDedica(e.target.value)}
        />

        {/* Anteprima */}
        {description.trim() && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Anteprima:</p>
            <GiftCardVisual card={previewCard} shop={shop} />
          </div>
        )}

        <button onClick={createCard} disabled={creating}
          style={{ background: '#6C3DF4', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: 'pointer', opacity: creating ? 0.7 : 1 }}>
          {creating ? 'Creazione...' : '+ Crea carta regalo'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {cards.map(card => (
          <GiftCardVisual key={card.id} card={card} shop={shop} />
        ))}
        {cards.length === 0 && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>Nessuna carta regalo ancora</p>}
      </div>
    </div>
  )
}
