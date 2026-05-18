import { NextRequest, NextResponse } from 'next/server'
import { createOgImageResponse, type OgRouteDoc, type OgRouteSite } from '@/lib/og-image-response'
import { getShareGraphicRedirectUrl } from '@/lib/og-share-graphic'
import { getOgSanityClient } from '@/sanity/lib/og-sanity-client'
import { ogRouteDataQuery } from '@/sanity/queries/documents/og-route-query'

export const runtime = 'edge'

const DOC_TYPES = ['page', 'event'] as const
type DocType = (typeof DOC_TYPES)[number]

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  const typeRaw = request.nextUrl.searchParams.get('type')

  if (!slug || !SLUG_RE.test(slug) || !typeRaw || !DOC_TYPES.includes(typeRaw as DocType)) {
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

  return createOgImageResponse({ doc, site })
}
