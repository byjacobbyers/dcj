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
    // Everyone who has signed in under this name, newest first, with the
    // latest guidelines version each of them agreed to (across all their visits).
    const rows = (await sql`
      SELECT p.email, max(s.guidelines_version)::text AS guidelines_version
      FROM people p
      JOIN signins s ON s.person_id = p.id
      WHERE p.id IN (
        SELECT person_id
        FROM signins
        WHERE lower(trim(first_name)) = lower(${firstName})
          AND lower(trim(last_name)) = lower(${lastName})
          AND person_id IS NOT NULL
      )
      GROUP BY p.id, p.email
      ORDER BY max(s.signed_in_at) DESC
      LIMIT 10
    `) as Array<{ email: string; guidelines_version: string | null }>

    return Response.json({
      matches: rows.map((row) => ({
        email: row.email,
        guidelinesVersion: row.guidelines_version,
      })),
    })
  } catch (error) {
    console.error('[API Lookup Email] Error:', error)
    return Response.json(
      { error: 'Internal server error', code: 'UNHANDLED' },
      { status: 500 }
    )
  }
}
