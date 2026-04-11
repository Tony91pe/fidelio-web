'use client'
import { useEffect, useState } from 'react'

type Shop = {
  id: string
  name: string
  category: string
  city: string
  plan: string
  createdAt: string
  _count: { customers: number; visits: number }
}

type AdminData = {
  shops: Shop[]
  totalCustomers: number
  totalVisits: number
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/admin')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{minHeight:'100vh',background:'#0D0D1A',display:'flex',alignItems:'center',justifyContent:'center',color:'white'}}>Caricamento...</div>
  if (error) return <div style={{minHeight:'100vh',background:'#0D0D1A',display:'flex',alignItems:'center',justifyContent:'center',color:'white'}}>Non autorizzato</div>
  if (!data) return null

  return (
    <div style={{minHeight:'100vh',background:'#0D0D1A',color:'white',padding:'2rem'}}>
      <h1 style={{fontSize:'1.8rem',fontWeight:'800',marginBottom:'0.5rem'}}>🛡️ Pannello Admin</h1>
      <p style={{color:'rgba(255,255,255,0.4)',marginBottom:'2rem'}}>Gestione piattaforma Fidelio</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
        {[
          { label:'Negozi totali', value: data.shops.length, icon:'🏪' },
          { label:'Clienti totali', value: data.totalCustomers, icon:'👥' },
          { label:'Visite totali', value: data.totalVisits, icon:'📊' },
          { label:'Abbonamenti Growth+', value: data.shops.filter(s=>s.plan!=='STARTER').length, icon:'⚡' },
        ].map((stat,i) => (
          <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.5rem'}}>
            <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>{stat.icon}</div>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.85rem',marginBottom:'0.3rem'}}>{stat.label}</p>
            <div style={{fontSize:'2rem',fontWeight:'700'}}>{stat.value}</div>
          </div>
        ))}
      </div>

      <h2 style={{fontSize:'1.2rem',fontWeight:'700',marginBottom:'1rem'}}>Negozi registrati</h2>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.9rem'}}>
          <thead>
            <tr style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
              {['Nome','Città','Categoria','Piano','Clienti','Visite','Data'].map(h=>(
                <th key={h} style={{textAlign:'left',padding:'0.75rem 1rem',color:'rgba(255,255,255,0.5)',fontWeight:'600'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.shops.map(shop => (
              <tr key={shop.id} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                <td style={{padding:'0.75rem 1rem',fontWeight:'600'}}>{shop.name}</td>
                <td style={{padding:'0.75rem 1rem',color:'rgba(255,255,255,0.6)'}}>{shop.city}</td>
                <td style={{padding:'0.75rem 1rem',color:'rgba(255,255,255,0.6)'}}>{shop.category}</td>
                <td style={{padding:'0.75rem 1rem'}}>
                  <span style={{background:shop.plan==='STARTER'?'rgba(255,255,255,0.1)':shop.plan==='GROWTH'?'rgba(108,61,244,0.3)':'rgba(255,107,53,0.3)',padding:'2px 8px',borderRadius:'100px',fontSize:'0.75rem',fontWeight:'600'}}>
                    {shop.plan}
                  </span>
                </td>
                <td style={{padding:'0.75rem 1rem',color:'rgba(255,255,255,0.6)'}}>{shop._count.customers}</td>
                <td style={{padding:'0.75rem 1rem',color:'rgba(255,255,255,0.6)'}}>{shop._count.visits}</td>
                <td style={{padding:'0.75rem 1rem',color:'rgba(255,255,255,0.6)'}}>{new Date(shop.createdAt).toLocaleDateString('it-IT')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
