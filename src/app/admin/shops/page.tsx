'use client'
import { useEffect, useState, useRef, useMemo } from 'react'

const CATEGORIES = ['bar', 'ristorante', 'pizzeria', 'parrucchiere', 'estetista', 'palestra', 'negozio', 'farmacia', 'supermercato', 'other']
const PLANS = ['STARTER', 'GROWTH', 'PRO']
const PLAN_COLOR: Record<string, string> = { STARTER: '#6b7280', GROWTH: '#7c3aed', PRO: '#f97316' }

const CITY_REGION: Record<string, string> = {
  // Lombardia
  'milano':'Lombardia','bergamo':'Lombardia','brescia':'Lombardia','como':'Lombardia','cremona':'Lombardia','lecco':'Lombardia','lodi':'Lombardia','mantova':'Lombardia','monza':'Lombardia','pavia':'Lombardia','sondrio':'Lombardia','varese':'Lombardia',
  // Lazio
  'roma':'Lazio','viterbo':'Lazio','rieti':'Lazio','frosinone':'Lazio','latina':'Lazio',
  // Campania
  'napoli':'Campania','salerno':'Campania','caserta':'Campania','avellino':'Campania','benevento':'Campania',
  // Sicilia
  'palermo':'Sicilia','catania':'Sicilia','messina':'Sicilia','agrigento':'Sicilia','caltanissetta':'Sicilia','enna':'Sicilia','ragusa':'Sicilia','siracusa':'Sicilia','trapani':'Sicilia',
  // Veneto
  'venezia':'Veneto','verona':'Veneto','padova':'Veneto','vicenza':'Veneto','treviso':'Veneto','belluno':'Veneto','rovigo':'Veneto',
  // Piemonte
  'torino':'Piemonte','alessandria':'Piemonte','asti':'Piemonte','biella':'Piemonte','cuneo':'Piemonte','novara':'Piemonte','verbania':'Piemonte','vercelli':'Piemonte',
  // Emilia-Romagna
  'bologna':'Emilia-Romagna','ferrara':'Emilia-Romagna','forli':'Emilia-Romagna','modena':'Emilia-Romagna','parma':'Emilia-Romagna','piacenza':'Emilia-Romagna','ravenna':'Emilia-Romagna','reggio emilia':'Emilia-Romagna','rimini':'Emilia-Romagna',
  // Toscana
  'firenze':'Toscana','arezzo':'Toscana','grosseto':'Toscana','livorno':'Toscana','lucca':'Toscana','massa':'Toscana','pisa':'Toscana','pistoia':'Toscana','prato':'Toscana','siena':'Toscana',
  // Puglia
  'bari':'Puglia','brindisi':'Puglia','foggia':'Puglia','lecce':'Puglia','taranto':'Puglia','andria':'Puglia','bat':'Puglia',
  // Calabria
  'catanzaro':'Calabria','cosenza':'Calabria','crotone':'Calabria','reggio calabria':'Calabria','vibo valentia':'Calabria',
  // Sardegna
  'cagliari':'Sardegna','nuoro':'Sardegna','oristano':'Sardegna','sassari':'Sardegna','sud sardegna':'Sardegna',
  // Liguria
  'genova':'Liguria','imperia':'Liguria','la spezia':'Liguria','savona':'Liguria',
  // Marche
  'ancona':'Marche','ascoli piceno':'Marche','fermo':'Marche','macerata':'Marche','pesaro':'Marche',
  // Abruzzo
  "l'aquila":'Abruzzo','chieti':'Abruzzo','pescara':'Abruzzo','teramo':'Abruzzo',
  // Friuli-Venezia Giulia
  'trieste':'Friuli-VG','udine':'Friuli-VG','gorizia':'Friuli-VG','pordenone':'Friuli-VG',
  // Trentino-Alto Adige
  'trento':'Trentino-AA','bolzano':'Trentino-AA','bozen':'Trentino-AA',
  // Umbria
  'perugia':'Umbria','terni':'Umbria',
  // Basilicata
  'potenza':'Basilicata','matera':'Basilicata',
  // Molise
  'campobasso':'Molise','isernia':'Molise',
  // Valle d'Aosta
  'aosta':"Valle d'Aosta",
}

function cityToRegion(city: string): string {
  const key = city.toLowerCase().trim()
  return CITY_REGION[key] ?? 'Altra regione'
}

