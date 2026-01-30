'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/Button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/Card'
import { Badge } from '@/components/Badge'

export default function DemoPage() {
  const [formData, setFormData] = useState({
    email: '',
    text: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setResult(data)
      setSubmitted(true)
      setFormData({ email: '', text: '' })
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      alert('Failed to submit feedback')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">Demo: Submit Feedback</h2>
          <p className="mt-2 text-muted-foreground">
            Try submitting different types of feedback to see how the categorization and scoring system works.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit Feedback</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@example.com"
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Feedback
                    </label>
                    <textarea
                      name="text"
                      value={formData.text}
                      onChange={handleChange}
                      placeholder="The app is very slow when loading data. It takes 5+ seconds which is frustrating."
                      rows={6}
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Result */}
          {submitted && result && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Category</p>
                    <Badge className="capitalize">{result.category}</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Sentiment</p>
                    <Badge
                      variant={
                        result.sentiment === 'positive'
                          ? 'accent'
                          : result.sentiment === 'negative'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="capitalize"
                    >
                      {result.sentiment}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Priority Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full"
                          style={{ width: `${result.score}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-primary">{result.score}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Status</p>
                    <Badge variant="secondary" className="capitalize">
                      {result.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Example feedback samples */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Try These Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => {
                setFormData({
                  email: 'john@example.com',
                  text: 'The app is very slow when loading data. It takes 5+ seconds which is frustrating.'
                })
              }}>
                <p className="text-sm font-medium text-foreground">Performance Issue (High Priority)</p>
                <p className="text-xs text-muted-foreground mt-1">The app is very slow when loading data. It takes 5+ seconds which is frustrating.</p>
              </div>
              <div className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => {
                setFormData({
                  email: 'jane@example.com',
                  text: 'Love the new design! Can you add integrations with Slack and Linear for better workflow?'
                })
              }}>
                <p className="text-sm font-medium text-foreground">Feature Request (Positive)</p>
                <p className="text-xs text-muted-foreground mt-1">Love the new design! Can you add integrations with Slack and Linear for better workflow?</p>
              </div>
              <div className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => {
                setFormData({
                  email: 'bob@example.com',
                  text: 'The UI is confusing. I cannot find where to update my settings and the buttons are not clear.'
                })
              }}>
                <p className="text-sm font-medium text-foreground">UX Issue (Medium Priority)</p>
                <p className="text-xs text-muted-foreground mt-1">The UI is confusing. I cannot find where to update my settings and the buttons are not clear.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
