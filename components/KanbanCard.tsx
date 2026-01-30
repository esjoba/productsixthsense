'use client'

import { useState } from 'react'
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

interface KanbanCardProps {
  feedback: FeedbackItem
  onMoveToColumn: (columnId: string) => void
}

export function KanbanCard({ feedback, onMoveToColumn }: KanbanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCategorization, setShowCategorization] = useState(false)
  const [showCreateIdea, setShowCreateIdea] = useState(false)

  const sentimentColor = {
    positive: 'bg-green-500/10 text-green-400 border-green-500/30',
    negative: 'bg-red-500/10 text-red-400 border-red-500/30',
    neutral: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
  }[feedback.sentiment] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'

  const categoryColor = {
    'Performance': 'bg-yellow-500/10 text-yellow-400',
    'UI/UX': 'bg-blue-500/10 text-blue-400',
    'Features': 'bg-purple-500/10 text-purple-400',
    'Integrations': 'bg-cyan-500/10 text-cyan-400',
    'Documentation': 'bg-indigo-500/10 text-indigo-400',
    'Bug': 'bg-red-500/10 text-red-400',
  }[feedback.category] || 'bg-gray-500/10 text-gray-400'

  const textPreview = feedback.text.split('\n')[0].substring(0, 100)

  const getCompanyFromEmail = (email: string) => {
    const domain = email.split('@')[1]
    return domain?.split('.')[0] || 'Unknown'
  }

  return (
    <div className="bg-zinc-800 rounded-lg border border-zinc-700 hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-lg"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Collapsed View */}
      {!isExpanded ? (
        <div className="p-4 space-y-3">
          {/* Timestamp */}
          <div className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors group">
            <time dateTime={feedback.created_at} title={new Date(feedback.created_at).toLocaleString()}>
              {formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })}
            </time>
          </div>

          {/* WHO */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">WHO</p>
            <p className="text-sm font-medium text-white mt-1">
              {feedback.contact_name || 'Unknown'} • {getCompanyFromEmail(feedback.email)}
            </p>
          </div>

          {/* TOPIC */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">TOPIC</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded border ${sentimentColor}`}>
                {feedback.sentiment}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${categoryColor}`}>
                {feedback.category}
              </span>
            </div>
          </div>

          {/* REQUEST/ISSUE */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">REQUEST/ISSUE</p>
            <p className="text-sm text-zinc-300 mt-1 line-clamp-3 leading-relaxed">{textPreview}</p>
          </div>
        </div>
      ) : (
        /* Expanded View */
        <div className="p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
          {/* Header with close */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-700">
            <time dateTime={feedback.created_at} className="text-xs text-zinc-500" title={new Date(feedback.created_at).toLocaleString()}>
              {formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })}
            </time>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs px-2 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
            >
              Close
            </button>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            {/* WHO */}
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">WHO</p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">{feedback.contact_name || 'Unknown'}</p>
                <p className="text-xs text-zinc-400">{feedback.email}</p>
                <p className="text-xs text-zinc-500">{getCompanyFromEmail(feedback.email)}</p>
              </div>
            </div>

            {/* TOPIC */}
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">TOPIC</p>
              <div className="flex gap-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded border ${sentimentColor}`}>
                  {feedback.sentiment}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${categoryColor}`}>
                  {feedback.category}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 font-medium">
                  {feedback.score}%
                </span>
              </div>
            </div>

            {/* ISSUE/REQUEST */}
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">REQUEST/ISSUE</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{feedback.text}</p>
            </div>

            {/* Categorization Proposal */}
            <div className="pt-4 border-t border-zinc-700">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-3">Suggested Ideas</p>
              <div className="space-y-2 mb-4">
                {/* Mock suggestions */}
                {['Performance Optimization', 'API Rate Limiting', 'User Dashboard'].map((idea, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-zinc-700/50 hover:bg-zinc-700 transition-colors">
                    <span className="text-xs text-zinc-300">{idea}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                      {82 - idx * 5}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveToColumn('classified')
                  }}
                  className="px-3 py-2 rounded text-xs font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  Accept #1
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowCategorization(!showCategorization)
                  }}
                  className="px-3 py-2 rounded text-xs font-medium bg-zinc-700 hover:bg-zinc-600 text-white transition-colors"
                >
                  Choose...
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowCreateIdea(!showCreateIdea)
                  }}
                  className="px-3 py-2 rounded text-xs font-medium bg-zinc-700 hover:bg-zinc-600 text-white transition-colors"
                >
                  Create Idea
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveToColumn('on-hold')
                  }}
                  className="px-3 py-2 rounded text-xs font-medium bg-zinc-700 hover:bg-zinc-600 text-white transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
