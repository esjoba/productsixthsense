'use client'

import { useEffect, useState } from 'react'
import { KanbanCard } from '@/components/KanbanCard'
import { formatDistanceToNow } from 'date-fns'

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
  { id: 'to-classify', title: 'To classify' },
  { id: 'on-hold', title: 'On hold' },
  { id: 'classified', title: 'Classified' },
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-400">Loading feedback...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Daily Triage</h1>
          <p className="mt-1 text-sm text-zinc-400">Categorize and organize incoming feedback</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-blue-400">{feedback.length}</div>
          <p className="text-xs text-zinc-500">items to classify</p>
        </div>
      </div>

      {feedback.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-12 text-center">
          <div className="text-5xl mb-4">✨</div>
          <p className="text-lg text-zinc-400">No new feedback. Perfect!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {KANBAN_COLUMNS.map((column) => (
            <div
              key={column.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 min-h-96 flex flex-col"
            >
              <div className="mb-6 pb-4 border-b border-zinc-800">
                <h2 className="font-semibold text-white text-base">{column.title}</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  {feedback.filter((f) => cardPosition[f.id] === column.id).length} items
                </p>
              </div>

              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                {feedback
                  .filter((f) => cardPosition[f.id] === column.id)
                  .map((item) => (
                    <KanbanCard
                      key={item.id}
                      feedback={item}
                      onMoveToColumn={(status) => handleMoveCard(item.id, status)}
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
