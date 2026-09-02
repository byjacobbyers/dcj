import { Metadata } from "next"
import { QueryParams } from "next-sanity"
import type { EventQueryResult, EventsQueryResult, SiteQueryResult } from "@/sanity.types"
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { eventsQuery, eventQuery } from "@/sanity/queries/documents/event-query"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import EventSingle from "@/components/event-single"
import {
  generateEventJsonLd,
  faqJsonLdFromSections,
  generateMetadata as generateSeoMetadata,
  type SeoType,
} from "@/lib/seo"
import type { EventSingleData } from "@/types/components/event-single-type"

export async function generateStaticParams() {
  try {
    const { data: events } = await sanityFetch({ query: eventsQuery })
    return ((events ?? []) as EventsQueryResult)
      .filter((e) => typeof e?.slug === 'string' && e.slug)
      .map((e) => ({ slug: e.slug as string }))
  } catch {
    return []
  }
}

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  try {
    const resolved = await params
    const [{ data: eventData }, { data: globalData }] = await Promise.all([
      sanityFetch({ query: eventQuery, params: { slug: resolved.slug } }),
      sanityFetch({ query: SiteQuery }),
    ])
    const event = eventData as EventQueryResult
    const global = globalData as SiteQueryResult

    if (!event) return generateSeoMetadata(undefined, undefined, undefined, 'Event at Denver Contact Jam.')

    return generateSeoMetadata(
      (event?.seo ?? undefined) as SeoType | undefined,
      (global?.seo ?? undefined) as SeoType | undefined,
      event?.title,
      'Join us for this event.',
      {
        url: `/events/${resolved.slug}`,
        titleSuffix: ' | Denver Contact Jam',
        ogDocument: { slug: resolved.slug, type: 'event' },
      }
    )
  } catch {
    return generateSeoMetadata(undefined, undefined, undefined, 'Event at Denver Contact Jam.')
  }
}

export default async function EventPage({ params }: { params: Promise<QueryParams> }) {
  try {
    const resolved = await params
    const slug = resolved?.slug
    if (!slug || typeof slug !== 'string') return notFound()

    const { data } = await sanityFetch({
      query: eventQuery,
      params: { slug },
    })
    const event = data as EventQueryResult

    if (!event) return notFound()

    const schemas = []
    const eventSlug = event.slug?.current
    const eventUrl = `/events/${eventSlug || slug}`

    const parseSanityDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day)
    }

    if (event.startDate) {
      const startDate = parseSanityDate(event.startDate).toISOString()
      const endDate = event.endDate ? parseSanityDate(event.endDate).toISOString() : undefined
      schemas.push(generateEventJsonLd({
        title: event.title,
        description: event.seo?.metaDesc,
        url: eventUrl,
        startDate,
        endDate,
        location: event.location,
        image: event.image,
        _updatedAt: event._updatedAt,
        jsonLd: event.jsonLd,
      }))
    }

    const faqSchema = faqJsonLdFromSections(event.sections)
    if (faqSchema) schemas.push(faqSchema)

    return (
      <>
        {schemas.length > 0 && (
          <script id="event-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
        )}
        <EventSingle event={event as EventSingleData} key={event._id} />
      </>
    )
  } catch {
    return notFound()
  }
}
