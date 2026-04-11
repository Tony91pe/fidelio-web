'use client'
import { useState } from 'react'

const inp: React.CSSProperties = {
  background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',
  borderRadius:'12px',padding:'14px 16px',color:'white',
  width:'100%',outline:'none',fontSize:'16px',marginBottom:'12px'
}

export default function CheckinForm({ shopId, shopName }: { shopId:string; shopName:string }) {
  const [step, setStep] = useState<'form'|'success'>('form')
  const [points, setPoints] = useState(0)
  const [customerCode, setCustomerCode] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/checkin', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ name, email, shopId }),
      })
      const data = await res.json()
      if (res.ok) {
        setPoints(data.pointsEarned)
        setCustomerCode(data.customerCode)
        setIsNew(data.isNew)
        setStep('success')
      }
    } finally { setLoading(false) }
  }

  if (step === 'success') return (
    <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'20px',padding:'2rem',border:'1px solid rgba(255,255,255,0.1)',textAlign:'center'}}>
      <div style={{fontSize:'4rem',marginBottom:'1rem'}}>🎉</div>
      <h2 style={{color:'white',fontWeight:'700',marginBottom:'0.5rem'}}>
        {isNew ? `Benvenuto in ${shopName}!` : `Bentornato in ${shopName}!`}
      </h2>
      <p style={{color:'rgba(255,255,255,0.6)',marginBottom:'1.5rem'}}>
        Hai ricevuto <strong style={{color:'#A78BFA'}}>{points} punti</strong>!
      </p>
      <div style={{background:'rgba(108,61,244,0.15)',border:'1px solid rgba(108,61,244,0.3)',borderRadius:'12px',padding:'1rem',marginTop:'1rem'}}>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.8rem',marginBottom:'0.3rem'}}>Il tuo codice cliente</p>
        <p style={{fontFamily:'monospace',fontSize:'1.5rem',fontWeight:'700',color:'#A78BFA',letterSpacing:'0.1em'}}>{customerCode}</p>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.75rem',marginTop:'0.3rem'}}>Conserva questo codice per il supporto</p>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{background:'rgba(255,255,255,0.05)',borderRadius:'20px',padding:'2rem',border:'1px solid rgba(255,255,255,0.1)'}}>
      <input style={inp} placeholder="Il tuo nome" value={name} onChange={e => setName(e.target.value)} required />
      <input style={inp} type="email" placeholder="La tua email" value={email} onChange={e => setEmail(e.target.value)} required />
      <button type="submit" disabled={loading}
        style={{width:'100%',background:'#6C3DF4',color:'white',padding:'16px',borderRadius:'12px',fontWeight:'700',border:'none',cursor:'pointer',fontSize:'16px',opacity:loading?0.7:1}}>
        {loading ? 'Registrazione...' : 'Inizia ad accumulare punti'}
      </button>
    </form>
  )
}
