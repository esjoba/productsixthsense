'use client'

import { useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'

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

interface SuggestedIdea {
  id: string
  title: string
  confidence: number
}

interface KanbanCardProps {
  feedback: FeedbackItem
  onMoveToColumn: (columnId: string) => void
}

// Mock suggestions - in real app this would come from AI/ML backend
const MOCK_SUGGESTIONS: SuggestedIdea[] = [
  { id: 'epic-1', title: 'Performance Optimization', confidence: 82 },
  { id: 'epic-2', title: 'API Rate Limiting', confidence: 74 },
  { id: 'epic-3', title: 'User Dashboard Improvements', confidence: 68 },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function XMarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export function KanbanCard({ feedback, onMoveToColumn }: KanbanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showChooseDropdown, setShowChooseDropdown] = useState(false)
  const [showCreateIdea, setShowCreateIdea] = useState(false)
  const [newIdeaTitle, setNewIdeaTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const getCompanyFromEmail = (email: string) => {
    const domain = email.split('@')[1]
    return domain?.split('.')[0]?.charAt(0).toUpperCase() + domain?.split('.')[0]?.slice(1) || 'Unknown'
  }

  const getCategoryStyles = (category: string) => {
    const styles: Record<string, string> = {
      'Performance': 'bg-warning/10 text-warning',
      'UI/UX': 'bg-accent/10 text-accent',
      'Features': 'bg-purple-500/10 text-purple-400',
      'Integrations': 'bg-cyan-500/10 text-cyan-400',
      'Documentation': 'bg-indigo-500/10 text-indigo-400',
      'Bug': 'bg-error/10 text-error',
    }
    return styles[category] || 'bg-muted text-muted-foreground'
  }

  const getConfidenceStyles = (confidence: number) => {
    if (confidence >= 80) return 'bg-success/20 text-success'
    if (confidence >= 60) return 'bg-warning/20 text-warning'
    return 'bg-muted text-muted-foreground'
  }

  const textPreview = feedback.text.length > 120
    ? feedback.text.substring(0, 120) + '...'
    : feedback.text

  const createdDate = new Date(feedback.created_at)
  const relativeTime = formatDistanceToNow(createdDate, { addSuffix: true })
  const exactTime = format(createdDate, 'MMM d, yyyy h:mm a')

  const handleAccept = (e: React.MouseEvent, ideaId: string) => {
    e.stopPropagation()
    // In real app, this would link feedback to the idea
    onMoveToColumn('classified')
  }

  const handleCreateIdea = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (newIdeaTitle.trim()) {
      // In real app, this would create a new idea
      setShowCreateIdea(false)
      setNewIdeaTitle('')
      onMoveToColumn('classified')
    }
  }

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMoveToColumn('on-hold')
  }

  return (
    <div
      className="bg-card rounded-lg border border-border hover:border-accent/30 transition-all duration-200 cursor-pointer group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Collapsed View */}
      {!isExpanded ? (
        <div className="p-4 space-y-3">
          {/* Metadata row - Timestamp */}
          <div className="flex items-center justify-between">
            <time
              dateTime={feedback.created_at}
              title={exactTime}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {relativeTime}
            </time>
            <ChevronDownIcon className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* WHO */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">WHO</p>
            <p className="text-sm font-medium text-foreground">
              {getCompanyFromEmail(feedback.email)} <span className="text-muted-foreground font-normal">·</span> <span className="font-normal text-muted-foreground">{feedback.contact_name || 'Unknown'}</span>
            </p>
          </div>

          {/* TOPIC */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">TOPIC</p>
            <span className={`inline-block text-xs px-2 py-0.5 rounded ${getCategoryStyles(feedback.category)}`}>
              {feedback.category}
            </span>
          </div>

          {/* REQUEST/ISSUE */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">REQUEST/ISSUE</p>
            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{textPreview}</p>
          </div>
        </div>
      ) : (
        /* Expanded View */
        <div className="p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
          {/* Header with timestamp and close */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <time
              dateTime={feedback.created_at}
              title={exactTime}
              className="text-xs text-muted-foreground"
            >
              {relativeTime}
            </time>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronUpIcon className="w-4 h-4" />
            </button>
          </div>

          {/* WHO - Detailed */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">WHO</p>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{feedback.contact_name || 'Unknown'}</p>
              <p className="text-xs text-muted-foreground">{feedback.email}</p>
              <p className="text-xs text-accent">{getCompanyFromEmail(feedback.email)}</p>
            </div>
          </div>

          {/* TOPIC - Detailed */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">TOPIC</p>
            <div className="flex gap-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded ${getCategoryStyles(feedback.category)}`}>
                {feedback.category}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent font-medium">
                Score: {feedback.score}
              </span>
            </div>
          </div>

          {/* REQUEST/ISSUE - Full */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">REQUEST/ISSUE</p>
            <p className="text-sm text-foreground/90 leading-relaxed">{feedback.text}</p>
          </div>

          {/* Categorization Proposal */}
          <div className="pt-3 border-t border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">SUGGESTED IDEAS</p>
            <div className="space-y-2 mb-4">
              {MOCK_SUGGESTIONS.map((suggestion, idx) => (
                <div
                  key={suggestion.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors ${idx === 0 ? 'ring-1 ring-accent/30' : ''}`}
                >
                  <span className="text-sm text-foreground">{suggestion.title}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getConfidenceStyles(suggestion.confidence)}`}>
                    {suggestion.confidence}%
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {/* Primary action */}
              <button
                onClick={(e) => handleAccept(e, MOCK_SUGGESTIONS[0].id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-white text-sm font-medium transition-colors"
              >
                <CheckIcon className="w-4 h-4" />
                Accept #{1} - {MOCK_SUGGESTIONS[0].title}
              </button>

              {/* Secondary actions */}
              <div className="grid grid-cols-3 gap-2">
                {/* Choose different */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowChooseDropdown(!showChooseDropdown)
                      setShowCreateIdea(false)
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium transition-colors"
                  >
                    <SearchIcon className="w-3.5 h-3.5" />
                    Choose...
                  </button>
                  {showChooseDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-card border border-border shadow-md z-10">
                      <input
                        type="text"
                        placeholder="Search ideas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-2 py-1.5 mb-2 text-xs rounded bg-input border border-input-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {['Dashboard Analytics', 'Mobile Support', 'Export Feature', 'Team Collaboration'].map((idea) => (
                          <button
                            key={idea}
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowChooseDropdown(false)
                              onMoveToColumn('classified')
                            }}
                            className="w-full text-left px-2 py-1.5 rounded text-xs text-foreground hover:bg-secondary transition-colors"
                          >
                            {idea}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Create new */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowCreateIdea(!showCreateIdea)
                      setShowChooseDropdown(false)
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium transition-colors"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    New
                  </button>
                  {showCreateIdea && (
                    <div className="absolute top-full left-0 mt-1 p-3 rounded-lg bg-card border border-border shadow-md z-10 w-56">
                      <p className="text-xs font-medium text-foreground mb-2">Create new idea</p>
                      <input
                        type="text"
                        placeholder="Idea title..."
                        value={newIdeaTitle}
                        onChange={(e) => setNewIdeaTitle(e.target.value)}
                        className="w-full px-2 py-1.5 mb-2 text-xs rounded bg-input border border-input-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={handleCreateIdea}
                        className="w-full px-2 py-1.5 rounded bg-accent hover:bg-accent/90 text-white text-xs font-medium transition-colors"
                      >
                        Create
                      </button>
                    </div>
                  )}
                </div>

                {/* Skip */}
                <button
                  onClick={handleSkip}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
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
