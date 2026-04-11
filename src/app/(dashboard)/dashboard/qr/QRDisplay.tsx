'use client'
import QRCode from 'react-qr-code'

export default function QRDisplay({ shopId, shopName, checkinUrl }: { shopId: string; shopName: string; checkinUrl: string }) {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:'1.5rem', maxWidth:'600px'}}>
      <div style={{background:'white', padding:'1.5rem', borderRadius:'16px', display:'flex', flexDirection:'column', alignItems:'center', width:'fit-content'}}>
        <QRCode value={checkinUrl} size={200} />
        <p style={{textAlign:'center', marginTop:'1rem', color:'#1a1a2e', fontWeight:'700'}}>{shopName}</p>
      </div>
      <div style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'1.5rem'}}>
        <h3 style={{fontWeight:'700', marginBottom:'1rem'}}>Come funziona</h3>
        <p style={{fontSize:'0.85rem', color:'rgba(255,255,255,0.6)', lineHeight:'1.8'}}>
          Stampa questa pagina o mostra lo schermo al cliente. Il cliente inquadra il QR con la fotocamera, inserisce nome e email e riceve 50 punti di benvenuto automaticamente.
        </p>
        <p style={{fontSize:'0.75rem', color:'rgba(255,255,255,0.3)', marginTop:'1rem', wordBreak:'break-all'}}>
          URL: {checkinUrl}
        </p>
        <button onClick={() => window.print()}
          style={{marginTop:'1rem', background:'#6C3DF4', color:'white', padding:'10px 20px', borderRadius:'10px', border:'none', cursor:'pointer', fontWeight:'600'}}>
          Stampa QR code
        </button>
      </div>
    </div>
  )
}
