'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

const features = [
  { icon:'📱', title:'QR Code in 10 minuti', desc:'Il cliente scansiona e si registra in 10 secondi.' },
  { icon:'⭐', title:'Punti e Premi', desc:'Programma punti personalizzato con premi esclusivi.' },
  { icon:'✉️', title:'Email Automatiche', desc:'Winback, compleanno, punti. Tutto automatico.' },
  { icon:'🤖', title:'AI Insights', desc:"L'AI ti dice chi sta per smettere di venire." },
  { icon:'📊', title:'Analytics Reali', desc:'Vedi chi sono i clienti e quando vengono.' },
  { icon:'🎁', title:'Carte Regalo', desc:'Carte regalo digitali con codici univoci.' },
]

const plans = [
  { name:'STARTER', price:'19', period:'mese',
    features:['Card digitale del cliente','QR del negozio','Raccolta punti semplice','Storico transazioni','Dashboard base','Fino a 3 premi attivi','Supporto via email'],
    cta:'Inizia gratis', featured:false },
  { name:'GROWTH', price:'39', period:'mese',
    features:['Tutto di STARTER','Premi illimitati','Automazioni base','Notifiche push ai clienti','Statistiche avanzate','Segmentazione clienti','QR dinamici anti-frode','Accesso multi-dispositivo','Supporto prioritario'],
    cta:'Inizia', featured:true },
  { name:'PRO', price:'79', period:'mese',
    features:['Tutto di GROWTH','Automazioni avanzate','Campagne marketing integrate','Messaggi personalizzati','Ruoli e permessi staff','API','Analisi predittiva','Supporto premium'],
    cta:'Inizia', featured:false },
]

const MAX_FOUNDERS = 50

