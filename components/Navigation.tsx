'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAVIGATION = [
  { name: 'New Requests', href: '/new', icon: '📬' },
  { name: 'Backlog', href: '/backlog', icon: '📋' },
  { name: 'Roadmap', href: '/roadmap', icon: '🗺️' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card p-6 flex flex-col">
      {/* Logo Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Feedback</h1>
        <p className="text-xs text-muted-foreground mt-1">Triage & Prioritize</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Views</p>
        {NAVIGATION.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">Workspace</p>
        <p className="text-sm font-medium text-foreground mt-2">Product Sense</p>
      </div>
    </aside>
  )
}
