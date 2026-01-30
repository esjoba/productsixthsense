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

const sentimentColors = {
  positive: 'bg-green-500/10 text-green-400 border-green-500/30',
  negative: 'bg-red-500/10 text-red-400 border-red-500/30',
  neutral: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
}

const categoryColors = {
  'Performance': 'bg-yellow-500/10 text-yellow-400',
  'UI/UX': 'bg-blue-500/10 text-blue-400',
  'Features': 'bg-purple-500/10 text-purple-400',
  'Integrations': 'bg-cyan-500/10 text-cyan-400',
  'Documentation': 'bg-indigo-500/10 text-indigo-400',
  'Bug': 'bg-red-500/10 text-red-400',
}

export function FeedbackCard({ feedback, onStatusChange, isKanban = false }: FeedbackCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const sentimentColor = sentimentColors[feedback.sentiment as keyof typeof sentimentColors] || sentimentColors.neutral
  const categoryColor = categoryColors[feedback.category as keyof typeof categoryColors] || 'bg-gray-500/10 text-gray-400'

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
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-blue-500/50 transition-all cursor-pointer group shadow-sm hover:shadow-md">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded border ${sentimentColor}`}>{feedback.sentiment}</span>
            <span className={`text-xs px-2 py-1 rounded ${categoryColor}`}>{feedback.category}</span>
          </div>
          <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/30">{feedback.score}%</span>
        </div>
        <p className="text-sm text-white line-clamp-3 mb-3 leading-relaxed">{feedback.text}</p>
        <p className="text-xs text-zinc-400 mb-3">{feedback.email}</p>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleStatusChange('review')}
            disabled={isLoading}
            className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors border border-blue-500/30"
          >
            Review
          </button>
          <button
            onClick={() => handleStatusChange('approved')}
            disabled={isLoading}
            className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors border border-green-500/30"
          >
            Approve
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-blue-500/50 transition-all">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex gap-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded border ${sentimentColor}`}>{feedback.sentiment}</span>
          <span className={`text-xs px-2 py-1 rounded ${categoryColor}`}>{feedback.category}</span>
        </div>
        <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/30">{feedback.score}%</span>
      </div>
      <p className="text-sm text-white mb-2 leading-relaxed">{feedback.text}</p>
      <p className="text-xs text-zinc-400 mb-4">{feedback.email}</p>
      <div className="flex gap-2">
        <button
          onClick={() => handleStatusChange('backlog')}
          disabled={isLoading}
          className="flex-1 text-sm px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 border border-blue-500/30"
        >
          To Backlog
        </button>
        <button
          onClick={() => handleStatusChange('idea')}
          disabled={isLoading}
          className="flex-1 text-sm px-3 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white transition-colors disabled:opacity-50 border border-zinc-600"
        >
          Create Idea
        </button>
      </div>
    </div>
  )
}
