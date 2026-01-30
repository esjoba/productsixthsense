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

const sentimentColors = {
  positive: 'bg-green-500/10 text-green-400',
  negative: 'bg-red-500/10 text-red-400',
  neutral: 'bg-zinc-500/10 text-zinc-400',
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
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-400">Loading backlog...</p>
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
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Feedback Backlog</h2>
        <p className="mt-2 text-zinc-400">Organized by category, sorted by priority score</p>
      </div>

      {Object.entries(grouped).length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-lg text-zinc-400">No feedback in backlog</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
              <h3 className="text-xl font-semibold text-white">{category}</h3>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/30">{items.length}</span>
            </div>
            <div className="space-y-3">
              {items.map((item) => {
                const sentimentColor = sentimentColors[item.sentiment as keyof typeof sentimentColors] || sentimentColors.neutral
                return (
                  <div key={item.id} className="bg-zinc-800 rounded-lg border border-zinc-700 p-5 hover:border-blue-500/50 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-zinc-400">{item.email}</span>
                          <span className={`text-xs px-2 py-1 rounded border ${sentimentColor} border-opacity-50`}>{item.sentiment}</span>
                          <span className="text-xs font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/30">{item.score}%</span>
                        </div>
                        <p className="text-sm text-white leading-relaxed">{item.text}</p>
                      </div>
                      <button
                        onClick={() => handleCreateIdea(item.id, item.email)}
                        className="whitespace-nowrap text-sm px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors border border-blue-500/30"
                      >
                        Create Idea
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
