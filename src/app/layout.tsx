import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fidelio — Fidelizza i tuoi clienti',
  description: 'La piattaforma di fidelizzazione per i negozi italiani',
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
        </body>
      </html>
    </ClerkProvider>
  )
}
