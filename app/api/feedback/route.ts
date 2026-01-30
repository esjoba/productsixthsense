import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
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

    const result = await sql`
      INSERT INTO feedback (email, text, category, sentiment, score, source, contact_name, status)
      VALUES (${email}, ${text}, ${category}, ${sentiment}, ${score}, ${source}, ${contact_name}, 'new')
      RETURNING *
    `

    return NextResponse.json(result.rows[0], { status: 201 })
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
    const result = await sql`
      SELECT * FROM feedback
      ORDER BY created_at DESC
      LIMIT 100
    `
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}
