import { getSql } from '@/lib/neon'

function parseString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>
    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const firstName = parseString(body.firstName)
    const lastName = parseString(body.lastName)

    if (!firstName || !lastName) {
      return Response.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    const sql = getSql()
    const rows = (await sql`
      SELECT email
      FROM (
        SELECT DISTINCT ON (lower(trim(email))) email, signed_in_at
        FROM signins
        WHERE lower(trim(first_name)) = lower(${firstName})
          AND lower(trim(last_name)) = lower(${lastName})
          AND trim(email) <> ''
        ORDER BY lower(trim(email)), signed_in_at DESC
      ) matched_emails
      ORDER BY signed_in_at DESC
      LIMIT 10
    `) as Array<{ email: string }>

    return Response.json({ emails: rows.map((row) => row.email) })
  } catch (error) {
    console.error('[API Lookup Email] Error:', error)
    return Response.json(
      { error: 'Internal server error', code: 'UNHANDLED' },
      { status: 500 }
    )
  }
}
