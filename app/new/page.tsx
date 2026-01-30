import { Navigation } from '@/components/Navigation'
import { NewRequestsScreen } from '@/components/NewRequestsScreen'

export default function NewPage() {
  return (
    <>
      <Navigation />
      <main className="p-6 max-w-7xl mx-auto">
        <NewRequestsScreen />
      </main>
    </>
  )
}
