'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAVIGATION = [
  { name: 'Review new requests', href: '/new', icon: '📬' },
  { name: 'Backlog', href: '/backlog', icon: '📋' },
  { name: 'Roadmap', href: '/roadmap', icon: '🗺️' },
]

export function Navigation() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col p-4 z-50 transition-all duration-200 ease-in-out"
      style={{ width: isExpanded ? '256px' : '64px' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <div className="mb-8 overflow-hidden">
        <div className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-lg font-bold text-white">Feedback</h1>
          <p className="text-xs text-zinc-400 mt-1">Triage</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        <p className={`text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          Views
        </p>
        {NAVIGATION.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-300'
              }`}
              title={item.name}
            >
              <span className="text-lg flex-shrink-0 flex items-center justify-center">{item.icon}</span>
              <span className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={`pt-4 border-t border-zinc-800 overflow-hidden transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-xs text-zinc-600">Workspace</p>
        <p className="text-sm font-medium text-white mt-2">Product Sense</p>
      </div>
    </aside>
  )
}
