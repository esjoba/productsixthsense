import { sql } from '@vercel/postgres'

export async function getAllFeedback() {
  try {
    const result = await sql`
      SELECT * FROM feedback
      ORDER BY created_at DESC
    `
    return result.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch feedback')
  }
}

export async function getFeedbackById(id: string) {
  try {
    const result = await sql`
      SELECT * FROM feedback WHERE id = ${id}
    `
    return result.rows[0]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch feedback')
  }
}

export async function getTodaysFeedback() {
  try {
    const result = await sql`
      SELECT * FROM feedback
      WHERE DATE(created_at) = CURRENT_DATE
      AND status = 'new'
      ORDER BY score DESC, created_at DESC
    `
    return result.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch today\'s feedback')
  }
}

export async function updateFeedbackStatus(
  id: string,
  status: 'new' | 'backlog' | 'idea' | 'archived'
) {
  try {
    const result = await sql`
      UPDATE feedback
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to update feedback')
  }
}

export async function createIdea(feedbackId: string, title: string, description: string) {
  try {
    const result = await sql`
      INSERT INTO idea (feedback_id, title, description)
      VALUES (${feedbackId}, ${title}, ${description})
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to create idea')
  }
}

export async function getAllIdeas() {
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
      ORDER BY i.created_at DESC
    `
    return result.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch ideas')
  }
}

export async function addSignalToIdea(
  ideaId: string,
  signalType: 'positive' | 'negative',
  source: string,
  metadata: string
) {
  try {
    const result = await sql`
      INSERT INTO idea_signal (idea_id, signal_type, source, metadata)
      VALUES (${ideaId}, ${signalType}, ${source}, ${metadata})
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to add signal')
  }
}

export async function updateIdeaStatus(
  id: string,
  status: 'active' | 'roadmap' | 'shipped' | 'archived'
) {
  try {
    const result = await sql`
      UPDATE idea
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to update idea')
  }
}
