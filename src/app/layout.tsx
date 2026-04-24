import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist } from 'next/font/google'
import './globals.css'
import { CookieBanner } from '@/components/CookieBanner'
import { CrispChat } from '@/components/CrispChat'

const geist = Geist({ subsets: ['latin'], display: 'swap' })

const BASE_URL = 'https://www.getfidelio.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Fidelio — Programma fedeltà digitale per negozi',
    template: '%s | Fidelio',
  },
  description: 'Fidelio ti aiuta a fidelizzare i clienti del tuo negozio con punti digitali, QR code, email automatiche e AI. Setup in 10 minuti, nessuna app richiesta.',
  keywords: ['programma fedeltà', 'fidelizzazione clienti', 'punti digitali', 'QR code negozio', 'loyalty program', 'fidelizzazione negozio'],
  authors: [{ name: 'Fidelio', url: BASE_URL }],
  creator: 'Fidelio',
  publisher: 'Fidelio',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: { google: 'LeZUdcyLi-do76Axi16X8D9FXwO9MIGYE-tJ0kwcTbw' },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: BASE_URL,
    siteName: 'Fidelio',
    title: 'Fidelio — Programma fedeltà digitale per negozi',
    description: 'Fidelizza i tuoi clienti con punti digitali, QR code, email automatiche e AI. Setup in 10 minuti.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Fidelio — Fedeltà digitale per negozi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fidelio — Programma fedeltà digitale per negozi',
    description: 'Fidelizza i tuoi clienti con punti digitali, QR code, email automatiche e AI.',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: BASE_URL },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="it">
        <body className={geist.className}>
          {children}
          <CrispChat />
          <CookieBanner />
        </body>
      </html>
    </ClerkProvider>
  )
}
