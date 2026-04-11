import { Metadata } from "next"
import { QueryParams, SanityDocument } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { eventsQuery, eventQuery } from "@/sanity/queries/documents/event-query"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import EventSingle from "@/components/event-single"
import Script from "next/script"
import {
  generateEventJsonLd,
  generateFAQJsonLd,
  generateMetadata as generateSeoMetadata,
} from "@/lib/seo"

export async function generateStaticParams() {
  try {
    const { data: events } = await sanityFetch({ query: eventsQuery })
    return (events || [])
      .filter((e: SanityDocument) => e?.slug?.current && typeof e.slug.current === 'string')
      .map((e: SanityDocument) => ({ slug: e.slug.current }))
  } catch {
    return []
  }
}

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  try {
    const resolved = await params
    const [{ data: event }, { data: global }] = await Promise.all([
      sanityFetch({ query: eventQuery, params: { slug: resolved.slug } }),
      sanityFetch({ query: SiteQuery }),
    ])

    if (!event) return generateSeoMetadata(undefined, undefined, undefined, 'Event at Denver Contact Jam.')

    return generateSeoMetadata(
      event?.seo,
      global?.seo,
      event?.title,
      'Join us for this event.',
      { url: `/events/${resolved.slug}`, titleSuffix: ' :: Denver Contact Jam' }
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

    const { data: event } = await sanityFetch({
      query: eventQuery,
      params: { slug },
    })

    if (!event) return notFound()

    const schemas = []
    const eventSlug = typeof event.slug === 'string' ? event.slug : event.slug?.current
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
      }))
    }

    const faqBlocks = event.sections?.filter((s: { _type?: string; active?: boolean }) => s._type === 'faqBlock' && s.active !== false) || []
    const allFaqs = faqBlocks.flatMap((b: { faqs?: Array<{ question: string; answer: unknown }> }) => b.faqs || [])
    const faqSchema = generateFAQJsonLd(allFaqs)
    if (faqSchema) schemas.push(faqSchema)

    return (
      <>
        {schemas.length > 0 && (
          <Script id="event-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
        )}
        <EventSingle event={event} key={event._id} />
      </>
    )
  } catch {
    return notFound()
  }
}
