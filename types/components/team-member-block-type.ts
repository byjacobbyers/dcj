import type { SectionPaddingValue } from '@/lib/section-padding'

export type TeamMemberSocials = {
  facebook?: string | null
  linkedin?: string | null
  github?: string | null
  x?: string | null
  instagram?: string | null
  youtube?: string | null
  tiktok?: string | null
}

export type TeamMemberData = {
  _id?: string
  title?: string | null
  slug?: string | null
  primaryJobTitle?: string | null
  secondaryJobTitle?: string | null
  email?: string | null
  phone?: string | null
  socials?: TeamMemberSocials | null
  image?: unknown
  content?: unknown[]
}

export type TeamMemberBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  sectionPadding?: SectionPaddingValue
  backgroundColor?: string
  member?: TeamMemberData | null
}
