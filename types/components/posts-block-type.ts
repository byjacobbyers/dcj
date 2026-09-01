import type { SectionPaddingValue } from '@/lib/section-padding'

export type PostCard = {
  _id: string
  title?: string | null
  slug?: string | null
  publishedAt?: string | null
  author?: { title?: string | null } | string | null
  category?: string | null
  excerpt?: string | null
  image?: unknown
}

export type PostsBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  sectionPadding?: SectionPaddingValue
  backgroundColor?: string
  title?: string
  /** How many posts to show before Load more (default 6). */
  count?: number
  /** Server-fetched list (preferred for SEO). */
  initialPosts?: PostCard[]
}
