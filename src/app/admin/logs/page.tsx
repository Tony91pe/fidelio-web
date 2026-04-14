'use client'
import { useEffect, useState } from 'react'

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/logs')
      .then(r => r.json())
      .then(d => { setLogs(d.logs ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ background: '#0D0D1A', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>📋 Log & Audit</h1>
      {loading ? <p style={{ color: 'rgba(255,255,255,0.4)' }}>Caricamento...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Evento', 'Utente', 'Dettagli', 'Data'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>Nessun log disponibile</td></tr>
              ) : logs.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: '#a78bfa' }}>{log.event}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.5)' }}>{log.userId}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{JSON.stringify(log.metadata)}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{new Date(log.createdAt).toLocaleString('it-IT')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
