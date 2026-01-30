import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Navigation } from '@/components/Navigation'
import { TopBar } from '@/components/TopBar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Customer Feedback Triage',
  description: 'Organize and prioritize customer feedback for product decisions',
}

export const viewport: Viewport = {
  themeColor: '#09090b',
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-white antialiased`}>
        <Navigation />
        <div className="fixed left-16 top-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 z-40">
          <TopBar />
        </div>
        <main className="ml-16 mt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
