'use client'
import { useEffect, useState, useMemo } from 'react'

type Shop = {
  id: string; name: string; category: string; city: string
  plan: string; suspended: boolean; approved: boolean
  planExpiresAt: string | null; createdAt: string
  ownerId: string
  _count: { customers: number; visits: number }
}
type PwaCustomer = {
  id: string; email: string; name: string; code: string
  points: number; totalVisits: number; createdAt: string
}
type AdminData = {
  shops: Shop[]; totalCustomers: number; totalVisits: number
  pwaCustomers: PwaCustomer[]; otpCodes: number
}

const PLAN_COLOR: Record<string, string> = {
  STARTER: '#6b7280',
  GROWTH: '#7c3aed',
  PRO: '#f97316',
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Shop | null>(null)
  const [giftMonths, setGiftMonths] = useState(1)
  const [working, setWorking] = useState(false)
  const [tab, setTab] = useState<'shops' | 'pwa'>('shops')
  const [search, setSearch] = useState('')
  const [filterPlan, setFilterPlan] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [emailModal, setEmailModal] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [emailTarget, setEmailTarget] = useState<'all' | 'paying' | 'pending'>('all')
  const [emailSending, setEmailSending] = useState(false)
  const [emailDone, setEmailDone] = useState(false)

  async function load() {
    const r = await fetch('/api/admin')
    if (r.ok) setData(await r.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function action(shopId: string, payload: object) {
    setWorking(true)
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId, ...payload })
    })
    await load()
    setSelected(null)
    setWorking(false)
  }

  async function deleteShop(shopId: string) {
    if (!confirm('Eliminare definitivamente questo negozio?')) return
    setWorking(true)
    await fetch('/api/admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId })
    })
    await load()
    setSelected(null)
    setWorking(false)
  }

  async function sendEmail() {
    setEmailSending(true)
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sendEmail', target: emailTarget, subject: emailSubject, body: emailBody })
    })
    setEmailSending(false)
    setEmailDone(true)
    setTimeout(() => { setEmailDone(false); setEmailModal(false); setEmailSubject(''); setEmailBody('') }, 2000)
  }

  const filtered = useMemo(() => {
    if (!data) return []
    return data.shops.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase())
      const matchPlan = filterPlan === 'ALL' || s.plan === filterPlan
      const matchStatus = filterStatus === 'ALL' ||
        (filterStatus === 'ACTIVE' && !s.suspended && s.approved) ||
        (filterStatus === 'SUSPENDED' && s.suspended) ||
        (filterStatus === 'PENDING' && !s.approved)
      return matchSearch && matchPlan && matchStatus
    })
  }, [data, search, filterPlan, filterStatus])

  const mrr = useMemo(() => {
    if (!data) return 0
    return data.shops.reduce((acc, s) => {
      if (s.plan === 'GROWTH') return acc + 29
      if (s.plan === 'PRO') return acc + 79
      return acc
    }, 0)
  }, [data])

  const growthData = useMemo(() => {
    if (!data) return []
    const counts: Record<string, number> = {}
    data.shops.forEach(s => {
      const month = new Date(s.createdAt).toLocaleDateString('it-IT', { month: 'short', year: '2-digit' })
      counts[month] = (counts[month] || 0) + 1
    })
    return Object.entries(counts).slice(-6)
  }, [data])

  const maxGrowth = Math.max(...growthData.map(([, v]) => v), 1)

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080B14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.3)', borderTop: '3px solid #7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>Caricamento...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!data) return (
    <div style={{ minHeight: '100vh', background: '#080B14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontFamily: 'monospace' }}>
      Non autorizzato
    </div>
  )

  const pendingShops = data.shops.filter(s => !s.approved)

  return (
    <div style={{ minHeight: '100vh', background: '#080B14', color: 'white', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 2px; }
        input, select, textarea { font-family: inherit; }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        .row-hover:hover { background: rgba(255,255,255,0.03) !important; }
        .stat-card { animation: fadeIn 0.4s ease both; }
      `}</style>

      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🛡️</div>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Admin Console</h1>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>fidelio · platform</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {pendingShops.length > 0 && (
            <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '4px 12px', fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
              ⏳ {pendingShops.length} in attesa
            </div>
          )}
          <button onClick={() => setEmailModal(true)} style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', color: '#a78bfa', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit' }}>
            ✉️ Invia Email
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'MRR Stimato', value: `€${mrr}`, icon: '💰', accent: '#10b981', delay: '0ms' },
            { label: 'Negozi totali', value: data.shops.length, icon: '🏪', accent: '#7c3aed', delay: '50ms' },
            { label: 'Piani paganti', value: data.shops.filter(s => s.plan !== 'STARTER').length, icon: '⚡', accent: '#f97316', delay: '100ms' },
            { label: 'In attesa', value: pendingShops.length, icon: '⏳', accent: '#f59e0b', delay: '150ms' },
            { label: 'Clienti totali', value: data.totalCustomers, icon: '👥', accent: '#06b6d4', delay: '200ms' },
            { label: 'Clienti PWA', value: data.pwaCustomers.length, icon: '📱', accent: '#8b5cf6', delay: '250ms' },
            { label: 'Visite totali', value: data.totalVisits, icon: '📊', accent: '#ec4899', delay: '300ms' },
            { label: 'Sospesi', value: data.shops.filter(s => s.suspended).length, icon: '🔴', accent: '#ef4444', delay: '350ms' },
          ].map((stat, i) => (
            <div key={i} className="stat-card" style={{ animationDelay: stat.delay, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: stat.accent, opacity: 0.6 }} />
              <div style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {growthData.length > 1 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Crescita negozi per mese</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: 80 }}>
              {growthData.map(([month, count]) => (
                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace' }}>{count}</span>
                  <div style={{ width: '100%', background: 'linear-gradient(180deg, #7c3aed, #a855f7)', borderRadius: '4px 4px 0 0', height: `${(count / maxGrowth) * 60}px`, minHeight: 4 }} />
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{month}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {([['shops', '🏪 Negozi'], ['pwa', '📱 Clienti PWA']] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? '#7c3aed' : 'rgba(255,255,255,0.05)',
              color: tab === t ? 'white' : 'rgba(255,255,255,0.5)',
              border: tab === t ? '1px solid #7c3aed' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '8px 20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              transition: 'all 0.15s ease', fontFamily: 'inherit'
            }}>{label}</button>
          ))}
        </div>

        {tab === 'shops' && (
          <>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <input placeholder="🔍 Cerca per nome o città..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: '0.85rem', outline: 'none', flex: 1, minWidth: 200 }} />
              <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                <option value="ALL">Tutti i piani</option>
                <option value="STARTER">Starter</option>
                <option value="GROWTH">Growth</option>
                <option value="PRO">Pro</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                <option value="ALL">Tutti gli stati</option>
                <option value="ACTIVE">Attivi</option>
                <option value="PENDING">In attesa</option>
                <option value="SUSPENDED">Sospesi</option>
              </select>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', alignSelf: 'center', fontFamily: 'DM Mono, monospace' }}>{filtered.length} risultati</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                      {['Nome', 'Città', 'Categoria', 'Piano', 'Clienti', 'Visite', 'Stato', 'Approvato', 'Registrato', 'Azioni'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(shop => (
                      <tr key={shop.id} className="row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: shop.suspended ? 0.5 : 1 }}>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{shop.name}</td>
                        <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{shop.city}</td>
                        <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{shop.category}</td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span style={{ background: `${PLAN_COLOR[shop.plan]}22`, color: PLAN_COLOR[shop.plan], border: `1px solid ${PLAN_COLOR[shop.plan]}44`, padding: '2px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700 }}>{shop.plan}</span>
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem' }}>{shop._count.customers}</td>
                        <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem' }}>{shop._count.visits}</td>
                        <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                          <span style={{ color: shop.suspended ? '#ef4444' : '#10b981', fontSize: '0.78rem', fontWeight: 600 }}>{shop.suspended ? '● Sospeso' : '● Attivo'}</span>
                        </td>
                        <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                          {shop.approved ? <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 600 }}>✓ Sì</span> : <span style={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 600 }}>⏳ No</span>}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>{new Date(shop.createdAt).toLocaleDateString('it-IT')}</td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <button onClick={() => setSelected(shop)} style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.35)', color: '#a78bfa', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Gestisci →</button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={10} style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>Nessun negozio trovato</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === 'pwa' && (
          <>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              <span style={{ color: 'white', fontWeight: 700 }}>{data.pwaCustomers.length}</span> clienti · <span style={{ color: 'white', fontWeight: 700 }}>{data.otpCodes}</span> codici OTP attivi
            </p>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                      {['Nome', 'Email', 'Codice', 'Punti', 'Visite', 'Registrato'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.pwaCustomers.map(c => (
                      <tr key={c.id} className="row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{c.name}</td>
                        <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.5)' }}>{c.email}</td>
                        <td style={{ padding: '0.875rem 1rem', fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: '#a78bfa' }}>{c.code}</td>
                        <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem' }}>{c.points}</td>
                        <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem' }}>{c.totalVisits}</td>
                        <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontFamily: 'DM Mono, monospace' }}>{new Date(c.createdAt).toLocaleDateString('it-IT')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2rem', maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto', animation: 'slideUp 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{selected.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{selected.city} · {selected.category} · {selected._count.customers} clienti</p>
              </div>
              <span style={{ background: `${PLAN_COLOR[selected.plan]}22`, color: PLAN_COLOR[selected.plan], border: `1px solid ${PLAN_COLOR[selected.plan]}44`, padding: '3px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700 }}>{selected.plan}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Accesso dashboard</p>
                {selected.approved ? (
                  <button disabled={working} onClick={() => action(selected.id, { action: 'unapprove' })}
                    style={{ width: '100%', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 10, padding: '9px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit', opacity: working ? 0.6 : 1 }}>
                    ✕ Revoca approvazione
                  </button>
                ) : (
                  <button disabled={working} onClick={() => action(selected.id, { action: 'approve' })}
                    style={{ width: '100%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: 10, padding: '9px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit', opacity: working ? 0.6 : 1 }}>
                    ✓ Approva negozio
                  </button>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Cambia piano</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['STARTER', 'GROWTH', 'PRO'].map(p => (
                    <button key={p} disabled={working} onClick={() => action(selected.id, { action: 'changePlan', plan: p })}
                      style={{ flex: 1, background: selected.plan === p ? PLAN_COLOR[p] : 'rgba(255,255,255,0.07)', border: `1px solid ${selected.plan === p ? PLAN_COLOR[p] : 'rgba(255,255,255,0.1)'}`, color: 'white', borderRadius: 10, padding: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'inherit', opacity: working ? 0.6 : 1 }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Regala mesi Growth</p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="number" min={1} max={24} value={giftMonths} onChange={e => setGiftMonths(Number(e.target.value))}
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '7px 12px', color: 'white', width: 70, outline: 'none', fontSize: '0.85rem', textAlign: 'center' }} />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>mesi</span>
                  <button disabled={working} onClick={() => action(selected.id, { action: 'giftMonths', months: giftMonths })}
                    style={{ flex: 1, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', color: '#10b981', borderRadius: 8, padding: '7px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit', opacity: working ? 0.6 : 1 }}>
                    🎁 Regala
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selected.suspended
                  ? <button disabled={working} onClick={() => action(selected.id, { action: 'unsuspend' })}
                    style={{ flex: 1, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: 10, padding: '9px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit', opacity: working ? 0.6 : 1 }}>✅ Riattiva</button>
                  : <button disabled={working} onClick={() => action(selected.id, { action: 'suspend' })}
                    style={{ flex: 1, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', color: '#f97316', borderRadius: 10, padding: '9px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit', opacity: working ? 0.6 : 1 }}>⚠️ Sospendi</button>
                }
                <button disabled={working} onClick={() => deleteShop(selected.id)}
                  style={{ flex: 1, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 10, padding: '9px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit', opacity: working ? 0.6 : 1 }}>🗑️ Elimina</button>
              </div>

              <button onClick={() => setSelected(null)}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: 10, padding: '9px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit' }}>
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {emailModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2rem', maxWidth: 480, width: '100%', animation: 'slideUp 0.2s ease' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.3rem' }}>✉️ Invia Email</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>Comunicazione agli owner dei negozi</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>Destinatari</label>
                <select value={emailTarget} onChange={e => setEmailTarget(e.target.value as any)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '9px 12px', color: 'white', fontSize: '0.85rem', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <option value="all">Tutti i negozi ({data.shops.length})</option>
                  <option value="paying">Solo piani paganti ({data.shops.filter(s => s.plan !== 'STARTER').length})</option>
                  <option value="pending">In attesa di approvazione ({pendingShops.length})</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>Oggetto</label>
                <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Oggetto dell'email..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '9px 12px', color: 'white', fontSize: '0.85rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>Messaggio</label>
                <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} placeholder="Scrivi il messaggio..." rows={5}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '9px 12px', color: 'white', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button disabled={emailSending || !emailSubject || !emailBody} onClick={sendEmail}
                  style={{ flex: 1, background: emailDone ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.3)', border: `1px solid ${emailDone ? 'rgba(16,185,129,0.5)' : 'rgba(124,58,237,0.5)'}`, color: emailDone ? '#10b981' : '#a78bfa', borderRadius: 10, padding: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit', opacity: (emailSending || !emailSubject || !emailBody) ? 0.5 : 1 }}>
                  {emailDone ? '✓ Inviata!' : emailSending ? 'Invio...' : '✉️ Invia'}
                </button>
                <button onClick={() => setEmailModal(false)}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit' }}>
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}