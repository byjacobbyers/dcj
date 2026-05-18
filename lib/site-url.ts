const DEFAULT_DEV_PORT = process.env.PORT || '3000'
const DEFAULT_DEV_ORIGIN = `http://localhost:${DEFAULT_DEV_PORT}`
const PROD_FALLBACK = 'http://localhost:3000'

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

/**
 * Public site origin (no trailing slash).
 *
 * **Development:** `NEXT_PUBLIC_LOCAL_URL` → `http://localhost:$PORT` (default port 3000).
 * We intentionally do **not** fall back to `NEXT_PUBLIC_SITE_URL` here, so Presentation /
 * draft-mode and stega use your local app instead of production when `.env.local` still
 * has the live domain set.
 *
 * **Production:** `NEXT_PUBLIC_SITE_URL` → localhost (misconfiguration fallback only).
 *
 * For a one-off override of the Presentation iframe origin, use `SANITY_STUDIO_PREVIEW_ORIGIN`
 * in `sanity.config.ts`.
 */
export function getPublicSiteUrl(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  if (process.env.NODE_ENV === 'development') {
    const local = process.env.NEXT_PUBLIC_LOCAL_URL?.trim()
    if (local) return stripTrailingSlash(local)
    return stripTrailingSlash(DEFAULT_DEV_ORIGIN)
  }

  const raw = site || PROD_FALLBACK
  return stripTrailingSlash(raw)
}
