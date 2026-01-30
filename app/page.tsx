import { Button } from '@/components/Button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-foreground mb-4">Welcome to Feedback Triage</h2>
          <p className="text-muted-foreground mb-8">
            Organize, prioritize, and act on customer feedback to build better products.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/new">
              <Button size="lg">Start Triaging</Button>
            </Link>
            <Link href="/roadmap">
              <Button size="lg" variant="outline">
                View Roadmap
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }
}
