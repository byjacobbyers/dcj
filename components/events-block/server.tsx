import { sanityFetch } from '@/sanity/lib/live'
import { eventsQuery } from '@/sanity/queries/documents/event-query'
import type { EventCard, EventsBlockProps } from '@/types/components/events-block-type'
import EventsBlock from './index'

/**
 * Fetches every event on the server so the list is in the HTML for crawlers.
 * The client splits upcoming from past by today's Denver date.
 */
export default async function EventsBlockServer(props: EventsBlockProps) {
  if (props.active === false) return null

  let initialEvents: EventCard[] = []
  try {
    const { data } = await sanityFetch({ query: eventsQuery })
    initialEvents = (data || []) as EventCard[]
  } catch {
    initialEvents = []
  }

  return <EventsBlock {...props} initialEvents={initialEvents} />
}
