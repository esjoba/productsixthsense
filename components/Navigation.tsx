'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAVIGATION = [
  { name: 'Review new requests', href: '/new', icon: '📬' },
  { name: 'Backlog', href: '/backlog', icon: '📋' },
  { name: 'Roadmap', href: '/roadmap', icon: '🗺️' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 w-16 h-screen bg-sidebar border-r border-border flex flex-col items-center py-4 gap-4 z-40">
      {/* Logo indicator */}
      <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-xs font-bold text-white mb-4">
        K
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        {NAVIGATION.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
              title={item.name}
            >
              {item.icon}
            </Link>
          )
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-foreground">
        U
      </div>
    </aside>
  )
}
