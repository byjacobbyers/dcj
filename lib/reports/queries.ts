import 'server-only'

import { getSql } from '@/lib/neon'
import type { Period } from './period'
import type { SigninRow } from './summarize'

type DbRow = {
  person_key: string
  first_name: string | null
  last_name: string | null
  payment_method: string | null
  amount: number | null
  jam_date: string
  first_date: string
}

/**
 * Sign-ins whose Denver date falls in the period, each with the date of that
 * person's first ever sign-in. People are matched by `person_id`, or by email
 * for any old row the people backfill did not link.
 *
 * `signed_in_at::timestamptz` is a no-op on a timestamptz column and reads a
 * plain timestamp as UTC (the session default), so either column type works.
 */
export async function fetchSignins(period: Period): Promise<SigninRow[]> {
  const sql = getSql()
  const rows = (await sql`
    WITH keyed AS (
      SELECT
        COALESCE(person_id::text, lower(trim(email))) AS person_key,
        trim(first_name) AS first_name,
        trim(last_name) AS last_name,
        payment_method::text AS payment_method,
        amount,
        (signed_in_at::timestamptz AT TIME ZONE 'America/Denver')::date AS jam_date
      FROM signins
    ),
    firsts AS (
      SELECT person_key, min(jam_date) AS first_date FROM keyed GROUP BY person_key
    )
    SELECT
      k.person_key, k.first_name, k.last_name, k.payment_method, k.amount,
      to_char(k.jam_date, 'YYYY-MM-DD') AS jam_date,
      to_char(f.first_date, 'YYYY-MM-DD') AS first_date
    FROM keyed k
    JOIN firsts f USING (person_key)
    WHERE k.jam_date >= ${period.start}::date AND k.jam_date < ${period.end}::date
    ORDER BY k.jam_date
  `) as DbRow[]

  return rows.map((r) => ({
    personKey: r.person_key,
    firstName: r.first_name ?? '',
    lastName: r.last_name ?? '',
    paymentMethod: r.payment_method ?? 'none',
    amount: r.amount == null ? null : Number(r.amount),
    jamDate: r.jam_date,
    firstDate: r.first_date,
  }))
}
