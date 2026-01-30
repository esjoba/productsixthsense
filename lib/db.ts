// Mock data for demo purposes
const mockFeedback = [
  {
    id: '1',
    email: 'john@example.com',
    contact_name: 'John Smith',
    text: 'The search feature is too slow when dealing with large datasets',
    category: 'Performance',
    sentiment: 'negative',
    score: 8,
    source: 'email',
    status: 'new',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    email: 'sarah@example.com',
    contact_name: 'Sarah Johnson',
    text: 'Please add dark mode support. Many of our users have requested this feature.',
    category: 'UI/UX',
    sentiment: 'positive',
    score: 7,
    source: 'web',
    status: 'backlog',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: '3',
    email: 'mike@example.com',
    contact_name: 'Mike Chen',
    text: 'Bug: Application crashes when uploading files larger than 100MB',
    category: 'Bug',
    sentiment: 'negative',
    score: 9,
    source: 'support',
    status: 'new',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: '4',
    email: 'emily@example.com',
    contact_name: 'Emily Rodriguez',
    text: 'Slack integration would be amazing for our team workflows',
    category: 'Integrations',
    sentiment: 'positive',
    score: 6,
    source: 'chat',
    status: 'backlog',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: '5',
    email: 'alex@example.com',
    contact_name: 'Alex Martinez',
    text: 'The documentation needs more examples for API endpoints',
    category: 'Documentation',
    sentiment: 'neutral',
    score: 5,
    source: 'email',
    status: 'backlog',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
]

const mockIdeas = [
  {
    id: 'idea-1',
    feedback_id: '1',
    title: 'Optimize Search Performance',
    description: 'Implement caching and indexing to improve search speed',
    priority: 'high',
    status: 'active',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    signal_count: 3,
    positive_signals: 3,
    negative_signals: 0,
  },
  {
    id: 'idea-2',
    feedback_id: '2',
    title: 'Add Dark Mode Theme',
    description: 'Implement system-wide dark mode support with user preference saving',
    priority: 'medium',
    status: 'roadmap',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    signal_count: 5,
    positive_signals: 5,
    negative_signals: 0,
  },
  {
    id: 'idea-3',
    feedback_id: '3',
    title: 'Fix File Upload Size Limit',
    description: 'Increase maximum file size and add progress tracking',
    priority: 'high',
    status: 'active',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    signal_count: 2,
    positive_signals: 2,
    negative_signals: 0,
  },
]

export async function getAllFeedback() {
  return mockFeedback
}

export async function getFeedbackById(id: string) {
  return mockFeedback.find(f => f.id === id)
}

export async function getTodaysFeedback() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return mockFeedback.filter(f => {
    const fDate = new Date(f.created_at)
    fDate.setHours(0, 0, 0, 0)
    return fDate.getTime() === today.getTime() && f.status === 'new'
  }).sort((a, b) => b.score - a.score)
}

export async function updateFeedbackStatus(
  id: string,
  status: 'new' | 'backlog' | 'idea' | 'archived'
) {
  const feedback = mockFeedback.find(f => f.id === id)
  if (feedback) {
    feedback.status = status
    feedback.updated_at = new Date()
  }
  return feedback
}

export async function createIdea(feedbackId: string, title: string, description: string) {
  const newIdea = {
    id: `idea-${Date.now()}`,
    feedback_id: feedbackId,
    title,
    description,
    priority: 'medium',
    status: 'active',
    created_at: new Date(),
    updated_at: new Date(),
    signal_count: 0,
    positive_signals: 0,
    negative_signals: 0,
  }
  mockIdeas.push(newIdea)
  return newIdea
}

export async function getAllIdeas() {
  return mockIdeas.sort((a, b) => {
    if (a.priority === 'high' && b.priority !== 'high') return -1
    if (a.priority !== 'high' && b.priority === 'high') return 1
    return b.signal_count - a.signal_count
  })
}

export async function addSignalToIdea(
  ideaId: string,
  signalType: 'positive' | 'negative',
  source: string,
  metadata: string
) {
  const idea = mockIdeas.find(i => i.id === ideaId)
  if (idea) {
    idea.signal_count += 1
    if (signalType === 'positive') {
      idea.positive_signals += 1
    } else {
      idea.negative_signals += 1
    }
  }
  return { id: `signal-${Date.now()}`, idea_id: ideaId, signal_type: signalType, source, metadata }
}

export async function updateIdeaStatus(
  id: string,
  status: 'active' | 'roadmap' | 'shipped' | 'archived'
) {
  const idea = mockIdeas.find(i => i.id === id)
  if (idea) {
    idea.status = status
    idea.updated_at = new Date()
  }
  return idea
}
