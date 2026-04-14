'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface GiftPlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shopId: string
  shopName: string
  onSuccess?: () => void
}

export function GiftPlanModal({ open, onOpenChange, shopId, shopName, onSuccess }: GiftPlanModalProps) {
  const [plan, setPlan] = useState<'STARTER' | 'GROWTH' | 'PRO'>('GROWTH')
  const [months, setMonths] = useState('1')
  const [loading, setLoading] = useState(false)

  const handleGift = async () => {
    if (!months || parseInt(months) < 1 || parseInt(months) > 60) {
      toast.error('Months must be between 1 and 60')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/gift-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId,
          plan,
          months: parseInt(months),
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to gift plan')
      }

      const data = await res.json()
      toast.success(`Gifted ${months} months of ${plan} to ${shopName}`)
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error(String(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gift Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Shop: {shopName}</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Plan</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as 'STARTER' | 'GROWTH' | 'PRO')}
              className="w-full border rounded px-3 py-2"
            >
              <option value="STARTER">STARTER (€0/month)</option>
              <option value="GROWTH">GROWTH (€29/month)</option>
              <option value="PRO">PRO (€99/month)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Number of Months</label>
            <input
              type="number"
              min="1"
              max="60"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded text-sm">
            Total: {months} months of {plan}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleGift} disabled={loading}>
            {loading ? 'Gifting...' : 'Gift Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
