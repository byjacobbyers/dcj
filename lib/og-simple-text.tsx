import type { CSSProperties, ReactNode } from 'react'
import { cleanStega } from '@/lib/stega'

type PtChild = {
  _type?: string
  text?: string
  marks?: string[]
}

type PtMarkDef = {
  _type?: string
  _key?: string
}

type PtBlock = {
  _type?: string
  _key?: string
  style?: string
  children?: PtChild[]
  markDefs?: PtMarkDef[]
}

function isPortableTextBlocks(value: unknown): value is PtBlock[] {
  return Array.isArray(value) && value.some((b) => b && typeof b === 'object' && (b as PtBlock)._type === 'block')
}

/** OG type scale (Satori): 1.5× base sizes for 1200×630 cards */
function blockStyle(style: string | undefined, color: string): CSSProperties {
  const gap: CSSProperties = { marginBottom: 21 }
  switch (style) {
    case 'display':
      return { ...gap, fontSize: 81, fontWeight: 700, lineHeight: 1.06, color }
    case 'large':
      return { ...gap, fontSize: 63, fontWeight: 700, lineHeight: 1.1, color }
    case 'small':
      return { ...gap, fontSize: 36, fontWeight: 400, lineHeight: 1.32, color }
    case 'h1':
      return { ...gap, fontSize: 72, fontWeight: 700, lineHeight: 1.08, color }
    case 'h2':
      return { ...gap, fontSize: 60, fontWeight: 700, lineHeight: 1.1, color }
    case 'h3':
      return { ...gap, fontSize: 51, fontWeight: 700, lineHeight: 1.12, color }
    case 'h4':
      return { ...gap, fontSize: 42, fontWeight: 700, lineHeight: 1.16, color }
    case 'blockquote':
      return {
        ...gap,
        fontSize: 42,
        fontWeight: 400,
        fontStyle: 'italic',
        lineHeight: 1.24,
        color,
        opacity: 0.92,
        borderLeft: `6px solid rgba(255,255,255,0.45)`,
        paddingLeft: 24,
      }
    default:
      return { ...gap, fontSize: 48, fontWeight: 400, lineHeight: 1.26, color }
  }
}

function applyMarks(
  text: string,
  marks: string[] | undefined,
  markDefs: PtMarkDef[] | undefined,
  color: string
): ReactNode {
  const cleaned = cleanStega(text)
  if (!cleaned) return null
  let node: ReactNode = cleaned
  if (!marks?.length) return node

  for (const mark of marks) {
    if (mark === 'strong') {
      node = <span style={{ fontWeight: 700 }}>{node}</span>
    } else if (mark === 'em') {
      node = <span style={{ fontStyle: 'italic' }}>{node}</span>
    } else if (mark === 'highlight') {
      node = (
        <span
          style={{
            backgroundColor: 'rgba(255, 235, 150, 0.45)',
            padding: '3px 9px',
            borderRadius: 6,
          }}
        >
          {node}
        </span>
      )
    } else {
      const def = markDefs?.find((d) => d._key === mark)
      if (def?._type === 'linkWithRoute' || def?._type === 'link') {
        node = <span style={{ textDecoration: 'underline', color }}>{node}</span>
      }
    }
  }
  return node
}

function renderBlock(block: PtBlock, color: string, budget: { left: number }): ReactNode {
  if (block._type !== 'block' || !block.children?.length) return null

  const parts: ReactNode[] = []
  for (const child of block.children) {
    const raw = typeof child.text === 'string' ? child.text : ''
    if (budget.left <= 0) break
    let segment = raw
    if (segment.length > budget.left) {
      segment = `${segment.slice(0, budget.left - 1)}…`
      budget.left = 0
    } else {
      budget.left -= segment.length
    }
    const el = applyMarks(segment, child.marks, block.markDefs, color)
    if (el != null) parts.push(<span key={parts.length}>{el}</span>)
    if (budget.left <= 0) break
  }

  if (parts.length === 0) return null

  const rowStyle: CSSProperties = {
    ...blockStyle(block.style, color),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  }

  return (
    <div key={block._key ?? `b-${parts.length}`} style={rowStyle}>
      {parts}
    </div>
  )
}

/**
 * Renders Sanity `simpleText` (portable text blocks) as inline styles for Satori / `next/og`.
 * Respects block styles (normal, display, large, h1–h4, quote) and marks (strong, em, highlight, links).
 */
export function renderSimpleTextForOg(
  content: unknown,
  options: { color: string; maxChars?: number }
): ReactNode {
  const { color, maxChars = 150 } = options
  if (!isPortableTextBlocks(content)) return null

  const budget = { left: maxChars }
  const blocks: ReactNode[] = []
  for (const block of content as PtBlock[]) {
    if (budget.left <= 0) break
    const node = renderBlock(block, color, budget)
    if (node) blocks.push(node)
  }

  if (blocks.length === 0) return null
  return <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{blocks}</div>
}

export function hasPortableHeading(content: unknown): boolean {
  return isPortableTextBlocks(content) && (content as PtBlock[]).some((b) => b._type === 'block' && b.children?.some((c) => cleanStega(c.text || '').length > 0))
}
