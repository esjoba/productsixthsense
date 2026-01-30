'use client'

import { useState } from 'react'
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

interface FeedbackCardProps {
  feedback: FeedbackItem
  onStatusChange: (id: string, status: string) => void
  isKanban?: boolean
}

export function FeedbackCard({ feedback, onStatusChange, isKanban = false }: FeedbackCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const sentimentColor = {
    positive: 'accent',
    negative: 'destructive',
    neutral: 'secondary',
  }[feedback.sentiment as keyof typeof sentimentColor] || 'secondary'

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)
    try {
      await fetch(`/api/feedback/${feedback.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      onStatusChange(feedback.id, newStatus)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isKanban) {
    return (
      <div className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-all cursor-pointer group shadow-sm hover:shadow-md">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={sentimentColor} className="text-xs">{feedback.sentiment}</Badge>
            <Badge className="text-xs">{feedback.category}</Badge>
          </div>
          <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">{feedback.score}%</span>
        </div>
        <p className="text-sm text-foreground line-clamp-3 mb-3">{feedback.text}</p>
        <p className="text-xs text-muted-foreground mb-3">{feedback.email}</p>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleStatusChange('review')}
            disabled={isLoading}
            className="text-xs px-2 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
          >
            Review
          </button>
          <button
            onClick={() => handleStatusChange('approved')}
            disabled={isLoading}
            className="text-xs px-2 py-1 rounded bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
          >
            Approve
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex gap-2 flex-wrap">
          <Badge variant={sentimentColor}>{feedback.sentiment}</Badge>
          <Badge>{feedback.category}</Badge>
        </div>
        <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">{feedback.score}%</span>
      </div>
      <p className="text-sm text-foreground mb-2">{feedback.text}</p>
      <p className="text-xs text-muted-foreground mb-4">{feedback.email}</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="primary"
          onClick={() => handleStatusChange('backlog')}
          disabled={isLoading}
          className="flex-1"
        >
          To Backlog
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => handleStatusChange('idea')}
          disabled={isLoading}
          className="flex-1"
        >
          Create Idea
        </Button>
      </div>
    </div>
  )
}
