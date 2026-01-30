import { Navigation } from '@/components/Navigation'
import { RoadmapScreen } from '@/components/RoadmapScreen'

export default function RoadmapPage() {
  return (
    <>
      <Navigation />
      <main className="p-6 max-w-7xl mx-auto">
        <RoadmapScreen />
      </main>
    </>
  )
}
