'use client'

import { useEffect, useState } from 'react'
import { Badge } from './Badge'
import { Button } from './Button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card'

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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Feedback Backlog</h2>
        <p className="mt-1 text-muted-foreground">Complete list of all feedback, organized by category</p>
      </div>

      {Object.entries(grouped).length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No feedback in backlog</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h3 className="font-semibold text-foreground">
              {category} <span className="text-sm text-muted-foreground">({items.length})</span>
            </h3>
            <div className="space-y-2">
              {items.map((item) => (
                <Card key={item.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.email}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.text}</p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant={item.sentiment as any}>{item.sentiment}</Badge>
                      <span className="text-xs font-bold text-primary">{item.score}%</span>
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCreateIdea(item.id, item.email)}
                    >
                      Create Idea
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