export default function LandingPage() {
  const [shopCount, setShopCount] = useState<number | null>(null)
  const { isSignedIn } = useUser()

  const registerHref = isSignedIn ? '/dashboard' : '/register'
  const loginHref = isSignedIn ? '/dashboard' : '/login'

  useEffect(() => {
    fetch('/api/app/shops')
      .then(r => r.json())
      .then(data => setShopCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setShopCount(0))
  }, [])

  const spotsLeft = shopCount !== null ? Math.max(MAX_FOUNDERS - shopCount, 0) : null

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#0D0D1A',color:'white',minHeight:'100vh'}}>

      {/* Nav */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,
        background:'rgba(13,13,26,0.9)',backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.08)',
        display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 2rem'}}>
        <Link href="/" style={{fontSize:'1.4rem',fontWeight:'700',display:'flex',alignItems:'center',gap:'0.5rem',textDecoration:'none',color:'white'}}>
          <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#6C3DF4'}} />
          Fidelio
        </Link>
        <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
          <Link href={loginHref} style={{color:'rgba(255,255,255,0.6)',textDecoration:'none',fontSize:'0.9rem'}}>
            {isSignedIn ? 'Dashboard' : 'Accedi'}
          </Link>
          <Link href={registerHref} style={{background:'#6C3DF4',color:'white',padding:'0.5rem 1.2rem',
            borderRadius:'100px',textDecoration:'none',fontSize:'0.9rem',fontWeight:'600'}}>
            {isSignedIn ? 'Vai alla dashboard' : 'Prova gratis'}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{paddingTop:'8rem',paddingBottom:'5rem',textAlign:'center',
        background:'radial-gradient(ellipse 80% 50% at 50% -10%,rgba(108,61,244,0.3) 0%,transparent 70%)'}}>
        <div style={{display:'inline-block',background:'rgba(108,61,244,0.15)',
          border:'1px solid rgba(108,61,244,0.3)',padding:'0.3rem 1rem',
          borderRadius:'100px',fontSize:'0.8rem',color:'#A78BFA',
          fontWeight:'600',marginBottom:'1.5rem'}}>
          La fedeltà digitale per i negozi italiani
        </div>
        <h1 style={{fontSize:'clamp(2.5rem,6vw,5rem)',fontWeight:'800',
          lineHeight:'1.1',marginBottom:'1.5rem',maxWidth:'800px',margin:'0 auto 1.5rem'}}>
          Fai tornare i tuoi clienti ogni giorno
        </h1>
        <p style={{fontSize:'1.1rem',color:'rgba(255,255,255,0.6)',
          maxWidth:'550px',margin:'0 auto 2.5rem',lineHeight:'1.7'}}>
          QR code alla cassa, punti digitali, email automatiche e AI che sa quando i clienti stanno per smettere di venire.
        </p>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <Link href={registerHref} style={{background:'#6C3DF4',color:'white',
            padding:'0.9rem 2rem',borderRadius:'100px',textDecoration:'none',
            fontWeight:'700',fontSize:'1rem',boxShadow:'0 0 30px rgba(108,61,244,0.4)'}}>
            {isSignedIn ? 'Vai alla dashboard' : 'Inizia gratis — nessuna carta'}
          </Link>
        </div>
        <p style={{color:'rgba(255,255,255,0.3)',fontSize:'0.8rem',marginTop:'1rem'}}>
          Setup in 10 minuti. Nessuna competenza tecnica.
        </p>
      </div>

      {/* Features */}
      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'5rem 2rem'}}>
        <h2 style={{textAlign:'center',fontSize:'2.2rem',fontWeight:'800',marginBottom:'3rem'}}>
          Tutto quello che ti serve
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.2rem'}}>
          {features.map(f => (
            <div key={f.title} style={{background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.5rem'}}>
              <div style={{fontSize:'2rem',marginBottom:'0.8rem'}}>{f.icon}</div>
              <h3 style={{fontWeight:'700',marginBottom:'0.4rem'}}>{f.title}</h3>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.9rem',lineHeight:'1.6'}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prezzi */}
      <div id="prezzi" style={{maxWidth:'900px',margin:'0 auto',padding:'5rem 2rem'}}>
        <h2 style={{textAlign:'center',fontSize:'2.2rem',fontWeight:'800',marginBottom:'3rem'}}>
          Prezzi semplici
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:'1.2rem'}}>
          {plans.map(p => (
            <div key={p.name} style={{
              background:p.featured?'rgba(108,61,244,0.15)':'rgba(255,255,255,0.04)',
              border:'1px solid '+(p.featured?'rgba(108,61,244,0.4)':'rgba(255,255,255,0.08)'),
              borderRadius:'20px',padding:'2rem',
              transform:p.featured?'scale(1.03)':'none'}}>
              {p.featured && (
                <div style={{background:'#6C3DF4',color:'white',padding:'0.2rem 0.8rem',
                  borderRadius:'100px',fontSize:'0.7rem',fontWeight:'700',
                  display:'inline-block',marginBottom:'1rem'}}>
                  PIÙ SCELTO
                </div>
              )}
              <div style={{fontWeight:'700',fontSize:'1.1rem',marginBottom:'0.3rem'}}>{p.name}</div>
              <div style={{fontSize:'2.5rem',fontWeight:'800',marginBottom:'1.2rem'}}>
                {p.price}<span style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.4)'}}> euro/{p.period}</span>
              </div>
              <ul style={{listStyle:'none',padding:0,marginBottom:'1.5rem'}}>
                {p.features.map(f => (
                  <li key={f} style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.7)',
                    marginBottom:'0.4rem',display:'flex',gap:'0.5rem'}}>
                    <span style={{color:'#10B981'}}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href={isSignedIn ? '/dashboard/upgrade' : registerHref} style={{display:'block',
                background:p.featured?'#6C3DF4':'transparent',color:'white',
                padding:'0.7rem',borderRadius:'10px',textAlign:'center',
                textDecoration:'none',fontWeight:'600',fontSize:'0.9rem',
                border:p.featured?'none':'1px solid rgba(255,255,255,0.2)'}}>
                {isSignedIn ? 'Gestisci piano' : p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Fondatori */}
      <div style={{background:'linear-gradient(135deg,#6C3DF4,#FF6B35)',
        padding:'3rem 2rem',textAlign:'center'}}>
        <h2 style={{fontSize:'2rem',fontWeight:'800',marginBottom:'0.5rem'}}>
          Sei tra i primi 50 negozi?
        </h2>
        <div style={{display:'inline-flex',alignItems:'center',gap:'0.75rem',
          background:'rgba(0,0,0,0.2)',borderRadius:'100px',padding:'0.4rem 1.2rem',
          marginBottom:'1rem'}}>
          <div style={{display:'flex',gap:'4px'}}>
            {Array.from({length:10}).map((_,i) => (
              <div key={i} style={{
                width:'10px',height:'10px',borderRadius:'50%',
                background: spotsLeft !== null && i < Math.ceil((spotsLeft/MAX_FOUNDERS)*10)
                  ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)'
              }} />
            ))}
          </div>
          <span style={{fontSize:'0.85rem',fontWeight:'700'}}>
            {spotsLeft === null ? 'Caricamento...' :
             spotsLeft === 0 ? 'Posti esauriti' :
             `${spotsLeft} post${spotsLeft === 1 ? 'o' : 'i'} rimast${spotsLeft === 1 ? 'o' : 'i'}`}
          </span>
        </div>
        <p style={{opacity:0.9,marginBottom:'2rem'}}>
          Piano Growth gratis per 6 mesi + badge Negozio Fondatore
        </p>
        <Link href={registerHref} style={{background:'white',color:'#6C3DF4',
          padding:'0.9rem 2rem',borderRadius:'100px',textDecoration:'none',
          fontWeight:'700',fontSize:'1rem',
          opacity: spotsLeft === 0 ? 0.5 : 1,
          pointerEvents: spotsLeft === 0 ? 'none' : 'auto'}}>
          {spotsLeft === 0 ? 'Posti esauriti' : isSignedIn ? 'Vai alla dashboard' : 'Candidati come fondatore'}
        </Link>
      </div>

      {/* Footer */}
      <div style={{padding:'2rem',textAlign:'center',
        borderTop:'1px solid rgba(255,255,255,0.06)',
        color:'rgba(255,255,255,0.3)',fontSize:'0.85rem'}}>
        <Link href="/" style={{fontSize:'1.2rem',fontWeight:'700',marginBottom:'0.5rem',color:'white',textDecoration:'none',display:'block'}}>
          Fidelio
        </Link>
        <p>La piattaforma di fidelizzazione per i negozi italiani</p>
        <div style={{display:'flex',gap:'1.5rem',justifyContent:'center',marginTop:'1rem',flexWrap:'wrap'}}>
          <Link href="/privacy" style={{color:'rgba(255,255,255,0.4)',textDecoration:'none',fontSize:'0.8rem'}}>Privacy Policy</Link>
          <Link href="/termini" style={{color:'rgba(255,255,255,0.4)',textDecoration:'none',fontSize:'0.8rem'}}>Termini di Servizio</Link>
          <a href="mailto:info@fidelio.it" style={{color:'rgba(255,255,255,0.4)',textDecoration:'none',fontSize:'0.8rem'}}>Contatti</a>
        </div>
        <p style={{marginTop:'1rem'}}>© 2026 Fidelio. Tutti i diritti riservati.</p>
      </div>

    </div>
  )
}