import { NextRequest, NextResponse } from 'next/server'
import { getAllIdeas } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { feedback_id, title, description, priority = 'medium' } = await request.json()

    if (!feedback_id || !title) {
      return NextResponse.json(
        { error: 'feedback_id and title are required' },
        { status: 400 }
      )
    }

    const { createIdea } = await import('@/lib/db')
    const newIdea = await createIdea(feedback_id, title, description)

    return NextResponse.json(newIdea, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const ideas = await getAllIdeas()
    return NextResponse.json(ideas)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    )
  }
}
