import { getSql } from '@/lib/neon'
import {
  isPaymentAmount,
  isPaymentMethod,
  normalizeEmail,
  parseVersionDate,
  paymentNeedsAmount,
} from '@/lib/signin'
import { client } from '@/sanity/lib/client'
import { SignInSettingsQuery } from '@/sanity/queries/documents/sign-in-query'

function parseString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Read fresh from Sanity so a sign-in records the version that is live right
 * now. If Sanity is unreachable the sign-in still goes through, unversioned,
 * and the box is simply unchecked again next time.
 */
async function currentGuidelinesVersion(): Promise<string | null> {
  try {
    const settings = await client.fetch(SignInSettingsQuery, {}, { useCdn: false, stega: false })
    return parseVersionDate(settings?.guidelinesVersion)
  } catch (error) {
    console.error('[API Signin] Could not read the guidelines version:', error)
    return null
  }
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
    const email = parseString(body.email)
    const paymentMethod = parseString(body.paymentMethod)
    const amount = body.amount

    if (!firstName) {
      return Response.json({ error: 'First name is required' }, { status: 400 })
    }

    if (!lastName) {
      return Response.json({ error: 'Last name is required' }, { status: 400 })
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return Response.json({ error: 'A valid email is required' }, { status: 400 })
    }

    if (body.agreedToGuidelines !== true) {
      return Response.json({ error: 'Please confirm you have read the guidelines' }, { status: 400 })
    }

    if (!isPaymentMethod(paymentMethod)) {
      return Response.json({ error: 'A valid payment method is required' }, { status: 400 })
    }

    const needsAmount = paymentNeedsAmount(paymentMethod)
    if (needsAmount && !isPaymentAmount(amount)) {
      return Response.json({ error: 'Please choose an amount' }, { status: 400 })
    }

    const guidelinesVersion = await currentGuidelinesVersion()

    const sql = getSql()
    const rows = (await sql`
      WITH person AS (
        INSERT INTO people (email, first_name, last_name)
        VALUES (${normalizeEmail(email)}, ${firstName}, ${lastName})
        ON CONFLICT (email) DO UPDATE
          SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
        RETURNING id
      )
      INSERT INTO signins (
        person_id, first_name, last_name, email, payment_method, amount, guidelines_version, signed_in_at
      )
      SELECT
        person.id, ${firstName}::text, ${lastName}::text, ${email}::text, ${paymentMethod}::text,
        ${needsAmount ? amount : null}::integer, ${guidelinesVersion}::date, NOW()
      FROM person
      RETURNING id, signed_in_at
    `) as Array<{ id: number; signed_in_at: string }>

    return Response.json({ success: true, signin: rows[0] })
  } catch (error) {
    console.error('[API Signin] Error:', error)
    return Response.json(
      { error: 'Internal server error', code: 'UNHANDLED' },
      { status: 500 }
    )
  }
}
