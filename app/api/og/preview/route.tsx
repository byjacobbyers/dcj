import { NextResponse } from 'next/server'
import { createOgImageResponse } from '@/lib/og-image-response'
import { getShareGraphicRedirectUrl } from '@/lib/og-share-graphic'
import { getOgSanityClient } from '@/sanity/lib/og-sanity-client'
import { ogRouteDataQuery } from '@/sanity/queries/documents/og-route-query'
import type { OgRouteDoc, OgRouteSite } from '@/lib/og-image-response'

export const runtime = 'edge'

const DOC_TYPES = ['page', 'event'] as const
type DocType = (typeof DOC_TYPES)[number]

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

type PreviewBody = {
  slug?: string
  type?: string
  heading?: unknown
  background?: string | null
}

/**
 * Studio-only: renders OG from the **current form** heading/background + Sanity for doc/site shell.
 * Avoids lag where GET /api/og only sees persisted CMS state. Disabled outside development.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return new Response('OG preview POST is only available in development', { status: 403 })
  }

  let body: PreviewBody
  try {
    body = (await request.json()) as PreviewBody
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const slug = typeof body.slug === 'string' ? body.slug : ''
  const typeRaw = typeof body.type === 'string' ? body.type : ''

  if (!slug || !SLUG_RE.test(slug) || !DOC_TYPES.includes(typeRaw as DocType)) {
    return new Response('Bad request', { status: 400 })
  }

  const docType = typeRaw as DocType

  let data: { doc: OgRouteDoc | null; site: OgRouteSite | null }
  try {
    data = await getOgSanityClient().fetch(ogRouteDataQuery, { slug, docType })
  } catch {
    return new Response('Upstream error', { status: 502 })
  }

  const doc = data.doc
  const site = data.site

  if (!doc) {
    return new Response('Not found', { status: 404 })
  }

  const redirectUrl = getShareGraphicRedirectUrl(doc)
  if (redirectUrl) {
    return NextResponse.redirect(redirectUrl, 307)
  }

  return createOgImageResponse({
    doc,
    site,
    headingPortableOverride: body.heading,
    backgroundOverride: body.background ?? undefined,
  })
}
