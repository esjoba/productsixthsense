import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function POST(request: NextRequest) {
  try {
    const { feedback_id, title, description, priority = 'medium' } = await request.json()

    if (!feedback_id || !title) {
      return NextResponse.json(
        { error: 'feedback_id and title are required' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO idea (feedback_id, title, description, priority, status)
      VALUES (${feedback_id}, ${title}, ${description || null}, ${priority}, 'active')
      RETURNING *
    `

    return NextResponse.json(result.rows[0], { status: 201 })
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
    const result = await sql`
      SELECT 
        i.*,
        COUNT(is.id) as signal_count,
        SUM(CASE WHEN is.signal_type = 'positive' THEN 1 ELSE 0 END) as positive_signals,
        SUM(CASE WHEN is.signal_type = 'negative' THEN 1 ELSE 0 END) as negative_signals
      FROM idea i
      LEFT JOIN idea_signal is ON i.id = is.idea_id
      GROUP BY i.id
      ORDER BY i.priority DESC, i.created_at DESC
    `
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    )
  }
}
