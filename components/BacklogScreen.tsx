'use client'

import { useEffect, useState } from 'react'

interface Idea {
  id: string
  title: string
  tags?: string[]
  votes?: number
  companies?: number
  trend_score?: number
  bucket?: string
  last_mention?: string
}

export function BacklogScreen() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('trend-desc')
  const [filterBucket, setFilterBucket] = useState('all')
  const [filterTags, setFilterTags] = useState<string[]>([])

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

  const sortIdeas = (ideas: Idea[]) => {
    const sorted = [...ideas]
    if (sortBy === 'trend-desc') {
      sorted.sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0))
    } else if (sortBy === 'companies-desc') {
      sorted.sort((a, b) => (b.companies || 0) - (a.companies || 0))
    } else if (sortBy === 'votes-desc') {
      sorted.sort((a, b) => (b.votes || 0) - (a.votes || 0))
    }
    return sorted
  }

  const filterIdeas = (ideas: Idea[]) => {
    return ideas.filter((idea) => {
      const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBucket = filterBucket === 'all' || idea.bucket === filterBucket
      const matchesTags = filterTags.length === 0 || filterTags.some((tag) => idea.tags?.includes(tag))
      return matchesSearch && matchesBucket && matchesTags
    })
  }

  const filteredAndSorted = sortIdeas(filterIdeas(ideas))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-400">Loading backlog...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Backlog</h1>
        <p className="mt-1 text-sm text-zinc-400">All ideas organized and prioritized</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50"
        />

        {/* Filter Bucket */}
        <select
          value={filterBucket}
          onChange={(e) => setFilterBucket(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:border-blue-500/50"
        >
          <option value="all">All Buckets</option>
          <option value="NOW">NOW</option>
          <option value="NEXT">NEXT</option>
          <option value="LATER">LATER</option>
          <option value="Unassigned">Unassigned</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:border-blue-500/50"
        >
          <option value="trend-desc">Trend ↓</option>
          <option value="companies-desc">Companies ↓</option>
          <option value="votes-desc">Votes ↓</option>
        </select>
      </div>

      {/* Table */}
      {filteredAndSorted.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-12 text-center">
          <p className="text-lg text-zinc-400">No ideas found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Tags</th>
                <th className="text-center px-4 py-3">Votes</th>
                <th className="text-center px-4 py-3">Companies</th>
                <th className="text-center px-4 py-3">Trend</th>
                <th className="text-left px-4 py-3">Last Mention</th>
                <th className="text-left px-4 py-3">Bucket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredAndSorted.map((idea) => (
                <tr key={idea.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400">Idea</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{idea.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {idea.tags?.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300">
                          {tag}
                        </span>
                      ))}
                      {(idea.tags?.length || 0) > 2 && (
                        <span className="text-xs px-2 py-1 text-zinc-500">+{idea.tags!.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-400">{idea.votes || 0}</td>
                  <td className="px-4 py-3 text-center text-zinc-400">{idea.companies || 0}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-blue-400">{idea.trend_score || 0}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{idea.last_mention || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      idea.bucket === 'NOW'
                        ? 'bg-green-500/10 text-green-400'
                        : idea.bucket === 'NEXT'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : idea.bucket === 'LATER'
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {idea.bucket || 'Unassigned'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
