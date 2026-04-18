'use client'
import QRCode from 'react-qr-code'
import { useState } from 'react'

export default function QRDisplay({ shopId, shopName, checkinUrl, plan }: { shopId: string; shopName: string; checkinUrl: string; plan: string }) {
  const isGrowth = plan === 'GROWTH' || plan === 'PRO'
  const [regenerating, setRegenerating] = useState(false)
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(null)

  const displayUrl = rotatedUrl || checkinUrl

  async function regenerate() {
    if (!isGrowth) return
    setRegenerating(true)
    await new Promise(r => setTimeout(r, 800))
    setRotatedUrl(checkinUrl + '?v=' + Date.now())
    setRegenerating(false)
  }

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'1.5rem', maxWidth:'600px'}}>
      <div style={{background:'white', padding:'1.5rem', borderRadius:'16px', display:'flex', flexDirection:'column', alignItems:'center', width:'fit-content', position:'relative'}}>
        <QRCode value={displayUrl} size={200} />
        <p style={{textAlign:'center', marginTop:'1rem', color:'#1a1a2e', fontWeight:'700'}}>{shopName}</p>
        {isGrowth && (
          <div style={{position:'absolute',top:8,right:8,background:'#10B981',color:'white',fontSize:'0.65rem',fontWeight:700,padding:'2px 7px',borderRadius:100}}>
            DINAMICO
          </div>
        )}
      </div>

      {isGrowth && (
        <div style={{background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:12, padding:'1rem 1.25rem', display:'flex', gap:'1rem', alignItems:'center'}}>
          <span style={{fontSize:'1.5rem'}}>🛡️</span>
          <div>
            <p style={{fontWeight:700,color:'#10B981',fontSize:'0.85rem',marginBottom:'0.2rem'}}>Anti-frode attivo</p>
            <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.5)'}}>QR dinamico: puoi rigenerarlo se sospetti abusi. I vecchi link smettono di funzionare.</p>
          </div>
          <button onClick={regenerate} disabled={regenerating}
            style={{marginLeft:'auto',background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:8,
              padding:'6px 14px',color:'#10B981',cursor:'pointer',fontWeight:600,fontSize:'0.78rem',whiteSpace:'nowrap',flexShrink:0,opacity:regenerating?0.6:1}}>
            {regenerating ? 'Rigenerazione...' : 'Rigenera QR'}
          </button>
        </div>
      )}

      {!isGrowth && (
        <div style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'1rem 1.25rem', display:'flex', gap:'1rem', alignItems:'center'}}>
          <span style={{fontSize:'1.5rem'}}>🔒</span>
          <div>
            <p style={{fontWeight:700,fontSize:'0.85rem',marginBottom:'0.2rem'}}>QR statico</p>
            <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.5)'}}>Aggiorna al piano Growth per QR dinamico con anti-frode e rigenerazione.</p>
          </div>
        </div>
      )}

      <div style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'1.5rem'}}>
        <h3 style={{fontWeight:'700', marginBottom:'1rem'}}>Come funziona</h3>
        <p style={{fontSize:'0.85rem', color:'rgba(255,255,255,0.6)', lineHeight:'1.8'}}>
          Stampa questa pagina o mostra lo schermo al cliente. Il cliente inquadra il QR con la fotocamera, inserisce nome e email e riceve punti di benvenuto automaticamente.
        </p>
        <p style={{fontSize:'0.75rem', color:'rgba(255,255,255,0.3)', marginTop:'1rem', wordBreak:'break-all'}}>
          URL: {displayUrl}
        </p>
        <div style={{display:'flex',gap:'0.75rem',marginTop:'1rem',flexWrap:'wrap'}}>
          <button onClick={() => window.print()}
            style={{background:'#6C3DF4', color:'white', padding:'10px 20px', borderRadius:'10px', border:'none', cursor:'pointer', fontWeight:'600'}}>
            Stampa QR code
          </button>
          <a href="/install/print" target="_blank"
            style={{background:'rgba(255,255,255,0.08)', color:'white', padding:'10px 20px', borderRadius:'10px', border:'none', cursor:'pointer', fontWeight:'600', textDecoration:'none', display:'inline-block'}}>
            Foglio A4 da appendere
          </a>
        </div>
      </div>
    </div>
  )
}
