import { Button } from '@/components/Button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-8">
      <div className="text-center max-w-2xl">
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-foreground mb-4">Customer Feedback Triage</h1>
          <p className="text-xl text-muted-foreground">Organize, categorize, and prioritize customer feedback to drive product decisions</p>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-12">
          <Link href="/new" className="p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="text-5xl mb-4">📬</div>
            <h3 className="text-lg font-semibold text-foreground">New Requests</h3>
            <p className="text-sm text-muted-foreground mt-3">Daily feedback triage</p>
          </Link>
          <Link href="/backlog" className="p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-foreground">Backlog</h3>
            <p className="text-sm text-muted-foreground mt-3">All feedback by category</p>
          </Link>
          <Link href="/roadmap" className="p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="text-5xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-foreground">Roadmap</h3>
            <p className="text-sm text-muted-foreground mt-3">Prioritized ideas</p>
          </Link>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/new">
            <Button size="lg" variant="primary">Get Started</Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="secondary">View Demo</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
