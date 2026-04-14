'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { GiftPlanModal } from '@/components/admin/GiftPlanModal'

interface Shop {
  id: string
  name: string
  email: string
  plan?: string
}

export default function AdminPlans() {
  const [shops, setShops] = useState<Shop[]>([])
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [giftModalOpen, setGiftModalOpen] = useState(false)

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setShops(data.users.filter((u: any) => u.type === 'MERCHANT'))
  }

  const changePlan = async (shopId: string, newPlan: string) => {
    const res = await fetch('/api/admin/plans/change', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId, newPlan }),
    })
    if (res.ok) {
      fetchShops()
    }
  }

  const openGiftModal = (shop: Shop) => {
    setSelectedShop(shop)
    setGiftModalOpen(true)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Plan Management</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Shop</th>
            <th className="p-2 text-left">Plan</th>
            <th className="p-2">Change Plan</th>
            <th className="p-2">Gift Plan</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((shop) => (
            <tr key={shop.id} className="border-t">
              <td className="p-2">{shop.name}</td>
              <td className="p-2">{shop.plan || 'STARTER'}</td>
              <td className="p-2 space-x-1">
                {['STARTER', 'GROWTH', 'PRO'].map(plan => (
                  <Button
                    key={plan}
                    size="sm"
                    variant="outline"
                    onClick={() => changePlan(shop.id, plan)}
                  >
                    {plan}
                  </Button>
                ))}
              </td>
              <td className="p-2">
                <Button size="sm" onClick={() => openGiftModal(shop)}>
                  Gift
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedShop && (
        <GiftPlanModal
          open={giftModalOpen}
          onOpenChange={setGiftModalOpen}
          shopId={selectedShop.id}
          shopName={selectedShop.name}
          onSuccess={fetchShops}
        />
      )}
    </div>
  )
}
