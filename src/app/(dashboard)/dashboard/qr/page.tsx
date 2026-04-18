import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import QRDisplay from './QRDisplay'

export default async function QRPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')
  const shop = await db.shop.findFirst({ where: { ownerId: userId } })
  if (!shop) redirect('/dashboard/shop')
  const checkinUrl = process.env.NEXT_PUBLIC_APP_URL + '/checkin/' + shop.id
  return (
    <div>
      <h1 style={{fontSize:'1.5rem',fontWeight:'700',marginBottom:'0.5rem'}}>QR Code</h1>
      <p style={{color:'rgba(255,255,255,0.4)',marginBottom:'2rem'}}>
        Stampa questo QR code e mettilo alla cassa.
      </p>
      <QRDisplay shopId={shop.id} shopName={shop.name} checkinUrl={checkinUrl} plan={shop.plan} />
    </div>
  )
}
