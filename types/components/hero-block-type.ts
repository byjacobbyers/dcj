export type HeroBlockProps = {
  active?: boolean
  componentIndex?: number
  content?: unknown
  layout?: string
  anchor?: string
  image?: { asset?: { url?: string }; alt?: string; crop?: unknown; hotspot?: unknown } | null
  cta?: { active?: boolean; route?: unknown } | null
}
