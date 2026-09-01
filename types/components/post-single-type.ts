/** Post shape used by the post detail page (article body + meta). */
export type PostAuthor = {
  title?: string | null
  slug?: string | null
  primaryJobTitle?: string | null
  image?: unknown
}

import type { SectionBackgroundColor } from '@/lib/section-background'

/** Full closing section (a ctaBlock object), not just a button. */
export type PostCtaSection = {
  active?: boolean
  backgroundColor?: SectionBackgroundColor
  alignment?: string
  content?: unknown
  cta?: { active?: boolean; route?: unknown } | null
}

export type PostSingleData = {
  title?: string | null
  image?: unknown
  publishedAt?: string | null
  author?: PostAuthor | string | null
  category?: string | null
  excerpt?: string | null
  /** Long-form portable text. Posts are articles, not page-builder sections. */
  body?: unknown[]
  cta?: PostCtaSection | null
}

export type PostSingleProps = {
  post: PostSingleData | null
}

export function authorDisplayName(author?: PostAuthor | string | null): string | undefined {
  if (!author) return undefined
  if (typeof author === 'string') return author.trim() || undefined
  return author.title?.trim() || undefined
}

export function authorObject(author?: PostAuthor | string | null): PostAuthor | null {
  return author && typeof author === 'object' ? author : null
}
