import { NextRequest, NextResponse } from 'next/server'

// Stubbed Linear integration
export async function POST(request: NextRequest) {
  try {
    const { idea_id, title, description, priority = 'Medium' } = await request.json()

    console.log(`[Linear Integration] Creating issue:`, { title, priority })

    // In production, this would call the Linear API
    // const response = await fetch('https://api.linear.app/graphql', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.LINEAR_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     query: CREATE_ISSUE_MUTATION,
    //     variables: { title, description, priority, ideaId: idea_id }
    //   })
    // })

    return NextResponse.json(
      {
        success: true,
        message: `[STUBBED] Issue created in Linear with title: "${title}"`,
        idea_id,
        issue_id: `LIN-${Math.floor(Math.random() * 9000) + 1000}`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Linear Integration Error:', error)
    return NextResponse.json(
      { error: 'Failed to create Linear issue' },
      { status: 500 }
    )
  }
}
