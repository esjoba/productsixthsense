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
  { id: 'triage', title: 'To Triage' },
  { id: 'review', title: 'In Review' },
  { id: 'approved', title: 'Approved' },
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <p style={{ color: '#a1a1aa' }}>Loading feedback...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#ffffff' }}>Daily Triage</h2>
          <p style={{ marginTop: '8px', color: '#a1a1aa' }}>Organize feedback into categories</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#60a5fa' }}>{feedback.length}</div>
          <p style={{ fontSize: '14px', color: '#a1a1aa' }}>items to triage</p>
        </div>
      </div>

      {feedback.length === 0 ? (
        <div style={{ borderRadius: '12px', border: '1px solid #27272a', backgroundColor: '#1a1a1e', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
          <p style={{ fontSize: '18px', color: '#a1a1aa' }}>No new feedback. Perfect!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {KANBAN_COLUMNS.map((column) => (
            <div
              key={column.id}
              style={{
                backgroundColor: '#1a1a1e',
                borderRadius: '12px',
                border: '1px solid #27272a',
                padding: '24px',
                minHeight: '384px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>
                <h3 style={{ fontWeight: '600', color: '#ffffff', fontSize: '18px' }}>{column.title}</h3>
                <p style={{ fontSize: '12px', color: '#71717a', marginTop: '4px' }}>
                  {feedback.filter((f) => cardPosition[f.id] === column.id).length} items
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
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
