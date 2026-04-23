'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { BrowserQRCodeReader } from '@zxing/library'

const QUEUE_KEY = 'fidelio_stamp_queue'

interface PendingStamp {
  id: string
  customerCode: string
  amount?: number
  timestamp: number
  shopName?: string
}

function loadQueue(): PendingStamp[] {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') } catch { return [] }
}

function saveQueue(q: PendingStamp[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
}

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [result, setResult] = useState<{code:string;name:string;points:number;rewardThreshold:number;rewardDescription:string} | null>(null)
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [scanning, setScanning] = useState(true)
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [queue, setQueue] = useState<PendingStamp[]>([])
  const [syncing, setSyncing] = useState(false)
  const readerRef = useRef<BrowserQRCodeReader | null>(null)
  const [branches, setBranches] = useState<{id:string;name:string}[]>([])
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/shop/branches').then(r => r.json()).then((data: {id:string;name:string}[]) => {
      if (Array.isArray(data) && data.length > 1) {
        setBranches(data)
        setSelectedShopId(data[0].id)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    setQueue(loadQueue())
    const onOnline = () => { setOnline(true); syncQueue() }
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline) }
  }, [])

  const syncQueue = useCallback(async () => {
    const q = loadQueue()
    if (!q.length) return
    setSyncing(true)
    const remaining: PendingStamp[] = []
    for (const item of q) {
      try {
        const res = await fetch('/api/scanner/stamp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerCode: item.customerCode, amount: item.amount }),
        })
        if (!res.ok) remaining.push(item)
      } catch { remaining.push(item) }
    }
    saveQueue(remaining)
    setQueue(remaining)
    setSyncing(false)
  }, [])

  useEffect(() => {
    const reader = new BrowserQRCodeReader()
    readerRef.current = reader
    if (videoRef.current) {
      reader.decodeFromVideoDevice(null, videoRef.current, async (res) => {
        if (res) {
          const text = res.getText()
          if (text.startsWith('FID-') || text.startsWith('fidelio-customer:')) {
            const code = text.replace('fidelio-customer:', '')
            setScanning(false)
            reader.reset()
            await handleScan(code)
          }
        }
      })
    }
    return () => { reader.reset() }
  }, [])

  async function handleScan(customerCode: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/scanner/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerCode, ...(selectedShopId ? { shopId: selectedShopId } : {}) }),
      })
      if (!res.ok) throw new Error('Cliente non trovato')
      setResult(await res.json())
    } catch (e: any) {
      setError(e.message)
      setScanning(true)
    } finally { setLoading(false) }
  }

  async function handleAssign() {
    if (!result) return
    setLoading(true)
    try {
      if (!online) {
        const pending: PendingStamp = {
          id: crypto.randomUUID(),
          customerCode: result.code,
          amount: amount ? parseFloat(amount) : undefined,
          timestamp: Date.now(),
          shopName: result.name,
        }
        const newQueue = [...loadQueue(), pending]
        saveQueue(newQueue)
        setQueue(newQueue)
        setSuccess(true)
        setResult(null)
        setAmount('')
        setTimeout(() => { setSuccess(false); setScanning(true) }, 3000)
        return
      }

      const res = await fetch('/api/scanner/stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerCode: result.code, amount: amount ? parseFloat(amount) : undefined, ...(selectedShopId ? { shopId: selectedShopId } : {}) }),
      })
      if (!res.ok) throw new Error('Errore assegnazione punti')
      setSuccess(true)
      setResult(null)
      setAmount('')
      setTimeout(() => { setSuccess(false); setScanning(true) }, 3000)
    } catch (e: any) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Timbra Cliente</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: online ? '#10B981' : '#EF4444' }} />
          <span style={{ fontSize: '12px', color: online ? '#10B981' : '#EF4444', fontWeight: 600 }}>
            {online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Scannerizza il QR del cliente per assegnare punti</p>

      {/* Selettore sede per utenti multi-sede */}
      {branches.length > 1 && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Sede attiva</label>
          <select
            value={selectedShopId ?? ''}
            onChange={e => setSelectedShopId(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', color: 'white', width: '100%', outline: 'none', fontSize: '14px' }}
          >
            {branches.map(b => <option key={b.id} value={b.id} style={{ background: '#1a1a2e' }}>{b.name}</option>)}
          </select>
        </div>
      )}

      {!online && (
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '1rem', fontSize: '13px', color: '#F59E0B' }}>
          ⚠️ Sei offline. I timbri verranno salvati e sincronizzati al rientro della connessione.
        </div>
      )}

      {queue.length > 0 && (
        <div style={{ background: 'rgba(108,61,244,0.1)', border: '1px solid rgba(108,61,244,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            {queue.length} timbr{queue.length === 1 ? 'o' : 'i'} in attesa di sincronizzazione
          </span>
          {online && (
            <button onClick={syncQueue} disabled={syncing}
              style={{ background: '#6C3DF4', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', opacity: syncing ? 0.7 : 1 }}>
              {syncing ? 'Sync...' : 'Sincronizza'}
            </button>
          )}
        </div>
      )}

      {success && (
        <div style={{ background: online ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', border: `1px solid ${online ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: '16px', padding: '2rem', textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
          <h3 style={{ fontWeight: '700', color: online ? '#10B981' : '#F59E0B' }}>
            {online ? 'Punti assegnati!' : 'Timbro salvato offline'}
          </h3>
        </div>
      )}

      {scanning && !success && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', marginBottom: '1rem' }}>
          <video ref={videoRef} style={{ width: '100%', display: 'block' }} />
          <p style={{ textAlign: 'center', padding: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            Inquadra il QR del cliente
          </p>
        </div>
      )}

      {loading && !result && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)' }}>Ricerca cliente...</div>
      )}

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', color: '#EF4444' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ background: 'rgba(108,61,244,0.1)', border: '1px solid rgba(108,61,244,0.3)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{result.name}</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {result.points} punti · Premio a {result.rewardThreshold} punti: {result.rewardDescription}
          </p>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', height: '8px', marginBottom: '1rem' }}>
            <div style={{ background: '#6C3DF4', borderRadius: '8px', height: '8px', width: `${Math.min((result.points / result.rewardThreshold) * 100, 100)}%` }} />
          </div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>
            Importo scontrino (opzionale)
          </label>
          <input
            type="number" min="0" step="0.01" placeholder="Es. 4.50"
            value={amount} onChange={e => setAmount(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px 14px', color: 'white', width: '100%', outline: 'none', fontSize: '14px', marginBottom: '1rem', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleAssign} disabled={loading}
              style={{ flex: 1, background: '#6C3DF4', color: 'white', padding: '12px', borderRadius: '10px', fontWeight: '700', border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Assegnazione...' : online ? '✓ Assegna punti' : '💾 Salva offline'}
            </button>
            <button onClick={() => { setResult(null); setScanning(true) }}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px 16px', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
