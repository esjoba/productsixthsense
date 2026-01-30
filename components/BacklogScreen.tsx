'use client'

import { useEffect, useState } from 'react'
import { Badge } from './Badge'
import { Button } from './Button'

interface FeedbackItem {
  id: string
  email: string
  text: string
  category: string
  sentiment: string
  score: number
  status: string
  created_at: string
}

export function BacklogScreen() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadFeedback() {
      try {
        const response = await fetch('/api/feedback')
        const data = await response.json()
        const backlogFeedback = data
          .filter((f: FeedbackItem) => f.status === 'backlog')
          .sort((a: FeedbackItem, b: FeedbackItem) => b.score - a.score)
        setFeedback(backlogFeedback)
      } catch (error) {
        console.error('Failed to load feedback:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeedback()
  }, [])

  const handleCreateIdea = async (feedbackId: string, email: string) => {
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback_id: feedbackId,
          title: `Idea from ${email}`,
          description: 'Converted from feedback',
        }),
      })
      
      if (response.ok) {
        setFeedback(feedback.filter((f) => f.id !== feedbackId))
      }
    } catch (error) {
      console.error('Failed to create idea:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading backlog...</p>
      </div>
    )
  }

  const grouped = feedback.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, FeedbackItem[]>
  )

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Feedback Backlog</h2>
        <p className="mt-2 text-muted-foreground">Organized by category, sorted by priority score</p>
      </div>

      {Object.entries(grouped).length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-lg text-muted-foreground">No feedback in backlog</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <h3 className="text-xl font-semibold text-foreground">{category}</h3>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{items.length}</span>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">{item.email}</span>
                        <Badge variant={item.sentiment as any} className="text-xs">{item.sentiment}</Badge>
                        <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">{item.score}%</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleCreateIdea(item.id, item.email)}
                      className="whitespace-nowrap"
                    >
                      Create Idea
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
