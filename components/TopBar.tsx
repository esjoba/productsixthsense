'use client'

export function TopBar() {
  return (
    <div className="h-full px-8 flex items-center justify-between bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">
          Kapas <span className="text-accent">6th sense</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Settings
        </button>
        <div className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer">
          <span className="text-sm">👤</span>
        </div>
      </div>
    </div>
  )
}
