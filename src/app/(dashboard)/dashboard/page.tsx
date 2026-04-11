import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import VisitsChart from './VisitsChart'
import AIInsights from './AIInsights'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')
  const user = await currentUser()
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })

  if (!shop) return (
    <div style={{textAlign:'center', marginTop:'5rem'}}>
      <div style={{fontSize:'3rem', marginBottom:'1rem'}}>🏪</div>
      <h1 style={{fontSize:'1.5rem', fontWeight:'700', marginBottom:'0.5rem'}}>Benvenuto su Fidelio!</h1>
      <Link href="/dashboard/shop"
        style={{background:'#6C3DF4', color:'white', padding:'12px 24px',
          borderRadius:'12px', fontWeight:'600', textDecoration:'none'}}>
        Crea il tuo negozio
      </Link>
    </div>
  )

  const emoji: Record<string,string> = {
    bar:'☕', restaurant:'🍕', hair:'✂️', beauty:'💅',
    gym:'💪', bakery:'🍰', clothing:'👗', bio:'🌿', other:'🏪'
  }

  const ago30 = new Date(Date.now()-30*24*60*60*1000)
  const [total, active, atRisk, pts] = await Promise.all([
    db.customer.count({ where:{ shopId:shop.id } }),
    db.customer.count({ where:{ shopId:shop.id, lastVisitAt:{ gte:ago30 } } }),
    db.customer.count({ where:{ shopId:shop.id, lastVisitAt:{ lt:ago30 } } }),
    db.visit.aggregate({ where:{ shopId:shop.id }, _sum:{ points:true } }),
  ])

  const kpis = [
    { label:'Clienti totali', value:total, icon:'👥', color:'#6C3DF4' },
    { label:'Attivi (30gg)', value:active, icon:'🔥', color:'#10B981' },
    { label:'A rischio', value:atRisk, icon:'⚠️', color:'#EF4444' },
    { label:'Punti totali', value:pts._sum.points||0, icon:'⭐', color:'#F59E0B' },
  ]

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <div>
          <h1 style={{fontSize:'1.5rem', fontWeight:'700'}}>
            {emoji[shop.category]||'🏪'} {shop.name}
          </h1>
          <p style={{color:'rgba(255,255,255,0.4)', marginTop:'0.2rem'}}>Ciao {user?.firstName}!</p>
        </div>
        <Link href="/dashboard/customers/new"
          style={{background:'#6C3DF4', color:'white', padding:'10px 20px',
            borderRadius:'10px', fontWeight:'600', textDecoration:'none', fontSize:'14px'}}>
          + Aggiungi cliente
        </Link>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem'}}>
        {kpis.map(k => (
          <div key={k.label} style={{background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'1.2rem'}}>
            <div style={{fontSize:'1.3rem', marginBottom:'0.4rem'}}>{k.icon}</div>
            <div style={{fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', marginBottom:'0.2rem'}}>{k.label}</div>
            <div style={{fontSize:'1.8rem', fontWeight:'700', color:k.color}}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem'}}>
        <div style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'16px', padding:'1.5rem'}}>
          <h3 style={{fontWeight:'700', marginBottom:'1rem'}}>Visite ultimi 7 giorni</h3>
          <VisitsChart shopId={shop.id} />
        </div>
        <AIInsights />
      </div>
    </div>
  )
}