export type CtaBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: 'primary' | 'secondary'
  content?: unknown
  alignment?: string
  cta?: { active?: boolean; route?: unknown } | null
}