type Shop = {
  id: string; name: string; category: string; city: string; address: string
  plan: string; suspended: boolean; approved: boolean
  createdAt: string; ownerId: string; ownerEmail: string | null
  planExpiresAt: string | null
  _count: { customers: number; visits: number }
}

const inp = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '9px 14px', color: 'white', fontSize: '0.85rem', outline: 'none', width: '100%', fontFamily: 'inherit' }

function ShopDropdown({ shop, working, onAction, onDelete }: {
  shop: Shop
  working: boolean
  onAction: (shopId: string, payload: object) => void
  onDelete: (shop: { id: string; name: string; customers: number }) => void
}) {
  const [open, setOpen] = useState(false)
  const [changingPlan, setChangingPlan] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        dropRef.current && !dropRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleOpen() {
    if (!btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    setDropPos({ top: r.bottom + 6, right: window.innerWidth - r.right })
    setOpen(v => !v)
  }

  const divider = <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />

  const item = (label: string, color: string, onClick: () => void, icon?: string) => (
    <button
      disabled={working}
      onClick={() => { setOpen(false); onClick() }}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', background: 'none', border: 'none', color, padding: '8px 14px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600, textAlign: 'left', opacity: working ? 0.5 : 1 }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  )

  return (
    <div style={{ display: 'inline-block' }}>
      <button
        ref={btnRef}
        onClick={handleOpen}
        style={{ background: 'rgba(108,61,244,0.2)', color: '#a78bfa', border: '1px solid rgba(108,61,244,0.35)', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
      >
        Gestisci {open ? '▲' : '▼'}
      </button>

      {open && (
        <div ref={dropRef} style={{ position: 'fixed', top: dropPos.top, right: dropPos.right, background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, minWidth: 220, zIndex: 9999, boxShadow: '0 12px 40px rgba(0,0,0,0.7)', overflow: 'hidden', paddingTop: 4, paddingBottom: 4 }}>

          {/* Info rapide */}
          <div style={{ padding: '8px 14px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 4 }}>
            {shop._count.customers} clienti · {shop._count.visits} visite
          </div>

          {/* Approvazione */}
          {!shop.approved && item('Approva negozio', '#10b981', () => onAction(shop.id, { action: 'approve' }), '✅')}

          {/* Sospensione */}
          {!shop.suspended
            ? item('Sospendi', '#f97316', () => onAction(shop.id, { action: 'suspend' }), '⏸')
            : item('Riattiva', '#10b981', () => onAction(shop.id, { action: 'unsuspend' }), '▶')}

          {divider}

          {/* Cambio piano */}
          {!changingPlan
            ? item('Cambia piano…', 'rgba(255,255,255,0.7)', () => setChangingPlan(true), '⚡')
            : (
              <div style={{ padding: '6px 14px' }}>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem' }}>Seleziona piano</p>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {PLANS.map(p => (
                    <button key={p} disabled={shop.plan === p || working}
                      onClick={() => { setChangingPlan(false); setOpen(false); onAction(shop.id, { action: 'changePlan', plan: p }) }}
                      style={{ flex: 1, background: shop.plan === p ? `${PLAN_COLOR[p]}33` : 'rgba(255,255,255,0.07)', color: PLAN_COLOR[p], border: `1px solid ${PLAN_COLOR[p]}44`, borderRadius: 6, padding: '5px 4px', cursor: shop.plan === p ? 'default' : 'pointer', fontSize: '0.7rem', fontWeight: 700 }}>
                      {p}
                    </button>
                  ))}
                </div>
                <button onClick={() => setChangingPlan(false)} style={{ marginTop: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>Annulla</button>
              </div>
            )
          }

          {/* Trial fondatore */}
          {item('Regala 6 mesi Growth', '#a78bfa', () => onAction(shop.id, { action: 'giftTrial' }), '🎁')}

          {divider}

          {/* Forza logout */}
          {item('Forza logout', 'rgba(255,255,255,0.5)', () => onAction(shop.id, { action: 'forceLogout' }), '🔒')}

          {divider}

          {/* Elimina */}
          {item('Elimina negozio…', '#ef4444', () => onDelete({ id: shop.id, name: shop.name, customers: shop._count.customers }), '🗑')}
        </div>
      )}
    </div>
  )
}

export default function AdminShops() {
  const [shops, setShops] = useState<Shop[]>([])
  const [search, setSearch] = useState('')
  const [filterPlan, setFilterPlan] = useState<string>('TUTTI')
  const [filterRegion, setFilterRegion] = useState<string>('TUTTE')
  const [working, setWorking] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [form, setForm] = useState({
    name: '', category: 'bar', street: '', civicNumber: '', city: '', phone: '', ownerEmail: '', plan: 'STARTER', logo: '',
  })
  const [logoUploading, setLogoUploading] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string; customers: number } | null>(null)

  async function load() {
    const r = await fetch('/api/admin')
    if (r.ok) { const d = await r.json(); setShops(d.shops) }
  }

  useEffect(() => { load() }, [])

  async function action(shopId: string, payload: object) {
    setWorking(true)
    await fetch('/api/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shopId, ...payload }) })
    await load()
    setWorking(false)
  }

  async function confirmDelete(deleteCustomers: boolean) {
    if (!deleteModal) return
    setWorking(true)
    await fetch('/api/admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId: deleteModal.id, deleteCustomers }),
    })
    setDeleteModal(null)
    await load()
    setWorking(false)
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) setForm(p => ({ ...p, logo: data.url }))
    setLogoUploading(false)
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    setWorking(true)
    const { street, civicNumber, ...rest } = form
    const res = await fetch('/api/admin/create-shop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rest, address: `${street}, ${civicNumber}`.trim().replace(/,\s*$/, '') }),
    })
    const data = await res.json()
    setWorking(false)
    if (!res.ok) { setFormError(data.error || 'Errore'); return }
    setFormSuccess(`✅ Negozio "${data.shop.name}" creato con successo!`)
    setForm({ name: '', category: 'bar', street: '', civicNumber: '', city: '', phone: '', ownerEmail: '', plan: 'STARTER', logo: '' })
    await load()
    setTimeout(() => { setFormSuccess(''); setShowForm(false) }, 2500)
  }

  const regions = useMemo(() => {
    const set = new Set(shops.map(s => cityToRegion(s.city)))
    return ['TUTTE', ...Array.from(set).sort()]
  }, [shops])

  const filtered = shops.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      (s.ownerEmail ?? '').toLowerCase().includes(search.toLowerCase())
    const matchPlan = filterPlan === 'TUTTI' || s.plan === filterPlan
    const matchRegion = filterRegion === 'TUTTE' || cityToRegion(s.city) === filterRegion
    return matchSearch && matchPlan && matchRegion
  })

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>🏪 Gestione Negozi</h1>
        <button onClick={() => { setShowForm(v => !v); setFormError(''); setFormSuccess('') }}
          style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
          {showForm ? '✕ Annulla' : '+ Nuovo negozio'}
        </button>
      </div>

      {/* Form nuovo negozio */}
      {showForm && (
        <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: '1.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: '#10b981' }}>Crea nuovo negozio</h2>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nome negozio *</label>
                <input style={inp} placeholder="es. Bar Centrale" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email proprietario *</label>
                <input style={inp} type="email" placeholder="owner@email.com" value={form.ownerEmail} onChange={e => setForm(p => ({ ...p, ownerEmail: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Via / Piazza *</label>
                <input style={inp} placeholder="es. Via Roma" value={form.street} onChange={e => setForm(p => ({ ...p, street: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>N. Civico *</label>
                <input style={inp} placeholder="es. 12" value={form.civicNumber} onChange={e => setForm(p => ({ ...p, civicNumber: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Città *</label>
                <input style={inp} placeholder="Milano" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Telefono</label>
                <input style={inp} placeholder="+39 02 1234567" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Categoria *</label>
                <select style={{ ...inp }} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Piano</label>
                <select style={{ ...inp }} value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))}>
                  {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Logo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {form.logo && <img src={form.logo} alt="logo" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />}
                  <label style={{ ...inp, cursor: 'pointer', textAlign: 'center', color: logoUploading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)', display: 'block', width: 'auto', flex: 1 }}>
                    {logoUploading ? 'Caricamento...' : form.logo ? '↩ Cambia immagine' : '📷 Carica logo'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} disabled={logoUploading} />
                  </label>
                </div>
              </div>
            </div>
            {formError && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.75rem' }}>⚠️ {formError}</p>}
            {formSuccess && <p style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{formSuccess}</p>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" disabled={working}
                style={{ background: 'linear-gradient(135deg, #10b981, #0ea5e9)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: working ? 'default' : 'pointer', fontWeight: 700, fontSize: '0.85rem', opacity: working ? 0.7 : 1 }}>
                {working ? 'Creazione...' : '✓ Crea negozio'}
              </button>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>
                Il negozio sarà approvato automaticamente · Le coordinate vengono calcolate dall'indirizzo
              </p>
            </div>
          </form>
        </div>
      )}

      {/* Ricerca e filtri */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
        <input placeholder="🔍 Cerca per nome, città o email..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inp, width: 280 }} />

        {/* Filtro piano */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Piano</span>
          {['TUTTI', ...PLANS].map(p => (
            <button key={p} onClick={() => setFilterPlan(p)}
              style={{ padding: '5px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                background: filterPlan === p ? (p === 'TUTTI' ? 'rgba(255,255,255,0.15)' : `${PLAN_COLOR[p]}33`) : 'rgba(255,255,255,0.06)',
                color: filterPlan === p ? (p === 'TUTTI' ? 'white' : PLAN_COLOR[p]) : 'rgba(255,255,255,0.4)',
              }}>
              {p === 'TUTTI' ? 'Tutti' : p}
            </button>
          ))}
        </div>

        {/* Filtro regione */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Regione</span>
          <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
            style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '5px 10px', color: 'white', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}>
            {regions.map(r => <option key={r} value={r} style={{ background: '#1a1a2e', color: 'white' }}>{r === 'TUTTE' ? 'Tutte le regioni' : r}</option>)}
          </select>
        </div>

        {/* Contatore risultati */}
        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
          {filtered.length} / {shops.length} negozi
        </span>
      </div>

      {/* Tabella */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {['Nome', 'Email proprietario', 'Città', 'Piano', 'Clienti', 'Stato', 'Approvato', 'Registrato', 'Scadenza', 'Azioni'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(shop => (
              <tr key={shop.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: shop.suspended ? 0.55 : 1 }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{shop.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>{shop.ownerEmail ?? '—'}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.5)' }}>{shop.city}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ background: `${PLAN_COLOR[shop.plan]}22`, color: PLAN_COLOR[shop.plan], border: `1px solid ${PLAN_COLOR[shop.plan]}44`, padding: '2px 8px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700 }}>{shop.plan}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.5)' }}>{shop._count.customers}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ color: shop.suspended ? '#ef4444' : '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>{shop.suspended ? '● Sospeso' : '● Attivo'}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {shop.approved ? <span style={{ color: '#10b981' }}>✓</span> : <span style={{ color: '#f59e0b' }}>⏳</span>}
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{new Date(shop.createdAt).toLocaleDateString('it-IT')}</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                  {shop.planExpiresAt
                    ? (() => {
                        const d = new Date(shop.planExpiresAt)
                        const expired = d < new Date()
                        const soon = !expired && d < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        return <span style={{ color: expired ? '#ef4444' : soon ? '#f59e0b' : 'rgba(255,255,255,0.4)' }}>
                          {expired ? '⚠ ' : soon ? '⚡ ' : ''}{d.toLocaleDateString('it-IT')}
                        </span>
                      })()
                    : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <ShopDropdown shop={shop} working={working} onAction={action} onDelete={setDeleteModal} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={10} style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>Nessun negozio trovato</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modale conferma eliminazione */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#111827', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '2rem', maxWidth: 460, width: '100%' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>🗑️</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem', textAlign: 'center' }}>Elimina "{deleteModal.name}"</h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '1.75rem', textAlign: 'center', lineHeight: 1.6 }}>
              Il negozio ha <strong style={{ color: 'white' }}>{deleteModal.customers} clienti</strong>.<br />Come vuoi procedere?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              <button disabled={working} onClick={() => confirmDelete(false)}
                style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', color: '#f59e0b', borderRadius: 12, padding: '14px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', textAlign: 'left', opacity: working ? 0.6 : 1 }}>
                <div style={{ marginBottom: '0.2rem' }}>📦 Elimina negozio, mantieni i clienti</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>I {deleteModal.customers} clienti vengono conservati nel DB</div>
              </button>
              <button disabled={working} onClick={() => confirmDelete(true)}
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#ef4444', borderRadius: 12, padding: '14px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', textAlign: 'left', opacity: working ? 0.6 : 1 }}>
                <div style={{ marginBottom: '0.2rem' }}>💥 Elimina tutto</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>Negozio + {deleteModal.customers} clienti + visite + premi. Non reversibile.</div>
              </button>
            </div>
            <button onClick={() => setDeleteModal(null)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: 10, padding: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
