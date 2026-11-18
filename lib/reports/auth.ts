import 'server-only'

import { timingSafeEqual } from 'node:crypto'

/**
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when the project has
 * that variable. Without it the report routes refuse everything, so nobody can
 * trigger an email by guessing the URL.
 */
export function isAuthorizedCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const expected = Buffer.from(`Bearer ${secret}`)
  const actual = Buffer.from(request.headers.get('authorization') ?? '')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
