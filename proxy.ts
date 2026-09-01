import { NextResponse, type NextRequest } from 'next/server'
import { apiVersion } from '@/sanity/env'

type Redirect = { source: string; destination: string; permanent?: boolean }

// ponytail: per-instance in-memory cache with 60s TTL; a CMS redirect takes
// effect within a minute without a deploy. Move to Vercel Edge Config if
// per-request latency or instance fan-out ever matters.
let cache: { map: Map<string, Redirect>; fetchedAt: number } | null = null
const TTL_MS = 60_000

const stripTrailingSlash = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

async function getRedirects(): Promise<Map<string, Redirect>> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) return cache.map

  const map = new Map<string, Redirect>()
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  if (projectId && dataset) {
    try {
      const query = encodeURIComponent('*[_type == "redirect"]{source, destination, permanent}')
      const res = await fetch(
        `https://${projectId}.apicdn.sanity.io/v${apiVersion.replace(/^v/, '')}/data/query/${dataset}?query=${query}`
      )
      if (res.ok) {
        const { result } = (await res.json()) as { result?: Redirect[] }
        for (const r of result || []) {
          if (r?.source && r?.destination) map.set(stripTrailingSlash(r.source), r)
        }
      }
    } catch {
      // Sanity unreachable: serve without redirects rather than failing requests
    }
  }

  cache = { map, fetchedAt: Date.now() }
  return map
}

export async function proxy(request: NextRequest) {
  const redirects = await getRedirects()
  const hit = redirects.get(stripTrailingSlash(request.nextUrl.pathname))
  if (!hit) return NextResponse.next()

  const destination = hit.destination.startsWith('http')
    ? hit.destination
    : new URL(hit.destination, request.url)
  return NextResponse.redirect(destination, hit.permanent === false ? 307 : 308)
}

export const config = {
  // Pages only: skip Next internals, API routes, the studio, and any path
  // with a file extension.
  matcher: ['/((?!api|_next|studio|.*\\..*).*)'],
}
