'use client'
import { useState } from 'react'

const inp: React.CSSProperties = {
  background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',
  borderRadius:'12px',padding:'14px 16px',color:'white',
  width:'100%',outline:'none',fontSize:'16px',marginBottom:'12px'
}

export default function CheckinForm({ shopId, shopName, defaultRef }: { shopId:string; shopName:string; defaultRef?:string }) {
  const [step, setStep] = useState<'form'|'success'>('form')
  const [points, setPoints] = useState(0)
  const [customerCode, setCustomerCode] = useState('')
  const [myReferralCode, setMyReferralCode] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [googleReviewUrl, setGoogleReviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [birthday, setBirthday] = useState('')
  const [referralCode, setReferralCode] = useState(defaultRef ?? '')
  const [showReferral, setShowReferral] = useState(!!defaultRef)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/checkin', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ name, email, birthday, shopId, ...(referralCode.trim() ? { referralCode: referralCode.trim().toUpperCase() } : {}) }),
      })
      const data = await res.json()
      if (res.ok) {
        setPoints(data.pointsEarned)
        setCustomerCode(data.customerCode)
        setMyReferralCode(data.referralCode ?? '')
        setIsNew(data.isNew)
        setGoogleReviewUrl(data.googleReviewUrl ?? null)
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
      {myReferralCode && (
        <div style={{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:'12px',padding:'1rem',marginTop:'1rem',textAlign:'left'}}>
          <p style={{color:'#10B981',fontSize:'0.82rem',fontWeight:'700',marginBottom:'0.3rem'}}>🎁 Porta un amico e guadagna punti!</p>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',marginBottom:'0.5rem'}}>Condividi il tuo codice — ricevi punti per ogni amico che si iscrive</p>
          <p style={{fontFamily:'monospace',fontSize:'1.2rem',fontWeight:'800',color:'white',letterSpacing:'0.15em',textAlign:'center'}}>{myReferralCode}</p>
        </div>
      )}
      {googleReviewUrl && (
        <div style={{background:'rgba(251,188,4,0.08)',border:'1px solid rgba(251,188,4,0.25)',borderRadius:'12px',padding:'1rem',marginTop:'1rem',textAlign:'center'}}>
          <p style={{fontSize:'1.2rem',marginBottom:'0.3rem'}}>⭐</p>
          <p style={{color:'rgba(255,255,255,0.85)',fontSize:'0.88rem',fontWeight:'700',marginBottom:'0.25rem'}}>Ti è piaciuto? Lascia una recensione!</p>
          <p style={{color:'rgba(255,255,255,0.45)',fontSize:'0.78rem',marginBottom:'0.75rem'}}>Ci vuole 1 minuto e ci aiuta tantissimo</p>
          <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer"
            style={{display:'inline-block',background:'#FBBC04',color:'#111',padding:'9px 20px',borderRadius:'8px',fontWeight:'800',textDecoration:'none',fontSize:'0.85rem'}}>
            ⭐ Scrivi una recensione su Google
          </a>
        </div>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{background:'rgba(255,255,255,0.05)',borderRadius:'20px',padding:'2rem',border:'1px solid rgba(255,255,255,0.1)'}}>
      <input style={inp} placeholder="Il tuo nome" value={name} onChange={e => setName(e.target.value)} required />
      <input style={inp} type="email" placeholder="La tua email" value={email} onChange={e => setEmail(e.target.value)} required />
      <div style={{position:'relative',marginBottom:'12px'}}>
        <label style={{position:'absolute',top:'-8px',left:'12px',fontSize:'11px',color:'rgba(255,255,255,0.5)',background:'transparent',pointerEvents:'none'}}>Data di nascita</label>
        <input style={{...inp,marginBottom:0,colorScheme:'dark'}} type="date" value={birthday} onChange={e => setBirthday(e.target.value)} required />
      </div>

      {/* Codice amico */}
      {!showReferral ? (
        <button type="button" onClick={() => setShowReferral(true)}
          style={{display:'block',width:'100%',textAlign:'center',background:'transparent',border:'1px dashed rgba(255,255,255,0.15)',borderRadius:'12px',padding:'10px',color:'rgba(255,255,255,0.4)',fontSize:'13px',cursor:'pointer',marginBottom:'12px'}}>
          Hai un codice amico? Inseriscilo →
        </button>
      ) : (
        <input style={inp} placeholder="Codice amico (es. AB3XY7)" value={referralCode}
          onChange={e => setReferralCode(e.target.value.toUpperCase())}
          maxLength={6} />
      )}

      <button type="submit" disabled={loading}
        style={{width:'100%',background:'#6C3DF4',color:'white',padding:'16px',borderRadius:'12px',fontWeight:'700',border:'none',cursor:'pointer',fontSize:'16px',opacity:loading?0.7:1}}>
        {loading ? 'Registrazione...' : 'Inizia ad accumulare punti'}
      </button>
      <p style={{marginTop:'12px',fontSize:'12px',color:'rgba(255,255,255,0.35)',lineHeight:'1.5',textAlign:'center'}}>
        Registrandoti accetti che <strong style={{color:'rgba(255,255,255,0.5)'}}>{shopName}</strong> tratti i tuoi dati (nome, email, data di nascita) per il programma fedeltà tramite Fidelio.
        Puoi richiedere la cancellazione in qualsiasi momento scrivendo a{' '}
        <a href="mailto:support@getfidelio.app" style={{color:'rgba(167,139,250,0.7)',textDecoration:'none'}}>support@getfidelio.app</a>.{' '}
        <a href="/privacy" style={{color:'rgba(167,139,250,0.7)',textDecoration:'none'}}>Privacy Policy</a>
      </p>
    </form>
  )
}
