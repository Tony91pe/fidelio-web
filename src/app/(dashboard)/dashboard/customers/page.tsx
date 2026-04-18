'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

type Customer = {
  id: string
  name: string
  email: string
  points: number
  totalVisits: number
  lastVisitAt: string | null
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [plan, setPlan] = useState<string>('STARTER')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterSegment, setFilterSegment] = useState<'all' | 'active' | 'inactive' | 'vip' | 'new'>('all')
  const [sortBy, setSortBy] = useState<'createdAt' | 'points' | 'totalVisits' | 'lastVisitAt'>('createdAt')

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard/customers').then(r => r.json()),
      fetch('/api/shop/plan').then(r => r.json()),
    ]).then(([c, p]) => {
      if (Array.isArray(c)) setCustomers(c)
      setPlan(p.plan ?? 'STARTER')
    }).finally(() => setLoading(false))
  }, [])

  const isGrowth = plan === 'GROWTH' || plan === 'PRO'

  const now = Date.now()
  const day = 86400000

  const filtered = useMemo(() => {
    let list = [...customers]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    }

    if (isGrowth && filterSegment !== 'all') {
      list = list.filter(c => {
        const lastVisit = c.lastVisitAt ? now - new Date(c.lastVisitAt).getTime() : Infinity
        if (filterSegment === 'active') return lastVisit < 30 * day
        if (filterSegment === 'inactive') return lastVisit > 60 * day
        if (filterSegment === 'vip') return c.totalVisits >= 10 || c.points >= 200
        if (filterSegment === 'new') return now - new Date(c.createdAt).getTime() < 7 * day
        return true
      })
    }

    list.sort((a, b) => {
      if (sortBy === 'points') return b.points - a.points
      if (sortBy === 'totalVisits') return b.totalVisits - a.totalVisits
      if (sortBy === 'lastVisitAt') {
        const aT = a.lastVisitAt ? new Date(a.lastVisitAt).getTime() : 0
        const bT = b.lastVisitAt ? new Date(b.lastVisitAt).getTime() : 0
        return bT - aT
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return list
  }, [customers, search, filterSegment, sortBy, isGrowth])

  if (loading) return <div style={{textAlign:'center',padding:'3rem',color:'rgba(255,255,255,0.4)'}}>Caricamento...</div>

  const segments = [
    { key: 'all', label: 'Tutti' },
    { key: 'active', label: 'Attivi (30gg)' },
    { key: 'inactive', label: 'Inattivi (60gg+)' },
    { key: 'vip', label: 'VIP' },
    { key: 'new', label: 'Nuovi (7gg)' },
  ] as const

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem'}}>
        <div>
          <h1 style={{fontSize:'1.5rem', fontWeight:'700'}}>Clienti</h1>
          <p style={{color:'rgba(255,255,255,0.4)', marginTop:'0.2rem'}}>{customers.length} clienti registrati</p>
        </div>
        <div style={{display:'flex',gap:'0.5rem'}}>
          <a href="/api/dashboard/customers/export" download
            style={{background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.7)',padding:'10px 16px',
              borderRadius:'10px',fontWeight:'600',textDecoration:'none',fontSize:'14px',border:'1px solid rgba(255,255,255,0.12)'}}>
            ↓ CSV
          </a>
          <Link href="/dashboard/customers/new"
            style={{background:'#6C3DF4', color:'white', padding:'10px 20px',
              borderRadius:'10px', fontWeight:'600', textDecoration:'none', fontSize:'14px'}}>
            + Nuovo cliente
          </Link>
        </div>
      </div>

      {/* Filtri */}
      <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap',marginBottom:'1rem'}}>
        <input
          placeholder="Cerca nome o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,
            padding:'8px 14px',color:'white',outline:'none',fontSize:'14px',flex:1,minWidth:200}}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
          style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,
            padding:'8px 14px',color:'white',outline:'none',fontSize:'14px',cursor:'pointer'}}>
          <option value="createdAt">Recenti</option>
          <option value="points">Per punti</option>
          <option value="totalVisits">Per visite</option>
          <option value="lastVisitAt">Ultima visita</option>
        </select>
      </div>

      {/* Segmentazione — GROWTH+ */}
      {isGrowth ? (
        <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1.25rem'}}>
          {segments.map(s => (
            <button key={s.key} onClick={() => setFilterSegment(s.key)}
              style={{padding:'6px 14px',borderRadius:100,fontSize:'0.8rem',fontWeight:600,cursor:'pointer',border:'none',
                background:filterSegment===s.key?'#7C3AED':'rgba(255,255,255,0.07)',
                color:filterSegment===s.key?'white':'rgba(255,255,255,0.5)'}}>
              {s.label}
            </button>
          ))}
        </div>
      ) : (
        <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1.25rem',opacity:0.4,pointerEvents:'none'}}>
          {segments.map(s => (
            <button key={s.key} style={{padding:'6px 14px',borderRadius:100,fontSize:'0.8rem',fontWeight:600,cursor:'default',border:'none',
              background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.4)'}}>
              {s.label} {s.key !== 'all' && <span style={{fontSize:'0.65rem',background:'rgba(124,58,237,0.3)',color:'#a78bfa',padding:'1px 5px',borderRadius:4,marginLeft:3}}>GROWTH</span>}
            </button>
          ))}
        </div>
      )}

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
        <>
          {filtered.length === 0 && (
            <p style={{textAlign:'center',padding:'2rem',color:'rgba(255,255,255,0.3)'}}>Nessun cliente corrisponde ai filtri</p>
          )}
          <div style={{background:'rgba(255,255,255,0.03)', borderRadius:'16px',
            border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                  {['Cliente','Email','Punti','Visite','Ultima visita'].map(h => (
                    <th key={h} style={{textAlign:'left', padding:'1rem', fontSize:'0.75rem',
                      color:'rgba(255,255,255,0.3)', fontWeight:'600', textTransform:'uppercase'}}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const initials = c.name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()
                  const lastVisit = c.lastVisitAt ? new Date(c.lastVisitAt).toLocaleDateString('it-IT') : '—'
                  const daysSince = c.lastVisitAt ? Math.floor((now - new Date(c.lastVisitAt).getTime()) / day) : null
                  const isInactive = daysSince !== null && daysSince > 60
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
                      <td style={{padding:'0.8rem 1rem', fontSize:'0.8rem',
                        color: isInactive ? '#ef4444' : 'rgba(255,255,255,0.5)',
                        borderTop:'1px solid rgba(255,255,255,0.04)'}}>
                        {lastVisit}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
