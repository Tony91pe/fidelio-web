cat > src/app/\(dashboard\)/layout.tsx << 'EOF'
'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'approved' | 'pending' | 'no-shop'>('loading')

  useEffect(() => {
    fetch('/api/shop/status')
      .then(r => r.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('no-shop'))
  }, [])

  if (status === 'loading') {
    return (
      <div style={{minHeight:'100vh',background:'#0F0F1A',display:'flex',alignItems:'center',justifyContent:'center',color:'white'}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:'48px',height:'48px',borderRadius:'14px',background:'linear-gradient(135deg,#7C3AED,#3B82F6)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:'24px',fontWeight:'900'}}>F</div>
          <p style={{color:'rgba(255,255,255,0.4)'}}>Caricamento...</p>
        </div>
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div style={{minHeight:'100vh',background:'#0F0F1A',display:'flex',alignItems:'center',justifyContent:'center',color:'white',padding:'2rem'}}>
        <div style={{textAlign:'center',maxWidth:'480px'}}>
          <div style={{width:'72px',height:'72px',borderRadius:'20px',background:'linear-gradient(135deg,#7C3AED,#3B82F6)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',fontSize:'36px',fontWeight:'900'}}>F</div>
          <h1 style={{fontSize:'1.8rem',fontWeight:'800',marginBottom:'0.75rem'}}>In attesa di approvazione</h1>
          <p style={{color:'rgba(255,255,255,0.5)',lineHeight:'1.7',marginBottom:'2rem'}}>
            La tua registrazione è stata ricevuta. Il nostro team verificherà le informazioni del tuo negozio e ti darà accesso entro 24 ore.
          </p>
          <div style={{background:'rgba(108,61,244,0.1)',border:'1px solid rgba(108,61,244,0.3)',borderRadius:'16px',padding:'1.5rem',marginBottom:'2rem'}}>
            <p style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.7)'}}>
              Riceverai una email a conferma dell'approvazione. Nel frattempo puoi contattarci a <a href="mailto:info@fidelio.it" style={{color:'#A78BFA'}}>info@fidelio.it</a>
            </p>
          </div>
          <a href="/" style={{color:'rgba(255,255,255,0.4)',fontSize:'0.9rem',textDecoration:'none'}}>← Torna alla home</a>
        </div>
      </div>
    )
  }

  if (status === 'no-shop') {
    return (
      <div className="flex min-h-screen bg-[#0F0F1A] text-white">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0F0F1A] text-white">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}
EOF