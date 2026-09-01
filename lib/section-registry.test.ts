import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * Lives in lib/ because vitest only looks there. Every block in the Studio
 * insert menu must be fully registered: rendered, shown in /design/sections,
 * linked from its nav, in the snapshot map, thumbnail captured, and either
 * serialized to Markdown or explicitly skipped. This is the checklist in
 * .claude/rules/new-section-checklist.md, enforced.
 */
const read = (p: string) => readFileSync(p, 'utf8')
const all = (re: RegExp, src: string) => [...src.matchAll(re)].map((m) => m[1])

// `type: 'xBlock'` entries (plus coverVideo, which doesn't follow the *Block
// naming) — everything except the array wrapper itself.
const schemaSrc = read('sanity/schemas/components/page-builder-schema.ts')
const insertMenu = [...new Set(all(/\{ type: '(\w+)' \}/g, schemaSrc))].sort()

const blockMapSrc = read('components/sections/index.tsx')
const blockMap = all(/^\s*(\w+):/gm, blockMapSrc)
const playgroundSrc = read('app/(site)/design/sections/playgrounds.tsx')
const playgroundTypes = all(/type="(\w+)"/g, playgroundSrc)
const playgroundIds = all(/<SectionChrome[^>]*?\bid="([a-z-]+)"/g, playgroundSrc)
const navIds = all(/href: '#([a-z-]+)'/g, read('app/(site)/design/sections/page.tsx'))
const snapshotSrc = read('scripts/capture-section-previews.mjs')
const snapshotIds = all(/\['([a-z-]+)', '\w+'\]/g, snapshotSrc)
const snapshotTypes = all(/\['[a-z-]+', '(\w+)'\]/g, snapshotSrc)
const previews = readdirSync('public/section-previews').map((f) => f.replace(/\.png$/, ''))
const registeredSchemas = read('sanity/schemas/index.ts')
const llmsSrc = read('lib/llms.ts')
const markdownHandled = all(/case '(\w+)':/g, llmsSrc)
const markdownSkipped = all(
  /'(\w+)'/g,
  llmsSrc.slice(llmsSrc.indexOf('MARKDOWN_SKIPPED_BLOCKS'), llmsSrc.indexOf('] as const'))
)

describe('section registry', () => {
  it('has at least the blocks this test was written against', () => {
    expect(insertMenu.length).toBeGreaterThanOrEqual(17)
  })

  it.each(insertMenu)('%s is fully registered', (type) => {
    expect(registeredSchemas, 'registered in sanity/schemas/index.ts').toContain(`${type},`)
    expect(blockMap, 'rendered by components/sections/index.tsx').toContain(type)
    expect(playgroundTypes, 'has a playground in /design/sections').toContain(type)
    expect(snapshotTypes, 'in scripts/capture-section-previews.mjs').toContain(type)
    expect(previews, 'has public/section-previews/<type>.png (pnpm sections:previews)').toContain(type)
    expect(
      [...markdownHandled, ...markdownSkipped],
      'serialized in lib/llms.ts sectionToMarkdown, or listed in MARKDOWN_SKIPPED_BLOCKS'
    ).toContain(type)
  })

  it.each(playgroundIds)('playground #%s is in the gallery nav and the snapshot map', (id) => {
    expect(navIds).toContain(id)
    expect(snapshotIds).toContain(id)
  })
})
