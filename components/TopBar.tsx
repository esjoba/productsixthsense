'use client'

export function TopBar() {
  return (
    <div className="h-full px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-white text-sm font-bold">K</span>
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight">
          Kapas <span className="text-blue-400">6th sense</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Settings
        </button>
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors cursor-pointer">
          <span className="text-sm">👤</span>
        </div>
      </div>
    </div>
  )
}
