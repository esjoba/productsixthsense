'use client'

import { useEffect, useState } from 'react'

interface Idea {
  id: string
  title: string
  description: string
  priority: string
  status: string
  signal_count: number
  positive_signals: number
  negative_signals: number
  created_at: string
}

export function RoadmapScreen() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const handlePostToSlack = async (idea: Idea) => {
    try {
      await fetch('/api/integrations/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea_id: idea.id,
          message: `New idea: *${idea.title}* - ${idea.description}`,
          channel: '#feedback',
        }),
      })
      alert('Posted to Slack (demo mode)')
    } catch (error) {
      console.error('Failed to post to Slack:', error)
    }
  }

  const handleCreateLinearIssue = async (idea: Idea) => {
    try {
      const response = await fetch('/api/integrations/linear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea_id: idea.id,
          title: idea.title,
          description: idea.description,
          priority: idea.priority,
        }),
      })
      const data = await response.json()
      alert(`Created Linear issue: ${data.issue_id}`)
    } catch (error) {
      console.error('Failed to create Linear issue:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-400">Loading roadmap...</p>
      </div>
    )
  }

  const statusGroups = {
    active: ideas.filter((i) => i.status === 'active'),
    roadmap: ideas.filter((i) => i.status === 'roadmap'),
    shipped: ideas.filter((i) => i.status === 'shipped'),
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Product Roadmap</h2>
        <p className="mt-2 text-zinc-400">Ideas prioritized by customer feedback signals</p>
      </div>

      {Object.entries(statusGroups).map(([status, items]) => (
        <div key={status} className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
            <h3 className="text-xl font-semibold text-white capitalize">{status}</h3>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/30">{items.length}</span>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-zinc-400 py-4">No ideas in this stage</p>
          ) : (
            <div className="space-y-3">
              {items.map((idea) => (
                <div key={idea.id} className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 hover:border-blue-500/50 transition-all">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white">{idea.title}</h4>
                      <p className="mt-2 text-sm text-zinc-400">{idea.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className="px-2 py-1 rounded text-sm font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">{idea.priority}</span>
                      <span className="px-2 py-1 rounded text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">{idea.signal_count}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-6 text-sm text-zinc-300">
                      <span className="flex items-center gap-1">
                        <span>👍</span>
                        <span className="font-medium">{idea.positive_signals || 0}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>👎</span>
                        <span className="font-medium">{idea.negative_signals || 0}</span>
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePostToSlack(idea)}
                        className="text-sm px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors border border-blue-500/30"
                      >
                        Slack
                      </button>
                      <button
                        onClick={() => handleCreateLinearIssue(idea)}
                        className="text-sm px-3 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white transition-colors border border-zinc-600"
                      >
                        Linear
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
