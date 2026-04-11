'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputStyle = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px', padding: '10px 14px',
  color: 'white', width: '100%', outline: 'none', fontSize: '14px',
}

export default function AddPointsForm({
  customerId, currentPoints
}: {
  customerId: string, currentPoints: number
}) {
  const router = useRouter()
  const [points, setPoints] = useState('1')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/customers/' + customerId + '/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: parseInt(points), note }),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => { setSuccess(false); router.refresh() }, 1500)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{background:'rgba(108,61,244,0.1)', border:'1px solid rgba(108,61,244,0.25)',
      borderRadius:'16px', padding:'1.5rem'}}>
      <h3 style={{fontWeight:'700', marginBottom:'0.3rem'}}>Aggiungi punti</h3>
      <p style={{color:'rgba(255,255,255,0.4)', fontSize:'0.8rem', marginBottom:'1rem'}}>
        Punti attuali: {currentPoints}
      </p>
      <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'0.8rem'}}>
        <div>
          <label style={{fontSize:'0.8rem', color:'rgba(255,255,255,0.5)', display:'block', marginBottom:'4px'}}>
            Punti da aggiungere
          </label>
          <div style={{display:'flex', gap:'0.5rem'}}>
            {[1,2,5,10].map(n => (
              <button key={n} type="button"
                onClick={() => setPoints(String(n))}
                style={{flex:1, padding:'8px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.15)',
                  background: points === String(n) ? '#6C3DF4' : 'transparent',
                  color:'white', cursor:'pointer', fontWeight:'600', fontSize:'0.85rem'}}>
                +{n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{fontSize:'0.8rem', color:'rgba(255,255,255,0.5)', display:'block', marginBottom:'4px'}}>
            Nota (opzionale)
          </label>
          <input style={inputStyle} placeholder="Es. Caffe macchiato"
            value={note} onChange={e => setNote(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}
          style={{background: success ? '#10B981' : '#6C3DF4', color:'white',
            padding:'12px', borderRadius:'10px', fontWeight:'600', border:'none',
            cursor:'pointer', fontSize:'14px', transition:'all 0.2s'}}>
          {success ? 'Punti aggiunti!' : loading ? 'Aggiunta...' : '+' + points + ' punt' + (parseInt(points) > 1 ? 'i' : 'o')}
        </button>
      </form>
    </div>
  )
}
