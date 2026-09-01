/**
 * llms.txt and per-page Markdown, built from the same documents the pages
 * render. Nothing here is a new field: titles, SEO descriptions, navigation
 * one-liners, excerpts and the sections' Portable Text already exist.
 *
 * Pure builders; the route handlers fetch and call these.
 */
import { buildUrl } from '@/lib/seo'
import { portableTextToMarkdown, tidy, type PtMarkDef, type PtNode } from '@/lib/portable-text-to-markdown'

type Json = Record<string, unknown>
const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : '')
const arr = (v: unknown): Json[] => (Array.isArray(v) ? (v as Json[]) : [])
const pt = (v: unknown) => (Array.isArray(v) ? (v as PtNode[]) : null)

export type MarkdownDocType = 'page' | 'event' | 'post'

/** Public path of a document. */
export const docPath = (type: MarkdownDocType, slug: string) =>
  type === 'post'
    ? `/posts/${slug}`
    : type === 'event'
      ? `/events/${slug}`
      : slug === 'home'
        ? '/'
        : `/${slug}`

/** `/pricing` → `/pricing.md`; `/` → `/index.md`. */
export const markdownPath = (path: string) => (path === '/' ? '/index.md' : `${path}.md`)

/**
 * Link annotations carry either an inline route (new) or a nested `route`
 * (legacy). Resolved to absolute URLs so the Markdown reads on its own.
 */
export function resolveLinkHref(def: PtMarkDef): string | null {
  const r = (def.linkType ? def : (def.route as Json | undefined)) as Json | undefined
  if (!r?.linkType) return null
  const page = r.pageRoute as { slug?: string } | undefined
  const event = r.eventRoute as { slug?: string } | undefined
  switch (r.linkType) {
    case 'page':
      return page?.slug ? buildUrl(docPath('page', page.slug)) : null
    case 'event':
      return event?.slug ? buildUrl(docPath('event', event.slug)) : null
    case 'path':
      return typeof r.route === 'string' ? buildUrl(`/${r.route.replace(/^\/+/, '')}`) : null
    case 'external':
      return str(r.link) || null
    case 'email':
      return r.email ? `mailto:${r.email}` : null
    case 'telephone':
      return r.telephone ? `tel:${r.telephone}` : null
    default:
      return null
  }
}

/**
 * Blocks with nothing a model could read: media, spacing, and lists that
 * render from other documents (posts). The registry test checks every
 * insert-menu block is either handled in sectionToMarkdown or listed here.
 */
export const MARKDOWN_SKIPPED_BLOCKS = [
  'imageBlock',
  'galleryBlock',
  'embedBlock',
  'dividerBlock',
  'spacerBlock',
  'videoBlock',
  'coverVideo',
  'postsBlock',
] as const

/** One section of the page builder → Markdown. Unknown or visual-only blocks render nothing. */
export function sectionToMarkdown(section: Json): string {
  if (section.active === false) return ''
  const md = (v: unknown) =>
    portableTextToMarkdown(pt(v), { resolveHref: resolveLinkHref, headingOffset: 1 })
  const h2 = (v: unknown) => (str(v) ? `## ${str(v)}` : '')
  const h3 = (v: unknown) => (str(v) ? `### ${str(v)}` : '')
  const cta = (v: unknown) => {
    const c = v as Json | undefined
    const route = c?.route as Json | undefined
    if (!c || c.active === false || !route?.linkType) return ''
    const href = resolveLinkHref(route as PtMarkDef)
    const title = str(route.title)
    return href && title ? `[${title}](${href})` : ''
  }
  const parts: string[] = []
  switch (section._type) {
    case 'coverBlock':
    case 'heroBlock':
    case 'ctaBlock':
    case 'textBlock':
      parts.push(md(section.content), cta(section.cta))
      break
    case 'formBlock':
      parts.push(h2(section.title), md(section.content))
      break
    case 'columnBlock':
      parts.push(md(section.header))
      for (const col of arr(section.columns)) parts.push(h3(col.title), md(col.content), cta(col.cta))
      parts.push(md(section.footer), cta(section.cta))
      break
    case 'problemBlock':
      parts.push(md(section.content))
      for (const col of arr(section.columns)) parts.push(md(col.content))
      parts.push(md(section.excerpt))
      break
    case 'faqBlock':
      parts.push(h2(section.title))
      for (const f of arr(section.faqs)) parts.push(h3(f.question), md(f.answer))
      break
    case 'splitScrollBlock':
      parts.push(md(section.title))
      for (const item of arr(section.items)) parts.push(md(item.content))
      break
    case 'teamMemberBlock': {
      const m = section.member as Json | undefined
      if (m) parts.push(h2(m.title), str(m.primaryJobTitle), md(m.content))
      break
    }
    default:
      break
  }
  return tidy(parts.filter(Boolean).join('\n\n'))
}

