import Link from 'next/link'
const features = [
{ icon:'■', title:'QR Code in 10 minuti', desc:'Il cliente scansiona e si registra in 10 secondi.' },
{ icon:'■', title:'Punti e Premi', desc:'Programma punti personalizzato con premi esclusivi.' },
{ icon:'■', title:'Email Automatiche', desc:'Winback, compleanno, punti. Tutto automatico.' },
{ icon:'■', title:'AI Insights', desc:"L'AI ti dice chi sta per smettere di venire." },
{ icon:'■', title:'Analytics Reali', desc:'Vedi chi sono i clienti e quando vengono.' },
{ icon:'■', title:'Carte Regalo', desc:'Carte regalo digitali con codici univoci.' },
]
const plans = [
{ name:'Starter', price:'0', period:'per sempre',
features:['Fino a 150 clienti','QR code e punti','Email benvenuto','Analytics base'],
cta:'Inizia gratis', featured:false },
{ name:'Growth', price:'29', period:'al mese',
features:['Fino a 2.000 clienti','Tutte le email','AI suggerimenti','Analytics avanzate'],
cta:'30 giorni gratis', featured:true },
{ name:'Pro', price:'79', period:'al mese',
features:['Clienti illimitati','AI avanzata','Export dati','5 negozi'],
cta:'Contattaci', featured:false },
]
export default function LandingPage() {
return (
<div style={{fontFamily:'system-ui,sans-serif',background:'#0D0D1A',color:'white',minHeight:'100vh'}
}>
<nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,
background:'rgba(13,13,26,0.9)',backdropFilter:'blur(20px)',
borderBottom:'1px solid rgba(255,255,255,0.08)',
display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 2rem'}}>
<div style={{fontSize:'1.4rem',fontWeight:'700',display:'flex',alignItems:'center',gap:'0.5rem'}
}>
<div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#6C3DF4'}} />
Fidelio
</div>
<div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
<Link href="/login" style={{color:'rgba(255,255,255,0.6)',textDecoration:'none',fontSize:'0.9rem'}}>
Accedi
</Link>
<Link href="/register" style={{background:'#6C3DF4',color:'white',padding:'0.5rem 1.2rem',
borderRadius:'100px',textDecoration:'none',fontSize:'0.9rem',fontWeight:'600'}}>
Prova gratis
</Link>
</div>
</nav>
<div style={{paddingTop:'8rem',paddingBottom:'5rem',textAlign:'center',
background:'radial-gradient(ellipse 80% 50% at 50% -10%,rgba(108,61,244,0.3) 0%,transparent 70%'}}>
<div style={{display:'inline-block',background:'rgba(108,61,244,0.15)',
border:'1px solid rgba(108,61,244,0.3)',padding:'0.3rem 1rem',
borderRadius:'100px',fontSize:'0.8rem',color:'#A78BFA',
fontWeight:'600',marginBottom:'1.5rem'}}>
La fedelta digitale per i negozi italiani
</div>
<h1 style={{fontSize:'clamp(2.5rem,6vw,5rem)',fontWeight:'800',
lineHeight:'1.1',marginBottom:'1.5rem',maxWidth:'800px',margin:'0 auto 1.5rem'}}>
Fai tornare i tuoi clienti ogni giorno
</h1>
<p style={{fontSize:'1.1rem',color:'rgba(255,255,255,0.6)',
maxWidth:'550px',margin:'0 auto 2.5rem',lineHeight:'1.7'}}>
QR code alla cassa, punti digitali, email automatiche e AI che sa quando i clienti stanno per
smettere di venire.
</p>
<div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
<Link href="/register" style={{background:'#6C3DF4',color:'white',
padding:'0.9rem 2rem',borderRadius:'100px',textDecoration:'none',
fontWeight:'700',fontSize:'1rem',boxShadow:'0 0 30px rgba(108,61,244,0.4)'}}>
Inizia gratis — nessuna carta
</Link>
</div>
<p style={{color:'rgba(255,255,255,0.3)',fontSize:'0.8rem',marginTop:'1rem'}}>
Setup in 10 minuti. Nessuna competenza tecnica.
</p>
</div>
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
<div id="prezzi" style={{maxWidth:'900px',margin:'0 auto',padding:'5rem 2rem'}}>
<h2 style={{textAlign:'center',fontSize:'2.2rem',fontWeight:'800',marginBottom:'3rem'}}>
Prezzi semplici
</h2>
<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.2rem'}}>
{plans.map(p => (
<div key={p.name} style={{
background:p.featured?'rgba(108,61,244,0.15)':'rgba(255,255,255,0.04)',
border:'1px solid '+(p.featured?'rgba(108,61,244,0.4)':'rgba(255,255,255,0.08)'),
borderRadius:'20px',padding:'2rem',
transform:p.featured?'scale(1.03)':'none'}}>
{p.featured&&(
<div style={{background:'#6C3DF4',color:'white',padding:'0.2rem 0.8rem',
borderRadius:'100px',fontSize:'0.7rem',fontWeight:'700',
display:'inline-block',marginBottom:'1rem'}}>
PIU SCELTO
</div>
)}
<div style={{fontWeight:'700',fontSize:'1.1rem',marginBottom:'0.3rem'}}>{p.name}</div>
<div style={{fontSize:'2.5rem',fontWeight:'800',marginBottom:'1.2rem'}}>
{p.price}<span style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.4)'}}> euro/{p.period
}</span>
</div>
<ul style={{listStyle:'none',padding:0,marginBottom:'1.5rem'}}>
{p.features.map(f=>(
<li key={f} style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.7)',
marginBottom:'0.4rem',display:'flex',gap:'0.5rem'}}>
<span style={{color:'#10B981'}}>v</span>{f}
</li>
))}
</ul>
<Link href="/register" style={{display:'block',
background:p.featured?'#6C3DF4':'transparent',color:'white',
padding:'0.7rem',borderRadius:'10px',textAlign:'center',
textDecoration:'none',fontWeight:'600',fontSize:'0.9rem',
border:p.featured?'none':'1px solid rgba(255,255,255,0.2)'}}>
{p.cta}
</Link>
</div>
))}
</div>
</div>
<div style={{background:'linear-gradient(135deg,#6C3DF4,#FF6B35)',
padding:'3rem 2rem',textAlign:'center'}}>
<h2 style={{fontSize:'2rem',fontWeight:'800',marginBottom:'1rem'}}>
Sei tra i primi 50 negozi?
</h2>
<p style={{opacity:0.9,marginBottom:'2rem'}}>
Piano Growth gratis per 6 mesi + badge Negozio Fondatore
</p>
<Link href="/register" style={{background:'white',color:'#6C3DF4',
padding:'0.9rem 2rem',borderRadius:'100px',textDecoration:'none',
fontWeight:'700',fontSize:'1rem'}}>
Candidati come fondatore
</Link>
</div>
<div style={{padding:'2rem',textAlign:'center',
borderTop:'1px solid rgba(255,255,255,0.06)',
color:'rgba(255,255,255,0.3)',fontSize:'0.85rem'}}>
<div style={{fontSize:'1.2rem',fontWeight:'700',marginBottom:'0.5rem',color:'white'}}>Fidelio</div>
<p>La piattaforma di fidelizzazione per i negozi italiani</p>
<p style={{marginTop:'0.5rem'}}>2026 Fidelio. Tutti i diritti riservati.</p>
</div>
</div>
)
}