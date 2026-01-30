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

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: '64px',
    backgroundColor: '#111111',
    borderRight: '1px solid #27272a',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    zIndex: 50,
    transition: 'width 0.2s ease-in-out',
  }

  const logoStyle: React.CSSProperties = {
    marginBottom: '32px',
    width: '100%',
    opacity: 0,
    transition: 'opacity 0.2s',
  }

  const navStyle: React.CSSProperties = {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: '600',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '16px',
    opacity: 0,
    transition: 'opacity 0.2s',
  }

  const linkStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    textDecoration: 'none',
    color: isActive ? '#60a5fa' : '#a1a1aa',
    backgroundColor: isActive ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
    border: isActive ? '1px solid rgba(96, 165, 250, 0.3)' : 'none',
    whiteSpace: 'nowrap',
  })

  const iconStyle: React.CSSProperties = {
    fontSize: '18px',
    flexShrink: 0,
  }

  const labelTextStyle: React.CSSProperties = {
    opacity: 0,
    transition: 'opacity 0.2s',
  }

  const footerStyle: React.CSSProperties = {
    width: '100%',
    paddingTop: '16px',
    borderTop: '1px solid #27272a',
    opacity: 0,
    transition: 'opacity 0.2s',
  }

  return (
    <>
      <style>{`
        aside:hover {
          width: 256px;
        }
        aside:hover > div:first-child {
          opacity: 1;
        }
        aside:hover nav > p {
          opacity: 1;
        }
        aside:hover a span:last-child {
          opacity: 1;
        }
        aside:hover > div:last-child {
          opacity: 1;
        }
      `}</style>
      <aside style={sidebarStyle}>
        <div style={logoStyle}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>Feedback</h1>
          <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '4px' }}>Triage</p>
        </div>

        <nav style={navStyle}>
          <p style={labelStyle}>Views</p>
          {NAVIGATION.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={linkStyle(isActive)}>
                <span style={iconStyle}>{item.icon}</span>
                <span style={labelTextStyle}>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div style={footerStyle}>
          <p style={{ fontSize: '12px', color: '#52525b' }}>Workspace</p>
          <p style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff', marginTop: '8px' }}>Product Sense</p>
        </div>
      </aside>
    </>
  )
}
