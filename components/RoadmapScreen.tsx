'use client'

import { useEffect, useState } from 'react'

interface Epic {
  id: string
  title: string
  votes?: number
  companies?: number
  trend_score?: number
  bucket?: string
  last_7_days?: number
}

// Mock data for demonstration
const MOCK_EPICS: Epic[] = [
  { id: '1', title: 'Performance Optimization', votes: 45, companies: 12, trend_score: 92, bucket: 'NOW', last_7_days: 8 },
  { id: '2', title: 'Dark Mode Theme', votes: 38, companies: 8, trend_score: 78, bucket: 'NOW', last_7_days: 5 },
  { id: '3', title: 'API Rate Limiting', votes: 32, companies: 15, trend_score: 85, bucket: 'NOW', last_7_days: 6 },
  { id: '4', title: 'Export to CSV/PDF', votes: 28, companies: 6, trend_score: 65, bucket: 'NEXT', last_7_days: 3 },
  { id: '5', title: 'Mobile App Support', votes: 52, companies: 20, trend_score: 95, bucket: 'LATER', last_7_days: 12 },
  { id: '6', title: 'Team Collaboration Features', votes: 24, companies: 9, trend_score: 72, bucket: 'NEXT', last_7_days: 4 },
  { id: '7', title: 'Webhook Integrations', votes: 19, companies: 7, trend_score: 58, bucket: 'LATER', last_7_days: 2 },
  { id: '8', title: 'Custom Dashboards', votes: 35, companies: 11, trend_score: 81, bucket: 'NEXT', last_7_days: 7 },
  { id: '9', title: 'SSO/SAML Support', votes: 41, companies: 14, trend_score: 88, bucket: 'NOW', last_7_days: 9 },
  { id: '10', title: 'Audit Logging', votes: 15, companies: 5, trend_score: 45, bucket: 'LATER', last_7_days: 1 },
]

function ViewColumnsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function HandThumbUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
    </svg>
  )
}

