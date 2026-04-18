'use client'
import { useEffect, useState } from 'react'

interface Referral {
  id: string
  shopId: string
  commissionPaid: boolean
  paidAt: string | null
  notes: string | null
  createdAt: string
  shop: { id: string; name: string; ownerEmail: string; plan: string } | null
}

interface Affiliate {
  id: string
  name: string
  email: string
  code: string
  commissionType: 'MONTHLY' | 'ONE_TIME'
  commissionAmount: number
  active: boolean
  notes: string | null
  referrals: Referral[]
  createdAt: string
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'system-ui',
}
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '5px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }

export default function AffiliatesAdmin() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list')
  const [selected, setSelected] = useState<Affiliate | null>(null)
  const [working, setWorking] = useState(false)
  const [shops, setShops] = useState<{ id: string; name: string; ownerEmail: string }[]>([])
  const [shopSearch, setShopSearch] = useState('')
  const [addingShop, setAddingShop] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', code: '', commissionType: 'MONTHLY', commissionAmount: '0', notes: '',
  })

  async function load() {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/affiliates')
      if (r.ok) setAffiliates(await r.json())
    } finally { setLoading(false) }
  }

  async function loadShops() {
    const r = await fetch('/api/admin/shops')
    if (r.ok) {
      const data = await r.json()
      setShops(Array.isArray(data) ? data : data.shops || [])
    }
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setForm({ name: '', email: '', code: '', commissionType: 'MONTHLY', commissionAmount: '0', notes: '' })
    setView('form')
  }

  function openDetail(a: Affiliate) {
    setSelected(a)
    loadShops()
    setView('detail')
    setShopSearch('')
    setAddingShop(false)
  }

  async function save() {
    setWorking(true)
    try {
      await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, commissionAmount: parseFloat(form.commissionAmount) || 0 }),
      })
      await load()
      setView('list')
    } finally { setWorking(false) }
  }

  async function toggleActive(a: Affiliate) {
    await fetch('/api/admin/affiliates', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: a.id, active: !a.active }),
    })
    setAffiliates(prev => prev.map(x => x.id === a.id ? { ...x, active: !x.active } : x))
  }

  async function deleteAffiliate(id: string) {
    if (!confirm('Eliminare questo affiliato?')) return
    await fetch('/api/admin/affiliates', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setAffiliates(prev => prev.filter(a => a.id !== id))
    setView('list')
  }

  async function addReferral(shopId: string) {
    if (!selected) return
    setWorking(true)
    try {
      await fetch('/api/admin/affiliates', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, action: 'addReferral', shopId }),
      })
      await load()
      const updated = affiliates.find(a => a.id === selected.id)
      if (updated) setSelected(updated)
      setAddingShop(false)
    } finally { setWorking(false) }
  }

  async function markPaid(referralId: string, paid: boolean) {
    if (!selected) return
    await fetch('/api/admin/affiliates', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, action: paid ? 'markPaid' : 'markUnpaid', referralId }),
    })
    await load()
  }

  async function removeReferral(referralId: string) {
    await fetch('/api/admin/affiliates', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralId }),
    })
    await load()
  }

  // Sync selected after reload
  useEffect(() => {
    if (selected) {
      const updated = affiliates.find(a => a.id === selected.id)
      if (updated) setSelected(updated)
    }
  }, [affiliates])

  const filteredShops = shops.filter(s =>
    !selected?.referrals.some(r => r.shopId === s.id) &&
    (s.name.toLowerCase().includes(shopSearch.toLowerCase()) || s.ownerEmail?.toLowerCase().includes(shopSearch.toLowerCase()))
  )

  const totalReferrals = affiliates.reduce((s, a) => s + a.referrals.length, 0)
  const totalUnpaid = affiliates.reduce((s, a) => s + a.referrals.filter(r => !r.commissionPaid).length, 0)

  return (
    <div style={{ padding: '2rem', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>Affiliati</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            {affiliates.length} affiliati · {totalReferrals} negozi referati · {totalUnpaid} commissioni da pagare
          </p>
        </div>
        {view === 'list' && (
          <button onClick={openNew} style={{ background: '#6C3DF4', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 18px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
            + Nuovo affiliato
          </button>
        )}
        {view !== 'list' && (
          <button onClick={() => setView('list')} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem' }}>
            ← Lista
          </button>
        )}
      </div>

      {/* LISTA */}
      {view === 'list' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>Caricamento...</div>
          ) : affiliates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16 }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🤝</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>Nessun affiliato ancora.</p>
              <button onClick={openNew} style={{ background: '#6C3DF4', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>
                Crea il primo affiliato
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {affiliates.map(a => {
                const unpaid = a.referrals.filter(r => !r.commissionPaid).length
                return (
                  <div key={a.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${a.active ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)'}`, borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', opacity: a.active ? 1 : 0.5 }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{a.name}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', background: 'rgba(108,61,244,0.15)', color: '#A78BFA', padding: '1px 8px', borderRadius: '100px' }}>{a.code}</span>
                        {!a.active && <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Disattivo</span>}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
                        {a.email} · {a.commissionType === 'MONTHLY' ? 'Mensile' : 'Una tantum'} · €{a.commissionAmount}
                        {a.referrals.length > 0 && <span> · <strong style={{ color: a.referrals.length > 0 ? 'white' : undefined }}>{a.referrals.length} negozi</strong></span>}
                        {unpaid > 0 && <span style={{ color: '#F59E0B' }}> · {unpaid} da pagare</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                      <button onClick={() => openDetail(a)} style={{ background: 'rgba(108,61,244,0.15)', color: '#A78BFA', border: '1px solid rgba(108,61,244,0.2)', borderRadius: 8, padding: '5px 12px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                        Gestisci
                      </button>
                      <button onClick={() => toggleActive(a)} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '5px 10px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                        {a.active ? 'Disattiva' : 'Attiva'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* FORM NUOVO AFFILIATO */}
      {view === 'form' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 560 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Nome *</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Mario Rossi" />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input style={inputStyle} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="mario@example.com" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Codice affiliato * (univoco)</label>
            <input style={{ ...inputStyle, fontFamily: 'monospace', textTransform: 'uppercase' }} value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase().replace(/\s/g, '') }))} placeholder="MARIO2024" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Tipo commissione</label>
              <select style={{ ...inputStyle, appearance: 'none' }} value={form.commissionType} onChange={e => setForm(f => ({ ...f, commissionType: e.target.value }))}>
                <option value="MONTHLY">Mensile ricorrente</option>
                <option value="ONE_TIME">Una tantum</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Importo commissione (€)</label>
              <input style={inputStyle} type="number" min="0" step="0.01" value={form.commissionAmount} onChange={e => setForm(f => ({ ...f, commissionAmount: e.target.value }))} placeholder="0.00" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Note interne</label>
            <input style={inputStyle} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Note private su questo affiliato..." />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={save} disabled={working || !form.name || !form.email || !form.code}
              style={{ flex: 1, background: '#6C3DF4', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, cursor: 'pointer', opacity: (working || !form.name || !form.email || !form.code) ? 0.6 : 1 }}>
              {working ? 'Salvataggio...' : '✓ Crea affiliato'}
            </button>
            <button onClick={() => setView('list')} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 10, padding: '12px 20px', fontWeight: 600, cursor: 'pointer' }}>
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* DETTAGLIO AFFILIATO */}
      {view === 'detail' && selected && (
        <div>
          {/* Info affiliato */}
          <div style={{ background: 'rgba(108,61,244,0.08)', border: '1px solid rgba(108,61,244,0.2)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{selected.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>{selected.email}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>CODICE</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', color: '#A78BFA' }}>{selected.code}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>COMMISSIONE</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>€{selected.commissionAmount} <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{selected.commissionType === 'MONTHLY' ? '/mese' : 'una tantum'}</span></div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>DA PAGARE</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#F59E0B' }}>{selected.referrals.filter(r => !r.commissionPaid).length}</div>
            </div>
            <button onClick={() => deleteAffiliate(selected.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              Elimina
            </button>
          </div>

          {/* Negozi referati */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>Negozi referati ({selected.referrals.length})</h3>
            <button onClick={() => setAddingShop(v => !v)} style={{ background: '#6C3DF4', color: 'white', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
              + Aggiungi negozio
            </button>
          </div>

          {/* Cerca e aggiungi negozio */}
          {addingShop && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
              <input
                placeholder="Cerca negozio per nome o email..."
                value={shopSearch}
                onChange={e => setShopSearch(e.target.value)}
                style={{ ...inputStyle, marginBottom: '0.75rem' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 200, overflowY: 'auto' }}>
                {filteredShops.slice(0, 10).map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '0.6rem 0.9rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{s.ownerEmail}</div>
                    </div>
                    <button onClick={() => addReferral(s.id)} disabled={working}
                      style={{ background: '#10B981', color: 'white', border: 'none', borderRadius: 7, padding: '4px 12px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                      Aggiungi
                    </button>
                  </div>
                ))}
                {filteredShops.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '0.5rem' }}>Nessun negozio trovato</div>}
              </div>
            </div>
          )}

          {/* Lista negozi referati */}
          {selected.referrals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(255,255,255,0.3)' }}>
              Nessun negozio ancora assegnato a questo affiliato.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selected.referrals.map(r => (
                <div key={r.id} style={{ background: r.commissionPaid ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)', border: `1px solid ${r.commissionPaid ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}`, borderRadius: 10, padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{r.shop?.name ?? r.shopId}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                      {r.shop?.ownerEmail} · Piano {r.shop?.plan} · Aggiunto {new Date(r.createdAt).toLocaleDateString('it-IT')}
                      {r.commissionPaid && r.paidAt && <span style={{ color: '#10B981' }}> · Pagato il {new Date(r.paidAt).toLocaleDateString('it-IT')}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <button onClick={() => markPaid(r.id, !r.commissionPaid)}
                      style={{ background: r.commissionPaid ? 'rgba(255,255,255,0.07)' : 'rgba(16,185,129,0.15)', color: r.commissionPaid ? 'rgba(255,255,255,0.4)' : '#10B981', border: `1px solid ${r.commissionPaid ? 'rgba(255,255,255,0.1)' : 'rgba(16,185,129,0.3)'}`, borderRadius: 7, padding: '4px 10px', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
                      {r.commissionPaid ? 'Da pagare' : '✓ Pagato'}
                    </button>
                    <button onClick={() => removeReferral(r.id)}
                      style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 7, padding: '4px 8px', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
