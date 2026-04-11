'use client'
import { useState } from 'react'
const inp: React.CSSProperties = {background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'10px',padding:'10px 14px',color:'white',width:'100%',outline:'none',fontSize:'14px',marginBottom:'8px'}
const segments = [{id:'all',label:'Tutti i clienti',desc:'Tutti i clienti registrati'},{id:'active',label:'Clienti attivi',desc:'Chi ha visitato negli ultimi 30 giorni'},{id:'atrisk',label:'A rischio abbandono',desc:'Chi non viene da piu di 30 giorni'}]
const templates = [{subject:'Offerta speciale per te!',body:'Abbiamo una sorpresa per te. Vieni a trovarci!'},{subject:'Ci manchi! Torna a trovarci',body:'E da un po che non ci vedi. I tuoi punti ti aspettano!'},{subject:'Novita per te',body:'Abbiamo delle novita che non vediamo lora di condividere!'}]
export default function CampaignsPage() {
const [segment, setSegment] = useState('all')
const [subject, setSubject] = useState('')
const [body, setBody] = useState('')
const [sending, setSending] = useState(false)
const [result, setResult] = useState<{sent:number;total:number}|null>(null)
async function handleSend(e: React.FormEvent) {
e.preventDefault()
if (!confirm('Inviare la campagna?')) return
setSending(true)
try {
  const res = await fetch('/api/campaigns', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject,body,segment})})
  if (!res.ok) throw new Error('Failed to send campaign')
  setResult(await res.json())
} catch (err) {
  console.error('Error sending campaign:', err)
} finally {
  setSending(false)
}
}
return (
<div>
<h1 style={{fontSize:'1.5rem',fontWeight:'700',marginBottom:'0.5rem'}}>Campagne Email</h1>
<p style={{color:'rgba(255,255,255,0.4)',marginBottom:'2rem'}}>Invia email ai tuoi clienti per farli tornare</p>
{result && (<div style={{background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'12px',padding:'1rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:'1rem'}}><span style={{fontSize:'1.5rem'}}>✓</span><p style={{fontWeight:'600',color:'#10B981'}}>{result.sent} email inviate su {result.total} clienti!</p><button onClick={()=>setResult(null)} style={{marginLeft:'auto',background:'transparent',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'1.2rem'}}>x</button></div>)}
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
<div>
<h3 style={{fontWeight:'700',marginBottom:'1rem',fontSize:'0.95rem'}}>1. Scegli segmento</h3>
{segments.map(s => (<div key={s.id} onClick={()=>setSegment(s.id)} style={{background:segment===s.id?'rgba(108,61,244,0.2)':'rgba(255,255,255,0.04)',border:'1px solid '+(segment===s.id?'rgba(108,61,244,0.4)':'rgba(255,255,255,0.08)'),borderRadius:'12px',padding:'0.8rem 1rem',cursor:'pointer',marginBottom:'0.6rem'}}><div style={{fontWeight:'600',fontSize:'0.9rem'}}>{s.label}</div><div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',marginTop:'0.2rem'}}>{s.desc}</div></div>))}
<h3 style={{fontWeight:'700',margin:'1rem 0 0.5rem',fontSize:'0.95rem'}}>2. Template pronti</h3>
{templates.map((t,i) => (<button key={i} onClick={()=>{setSubject(t.subject);setBody(t.body)}} style={{display:'block',width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'10px',padding:'0.6rem 1rem',cursor:'pointer',color:'white',textAlign:'left',fontSize:'0.85rem',marginBottom:'0.4rem'}}>{t.subject}</button>))}
</div>
<form onSubmit={handleSend}>
<h3 style={{fontWeight:'700',marginBottom:'0.8rem',fontSize:'0.95rem'}}>3. Componi</h3>
<input style={inp} placeholder="Oggetto email" value={subject} onChange={e=>setSubject(e.target.value)} required />
<textarea style={{...inp,height:'150px',resize:'vertical'}} placeholder="Testo email..." value={body} onChange={e=>setBody(e.target.value)} required />
<button type="submit" disabled={sending} style={{width:'100%',background:'#6C3DF4',color:'white',padding:'12px',borderRadius:'10px',fontWeight:'600',border:'none',cursor:'pointer',opacity:sending?0.7:1}}>{sending?'Invio...':'Invia campagna'}</button>
</form>
</div>
</div>
)
}
