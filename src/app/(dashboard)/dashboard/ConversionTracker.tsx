'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function ConversionTracker({ plan }: { plan: string }) {
  const router = useRouter()

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'purchase', {
        event_category: 'subscription',
        event_label: plan,
        value: plan === 'GROWTH' ? 79 : 39,
        currency: 'EUR',
      })
    }
    // Rimuove il param dall'URL senza reload
    const url = new URL(window.location.href)
    url.searchParams.delete('upgraded')
    router.replace(url.pathname + (url.search || ''), { scroll: false })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
