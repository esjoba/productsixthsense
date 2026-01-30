'use client'

import { useState } from 'react'

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

const sentimentColorMap = {
  positive: { bg: '#22c55e', bg10: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
  negative: { bg: '#ef4444', bg10: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
  neutral: { bg: '#71717a', bg10: 'rgba(113, 113, 122, 0.1)', text: '#71717a' },
}

const categoryColorMap = {
  'Performance': { bg10: 'rgba(234, 179, 8, 0.1)', text: '#eab308' },
  'UI/UX': { bg10: 'rgba(96, 165, 250, 0.1)', text: '#60a5fa' },
  'Features': { bg10: 'rgba(168, 85, 247, 0.1)', text: '#a855f7' },
  'Integrations': { bg10: 'rgba(34, 211, 238, 0.1)', text: '#22d3ee' },
  'Documentation': { bg10: 'rgba(99, 102, 241, 0.1)', text: '#6366f1' },
  'Bug': { bg10: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
}

export function FeedbackCard({ feedback, onStatusChange, isKanban = false }: FeedbackCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const sentimentColor = sentimentColorMap[feedback.sentiment as keyof typeof sentimentColorMap] || sentimentColorMap.neutral
  const categoryColor = categoryColorMap[feedback.category as keyof typeof categoryColorMap] || { bg10: 'rgba(107, 114, 128, 0.1)', text: '#d1d5db' }

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
      <div style={{
        backgroundColor: '#27272a',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid #3f3f46',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        group: true,
      }} onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)'
      }} onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#3f3f46'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              border: `1px solid ${sentimentColor.bg}`,
              backgroundColor: sentimentColor.bg10,
              color: sentimentColor.text,
            }}>{feedback.sentiment}</span>
            <span style={{
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: categoryColor.bg10,
              color: categoryColor.text,
            }}>{feedback.category}</span>
          </div>
          <span style={{
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.3)',
          }}>{feedback.score}%</span>
        </div>
        <p style={{ fontSize: '14px', color: '#ffffff', marginBottom: '12px', lineHeight: '1.5', maxHeight: '72px', overflow: 'hidden' }}>{feedback.text}</p>
        <p style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '12px' }}>{feedback.email}</p>
        <div style={{ display: 'flex', gap: '8px', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
        }} onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0'
        }}>
          <button
            onClick={() => handleStatusChange('review')}
            disabled={isLoading}
            style={{
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(96, 165, 250, 0.2)',
              color: '#60a5fa',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.2)'}
          >
            Review
          </button>
          <button
            onClick={() => handleStatusChange('approved')}
            disabled={isLoading}
            style={{
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              color: '#22c55e',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.2)'}
          >
            Approve
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: '#27272a',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #3f3f46',
      transition: 'all 0.2s',
    }} onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)'
    }} onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#3f3f46'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '4px',
            border: `1px solid ${sentimentColor.bg}`,
            backgroundColor: sentimentColor.bg10,
            color: sentimentColor.text,
          }}>{feedback.sentiment}</span>
          <span style={{
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: categoryColor.bg10,
            color: categoryColor.text,
          }}>{feedback.category}</span>
        </div>
        <span style={{
          fontSize: '13px',
          fontWeight: 'bold',
          color: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid rgba(96, 165, 250, 0.3)',
        }}>{feedback.score}%</span>
      </div>
      <p style={{ fontSize: '14px', color: '#ffffff', marginBottom: '8px', lineHeight: '1.5' }}>{feedback.text}</p>
      <p style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '16px' }}>{feedback.email}</p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => handleStatusChange('backlog')}
          disabled={isLoading}
          style={{
            flex: 1,
            fontSize: '14px',
            padding: '8px 12px',
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
          To Backlog
        </button>
        <button
          onClick={() => handleStatusChange('idea')}
          disabled={isLoading}
          style={{
            flex: 1,
            fontSize: '14px',
            padding: '8px 12px',
            borderRadius: '4px',
            backgroundColor: '#3f3f46',
            color: '#ffffff',
            border: '1px solid #52525b',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#27272a'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3f3f46'}
        >
          Create Idea
        </button>
      </div>
    </div>
  )
}
