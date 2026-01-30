'use client'

import { ReactNode } from 'react'
import { SidebarProvider, useSidebar } from './SidebarContext'
import { Navigation } from './Navigation'
import { TopBar } from './TopBar'

function LayoutContent({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'ml-16' : 'ml-56'
        }`}
      >
        {/* Top bar */}
        <div className="h-14 border-b border-border flex-shrink-0 sticky top-0 z-30 bg-background">
          <TopBar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  )
}
