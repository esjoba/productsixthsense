'use client'

import { useEffect, useState } from 'react'

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <p style={{ color: '#a1a1aa' }}>Loading backlog...</p>
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
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#ffffff' }}>Feedback Backlog</h2>
        <p style={{ marginTop: '8px', color: '#a1a1aa' }}>Organized by category, sorted by priority score</p>
      </div>

      {Object.entries(grouped).length === 0 ? (
        <div style={{ borderRadius: '12px', border: '1px solid #27272a', backgroundColor: '#1a1a1e', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <p style={{ fontSize: '18px', color: '#a1a1aa' }}>No feedback in backlog</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff' }}>{category}</h3>
              <span style={{ padding: '6px 12px', borderRadius: '9999px', backgroundColor: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', fontSize: '14px', fontWeight: '500', border: '1px solid rgba(96, 165, 250, 0.3)' }}>{items.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map((item) => (
                <div key={item.id} style={{ backgroundColor: '#27272a', borderRadius: '8px', border: '1px solid #3f3f46', padding: '20px', transition: 'all 0.2s' }} onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)'
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3f3f46'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#a1a1aa' }}>{item.email}</span>
                        <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', backgroundColor: item.sentiment === 'positive' ? 'rgba(34, 197, 94, 0.1)' : item.sentiment === 'negative' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(113, 113, 122, 0.1)', color: item.sentiment === 'positive' ? '#22c55e' : item.sentiment === 'negative' ? '#ef4444' : '#71717a', border: `1px solid ${item.sentiment === 'positive' ? 'rgba(34, 197, 94, 0.5)' : item.sentiment === 'negative' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(113, 113, 122, 0.5)'}` }}>{item.sentiment}</span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>{item.score}%</span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: '1.5' }}>{item.text}</p>
                    </div>
                    <button
                      onClick={() => handleCreateIdea(item.id, item.email)}
                      style={{
                        whiteSpace: 'nowrap',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: '1px solid rgba(37, 99, 235, 0.3)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    >
                      Create Idea
                    </button>
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
