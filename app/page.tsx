import Link from 'next/link'
import { Button } from '@/components/Button'

export default function HomePage() {
  return (
    <main className="p-8">
      <div className="max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Customer Feedback Triage</h1>
          <p className="text-lg text-muted-foreground">Organize, categorize, and prioritize customer feedback to drive product decisions</p>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-12">
          <Link href="/new" className="p-8 bg-card rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-lg">
            <div className="text-4xl mb-4">📬</div>
            <h3 className="text-lg font-semibold text-foreground">New Requests</h3>
            <p className="text-sm text-muted-foreground mt-3">Daily feedback triage in kanban view</p>
          </Link>
          
          <Link href="/backlog" className="p-8 bg-card rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-lg">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-foreground">Backlog</h3>
            <p className="text-sm text-muted-foreground mt-3">All feedback organized by priority</p>
          </Link>
          
          <Link href="/roadmap" className="p-8 bg-card rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-lg">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-foreground">Roadmap</h3>
            <p className="text-sm text-muted-foreground mt-3">Prioritized ideas and trends</p>
          </Link>
        </div>
        
        <div className="flex gap-4">
          <Link href="/new">
            <Button size="lg" variant="primary">Start Triaging</Button>
          </Link>
          <Link href="/backlog">
            <Button size="lg" variant="secondary">View Backlog</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

