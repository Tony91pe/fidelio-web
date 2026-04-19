'use client'
import { useEffect, useRef, useState } from 'react'

interface Notification {
  id: string
  type: 'visit' | 'redemption'
  title: string
  subtitle: string
  icon: string
  createdAt: string
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (diff < 1) return 'adesso'
  if (diff < 60) return `${diff}m fa`
  const h = Math.floor(diff / 60)
  if (h < 24) return `${h}h fa`
  return `${Math.floor(h / 24)}g fa`
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/dashboard/notifications')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.notifications)) {
          setNotifications(d.notifications)
          const lastSeen = localStorage.getItem('fidelio_notif_seen')
          const count = lastSeen
            ? d.notifications.filter((n: Notification) => new Date(n.createdAt) > new Date(lastSeen)).length
            : d.notifications.length
          setUnread(count)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleOpen() {
    setOpen(o => !o)
    if (!open) {
      setUnread(0)
      localStorage.setItem('fidelio_notif_seen', new Date().toISOString())
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={handleOpen}
        style={{ position: 'relative', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px' }}
      >
        🔔
        {unread > 0 && (
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#EF4444', color: 'white', borderRadius: '999px', fontSize: '10px', fontWeight: '700', minWidth: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '320px', background: '#13131F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 200, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>Attività recente</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>Ultimi 7 giorni</p>
          </div>

          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
                Nessuna attività recente
              </div>
            ) : (
              notifications.map((n, i) => (
                <div key={n.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem 1.25rem', alignItems: 'flex-start', borderBottom: i < notifications.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: 'transparent' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: n.type === 'redemption' ? 'rgba(251,191,36,0.12)' : 'rgba(108,61,244,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px' }}>
                    {n.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'white', marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{n.subtitle} · {timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
