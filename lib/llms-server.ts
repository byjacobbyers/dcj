import { client } from '@/sanity/lib/client'
import { pageQuery } from '@/sanity/queries/documents/page-query'
import { eventQuery } from '@/sanity/queries/documents/event-query'
import { postQuery } from '@/sanity/queries/documents/post-query'
import { llmsDocumentsQuery, llmsIndexQuery } from '@/sanity/queries/documents/llms-query'
import {
  buildLlmsIndex,
  documentToMarkdown,
  type IndexInput,
  type MarkdownDoc,
  type MarkdownDocType,
} from '@/lib/llms'

/**
 * Fetching for the Markdown surfaces. Plain client, CDN on, no Live tags:
 * these handlers are dynamic on purpose so every crawler read is fresh-ish
 * (CDN-cached) without joining the Live subscription pool.
 */
export async function fetchMarkdownDocument(type: MarkdownDocType, slug: string): Promise<string | null> {
  const query = type === 'post' ? postQuery : type === 'event' ? eventQuery : pageQuery
  const doc = (await client.fetch(query, { slug })) as MarkdownDoc | null
  return doc ? documentToMarkdown(doc, type) : null
}

export async function fetchLlmsIndex(): Promise<string> {
  const data = (await client.fetch(llmsIndexQuery)) as {
    site: { title?: string; summary?: string; homeDescription?: string } | null
    nav: Array<{ slug?: string | null; description?: string | null }> | null
    pages: IndexInput['pages']
    events: IndexInput['events']
    posts: IndexInput['posts']
  }
  return buildLlmsIndex({
    site: {
      name: data.site?.title?.trim() || 'Denver Contact Jam',
      summary: data.site?.summary?.trim() || 'Contact improvisation jams and events in Denver.',
    },
    nav: (data.nav ?? [])
      .filter((n) => n?.slug)
      .map((n) => ({ slug: n.slug as string, description: n.description ?? undefined })),
    // The home document has no SEO of its own; Site Settings carries it.
    pages: data.pages.map((p) =>
      p.slug === 'home' && !p.description ? { ...p, description: data.site?.homeDescription ?? undefined } : p
    ),
    events: data.events,
    posts: data.posts,
  })
}

export async function fetchLlmsFull(): Promise<string> {
  const { pages, events, posts } = (await client.fetch(llmsDocumentsQuery)) as {
    pages: Array<{ slug: string }>
    events: Array<{ slug: string }>
    posts: Array<{ slug: string }>
  }
  const docs = [
    ...pages.map((p) => ({ type: 'page' as const, slug: p.slug })),
    ...events.map((e) => ({ type: 'event' as const, slug: e.slug })),
    ...posts.map((p) => ({ type: 'post' as const, slug: p.slug })),
  ]
  const rendered = await Promise.all(docs.map((d) => fetchMarkdownDocument(d.type, d.slug)))
  return rendered.filter(Boolean).join('\n\n\n') + '\n'
}

/** A Markdown response for crawler surfaces. */
export function markdownResponse(body: string) {
  return new Response(body, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'x-robots-tag': 'noindex',
    },
  })
}
