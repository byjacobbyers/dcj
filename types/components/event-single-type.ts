export type EventSingleData = {
  title?: string
  image?: unknown
  startDate?: string
  endDate?: string
  location?: string
  sections?: unknown[]
  timeString?: string
  soldOut?: boolean
}

export type EventSingleProps = {
  event: EventSingleData | null
}
