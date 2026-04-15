import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist } from 'next/font/google'
import './globals.css'
import { CookieBanner } from '@/components/CookieBanner'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fidelio — Fidelizza i tuoi clienti',
  description: 'La Fedeltà digitale per il tuo Negozio',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="it">
        <body className={geist.className}>
          {children}
          <CookieBanner />
        </body>
      </html>
    </ClerkProvider>
  )
}