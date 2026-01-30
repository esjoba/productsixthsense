import { Navigation } from '@/components/Navigation'
import { BacklogScreen } from '@/components/BacklogScreen'

export default function BacklogPage() {
  return (
    <>
      <Navigation />
      <main className="p-6 max-w-7xl mx-auto">
        <BacklogScreen />
      </main>
    </>
  )
}
