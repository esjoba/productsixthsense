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
    <aside className="fixed left-0 top-0 h-screen w-16 hover:w-64 bg-zinc-950 border-r border-zinc-800 transition-all duration-200 ease-in-out flex flex-col items-start p-4 group z-50">
      {/* Logo - visible on hover */}
      <div className="mb-8 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <h1 className="text-xl font-bold text-white">Feedback</h1>
        <p className="text-xs text-zinc-400 mt-1">Triage</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 w-full space-y-2">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 opacity-0 group-hover:opacity-100 transition-opacity">Views</p>
        {NAVIGATION.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="w-full pt-4 border-t border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <p className="text-xs text-zinc-600">Workspace</p>
        <p className="text-sm font-medium text-white mt-2">Product Sense</p>
      </div>
    </aside>
  )
}
