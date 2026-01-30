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
      <head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html { color-scheme: dark; }
          body { 
            background-color: #09090b; 
            color: #ffffff; 
            font-family: ${inter.style.fontFamily};
          }
          main {
            margin-left: 64px;
            min-height: 100vh;
            background-color: #09090b;
          }
        `}</style>
      </head>
      <body style={{ backgroundColor: '#09090b', color: '#ffffff', fontFamily: inter.style.fontFamily }}>
        <Navigation />
        <main style={{ marginLeft: '64px', minHeight: '100vh', backgroundColor: '#09090b' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
