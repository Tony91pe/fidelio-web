'use client'
import { useEffect, useState } from 'react'

type Shop = {
  id: string; name: string; category: string; city: string
  plan: string; suspended: boolean; planExpiresAt: string | null
  createdAt: string; _count: { customers: number; visits: number }
}
type AdminData = { shops: Shop[]; totalCustomers: number; totalVisits: number }

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Shop | null>(null)
  const [giftMonths, setGiftMonths] = useState(1)
  const [working, setWorking] = useState(false)

  async function load() {
    const r = await fetch('/api/admin')
    if (r.ok) setData(await r.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function action(shopId: string, payload: object) {
    setWorking(true)
    await fetch('/api/admin', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ shopId, ...payload }) })
    await load()
    setSelected(null)
    setWorking(false)
  }

  async function deleteShop(shopId: string) {
    if (!confirm('Eliminare definitivamente questo negozio?')) return
    setWorking(true)
    await fetch('/api/admin', { method: 'DELETE', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ shopId }) })
    await load()
    setSelected(null)
    setWorking(false)
  }

  const s = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'1.5rem' }
  const btn = (bg: string) => ({ background:bg, color:'white', border:'none', borderRadius:'8px', padding:'6px 14px', cursor:'pointer', fontSize:'13px', fontWeight:'600' as const, opacity: working ? 0.6 : 1 })

  if (loading) return <div style={{minHeight:'100vh',background:'#0D0D1A',display:'flex',alignItems:'center',justifyContent:'center',color:'white'}}>Caricamento...</div>
  if (!data) return <div style={{minHeight:'100vh',background:'#0D0D1A',display:'flex',alignItems:'center',justifyContent:'center',color:'white'}}>Non autorizzato</div>

  return (
    <div style={{minHeight:'100vh',background:'#0D0D1A',color:'white',padding:'2rem',maxWidth:'100%'}}>
      <h1 style={{fontSize:'1.8rem',fontWeight:'800',marginBottom:'0.5rem'}}>🛡️ Pannello Admin</h1>
      <p style={{color:'rgba(255,255,255,0.4)',marginBottom:'2rem'}}>Gestione piattaforma Fidelio</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
        {[
          { label:'Negozi totali', value: data.shops.length, icon:'🏪' },
          { label:'Clienti totali', value: data.totalCustomers, icon:'👥' },
          { label:'Visite totali', value: data.totalVisits, icon:'📊' },
          { label:'Piani paganti', value: data.shops.filter(s=>s.plan!=='STARTER').length, icon:'⚡' },
          { label:'Sospesi', value: data.shops.filter(s=>s.suspended).length, icon:'🔴' },
        ].map((stat,i) => (
          <div key={i} style={s}>
            <div style={{fontSize:'1.5rem',marginBottom:'0.3rem'}}>{stat.icon}</div>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.8rem',marginBottom:'0.2rem'}}>{stat.label}</p>
            <div style={{fontSize:'1.8rem',fontWeight:'700'}}>{stat.value}</div>
          </div>
        ))}
      </div>

      <h2 style={{fontSize:'1.2rem',fontWeight:'700',marginBottom:'1rem'}}>Negozi registrati</h2>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.85rem'}}>
          <thead>
            <tr style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
              {['Nome','Città','Piano','Scadenza','Clienti','Visite','Stato','Azioni'].map(h=>(
                <th key={h} style={{textAlign:'left',padding:'0.75rem 0.5rem',color:'rgba(255,255,255,0.5)',fontWeight:'600'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.shops.map(shop => (
              <tr key={shop.id} style={{borderBottom:'1px solid rgba(255,255,255,0.05)',opacity:shop.suspended?0.5:1}}>
                <td style={{padding:'0.75rem 0.5rem',fontWeight:'600'}}>{shop.name}</td>
                <td style={{padding:'0.75rem 0.5rem',color:'rgba(255,255,255,0.6)'}}>{shop.city}</td>
                <td style={{padding:'0.75rem 0.5rem'}}>
                  <span style={{background:shop.plan==='STARTER'?'rgba(255,255,255,0.1)':shop.plan==='GROWTH'?'rgba(108,61,244,0.3)':'rgba(255,107,53,0.3)',padding:'2px 8px',borderRadius:'100px',fontSize:'0.75rem',fontWeight:'600'}}>
                    {shop.plan}
                  </span>
                </td>
                <td style={{padding:'0.75rem 0.5rem',color:'rgba(255,255,255,0.6)',fontSize:'0.8rem'}}>
                  {shop.planExpiresAt ? new Date(shop.planExpiresAt).toLocaleDateString('it-IT') : '—'}
                </td>
                <td style={{padding:'0.75rem 0.5rem',color:'rgba(255,255,255,0.6)'}}>{shop._count.customers}</td>
                <td style={{padding:'0.75rem 0.5rem',color:'rgba(255,255,255,0.6)'}}>{shop._count.visits}</td>
                <td style={{padding:'0.75rem 0.5rem'}}>
                  <span style={{color:shop.suspended?'#FF6B6B':'#10B981',fontSize:'0.8rem',fontWeight:'600'}}>
                    {shop.suspended ? '🔴 Sospeso' : '🟢 Attivo'}
                  </span>
                </td>
                <td style={{padding:'0.75rem 0.5rem'}}>
                  <button onClick={() => setSelected(shop)} style={btn('#6C3DF4')}>Gestisci</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:'1rem'}}>
          <div style={{background:'#1a1a2e',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'20px',padding:'2rem',maxWidth:'480px',width:'100%'}}>
            <h3 style={{fontSize:'1.2rem',fontWeight:'700',marginBottom:'0.3rem'}}>{selected.name}</h3>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.85rem',marginBottom:'1.5rem'}}>{selected.city} · {selected.plan} · {selected._count.customers} clienti</p>

            <div style={{marginBottom:'1.5rem'}}>
              <p style={{fontSize:'0.85rem',fontWeight:'600',marginBottom:'0.5rem',color:'rgba(255,255,255,0.7)'}}>Cambia piano</p>
              <div style={{display:'flex',gap:'0.5rem'}}>
                {['STARTER','GROWTH','PRO'].map(p => (
                  <button key={p} disabled={working} onClick={() => action(selected.id, { action:'changePlan', plan:p })}
                    style={{...btn(selected.plan===p?'#6C3DF4':'rgba(255,255,255,0.1)'),flex:1}}>{p}</button>
                ))}
              </div>
            </div>

            <div style={{marginBottom:'1.5rem'}}>
              <p style={{fontSize:'0.85rem',fontWeight:'600',marginBottom:'0.5rem',color:'rgba(255,255,255,0.7)'}}>Regala mesi abbonamento Growth</p>
              <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                <input type="number" min={1} max={24} value={giftMonths} onChange={e=>setGiftMonths(Number(e.target.value))}
                  style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',padding:'6px 12px',color:'white',width:'80px',outline:'none'}} />
                <span style={{color:'rgba(255,255,255,0.5)',fontSize:'0.85rem'}}>mesi</span>
                <button disabled={working} onClick={() => action(selected.id, { action:'giftMonths', months:giftMonths })}
                  style={btn('#10B981')}>Regala</button>
              </div>
            </div>

            <div style={{display:'flex',gap:'0.5rem',marginBottom:'1rem'}}>
              {selected.suspended
                ? <button disabled={working} onClick={() => action(selected.id, { action:'unsuspend' })} style={{...btn('#10B981'),flex:1}}>✅ Riattiva negozio</button>
                : <button disabled={working} onClick={() => action(selected.id, { action:'suspend' })} style={{...btn('#FF6B35'),flex:1}}>⚠️ Sospendi negozio</button>
              }
              <button disabled={working} onClick={() => deleteShop(selected.id)} style={{...btn('#EF4444'),flex:1}}>🗑️ Elimina definitivamente</button>
            </div>

            <button onClick={() => setSelected(null)} style={{...btn('rgba(255,255,255,0.1)'),width:'100%'}}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  )
}
