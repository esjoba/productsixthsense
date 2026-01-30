'use client'

import { useEffect, useState } from 'react'
import { KanbanCard } from '@/components/KanbanCard'

interface FeedbackItem {
  id: string
  email: string
  contact_name?: string
  text: string
  category: string
  sentiment: string
  score: number
  status: string
  created_at: string
}

const KANBAN_COLUMNS = [
  { id: 'to-classify', title: 'To classify', description: 'New items awaiting triage' },
  { id: 'on-hold', title: 'On hold', description: 'Skipped or pending review' },
  { id: 'classified', title: 'Classified', description: 'Linked to existing ideas' },
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
        const newFeedback = data
          .filter((f: FeedbackItem) => f.status === 'new')
          .sort((a: FeedbackItem, b: FeedbackItem) => b.score - a.score)
        setFeedback(newFeedback)
        const positions: Record<string, string> = {}
        newFeedback.forEach((f: FeedbackItem) => {
          positions[f.id] = 'to-classify'
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

  const getColumnCount = (columnId: string) => {
    return feedback.filter((f) => cardPosition[f.id] === columnId).length
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading feedback...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 h-full">
      {/* Stats bar */}
      <div className="flex items-center gap-6 mb-6 pb-4 border-b border-border">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{getColumnCount('to-classify')}</span>
          <span className="text-sm text-muted-foreground">to classify</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-muted-foreground">{getColumnCount('on-hold')}</span>
          <span className="text-sm text-muted-foreground">on hold</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-success">{getColumnCount('classified')}</span>
          <span className="text-sm text-muted-foreground">classified</span>
        </div>
      </div>

      {feedback.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="text-lg font-medium text-foreground mb-2">All caught up!</p>
          <p className="text-sm text-muted-foreground">No new feedback to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-180px)]">
          {KANBAN_COLUMNS.map((column) => (
            <div
              key={column.id}
              className="flex flex-col rounded-lg border border-border bg-card/30 overflow-hidden"
            >
              {/* Column header */}
              <div className="px-4 py-3 border-b border-border bg-card/50">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold text-foreground text-sm">{column.title}</h2>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    {getColumnCount(column.id)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{column.description}</p>
              </div>

              {/* Column content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {feedback
                  .filter((f) => cardPosition[f.id] === column.id)
                  .map((item) => (
                    <KanbanCard
                      key={item.id}
                      feedback={item}
                      onMoveToColumn={(status) => handleMoveCard(item.id, status)}
                    />
                  ))}
                {getColumnCount(column.id) === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859" />
                      </svg>
                    </div>
                    <p className="text-xs text-muted-foreground">No items</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
