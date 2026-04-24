'use client'
import { useState } from 'react'

const inp: React.CSSProperties = {
  background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',
  borderRadius:'12px',padding:'14px 16px',color:'white',
  width:'100%',outline:'none',fontSize:'16px',marginBottom:'12px'
}

const SCORES = [1,2,3,4,5,6,7,8,9,10]

export default function CheckinForm({ shopId, shopName, defaultRef }: { shopId:string; shopName:string; defaultRef?:string }) {
  const [step, setStep] = useState<'form'|'nps'|'nps-feedback'|'success'>('form')
  const [points, setPoints] = useState(0)
  const [customerCode, setCustomerCode] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [myReferralCode, setMyReferralCode] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [showGoogleReview, setShowGoogleReview] = useState(false)
  const [googleReviewUrl, setGoogleReviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [birthday, setBirthday] = useState('')
  const [referralCode, setReferralCode] = useState(defaultRef ?? '')
  const [showReferral, setShowReferral] = useState(!!defaultRef)
  const [npsScore, setNpsScore] = useState<number | null>(null)
  const [npsFeedback, setNpsFeedback] = useState('')
  const [npsLoading, setNpsLoading] = useState(false)

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
        setCustomerId(data.customerId ?? '')
        setMyReferralCode(data.referralCode ?? '')
        setIsNew(data.isNew)
        // Se Google Reviews è abilitato → mostra NPS prima
        if (data.googleReviewUrl) {
          setGoogleReviewUrl(data.googleReviewUrl)
          setStep('nps')
        } else {
          setStep('success')
        }
      }
    } finally { setLoading(false) }
  }

  async function handleNpsSubmit(score: number) {
    setNpsScore(score)
    setNpsLoading(true)
    try {
      const res = await fetch('/api/nps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, shopId, customerId: customerId || null }),
      })
      const data = await res.json()
      if (score <= 8) {
        // Punteggio basso → chiede feedback testuale
        setStep('nps-feedback')
      } else {
        // Punteggio alto → mostra Google Reviews se disponibile
        setShowGoogleReview(!!data.googleReviewUrl)
        setStep('success')
      }
    } finally { setNpsLoading(false) }
  }

  async function handleFeedbackSubmit() {
    if (npsFeedback.trim() && npsScore !== null) {
      await fetch('/api/nps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: npsScore, feedback: npsFeedback, shopId, customerId: customerId || null }),
      })
    }
    setStep('success')
  }

  // Step NPS — valutazione
  if (step === 'nps') return (
    <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'20px',padding:'2rem',border:'1px solid rgba(255,255,255,0.1)',textAlign:'center'}}>
      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>⭐</div>
      <h2 style={{color:'white',fontWeight:'700',marginBottom:'0.5rem',fontSize:'1.2rem'}}>
        Come valuteresti la tua esperienza con {shopName}?
      </h2>
      <p style={{color:'rgba(255,255,255,0.45)',fontSize:'0.82rem',marginBottom:'1.5rem'}}>
        1 = pessimo · 10 = eccellente
      </p>
      <div style={{display:'flex',gap:'6px',justifyContent:'center',flexWrap:'wrap',marginBottom:'0.5rem'}}>
        {SCORES.map(n => (
          <button
            key={n}
            onClick={() => handleNpsSubmit(n)}
            disabled={npsLoading}
            style={{
              width: 44, height: 44, borderRadius: 12, border: 'none',
              cursor: 'pointer', fontWeight: 800, fontSize: '1rem',
              background: n >= 9 ? 'rgba(16,185,129,0.2)' : n >= 7 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
              color: n >= 9 ? '#10B981' : n >= 7 ? '#F59E0B' : '#EF4444',
              transition: 'transform 0.1s',
              opacity: npsLoading ? 0.5 : 1,
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',padding:'0 4px',marginBottom:'1.5rem'}}>
        <span style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.3)'}}>😞 Per niente</span>
        <span style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.3)'}}>😍 Assolutamente</span>
      </div>
      <button
        onClick={() => setStep('success')}
        style={{background:'transparent',border:'none',color:'rgba(255,255,255,0.25)',fontSize:'0.78rem',cursor:'pointer'}}>
        Salta
      </button>
    </div>
  )

  // Step feedback testuale (punteggi bassi)
  if (step === 'nps-feedback') return (
    <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'20px',padding:'2rem',border:'1px solid rgba(255,255,255,0.1)',textAlign:'center'}}>
      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>💬</div>
      <h2 style={{color:'white',fontWeight:'700',marginBottom:'0.5rem',fontSize:'1.15rem'}}>
        Grazie per il tuo voto
      </h2>
      <p style={{color:'rgba(255,255,255,0.45)',fontSize:'0.85rem',marginBottom:'1.25rem',lineHeight:1.6}}>
        Vuoi dirci cosa potremmo migliorare? Il tuo feedback è prezioso.
      </p>
      <textarea
        value={npsFeedback}
        onChange={e => setNpsFeedback(e.target.value)}
        placeholder="Scrivi qui il tuo feedback (opzionale)..."
        rows={4}
        style={{
          width:'100%',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',
          borderRadius:'12px',padding:'12px 14px',color:'white',fontSize:'0.9rem',
          outline:'none',resize:'none',marginBottom:'1rem',boxSizing:'border-box',
        }}
      />
      <button
        onClick={handleFeedbackSubmit}
        style={{width:'100%',background:'#6C3DF4',color:'white',padding:'13px',borderRadius:'12px',fontWeight:'700',border:'none',cursor:'pointer',fontSize:'0.95rem',marginBottom:'0.5rem'}}>
        Invia feedback
      </button>
      <button
        onClick={() => setStep('success')}
        style={{background:'transparent',border:'none',color:'rgba(255,255,255,0.25)',fontSize:'0.78rem',cursor:'pointer'}}>
        Salta
      </button>
    </div>
  )

  // Step successo
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
      {/* Google Reviews — solo se NPS >= 9 */}
      {showGoogleReview && googleReviewUrl && (
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
