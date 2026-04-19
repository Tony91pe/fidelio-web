'use client'

export function CrispButton({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  function open() {
    if (typeof window !== 'undefined' && (window as any).$crisp) {
      (window as any).$crisp.push(['do', 'chat:open'])
    }
  }
  return (
    <button onClick={open} style={style}>
      {children}
    </button>
  )
}

export function CrispLoader() {
  if (typeof window === 'undefined') return null
  const id = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID
  if (!id) return null
  return null
}
