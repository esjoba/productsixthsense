'use client'

import { useEffect, useState } from 'react'

interface Idea {
  id: string
  title: string
  description: string
  priority: string
  status: string
  signal_count: number
  positive_signals: number
  negative_signals: number
  created_at: string
}

export function RoadmapScreen() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadIdeas() {
      try {
        const response = await fetch('/api/ideas')
        const data = await response.json()
        setIdeas(data)
      } catch (error) {
        console.error('Failed to load ideas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadIdeas()
  }, [])

  const handlePostToSlack = async (idea: Idea) => {
    try {
      await fetch('/api/integrations/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea_id: idea.id,
          message: `New idea: *${idea.title}* - ${idea.description}`,
          channel: '#feedback',
        }),
      })
      alert('Posted to Slack (demo mode)')
    } catch (error) {
      console.error('Failed to post to Slack:', error)
    }
  }

  const handleCreateLinearIssue = async (idea: Idea) => {
    try {
      const response = await fetch('/api/integrations/linear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea_id: idea.id,
          title: idea.title,
          description: idea.description,
          priority: idea.priority,
        }),
      })
      const data = await response.json()
      alert(`Created Linear issue: ${data.issue_id}`)
    } catch (error) {
      console.error('Failed to create Linear issue:', error)
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <p style={{ color: '#a1a1aa' }}>Loading roadmap...</p>
      </div>
    )
  }

  const statusGroups = {
    active: ideas.filter((i) => i.status === 'active'),
    roadmap: ideas.filter((i) => i.status === 'roadmap'),
    shipped: ideas.filter((i) => i.status === 'shipped'),
  }

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#ffffff' }}>Product Roadmap</h2>
        <p style={{ marginTop: '8px', color: '#a1a1aa' }}>Ideas prioritized by customer feedback signals</p>
      </div>

      {Object.entries(statusGroups).map(([status, items]) => (
        <div key={status} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #27272a' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', textTransform: 'capitalize' }}>{status}</h3>
            <span style={{ padding: '6px 12px', borderRadius: '9999px', backgroundColor: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', fontSize: '14px', fontWeight: '500', border: '1px solid rgba(96, 165, 250, 0.3)' }}>{items.length}</span>
          </div>
          {items.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#a1a1aa', padding: '16px' }}>No ideas in this stage</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map((idea) => (
                <div key={idea.id} style={{ backgroundColor: '#27272a', borderRadius: '8px', border: '1px solid #3f3f46', padding: '24px', transition: 'all 0.2s' }} onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)'
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3f3f46'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>{idea.title}</h4>
                      <p style={{ marginTop: '8px', fontSize: '14px', color: '#a1a1aa' }}>{idea.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <span style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '14px', fontWeight: '500', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)' }}>{idea.priority}</span>
                      <span style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '14px', fontWeight: '500', backgroundColor: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', border: '1px solid rgba(96, 165, 250, 0.3)' }}>{idea.signal_count}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#d4d4d8' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>👍</span>
                        <span style={{ fontWeight: '500' }}>{idea.positive_signals || 0}</span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>👎</span>
                        <span style={{ fontWeight: '500' }}>{idea.negative_signals || 0}</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handlePostToSlack(idea)}
                        style={{
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
                        Slack
                      </button>
                      <button
                        onClick={() => handleCreateLinearIssue(idea)}
                        style={{
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
                        Linear
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
