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
        <div className="flex h-screen">
          {/* Sidebar */}
          <Navigation />
          
          {/* Main area */}
          <div className="flex-1 flex flex-col">
            {/* Top bar */}
            <div className="h-16 bg-zinc-900 border-b border-zinc-800 flex-shrink-0">
              <TopBar />
            </div>
            
            {/* Content */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
