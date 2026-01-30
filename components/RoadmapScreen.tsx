'use client'

import { useEffect, useState } from 'react'
import { Badge } from './Badge'
import { Button } from './Button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card'

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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Product Roadmap</h2>
        <p className="mt-1 text-muted-foreground">Ideas prioritized by customer feedback signals</p>
      </div>

      {Object.entries(statusGroups).map(([status, items]) => (
        <div key={status} className="space-y-3">
          <h3 className="font-semibold text-foreground capitalize">
            {status} <span className="text-sm text-muted-foreground">({items.length})</span>
          </h3>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ideas in this stage</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((idea) => (
                <Card key={idea.id}>
                  <CardHeader>
                    <CardTitle>{idea.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{idea.description}</p>
                    <div className="mt-3 flex gap-2">
                      <Badge>{idea.priority}</Badge>
                      <Badge variant="secondary">{idea.signal_count} signals</Badge>
                    </div>
                    <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                      <span>👍 {idea.positive_signals || 0}</span>
                      <span>👎 {idea.negative_signals || 0}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePostToSlack(idea)}
                    >
                      Slack
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCreateLinearIssue(idea)}
                    >
                      Linear
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
