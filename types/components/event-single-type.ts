import type { SanityImageSource } from '@/types/components/sanity-image-type'

export type EventSingleData = {
  title?: string
  image?: SanityImageSource | null
  startDate?: string
  endDate?: string
  location?: string
  sections?: unknown[]
  timeString?: string
  eventType?: string
  soldOut?: boolean
  price?: string
  registration?: string
  bookingUrl?: string
  bookingLabel?: string
  contact?: string
}

export type EventSingleProps = {
  event: EventSingleData | null
}

export type EventDetailsProps = Pick<
  EventSingleData,
  | 'startDate'
  | 'endDate'
  | 'timeString'
  | 'location'
  | 'price'
  | 'registration'
  | 'contact'
  | 'soldOut'
  | 'bookingUrl'
  | 'bookingLabel'
> & { className?: string }
