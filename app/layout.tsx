import type { Metadata, Viewport } from 'next'
import { AppLayout } from '@/components/AppLayout'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kapas 6th Sense | Customer Feedback Triage',
  description: 'Organize and prioritize customer feedback for product decisions',
}

export const viewport: Viewport = {
  themeColor: '#141414',
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
