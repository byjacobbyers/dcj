#!/usr/bin/env node
/**
 * Bulk-import redirects from a migration CSV into Sanity.
 *
 * CSV columns: source,destination[,permanent]   (header row optional)
 * ponytail: naive comma split; quote-wrapped fields with commas are not
 * supported. Fine for path-to-path migration maps.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=... node scripts/import-redirects.mjs redirects.csv
 * Reads NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET from env
 * (source .env.local first, or pass them inline).
 */
import { readFileSync } from 'node:fs'

const [, , csvPath] = process.argv
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!csvPath || !projectId || !token) {
  console.error(
    'Usage: SANITY_API_WRITE_TOKEN=... NEXT_PUBLIC_SANITY_PROJECT_ID=... node scripts/import-redirects.mjs <file.csv>'
  )
  process.exit(1)
}

const rows = readFileSync(csvPath, 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => line.split(',').map((c) => c.trim()))
  .filter(([source]) => source?.startsWith('/')) // drops a header row too

if (rows.length === 0) {
  console.error('No valid rows found (source column must start with /)')
  process.exit(1)
}

const mutations = rows.map(([source, destination, permanent]) => ({
  createOrReplace: {
    _id: `redirect-${source.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    _type: 'redirect',
    source,
    destination,
    permanent: permanent ? permanent.toLowerCase() !== 'false' : true,
  },
}))

const res = await fetch(
  `https://${projectId}.api.sanity.io/v2025-02-19/data/mutate/${dataset}`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  }
)

if (!res.ok) {
  console.error(`Import failed: ${res.status}`, await res.text())
  process.exit(1)
}
console.log(`Imported ${mutations.length} redirects.`)
