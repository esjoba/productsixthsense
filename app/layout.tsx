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
  themeColor: '#1a1a1a',
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Navigation />
        
        <div className="ml-16 flex flex-col h-screen">
          {/* Top bar */}
          <div className="h-16 border-b border-border flex-shrink-0">
            <TopBar />
          </div>
          
          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
