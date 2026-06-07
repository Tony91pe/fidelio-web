'use client'

import { useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  type: 'MERCHANT' | 'CUSTOMER'
  name: string
  email: string
  suspended: boolean
  createdAt: string
  lastActivityAt: string | null
}

const btn = (variant: 'primary' | 'outline' | 'danger' | 'ghost'): React.CSSProperties => {
  const base: React.CSSProperties = {
    padding: '0.35rem 0.75rem',
    borderRadius: 6,
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'opacity 0.15s',
  }
  if (variant === 'primary') return { ...base, background: 'linear-gradient(135deg, #7C3AED, #3B82F6)', color: '#fff' }
  if (variant === 'outline') return { ...base, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)' }
  if (variant === 'danger') return { ...base, background: '#7f1d1d', color: '#fca5a5', border: '1px solid #991b1b' }
  return { ...base, background: 'transparent', color: 'rgba(255,255,255,0.45)' }
}

export function AdminPasswordManager() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}&limit=100`)
      const data = await res.json()
      setUsers(data.users ?? [])
    } catch {
      showToast('Errore caricamento utenti', 'err')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300)
    return () => clearTimeout(t)
  }, [fetchUsers])

  const handleResetPassword = async () => {
    if (!selectedUser) return
    setResetting(true)
    try {
      const res = await fetch('/api/admin/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      showToast(`Password temporanea: ${data.tempPassword}`, 'ok')
      setResetModalOpen(false)
      setSelectedUser(null)
    } catch {
      showToast('Reset fallito', 'err')
    } finally {
      setResetting(false)
    }
  }

  const handleForceLogout = async () => {
    if (!selectedUser) return
    setResetting(true)
    try {
      const res = await fetch('/api/admin/force-logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      showToast(data.message ?? `${selectedUser.name} disconnesso`, 'ok')
      setLogoutModalOpen(false)
      setSelectedUser(null)
      fetchUsers()
    } catch {
      showToast('Logout forzato fallito', 'err')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.type === 'ok' ? '#14532d' : '#7f1d1d',
          color: toast.type === 'ok' ? '#86efac' : '#fca5a5',
          border: `1px solid ${toast.type === 'ok' ? '#166534' : '#991b1b'}`,
          borderRadius: 10, padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: 600,
          maxWidth: 420, wordBreak: 'break-all',
        }}>
          {toast.msg}
        </div>
      )}

      <input
        placeholder="Cerca per nome o email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, padding: '0.5rem 0.85rem', color: '#fff', fontSize: '0.85rem',
          outline: 'none', width: 280, marginBottom: '1.25rem',
        }}
      />

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', padding: '2rem 0' }}>Caricamento...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Tipo', 'Nome', 'Email', 'Stato', 'Ultima attività', 'Azioni'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.6rem 0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'rgba(255,255,255,0.5)' }}>{user.type === 'MERCHANT' ? 'Negozio' : 'Cliente'}</td>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#fff', fontWeight: 500 }}>{user.name}</td>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{user.email}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <span style={{ color: user.suspended ? '#f87171' : '#4ade80', fontWeight: 600 }}>
                      {user.suspended ? 'Sospeso' : 'Attivo'}
                    </span>
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
                    {user.lastActivityAt ? new Date(user.lastActivityAt).toLocaleDateString('it-IT') : 'Mai'}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', display: 'flex', gap: '0.4rem' }}>
                    <button style={btn('outline')} onClick={() => { setSelectedUser(user); setResetModalOpen(true) }}>
                      Reset Password
                    </button>
                    <button style={btn('danger')} onClick={() => { setSelectedUser(user); setLogoutModalOpen(true) }}>
                      Force Logout
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>Nessun utente trovato</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {resetModalOpen && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '2rem', width: 400, maxWidth: '90vw' }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>Reset Password</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Verrà generata una password temporanea per <strong style={{ color: '#fff' }}>{selectedUser.name}</strong> ({selectedUser.email}).
              La password temporanea sarà visibile solo ora.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button style={btn('ghost')} onClick={() => setResetModalOpen(false)}>Annulla</button>
              <button style={btn('primary')} onClick={handleResetPassword} disabled={resetting}>
                {resetting ? 'Reset...' : 'Conferma Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {logoutModalOpen && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '2rem', width: 400, maxWidth: '90vw' }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>Force Logout</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Tutte le sessioni attive di <strong style={{ color: '#fff' }}>{selectedUser.name}</strong> verranno revocate immediatamente.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button style={btn('ghost')} onClick={() => setLogoutModalOpen(false)}>Annulla</button>
              <button style={btn('danger')} onClick={handleForceLogout} disabled={resetting}>
                {resetting ? 'Disconnessione...' : 'Conferma Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
