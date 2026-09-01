/**
 * Portable Text → Markdown, for the .md and llms.txt surfaces. Covers what the
 * site's simpleText / normalText actually allow: block styles, bullet and
 * numbered lists, strong / em / code marks, link annotations and inline images.
 * Pure; link hrefs come from the caller so this file knows nothing about routes.
 */
export type PtSpan = { _type: 'span'; text?: string; marks?: string[] }
export type PtMarkDef = { _key: string; _type: string } & Record<string, unknown>
export type PtBlock = {
  _type: 'block'
  style?: string
  listItem?: 'bullet' | 'number' | string
  level?: number
  children?: PtSpan[]
  markDefs?: PtMarkDef[]
}
export type PtImage = { _type: string; alt?: string; asset?: { url?: string } }
export type PtNode = PtBlock | PtImage | ({ _type: string } & Record<string, unknown>)

export type ResolveHref = (def: PtMarkDef) => string | null

const HEADING: Record<string, string> = { h1: '#', h2: '##', h3: '###', h4: '####', h5: '#####', h6: '######' }

function inline(block: PtBlock, resolveHref: ResolveHref): string {
  const defs = new Map((block.markDefs ?? []).map((d) => [d._key, d]))
  return (block.children ?? [])
    .map((span) => {
      let text = span.text ?? ''
      if (!text) return ''
      const marks = span.marks ?? []
      // Whitespace-only spans carry no emphasis; wrapping them breaks the rendering.
      if (!text.trim()) return text
      const lead = text.match(/^\s*/)?.[0] ?? ''
      const trail = text.match(/\s*$/)?.[0] ?? ''
      text = text.trim()
      if (marks.includes('code')) text = `\`${text}\``
      if (marks.includes('em')) text = `_${text}_`
      if (marks.includes('strong')) text = `**${text}**`
      for (const key of marks) {
        const def = defs.get(key)
        if (!def) continue
        const href = resolveHref(def)
        if (href) text = `[${text}](${href})`
      }
      return lead + text + trail
    })
    .join('')
}

/** Shift headings so a page body never competes with the document's own H1. */
export function portableTextToMarkdown(
  nodes: PtNode[] | null | undefined,
  options: { resolveHref?: ResolveHref; headingOffset?: number } = {}
): string {
  const resolveHref = options.resolveHref ?? (() => null)
  const offset = options.headingOffset ?? 0
  const out: string[] = []
  let counter = 0
  let prevList = false

  for (const node of nodes ?? []) {
    if (!node || typeof node !== 'object') continue
    if (node._type === 'block') {
      const block = node as PtBlock
      const text = inline(block, resolveHref)
      if (block.listItem) {
        if (!prevList) counter = 0
        const indent = '  '.repeat(Math.max(0, (block.level ?? 1) - 1))
        const marker = block.listItem === 'number' ? `${++counter}.` : '-'
        out.push(`${indent}${marker} ${text}`)
        prevList = true
        continue
      }
      prevList = false
      if (!text.trim()) continue
      const style = block.style ?? 'normal'
      if (HEADING[style]) {
        const level = Math.min(6, HEADING[style].length + offset)
        // A soft line break inside a heading is layout, not content.
        out.push('', `${'#'.repeat(level)} ${text.replace(/\s*\n\s*/g, ' ')}`, '')
      } else if (style === 'blockquote') {
        out.push('', `> ${text}`, '')
      } else {
        out.push('', text, '')
      }
      continue
    }
    prevList = false
    const image = node as PtImage
    if (image.asset?.url) {
      out.push('', `![${image.alt ?? ''}](${image.asset.url})`, '')
    }
  }
  return tidy(out.join('\n'))
}

/** Collapse runs of blank lines and trim. */
export function tidy(markdown: string): string {
  return markdown.replace(/\n{3,}/g, '\n\n').trim()
}
