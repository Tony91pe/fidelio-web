'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
export default function VisitsChart({ shopId }: { shopId: string }) {
const [data, setData] = useState<any[]>([])
useEffect(() => {
fetch('/api/analytics/visits?shopId='+shopId).then(r=>r.json()).then(setData)
}, [shopId])
if (data.length===0) return (
<div style={{height:'120px',display:'flex',alignItems:'center',
justifyContent:'center',color:'rgba(255,255,255,0.3)',fontSize:'0.85rem'}}>
Nessuna visita ancora
</div>
)
return (
<ResponsiveContainer width="100%" height={120}>
<BarChart data={data}>
<XAxis dataKey="day" tick={{fill:'rgba(255,255,255,0.3)',fontSize:11}} />
<YAxis hide />
<Tooltip contentStyle={{background:'#1a1a2e',border:'1px solid rgba(108,61,244,0.3)',
borderRadius:'8px',color:'white'}} />
<Bar dataKey="visite" fill="#6C3DF4" radius={[4,4,0,0]} />
</BarChart>
</ResponsiveContainer>
)
}
