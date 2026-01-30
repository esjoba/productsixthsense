'use client'

import { useEffect, useState } from 'react'

interface Epic {
  id: string
  title: string
  votes?: number
  companies?: number
  trend_score?: number
  bucket?: string
}

export function RoadmapScreen() {
  const [ideas, setIdeas] = useState<Epic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'kanban' | 'trending'>('kanban')

  useEffect(() => {
    async function loadIdeas() {
      try {
        const response = await fetch('/api/ideas')
        const data = await response.json()
        setIdeas(data)
      } catch (error) {
        console.error('Failed to load ideas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadIdeas()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-400">Loading roadmap...</p>
      </div>
    )
  }

  const nowBucket = ideas.filter((i) => i.bucket === 'NOW')
  const nextBucket = ideas.filter((i) => i.bucket === 'NEXT')
  const laterBucket = ideas.filter((i) => i.bucket === 'LATER')
  const trendingIdeas = [...ideas].sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0)).slice(0, 8)

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Roadmap</h1>
          <p className="mt-1 text-sm text-zinc-400">Prioritized by customer feedback</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'kanban'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Roadmap
          </button>
          <button
            onClick={() => setViewMode('trending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'trending'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Trending
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        /* Kanban View: NOW / NEXT / LATER */
        <div className="grid grid-cols-3 gap-6">
          {/* NOW */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 min-h-96 flex flex-col">
            <div className="mb-6 pb-4 border-b border-zinc-800">
              <h2 className="font-semibold text-white text-base">NOW</h2>
              <p className="text-xs text-zinc-500 mt-1">{nowBucket.length} items</p>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {nowBucket.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-lg border border-zinc-700 bg-zinc-800/50 hover:border-green-500/50 p-4 transition-colors"
                >
                  <h3 className="text-sm font-medium text-white line-clamp-2 mb-3">{idea.title}</h3>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{idea.votes || 0} votes</span>
                    <span>{idea.companies || 0} cos</span>
                    <span className="font-semibold text-green-400">{idea.trend_score || 0}</span>
                  </div>
                </div>
              ))}
              {nowBucket.length === 0 && (
                <p className="text-xs text-zinc-500 py-8">No items in NOW</p>
              )}
            </div>
          </div>

          {/* NEXT */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 min-h-96 flex flex-col">
            <div className="mb-6 pb-4 border-b border-zinc-800">
              <h2 className="font-semibold text-white text-base">NEXT</h2>
              <p className="text-xs text-zinc-500 mt-1">{nextBucket.length} items</p>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {nextBucket.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-lg border border-zinc-700 bg-zinc-800/50 hover:border-yellow-500/50 p-4 transition-colors"
                >
                  <h3 className="text-sm font-medium text-white line-clamp-2 mb-3">{idea.title}</h3>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{idea.votes || 0} votes</span>
                    <span>{idea.companies || 0} cos</span>
                    <span className="font-semibold text-yellow-400">{idea.trend_score || 0}</span>
                  </div>
                </div>
              ))}
              {nextBucket.length === 0 && (
                <p className="text-xs text-zinc-500 py-8">No items in NEXT</p>
              )}
            </div>
          </div>

          {/* LATER */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 min-h-96 flex flex-col">
            <div className="mb-6 pb-4 border-b border-zinc-800">
              <h2 className="font-semibold text-white text-base">LATER</h2>
              <p className="text-xs text-zinc-500 mt-1">{laterBucket.length} items</p>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {laterBucket.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-lg border border-zinc-700 bg-zinc-800/50 hover:border-purple-500/50 p-4 transition-colors"
                >
                  <h3 className="text-sm font-medium text-white line-clamp-2 mb-3">{idea.title}</h3>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{idea.votes || 0} votes</span>
                    <span>{idea.companies || 0} cos</span>
                    <span className="font-semibold text-purple-400">{idea.trend_score || 0}</span>
                  </div>
                </div>
              ))}
              {laterBucket.length === 0 && (
                <p className="text-xs text-zinc-500 py-8">No items in LATER</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Trending View: Top 8 as grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingIdeas.map((idea) => (
            <div
              key={idea.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-blue-500/50 p-6 flex flex-col transition-colors group cursor-pointer"
            >
              <h3 className="text-sm font-medium text-white mb-4 line-clamp-3">{idea.title}</h3>
              
              <div className="text-3xl font-bold text-blue-400 mb-4">
                {idea.trend_score || 0}
              </div>

              <div className="space-y-2 text-xs text-zinc-500 mb-6">
                <div className="flex items-center justify-between">
                  <span>Votes</span>
                  <span className="font-semibold text-zinc-300">{idea.votes || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Companies</span>
                  <span className="font-semibold text-zinc-300">{idea.companies || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last 7 days</span>
                  <span className="font-semibold text-zinc-300">+5</span>
                </div>
              </div>

              <button className="mt-auto px-3 py-2 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors">
                View details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
