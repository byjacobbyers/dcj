import 'server-only'

import { neon } from '@neondatabase/serverless'

let sql: ReturnType<typeof neon> | undefined

export function getSql() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  sql ??= neon(databaseUrl)

  return sql
}
