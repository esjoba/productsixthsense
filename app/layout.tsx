import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Navigation } from '@/components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Customer Feedback Triage',
  description: 'Organize and prioritize customer feedback for product decisions',
}

export const viewport: Viewport = {
  themeColor: '#1a1a1f',
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <Navigation />
        <main className="ml-64">
          {children}
        </main>
      </body>
    </html>
  )
}
