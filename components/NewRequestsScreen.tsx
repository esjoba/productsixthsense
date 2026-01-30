'use client'

import { useEffect, useState } from 'react'
import { FeedbackCard } from '@/components/FeedbackCard'

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

export function NewRequestsScreen() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadFeedback() {
      try {
        const response = await fetch('/api/feedback')
        const data = await response.json()
        // Filter for today's new feedback, sorted by score
        const today = new Date().toISOString().split('T')[0]
        const todaysFeedback = data
          .filter((f: FeedbackItem) => f.status === 'new' && f.created_at.startsWith(today))
          .sort((a: FeedbackItem, b: FeedbackItem) => b.score - a.score)
        setFeedback(todaysFeedback)
      } catch (error) {
        console.error('Failed to load feedback:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeedback()
  }, [])

  const handleStatusChange = (id: string, status: string) => {
    setFeedback(feedback.filter((f) => f.id !== id))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading feedback...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Daily Triage</h2>
          <p className="mt-1 text-muted-foreground">Review and categorize today's new feedback</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary">{feedback.length}</div>
          <p className="text-sm text-muted-foreground">items to review</p>
        </div>
      </div>

      {feedback.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No new feedback for today. Great job!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {feedback.map((item) => (
            <FeedbackCard
              key={item.id}
              feedback={item}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
