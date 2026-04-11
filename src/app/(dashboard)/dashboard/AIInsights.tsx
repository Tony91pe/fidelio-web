'use client'
import { useEffect, useState } from 'react'
type Insight = { titolo:string; descrizione:string; azione:string }
export default function AIInsights() {
const [insights, setInsights] = useState<Insight[]>([])
const [loading, setLoading] = useState(true)
useEffect(() => {
fetch('/api/ai/insights').then(r=>r.json())
.then(d=>{ setInsights(d.insights||[]); setLoading(false) })
.catch(()=>setLoading(false))
}, [])
return (
<div style={{background:'rgba(108,61,244,0.1)',border:'1px solid rgba(108,61,244,0.2)',
borderRadius:'16px',padding:'1.5rem'}}>
<div style={{fontSize:'0.7rem',color:'#A78BFA',fontWeight:'700',marginBottom:'1rem'}}>
AI INSIGHTS
</div>
{loading ? (
<p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.85rem'}}>Analisi in corso...</p>
) : insights.map((ins,i) => (
<div key={i} style={{marginBottom:'1rem',paddingBottom:'1rem',
borderBottom:i<insights.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}>
<p style={{fontSize:'0.85rem',fontWeight:'700',marginBottom:'0.3rem'}}>{ins.titolo}</p>
<p style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.6)',lineHeight:'1.5',marginBottom:'0.3em'}}>
{ins.descrizione}
</p>
<p style={{fontSize:'0.75rem',color:'#A78BFA',fontWeight:'600'}}>Azione: {ins.azione}</p>
</div>
))}
</div>
)
}
