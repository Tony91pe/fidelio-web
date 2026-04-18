'use client'
import { useEffect, useState } from 'react'

const TYPE_COLORS: Record<string, string> = {
  SHOP_REGISTERED: '#10b981',
  SHOP_APPROVED: '#6C3DF4',
  SHOP_UPDATED: '#a78bfa',
  PLAN_CHANGED: '#f59e0b',
  PLAN_CHANGED_ADMIN: '#f59e0b',
  TRIAL_ACTIVATED: '#06b6d4',
  CHECKIN: '#10b981',
  CUSTOMER_CREATED: '#8b5cf6',
  CUSTOMER_REGISTERED: '#8b5cf6',
  CUSTOMER_LOGIN: '#64748b',
  AUTH_FAILED: '#ef4444',
  AUTH_BLOCKED: '#ef4444',
  ACCOUNT_SUSPENDED: '#ef4444',
  ACCOUNT_DELETED: '#ef4444',
  GIFTCARD_USED: '#f97316',
  QR_REGENERATED: '#f97316',
  NOTIFICATION_SENT: '#06b6d4',
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetch('/api/admin/logs?limit=500')
      .then(r => r.json())
      .then(d => { setLogs(d.logs ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter
    ? logs.filter(l => l.eventType?.toLowerCase().includes(filter.toLowerCase()) || l.action?.toLowerCase().includes(filter.toLowerCase()))
    : logs

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>📋 Log & Audit</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        {logs.length} eventi registrati
      </p>

      <input
        placeholder="Filtra per tipo o azione..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 14px', color: 'white', width: '100%', outline: 'none', fontSize: '14px', marginBottom: '1.25rem' }}
      />

      {loading ? <p style={{ color: 'rgba(255,255,255,0.4)' }}>Caricamento...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Tipo evento', 'Azione', 'Negozio / Utente', 'Dettagli', 'Data'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                  {logs.length === 0 ? 'Nessun log disponibile — gli eventi verranno registrati automaticamente da ora in poi' : 'Nessun risultato per questo filtro'}
                </td></tr>
              ) : filtered.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: `${TYPE_COLORS[log.eventType] ?? '#6C3DF4'}22`, color: TYPE_COLORS[log.eventType] ?? '#a78bfa', border: `1px solid ${TYPE_COLORS[log.eventType] ?? '#6C3DF4'}44`, padding: '2px 8px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {log.eventType}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.8)' }}>{log.action}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                    {log.shopId && <div>shop: {log.shopId.slice(0, 8)}…</div>}
                    {log.userId && <div>user: {log.userId.slice(0, 8)}…</div>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.metadata ? JSON.stringify(log.metadata) : '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString('it-IT')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
