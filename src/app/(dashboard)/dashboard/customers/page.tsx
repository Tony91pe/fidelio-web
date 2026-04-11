import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'

export default async function CustomersPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) redirect('/dashboard/shop')

  const customers = await db.customer.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem'}}>
        <div>
          <h1 style={{fontSize:'1.5rem', fontWeight:'700'}}>Clienti</h1>
          <p style={{color:'rgba(255,255,255,0.4)', marginTop:'0.2rem'}}>{customers.length} clienti registrati</p>
        </div>
        <Link href="/dashboard/customers/new"
          style={{background:'#6C3DF4', color:'white', padding:'10px 20px',
            borderRadius:'10px', fontWeight:'600', textDecoration:'none', fontSize:'14px'}}>
          + Nuovo cliente
        </Link>
      </div>

      {customers.length === 0 ? (
        <div style={{textAlign:'center', padding:'4rem',
          background:'rgba(255,255,255,0.03)', borderRadius:'16px',
          border:'1px solid rgba(255,255,255,0.07)'}}>
          <div style={{fontSize:'3rem', marginBottom:'1rem'}}>👥</div>
          <p style={{fontWeight:'600', marginBottom:'0.5rem'}}>Nessun cliente ancora</p>
          <Link href="/dashboard/customers/new"
            style={{background:'#6C3DF4', color:'white', padding:'10px 20px',
              borderRadius:'10px', fontWeight:'600', textDecoration:'none', fontSize:'14px',
              display:'inline-block', marginTop:'1rem'}}>
            + Aggiungi cliente
          </Link>
        </div>
      ) : (
        <div style={{background:'rgba(255,255,255,0.03)', borderRadius:'16px',
          border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                {['Cliente','Email','Punti','Visite','Stato'].map(h => (
                  <th key={h} style={{textAlign:'left', padding:'1rem', fontSize:'0.75rem',
                    color:'rgba(255,255,255,0.3)', fontWeight:'600', textTransform:'uppercase'}}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const initials = c.name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()
                return (
                  <tr key={c.id}>
                    <td style={{padding:'0', borderTop:'1px solid rgba(255,255,255,0.04)'}}>
                      <Link href={'/dashboard/customers/' + c.id}
                        style={{display:'flex', alignItems:'center', gap:'0.8rem',
                          padding:'0.8rem 1rem', textDecoration:'none',
                          color:'white', cursor:'pointer'}}>
                        <div style={{width:'32px', height:'32px', borderRadius:'50%',
                          background:'linear-gradient(135deg,#6C3DF4,#A78BFA)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:'0.75rem', fontWeight:'700', flexShrink:0}}>
                          {initials}
                        </div>
                        <span style={{fontWeight:'600', fontSize:'0.9rem'}}>{c.name}</span>
                      </Link>
                    </td>
                    <td style={{padding:'0.8rem 1rem', fontSize:'0.85rem',
                      color:'rgba(255,255,255,0.5)', borderTop:'1px solid rgba(255,255,255,0.04)'}}>
                      {c.email}
                    </td>
                    <td style={{padding:'0.8rem 1rem', fontWeight:'700', color:'#A78BFA',
                      borderTop:'1px solid rgba(255,255,255,0.04)'}}>
                      {c.points}
                    </td>
                    <td style={{padding:'0.8rem 1rem', fontSize:'0.85rem',
                      borderTop:'1px solid rgba(255,255,255,0.04)'}}>
                      {c.totalVisits}
                    </td>
                    <td style={{padding:'0.8rem 1rem',
                      borderTop:'1px solid rgba(255,255,255,0.04)'}}>
                      <span style={{background:'rgba(108,61,244,0.2)', color:'#A78BFA',
                        padding:'0.2rem 0.6rem', borderRadius:'100px',
                        fontSize:'0.75rem', fontWeight:'600'}}>
                        Nuovo
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
