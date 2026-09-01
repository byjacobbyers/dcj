import { fetchMarkdownDocument, markdownResponse } from '@/lib/llms-server'

export const dynamic = 'force-dynamic'

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

/** Reached through the `.md` rewrites in next.config.ts, never linked directly. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  const { type, slug } = await params
  if ((type !== 'page' && type !== 'event' && type !== 'post') || !SLUG_RE.test(slug)) {
    return new Response('Not found', { status: 404 })
  }
  const body = await fetchMarkdownDocument(type, slug)
  if (!body) return new Response('Not found', { status: 404 })
  return markdownResponse(body)
}
