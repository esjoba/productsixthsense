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

const KANBAN_COLUMNS = [
  { id: 'triage', title: 'To Triage', color: 'from-blue-500/10 to-blue-600/5' },
  { id: 'review', title: 'In Review', color: 'from-purple-500/10 to-purple-600/5' },
  { id: 'approved', title: 'Approved', color: 'from-green-500/10 to-green-600/5' },
]

export function NewRequestsScreen() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cardPosition, setCardPosition] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadFeedback() {
      try {
        const response = await fetch('/api/feedback')
        const data = await response.json()
        // Get new feedback sorted by score
        const newFeedback = data
          .filter((f: FeedbackItem) => f.status === 'new')
          .sort((a: FeedbackItem, b: FeedbackItem) => b.score - a.score)
        setFeedback(newFeedback)
        // Initialize all cards in 'triage' column
        const positions: Record<string, string> = {}
        newFeedback.forEach((f: FeedbackItem) => {
          positions[f.id] = 'triage'
        })
        setCardPosition(positions)
      } catch (error) {
        console.error('Failed to load feedback:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeedback()
  }, [])

  const handleMoveCard = (id: string, column: string) => {
    setCardPosition((prev) => ({ ...prev, [id]: column }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading feedback...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Daily Triage</h2>
          <p className="mt-2 text-muted-foreground">Drag cards between columns to organize feedback</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary">{feedback.length}</div>
          <p className="text-sm text-muted-foreground">items to triage</p>
        </div>
      </div>

      {feedback.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="text-5xl mb-4">✨</div>
          <p className="text-lg text-muted-foreground">No new feedback. Perfect!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {KANBAN_COLUMNS.map((column) => (
            <div
              key={column.id}
              className={`bg-gradient-to-br ${column.color} rounded-2xl border border-border p-6 min-h-96`}
            >
              <div className="mb-6 pb-4 border-b border-border">
                <h3 className="font-semibold text-foreground text-lg">{column.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {feedback.filter((f) => cardPosition[f.id] === column.id).length} items
                </p>
              </div>

              <div className="space-y-3">
                {feedback
                  .filter((f) => cardPosition[f.id] === column.id)
                  .map((item) => (
                    <FeedbackCard
                      key={item.id}
                      feedback={item}
                      onStatusChange={(id, status) => {
                        handleMoveCard(id, status)
                      }}
                      isKanban={true}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
