'use client'
import { useEffect, useRef, useState } from 'react'
import { BrowserQRCodeReader } from '@zxing/library'

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [result, setResult] = useState<{name:string;points:number;rewardThreshold:number;rewardDescription:string} | null>(null)
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [scanning, setScanning] = useState(true)
  const readerRef = useRef<BrowserQRCodeReader | null>(null)

  useEffect(() => {
    const reader = new BrowserQRCodeReader()
    readerRef.current = reader
    if (videoRef.current) {
      reader.decodeFromVideoDevice(null, videoRef.current, async (res, err) => {
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
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ customerCode }),
      })
      if (!res.ok) throw new Error('Cliente non trovato')
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e.message)
      setScanning(true)
    } finally { setLoading(false) }
  }

  async function handleAssign() {
    if (!result) return
    setLoading(true)
    try {
      const res = await fetch('/api/scanner/stamp', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ customerCode: result.name, amount: amount ? parseFloat(amount) : undefined }),
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
    <div style={{maxWidth:'500px',margin:'0 auto'}}>
      <h1 style={{fontSize:'1.5rem',fontWeight:'700',marginBottom:'0.5rem'}}>Timbra Cliente</h1>
      <p style={{color:'rgba(255,255,255,0.4)',marginBottom:'2rem'}}>Scannerizza il QR del cliente per assegnare punti</p>

      {success && (
        <div style={{background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'16px',padding:'2rem',textAlign:'center',marginBottom:'1rem'}}>
          <div style={{fontSize:'3rem',marginBottom:'0.5rem'}}>✅</div>
          <h3 style={{fontWeight:'700',color:'#10B981'}}>Punti assegnati!</h3>
        </div>
      )}

      {scanning && !success && (
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',overflow:'hidden',marginBottom:'1rem'}}>
          <video ref={videoRef} style={{width:'100%',display:'block'}} />
          <p style={{textAlign:'center',padding:'1rem',color:'rgba(255,255,255,0.5)',fontSize:'0.85rem'}}>
            Inquadra il QR del cliente
          </p>
        </div>
      )}

      {loading && !result && (
        <div style={{textAlign:'center',padding:'2rem',color:'rgba(255,255,255,0.5)'}}>Ricerca cliente...</div>
      )}

      {error && (
        <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'12px',padding:'1rem',marginBottom:'1rem',color:'#EF4444'}}>
          {error}
        </div>
      )}

      {result && (
        <div style={{background:'rgba(108,61,244,0.1)',border:'1px solid rgba(108,61,244,0.3)',borderRadius:'16px',padding:'1.5rem'}}>
          <h3 style={{fontWeight:'700',fontSize:'1.1rem',marginBottom:'0.3rem'}}>{result.name}</h3>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.85rem',marginBottom:'1rem'}}>
            {result.points} punti · Premio a {result.rewardThreshold} punti: {result.rewardDescription}
          </p>
          <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'8px',height:'8px',marginBottom:'1rem'}}>
            <div style={{background:'#6C3DF4',borderRadius:'8px',height:'8px',width:`${Math.min((result.points/result.rewardThreshold)*100,100)}%`}} />
          </div>
          <label style={{display:'block',fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:'0.4rem'}}>
            Importo scontrino (opzionale)
          </label>
          <input
            type="number" min="0" step="0.01" placeholder="Es. 4.50"
            value={amount} onChange={e => setAmount(e.target.value)}
            style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'10px',padding:'10px 14px',color:'white',width:'100%',outline:'none',fontSize:'14px',marginBottom:'1rem'}}
          />
          <div style={{display:'flex',gap:'0.5rem'}}>
            <button onClick={handleAssign} disabled={loading}
              style={{flex:1,background:'#6C3DF4',color:'white',padding:'12px',borderRadius:'10px',fontWeight:'700',border:'none',cursor:'pointer',opacity:loading?0.7:1}}>
              {loading ? 'Assegnazione...' : '✓ Assegna punti'}
            </button>
            <button onClick={() => { setResult(null); setScanning(true) }}
              style={{background:'rgba(255,255,255,0.1)',color:'white',padding:'12px 16px',borderRadius:'10px',fontWeight:'600',border:'none',cursor:'pointer'}}>
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