export type MarkdownDoc = {
  title?: string | null
  slug?: string | { current?: string | null } | null
  excerpt?: string | null
  seo?: { metaDesc?: string | null } | null
  sections?: unknown
  body?: unknown
  publishedAt?: string | null
  startDate?: string | null
  endDate?: string | null
  location?: string | null
  author?: { title?: string | null } | null
  _updatedAt?: string | null
}

const slugOf = (doc: MarkdownDoc) =>
  typeof doc.slug === 'string' ? doc.slug : str(doc.slug?.current)

/** A whole page, event or post as one Markdown document with a small front matter. */
export function documentToMarkdown(doc: MarkdownDoc, type: MarkdownDocType): string {
  const slug = slugOf(doc) || 'home'
  const url = buildUrl(docPath(type, slug))
  const front = [
    '---',
    `title: ${JSON.stringify(str(doc.title) || slug)}`,
    `url: ${url}`,
    doc.publishedAt ? `published: ${doc.publishedAt}` : '',
    type === 'event' && doc.startDate ? `starts: ${doc.startDate}` : '',
    type === 'event' && doc.endDate ? `ends: ${doc.endDate}` : '',
    type === 'event' && str(doc.location) ? `location: ${JSON.stringify(str(doc.location))}` : '',
    doc._updatedAt ? `updated: ${doc._updatedAt}` : '',
    '---',
  ].filter(Boolean)
  const body =
    type === 'post'
      ? [
          `# ${str(doc.title) || slug}`,
          str(doc.excerpt) ? `> ${str(doc.excerpt)}` : '',
          doc.author?.title ? `By ${doc.author.title}` : '',
          portableTextToMarkdown(pt(doc.body), { resolveHref: resolveLinkHref, headingOffset: 1 }),
        ]
      : [
          `# ${str(doc.title) || slug}`,
          str(doc.seo?.metaDesc) ? `> ${str(doc.seo?.metaDesc)}` : '',
          ...arr(doc.sections).map((s) => sectionToMarkdown(s)),
        ]
  return tidy(
    [...front, '', ...body.filter(Boolean)]
      .join('\n\n')
      .replace(/^---\n\n/, '---\n')
      .replace(/\n\n(?=(title|url|published|starts|ends|location|updated):)/g, '\n')
      .replace(/\n\n---/, '\n---')
  )
}

export type IndexInput = {
  site: { name: string; summary: string }
  /** Header navigation: page links with optional one-liners, in nav order. */
  nav: Array<{ slug: string; description?: string }>
  pages: Array<{ slug: string; title: string; description?: string }>
  events: Array<{ slug: string; title: string; startDate?: string }>
  posts: Array<{ slug: string; title: string; excerpt?: string; publishedAt?: string }>
}

/**
 * llms.txt: the site in one screen. Pages follow the header navigation so the
 * file reorganizes itself when the nav does; the one-liners are the nav
 * descriptions, then the SEO description, then nothing.
 */
export function buildLlmsIndex(input: IndexInput): string {
  const out: string[] = [`# ${input.site.name}`, '', `> ${input.site.summary}`, '']
  out.push(
    'Every page on this site is also available as Markdown: append `.md` to its URL (the home page is `/index.md`). Links below point at the Markdown versions.',
    ''
  )
  const line = (path: string, title: string, desc?: string) =>
    `- [${title}](${buildUrl(markdownPath(path))})${desc ? `: ${desc}` : ''}`

  const byPage = new Map(input.pages.map((p) => [p.slug, p]))
  const seen = new Set<string>()
  out.push('## Pages', '')

  const home = byPage.get('home')
  if (home) {
    out.push(line('/', home.title, home.description))
    seen.add('home')
  }
  for (const item of input.nav) {
    const page = byPage.get(item.slug)
    if (!page || seen.has(item.slug)) continue
    out.push(line(docPath('page', item.slug), page.title, item.description || page.description))
    seen.add(item.slug)
  }
  const rest = input.pages.filter((p) => !seen.has(p.slug))
  if (rest.length) {
    out.push('', '## More', '')
    for (const page of rest) out.push(line(docPath('page', page.slug), page.title, page.description))
  }
  if (input.events.length) {
    out.push('', '## Events', '')
    for (const event of input.events)
      out.push(line(docPath('event', event.slug), event.title, event.startDate))
  }
  if (input.posts.length) {
    out.push('', '## Articles', '')
    for (const post of input.posts) out.push(line(docPath('post', post.slug), post.title, post.excerpt))
  }
  out.push('', '## Optional', '', `- [Everything as one file](${buildUrl('/llms-full.txt')})`, `- [Sitemap](${buildUrl('/sitemap.xml')})`)
  return tidy(out.join('\n')) + '\n'
}
