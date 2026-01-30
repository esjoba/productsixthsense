'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAVIGATION = [
  { name: 'New Requests', href: '/new', icon: '📬' },
  { name: 'Backlog', href: '/backlog', icon: '📋' },
  { name: 'Roadmap', href: '/roadmap', icon: '🗺️' },
  { name: 'Demo', href: '/demo', icon: '🎯' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2 border-b border-border bg-background p-4">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-foreground">Feedback Triage</h1>
      </div>
      <div className="flex gap-2">
        {NAVIGATION.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}
