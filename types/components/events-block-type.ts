import type { SectionPaddingValue } from '@/lib/section-padding'
import type { SanityImageSource } from '@/types/components/sanity-image-type'

export type EventCard = {
  _id: string
  title?: string
  slug?: string
  startDate?: string
  endDate?: string
  timeString?: string
  eventType?: string
  soldOut?: boolean
  location?: string
  price?: string
  image?: SanityImageSource | null
}

export type EventsBlockProps = {
  active?: boolean
  componentIndex?: number
  sectionPadding?: SectionPaddingValue | null
  anchor?: string
  backgroundColor?: string
  title?: string
  /** How many events to show before "Load more" (default 3). */
  count?: number
  hideWhenEmpty?: boolean
  /** Server-fetched list, so it is in the HTML for crawlers. */
  initialEvents?: EventCard[]
  /** upcoming = in progress or still to come; past = ended. */
  listMode?: 'upcoming' | 'past'
}
