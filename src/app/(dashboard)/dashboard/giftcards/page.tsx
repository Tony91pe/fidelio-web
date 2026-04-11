'use client'
import { useState, useEffect } from 'react'

type GiftCard = { id:string; code:string; points:number; description:string|null; used:boolean; createdAt:string }

const inp: React.CSSProperties = {
  background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
  borderRadius:'10px', padding:'10px 14px', color:'white', width:'100%', outline:'none', fontSize:'14px'
}

export default function GiftCardsPage() {
  const [cards, setCards] = useState<GiftCard[]>([])
  const [description, setDescription] = useState('')
  const [points, setPoints] = useState('50')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetch('/api/giftcards').then(r => r.json()).then(setCards).catch(console.error)
  }, [])

  async function createCard() {
    if (!description.trim()) { alert('Inserisci una descrizione'); return }
    setCreating(true)
    try {
      const res = await fetch('/api/giftcards', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ points: parseInt(points), description }),
      })
      if (!res.ok) throw new Error()
      const card = await res.json()
      setCards([card, ...cards])
      setDescription('')
    } catch { console.error('Errore creazione carta') }
    finally { setCreating(false) }
  }

  return (
    <div>
      <h1 style={{fontSize:'1.5rem',fontWeight:'700',marginBottom:'0.5rem'}}>Carte Regalo</h1>
      <p style={{color:'rgba(255,255,255,0.4)',marginBottom:'2rem'}}>Crea buoni regalo personalizzati per i tuoi clienti</p>

      <div style={{background:'rgba(108,61,244,0.1)',border:'1px solid rgba(108,61,244,0.25)',borderRadius:'16px',padding:'1.5rem',marginBottom:'2rem'}}>
        <h3 style={{fontWeight:'700',marginBottom:'1rem'}}>Crea nuova carta regalo</h3>
        
        <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.4rem'}}>Descrizione del regalo *</label>
        <input style={{...inp,marginBottom:'1rem'}} placeholder="Es. 10 colazioni, Cena per 2, 50€ di spesa..." value={description} onChange={e=>setDescription(e.target.value)} />

        <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.4rem'}}>Valore in punti</label>
        <div style={{display:'flex',gap:'0.5rem',marginBottom:'1rem',flexWrap:'wrap'}}>
          {['25','50','100','200','500'].map(p => (
            <button key={p} onClick={() => setPoints(p)}
              style={{padding:'8px 16px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',
              background:points===p?'#6C3DF4':'transparent',color:'white',cursor:'pointer',fontWeight:'600'}}>
              {p} punti
            </button>
          ))}
        </div>

        <button onClick={createCard} disabled={creating}
          style={{background:'#6C3DF4',color:'white',padding:'12px 24px',borderRadius:'10px',fontWeight:'600',border:'none',cursor:'pointer',opacity:creating?0.7:1}}>
          {creating ? 'Creazione...' : '+ Crea carta regalo'}
        </button>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'0.8rem'}}>
        {cards.map(card => (
          <div key={card.id} style={{
            background:card.used?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',
            padding:'1rem',display:'flex',alignItems:'center',justifyContent:'space-between',
            gap:'1rem',opacity:card.used?0.5:1,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
              <span style={{fontSize:'1.5rem'}}>{card.used?'✓':'🎁'}</span>
              <div>
                <div style={{fontFamily:'monospace',fontSize:'1.1rem',fontWeight:'700',letterSpacing:'0.1em',color:card.used?'rgba(255,255,255,0.4)':'#A78BFA'}}>
                  {card.code}
                </div>
                {card.description && <div style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.7)',marginTop:'2px'}}>{card.description}</div>}
                <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.3)'}}>{new Date(card.createdAt).toLocaleDateString('it-IT')}</div>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontWeight:'700'}}>{card.points} punti</div>
              <div style={{fontSize:'0.75rem',color:card.used?'#EF4444':'#10B981',fontWeight:'600'}}>{card.used?'Utilizzata':'Disponibile'}</div>
            </div>
          </div>
        ))}
        {cards.length===0 && <p style={{textAlign:'center',color:'rgba(255,255,255,0.3)',padding:'2rem'}}>Nessuna carta regalo ancora</p>}
      </div>
    </div>
  )
}
