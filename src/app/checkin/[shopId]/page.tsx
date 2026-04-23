import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import CheckinForm from './CheckinForm'

const emoji: Record<string,string> = {
  bar:'☕', restaurant:'🍕', hair:'✂️', beauty:'💅',
  gym:'💪', bakery:'🍰', clothing:'👗', bio:'🌿', other:'🏪'
}

export default async function CheckinPage({
  params, searchParams
}: {
  params: Promise<{ shopId: string }>
  searchParams: Promise<{ ref?: string }>
}) {
  const { shopId } = await params
  const { ref } = await searchParams
  const shop = await db.shop.findUnique({ where: { id: shopId } })
  if (!shop) redirect('/')
  return (
    <div style={{minHeight:'100vh', background:'#0D0D1A',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem'}}>
      <div style={{width:'100%', maxWidth:'400px', textAlign:'center'}}>
        <div style={{fontSize:'3rem', marginBottom:'0.5rem'}}>{emoji[shop.category]||'🏪'}</div>
        <h1 style={{color:'white', fontSize:'1.5rem', fontWeight:'700'}}>{shop.name}</h1>
        <p style={{color:'rgba(255,255,255,0.5)', marginBottom:'2rem'}}>
          Registrati per accumulare punti
        </p>
        <CheckinForm shopId={shop.id} shopName={shop.name} defaultRef={ref} />
      </div>
    </div>
  )
}