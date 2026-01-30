import { NextRequest, NextResponse } from 'next/server'
import { categorizeText, calculateScore, detectSentiment } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { email, text, source = 'web', contact_name = null } = await request.json()

    if (!email || !text) {
      return NextResponse.json(
        { error: 'Email and text are required' },
        { status: 400 }
      )
    }

    const category = categorizeText(text)
    const sentiment = detectSentiment(text)
    const score = calculateScore(text, sentiment)

    const newFeedback = {
      id: String(Date.now()),
      email,
      contact_name,
      text,
      category,
      sentiment,
      score,
      source,
      status: 'new',
      created_at: new Date(),
      updated_at: new Date(),
    }

    return NextResponse.json(newFeedback, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { getAllFeedback } = await import('@/lib/db')
    const feedback = await getAllFeedback()
    return NextResponse.json(feedback)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}
