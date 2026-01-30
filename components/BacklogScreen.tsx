'use client'

import { useEffect, useState } from 'react'

interface Idea {
  id: string
  title: string
  type?: 'idea' | 'epic'
  tags?: string[]
  votes?: number
  companies?: number
  trend_score?: number
  bucket?: string
  last_mention?: string
}

// Mock data for demonstration
const MOCK_IDEAS: Idea[] = [
  { id: '1', title: 'Performance Optimization', type: 'epic', tags: ['backend', 'priority'], votes: 45, companies: 12, trend_score: 92, bucket: 'NOW', last_mention: '2 hours ago' },
  { id: '2', title: 'Dark Mode Theme', type: 'idea', tags: ['ui', 'frontend'], votes: 38, companies: 8, trend_score: 78, bucket: 'NOW', last_mention: '4 hours ago' },
  { id: '3', title: 'API Rate Limiting', type: 'epic', tags: ['backend', 'security'], votes: 32, companies: 15, trend_score: 85, bucket: 'NEXT', last_mention: '1 day ago' },
  { id: '4', title: 'Export to CSV/PDF', type: 'idea', tags: ['feature'], votes: 28, companies: 6, trend_score: 65, bucket: 'NEXT', last_mention: '2 days ago' },
  { id: '5', title: 'Mobile App Support', type: 'epic', tags: ['mobile', 'priority'], votes: 52, companies: 20, trend_score: 95, bucket: 'LATER', last_mention: '3 days ago' },
  { id: '6', title: 'Team Collaboration Features', type: 'idea', tags: ['collaboration'], votes: 24, companies: 9, trend_score: 72, bucket: 'LATER', last_mention: '5 days ago' },
  { id: '7', title: 'Webhook Integrations', type: 'idea', tags: ['integrations', 'backend'], votes: 19, companies: 7, trend_score: 58, bucket: 'Unassigned', last_mention: '1 week ago' },
  { id: '8', title: 'Custom Dashboards', type: 'epic', tags: ['ui', 'analytics'], votes: 35, companies: 11, trend_score: 81, bucket: 'NEXT', last_mention: '6 hours ago' },
  { id: '9', title: 'SSO/SAML Support', type: 'idea', tags: ['security', 'enterprise'], votes: 41, companies: 14, trend_score: 88, bucket: 'NOW', last_mention: '12 hours ago' },
  { id: '10', title: 'Audit Logging', type: 'idea', tags: ['security', 'compliance'], votes: 15, companies: 5, trend_score: 45, bucket: 'Unassigned', last_mention: '2 weeks ago' },
]

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
  )
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
  )
}

export function BacklogScreen() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'trend' | 'companies' | 'votes'>('trend')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filterBucket, setFilterBucket] = useState('all')
  const [filterTags, setFilterTags] = useState<string[]>([])

  // Get all unique tags
  const allTags = Array.from(new Set(MOCK_IDEAS.flatMap(idea => idea.tags || [])))

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIdeas(MOCK_IDEAS)
      setIsLoading(false)
    }, 300)
  }, [])

  const sortIdeas = (ideas: Idea[]) => {
    const sorted = [...ideas]
    sorted.sort((a, b) => {
      let aVal: number, bVal: number
      if (sortBy === 'trend') {
        aVal = a.trend_score || 0
        bVal = b.trend_score || 0
      } else if (sortBy === 'companies') {
        aVal = a.companies || 0
        bVal = b.companies || 0
      } else {
        aVal = a.votes || 0
        bVal = b.votes || 0
      }
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal
    })
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

  const handleSort = (field: 'trend' | 'companies' | 'votes') => {
    if (sortBy === field) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  const toggleTag = (tag: string) => {
    setFilterTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const getBucketStyles = (bucket?: string) => {
    switch (bucket) {
      case 'NOW': return 'bg-success/10 text-success border border-success/20'
      case 'NEXT': return 'bg-warning/10 text-warning border border-warning/20'
      case 'LATER': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
      default: return 'bg-secondary text-muted-foreground'
    }
  }

  const getTypeStyles = (type?: string) => {
    return type === 'epic'
      ? 'bg-accent/10 text-accent'
      : 'bg-secondary text-muted-foreground'
  }

  const filteredAndSorted = sortIdeas(filterIdeas(ideas))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading backlog...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg border border-border bg-card">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-input border border-input-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Bucket Filter */}
        <div className="relative">
          <select
            value={filterBucket}
            onChange={(e) => setFilterBucket(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-input border border-input-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors cursor-pointer"
          >
            <option value="all">All Buckets</option>
            <option value="NOW">NOW</option>
            <option value="NEXT">NEXT</option>
            <option value="LATER">LATER</option>
            <option value="Unassigned">Unassigned</option>
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={`${sortBy}-${sortDir}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split('-') as ['trend' | 'companies' | 'votes', 'asc' | 'desc']
              setSortBy(field)
              setSortDir(dir)
            }}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-input border border-input-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors cursor-pointer"
          >
            <option value="trend-desc">Trend (High to Low)</option>
            <option value="trend-asc">Trend (Low to High)</option>
            <option value="companies-desc">Companies (High to Low)</option>
            <option value="companies-asc">Companies (Low to High)</option>
            <option value="votes-desc">Votes (High to Low)</option>
            <option value="votes-asc">Votes (Low to High)</option>
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Tags:</span>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              filterTags.includes(tag)
                ? 'bg-accent text-white'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {tag}
          </button>
        ))}
        {filterTags.length > 0 && (
          <button
            onClick={() => setFilterTags([])}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {filteredAndSorted.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-foreground font-medium mb-2">No ideas found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</th>
                <th
                  className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('votes')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Votes
                    {sortBy === 'votes' && (
                      sortDir === 'desc' ? <ArrowDownIcon className="w-3 h-3" /> : <ArrowUpIcon className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th
                  className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('companies')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Companies
                    {sortBy === 'companies' && (
                      sortDir === 'desc' ? <ArrowDownIcon className="w-3 h-3" /> : <ArrowUpIcon className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th
                  className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('trend')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Trend
                    {sortBy === 'trend' && (
                      sortDir === 'desc' ? <ArrowDownIcon className="w-3 h-3" /> : <ArrowUpIcon className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Mention</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bucket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAndSorted.map((idea) => (
                <tr key={idea.id} className="hover:bg-card/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${getTypeStyles(idea.type)}`}>
                      {idea.type || 'idea'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{idea.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {idea.tags?.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                      {(idea.tags?.length || 0) > 2 && (
                        <span className="text-xs text-muted-foreground">+{idea.tags!.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{idea.votes || 0}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{idea.companies || 0}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-accent">{idea.trend_score || 0}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{idea.last_mention || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${getBucketStyles(idea.bucket)}`}>
                      {idea.bucket || 'Unassigned'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
        <span>Showing {filteredAndSorted.length} of {ideas.length} items</span>
        <span>Default sort: Trend score (desc), Companies (desc), Votes (desc)</span>
      </div>
    </div>
  )
}
