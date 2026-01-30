'use client'

import { useEffect, useState } from 'react'
import { Badge } from './Badge'
import { Button } from './Button'

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
        <p className="text-muted-foreground">Loading roadmap...</p>
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
        <h2 className="text-3xl font-bold text-foreground">Product Roadmap</h2>
        <p className="mt-2 text-muted-foreground">Ideas prioritized by customer feedback signals</p>
      </div>

      {Object.entries(statusGroups).map(([status, items]) => (
        <div key={status} className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <h3 className="text-xl font-semibold text-foreground capitalize">{status}</h3>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{items.length}</span>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No ideas in this stage</p>
          ) : (
            <div className="space-y-3">
              {items.map((idea) => (
                <div key={idea.id} className="bg-card rounded-xl border border-border p-6 hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground">{idea.title}</h4>
                      <p className="mt-2 text-sm text-muted-foreground">{idea.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-yellow-500/20 text-yellow-400">{idea.priority}</Badge>
                      <Badge className="bg-blue-500/20 text-blue-400">{idea.signal_count} signals</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-muted-foreground">
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
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handlePostToSlack(idea)}
                      >
                        Slack
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCreateLinearIssue(idea)}
                      >
                        Linear
                      </Button>
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
