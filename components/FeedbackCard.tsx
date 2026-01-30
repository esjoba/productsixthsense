'use client'

import { useState } from 'react'
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

interface FeedbackCardProps {
  feedback: FeedbackItem
  onStatusChange: (id: string, status: string) => void
}

export function FeedbackCard({ feedback, onStatusChange }: FeedbackCardProps) {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge variant={sentimentColor}>{feedback.sentiment}</Badge>
            <Badge>{feedback.category}</Badge>
            <span className="text-xs font-bold text-primary">{feedback.score}%</span>
          </div>
          <p className="mt-2 text-sm font-medium text-muted-foreground">{feedback.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-foreground">{feedback.text}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatusChange('backlog')}
          disabled={isLoading}
        >
          To Backlog
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatusChange('idea')}
          disabled={isLoading}
        >
          Create Idea
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatusChange('archived')}
          disabled={isLoading}
        >
          Archive
        </Button>
      </CardFooter>
    </Card>
  )
}