export function RoadmapScreen() {
  const [epics, setEpics] = useState<Epic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'kanban' | 'trending'>('kanban')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEpics(MOCK_EPICS)
      setIsLoading(false)
    }, 300)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading roadmap...</p>
        </div>
      </div>
    )
  }

  const nowBucket = epics.filter((e) => e.bucket === 'NOW')
  const nextBucket = epics.filter((e) => e.bucket === 'NEXT')
  const laterBucket = epics.filter((e) => e.bucket === 'LATER')
  const trendingEpics = [...epics].sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0)).slice(0, 8)

  const getBucketColor = (bucket: string) => {
    switch (bucket) {
      case 'NOW': return 'border-success/30 hover:border-success/50'
      case 'NEXT': return 'border-warning/30 hover:border-warning/50'
      case 'LATER': return 'border-purple-500/30 hover:border-purple-500/50'
      default: return 'border-border hover:border-accent/30'
    }
  }

  const getBucketHeaderColor = (bucket: string) => {
    switch (bucket) {
      case 'NOW': return 'text-success'
      case 'NEXT': return 'text-warning'
      case 'LATER': return 'text-purple-400'
      default: return 'text-foreground'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* View toggle */}
      <div className="flex items-center justify-end gap-2">
        <div className="inline-flex rounded-lg border border-border p-1 bg-card">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'kanban'
                ? 'bg-accent text-white'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ViewColumnsIcon className="w-4 h-4" />
            Roadmap
          </button>
          <button
            onClick={() => setViewMode('trending')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'trending'
                ? 'bg-accent text-white'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUpIcon className="w-4 h-4" />
            Trending
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        /* Kanban View: NOW / NEXT / LATER */
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-180px)]">
          {/* NOW Column */}
          <div className="flex flex-col rounded-lg border border-border bg-card/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-card/50">
              <div className="flex items-center justify-between mb-1">
                <h2 className={`font-semibold text-sm ${getBucketHeaderColor('NOW')}`}>NOW</h2>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
                  {nowBucket.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {nowBucket.map((epic) => (
                <div
                  key={epic.id}
                  className={`p-4 rounded-lg bg-card border ${getBucketColor('NOW')} transition-all duration-200 cursor-pointer group`}
                >
                  <h3 className="text-sm font-medium text-foreground mb-3 line-clamp-2 group-hover:text-success transition-colors">
                    {epic.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <HandThumbUpIcon className="w-3.5 h-3.5" />
                        {epic.votes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-3.5 h-3.5" />
                        {epic.companies || 0}
                      </span>
                    </div>
                    <span className="font-semibold text-success">{epic.trend_score || 0}</span>
                  </div>
                </div>
              ))}
              {nowBucket.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-xs text-muted-foreground">No items in NOW</p>
                </div>
              )}
            </div>
          </div>

          {/* NEXT Column */}
          <div className="flex flex-col rounded-lg border border-border bg-card/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-card/50">
              <div className="flex items-center justify-between mb-1">
                <h2 className={`font-semibold text-sm ${getBucketHeaderColor('NEXT')}`}>NEXT</h2>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                  {nextBucket.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Up next in the pipeline</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {nextBucket.map((epic) => (
                <div
                  key={epic.id}
                  className={`p-4 rounded-lg bg-card border ${getBucketColor('NEXT')} transition-all duration-200 cursor-pointer group`}
                >
                  <h3 className="text-sm font-medium text-foreground mb-3 line-clamp-2 group-hover:text-warning transition-colors">
                    {epic.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <HandThumbUpIcon className="w-3.5 h-3.5" />
                        {epic.votes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-3.5 h-3.5" />
                        {epic.companies || 0}
                      </span>
                    </div>
                    <span className="font-semibold text-warning">{epic.trend_score || 0}</span>
                  </div>
                </div>
              ))}
              {nextBucket.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-xs text-muted-foreground">No items in NEXT</p>
                </div>
              )}
            </div>
          </div>

          {/* LATER Column */}
          <div className="flex flex-col rounded-lg border border-border bg-card/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-card/50">
              <div className="flex items-center justify-between mb-1">
                <h2 className={`font-semibold text-sm ${getBucketHeaderColor('LATER')}`}>LATER</h2>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                  {laterBucket.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Future considerations</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {laterBucket.map((epic) => (
                <div
                  key={epic.id}
                  className={`p-4 rounded-lg bg-card border ${getBucketColor('LATER')} transition-all duration-200 cursor-pointer group`}
                >
                  <h3 className="text-sm font-medium text-foreground mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {epic.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <HandThumbUpIcon className="w-3.5 h-3.5" />
                        {epic.votes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-3.5 h-3.5" />
                        {epic.companies || 0}
                      </span>
                    </div>
                    <span className="font-semibold text-purple-400">{epic.trend_score || 0}</span>
                  </div>
                </div>
              ))}
              {laterBucket.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-xs text-muted-foreground">No items in LATER</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Trending View: Top 8 as responsive grid */
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-1">Trending Topics</h2>
            <p className="text-sm text-muted-foreground">Top 8 ideas by trend score</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {trendingEpics.map((epic, index) => (
              <div
                key={epic.id}
                className="p-5 rounded-lg bg-card border border-border hover:border-accent/30 transition-all duration-200 cursor-pointer group flex flex-col"
              >
                {/* Rank badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent/10 text-accent">
                    #{index + 1}
                  </span>
                  <TrendingUpIcon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-foreground mb-4 line-clamp-2 flex-1">
                  {epic.title}
                </h3>

                {/* Trend score - prominent */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-accent">{epic.trend_score || 0}</div>
                  <div className="text-xs text-muted-foreground">Trend Score</div>
                </div>

                {/* Metrics */}
                <div className="space-y-2 text-xs mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <HandThumbUpIcon className="w-3.5 h-3.5" />
                      Votes
                    </span>
                    <span className="font-medium text-foreground">{epic.votes || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <UsersIcon className="w-3.5 h-3.5" />
                      Companies
                    </span>
                    <span className="font-medium text-foreground">{epic.companies || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last 7 days</span>
                    <span className="font-medium text-success">+{epic.last_7_days || 0}</span>
                  </div>
                </div>

                {/* Action button */}
                <button className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium text-foreground transition-colors group-hover:bg-accent group-hover:text-white">
                  View details
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
