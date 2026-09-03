import { Metadata } from 'next'
import { urlFor } from '@/sanity/lib/image'
import { getPublicSiteUrl } from '@/lib/site-url'

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

const baseUrl = normalizeBaseUrl(getPublicSiteUrl())

export function buildUrl(path?: string): string {
  if (!path) return baseUrl
  if (path.startsWith('http')) return path
  const slash = path.startsWith('/') ? '' : '/'
  return `${baseUrl}${slash}${path}`
}

const defaultTitle = 'Denver Contact Jam'
const defaultDescription = 'Denver Contact Jam'
const defaultOgImage = `${baseUrl}/opengraph-image.png`

export type SeoType = {
  metaTitle?: string
  metaDesc?: string
  noIndex?: boolean
  shareGraphic?: {
    asset?: { url?: string }
  }
}

export type OgDocumentRef = { slug: string; type: 'page' | 'event' | 'post' }

export function buildGeneratedOgImageUrl(ref: OgDocumentRef): string {
  const qs = new URLSearchParams({ slug: ref.slug, type: ref.type })
  return buildUrl(`/api/og?${qs.toString()}`)
}

function shareGraphicOgUrl(seo?: SeoType): string | undefined {
  if (!seo?.shareGraphic?.asset?.url) return undefined
  return urlFor(seo.shareGraphic.asset as Parameters<typeof urlFor>[0])
    .width(1200)
    .height(630)
    .url()
}

function resolveOgImageUrl(
  pageSeo?: SeoType,
  globalSeo?: SeoType,
  ogDocument?: OgDocumentRef
): string {
  const pageGraphic = shareGraphicOgUrl(pageSeo)
  if (pageGraphic) return pageGraphic
  if (ogDocument) return buildGeneratedOgImageUrl(ogDocument)
  const siteGraphic = shareGraphicOgUrl(globalSeo)
  if (siteGraphic) return siteGraphic
  return defaultOgImage
}

export function generateMetadata(
  pageSeo?: SeoType,
  globalSeo?: SeoType,
  fallbackTitle?: string,
  fallbackDescription?: string,
  options?: {
    url?: string
    titleSuffix?: string
    ogDocument?: OgDocumentRef
    siteTitle?: string
  }
): Metadata {
  const title =
    pageSeo?.metaTitle ||
    globalSeo?.metaTitle ||
    options?.siteTitle ||
    fallbackTitle ||
    defaultTitle
  const description = pageSeo?.metaDesc || globalSeo?.metaDesc || fallbackDescription || defaultDescription
  const noIndex = pageSeo?.noIndex ?? false
  const ogImage = resolveOgImageUrl(pageSeo, globalSeo, options?.ogDocument)
  const pageUrl = options?.url ? buildUrl(options.url) : baseUrl
  const finalTitle = options?.titleSuffix ? `${title}${options.titleSuffix}` : title

  return {
    metadataBase: new URL(baseUrl),
    title: finalTitle,
    description,
    robots: { index: !noIndex, follow: true },
    openGraph: {
      title: finalTitle,
      description,
      url: pageUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: finalTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description,
      images: [ogImage],
    },
  }
}

/** CMS-editable structured-data overrides (schemas in sanity/schemas/objects/*-json-ld-schema.ts). */
export type PageJsonLdOverrides = {
  pageType?: string | null
  name?: string | null
  description?: string | null
}

export type ArticleJsonLdOverrides = {
  headline?: string | null
  description?: string | null
  authorName?: string | null
  articleSection?: string | null
}

export type EventJsonLdOverrides = {
  description?: string | null
  eventStatus?: string | null
  eventAttendanceMode?: string | null
  organizerName?: string | null
  organizerUrl?: string | null
  offersUrl?: string | null
  offersPrice?: string | null
  offersPriceCurrency?: string | null
  offersAvailability?: string | null
}

const PAGE_JSON_LD_TYPES = new Set<string>([
  'WebPage',
  'AboutPage',
  'ContactPage',
  'CollectionPage',
  'FAQPage',
  'Service',
])

/** Normalize Schema.org enum values to full URLs when editors pick short codes. */
function schemaOrgEnum(value: string | null | undefined) {
  if (!value) return undefined
  if (value.startsWith('http')) return value
  return `https://schema.org/${value}`
}

export function generateWebPageJsonLd(data: {
  title: string
  description?: string | null
  url: string
  seo?: SeoType | null
  _updatedAt?: string | null
  jsonLd?: PageJsonLdOverrides | null
}) {
  const pageUrl = data.url.startsWith('http') ? data.url : buildUrl(data.url)
  const overrides = data.jsonLd
  const rawType = overrides?.pageType || 'WebPage'
  const pageType = PAGE_JSON_LD_TYPES.has(rawType) ? rawType : 'WebPage'
  const name = overrides?.name || data.title
  const description = overrides?.description || data.description
  return {
    '@context': 'https://schema.org',
    '@type': pageType,
    name,
    ...(description && { description }),
    url: pageUrl,
    ...(data._updatedAt && { dateModified: new Date(data._updatedAt).toISOString() }),
  }
}

export function generateArticleJsonLd(data: {
  title: string
  description?: string | null
  url: string
  image?: { asset?: { url?: string | null } | null } | null
  datePublished?: string | null
  _updatedAt?: string | null
  author?: { title?: string | null; primaryJobTitle?: string | null } | null
  jsonLd?: ArticleJsonLdOverrides | null
}) {
  const articleUrl = data.url.startsWith('http') ? data.url : buildUrl(data.url)
  const overrides = data.jsonLd
  const headline = overrides?.headline || data.title
  const description = overrides?.description || data.description
  const authorName = overrides?.authorName || data.author?.title
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    ...(description && { description }),
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    ...(overrides?.articleSection && { articleSection: overrides.articleSection }),
    ...(data.image?.asset?.url && { image: data.image.asset.url }),
    ...(data.datePublished && { datePublished: data.datePublished }),
    ...(data._updatedAt && { dateModified: new Date(data._updatedAt).toISOString() }),
    ...(authorName && {
      author: {
        '@type': 'Person',
        name: authorName,
        ...(data.author?.primaryJobTitle && { jobTitle: data.author.primaryJobTitle }),
      },
    }),
  }
}

export function generateEventJsonLd(data: {
  title: string
  description?: string | null
  url: string
  startDate: string
  endDate?: string | null
  location?: string | null
  image?: { asset?: { url?: string | null } | null } | null
  _updatedAt?: string | null
  jsonLd?: EventJsonLdOverrides | null
}) {
  const eventUrl = data.url.startsWith('http') ? data.url : buildUrl(data.url)
  const overrides = data.jsonLd
  const description = overrides?.description || data.description
  const eventStatus = schemaOrgEnum(overrides?.eventStatus)
  const eventAttendanceMode = schemaOrgEnum(overrides?.eventAttendanceMode)
  const offersAvailability = schemaOrgEnum(overrides?.offersAvailability)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.title,
    ...(description && { description }),
    url: eventUrl,
    startDate: data.startDate,
    ...(data.endDate && { endDate: data.endDate }),
    ...(data.location && { location: { '@type': 'Place', name: data.location } }),
    ...(eventStatus && { eventStatus }),
    ...(eventAttendanceMode && { eventAttendanceMode }),
    ...(data.image?.asset?.url && {
      image: urlFor(data.image.asset as Parameters<typeof urlFor>[0]).width(1200).height(630).url(),
    }),
    ...(data._updatedAt && { dateModified: new Date(data._updatedAt).toISOString() }),
  }

  if (overrides?.organizerName || overrides?.organizerUrl) {
    schema.organizer = {
      '@type': 'Organization',
      ...(overrides.organizerName && { name: overrides.organizerName }),
      ...(overrides.organizerUrl && { url: overrides.organizerUrl }),
    }
  }

  if (overrides?.offersUrl || overrides?.offersPrice || offersAvailability) {
    schema.offers = {
      '@type': 'Offer',
      ...(overrides?.offersUrl && { url: overrides.offersUrl }),
      ...(overrides?.offersPrice && { price: overrides.offersPrice }),
      ...(overrides?.offersPriceCurrency && { priceCurrency: overrides.offersPriceCurrency }),
      ...(offersAvailability && { availability: offersAvailability }),
    }
  }

  return schema
}

export function extractTextFromPortableText(content: unknown): string {
  if (typeof content === 'string') return content
  if (!content || !Array.isArray(content)) return ''
  return (content as Array<{ _type?: string; children?: Array<{ text?: string }> }>)
    .map((block) => {
      if (block._type === 'block' && block.children) {
        return block.children.map((c) => c.text || '').join(' ')
      }
      return ''
    })
    .join(' ')
    .trim()
}

export type SiteType = {
  title?: string
  email?: string
  address?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  addressCountry?: string
  latitude?: number
  longitude?: number
  sameAs?: string[]
  seo?: { metaDesc?: string }
  organizationJsonLd?: {
    name?: string
    legalName?: string
    description?: string
    logo?: { asset?: { url?: string } }
    url?: string
    email?: string
    telephone?: string
    priceRange?: string
  }
}

export function generateOrganizationJsonLd(site: SiteType | null) {
  if (!site) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Denver Contact Jam',
      url: baseUrl,
    }
  }
  // LocalBusiness alongside Organization: the jam has a Google Business Profile
  // with a fixed address/hours, and priceRange is only valid on LocalBusiness.
  // (DanceGroup would misdescribe it — that's for performing companies.)
  const org = site.organizationJsonLd
  const logoUrl = org?.logo?.asset?.url
    ? (urlFor(org.logo.asset as Parameters<typeof urlFor>[0]).width(600).height(60).url())
    : undefined
  const name = org?.name || site.title || 'Denver Contact Jam'
  const siteUrl = org?.url || baseUrl
  const email = site.email || org?.email

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name,
    ...(org?.legalName && { legalName: org.legalName }),
    ...(org?.description && { description: org.description }),
    ...(logoUrl && {
      logo: { '@type': 'ImageObject', url: logoUrl },
      image: logoUrl,
    }),
    url: siteUrl,
    ...(email && { email }),
    ...(org?.telephone && { telephone: org.telephone }),
    ...(org?.priceRange && { priceRange: org.priceRange }),
  }

  if (
    site.address ||
    site.addressLocality ||
    site.addressRegion ||
    site.postalCode ||
    site.addressCountry
  ) {
    ;(schema as Record<string, unknown>).address = {
      '@type': 'PostalAddress',
      ...(site.address && { streetAddress: site.address }),
      ...(site.addressLocality && { addressLocality: site.addressLocality }),
      ...(site.addressRegion && { addressRegion: site.addressRegion }),
      ...(site.postalCode && { postalCode: site.postalCode }),
      ...(site.addressCountry && { addressCountry: site.addressCountry }),
    }
  }

  if (typeof site.latitude === 'number' && typeof site.longitude === 'number') {
    ;(schema as Record<string, unknown>).geo = {
      '@type': 'GeoCoordinates',
      latitude: site.latitude,
      longitude: site.longitude,
    }
  }

  if (Array.isArray(site.sameAs) && site.sameAs.length > 0) {
    ;(schema as Record<string, unknown>).sameAs = site.sameAs.filter(Boolean)
  }

  return schema
}

/**
 * Weekly-jam facts that don't live in the CMS. The postal address and geo come
 * from the Sanity site document (single source with the Organization schema and
 * the footer), so only the recurrence itself is code.
 */
export const JAM_VENUE_NAME = 'Wiggelruhm'
/** Google Business Profile share link (entity /g/11yrxrgkhf). */
export const GBP_PROFILE_URL = 'https://share.google/9eQ78VOLIZARJFI9i'
const JAM_SCHEDULE = {
  '@type': 'Schedule',
  byDay: 'https://schema.org/Monday',
  startTime: '18:00',
  endTime: '20:00',
  scheduleTimezone: 'America/Denver',
  repeatFrequency: 'P1W',
}

function sitePostalAddress(site: SiteType | null) {
  if (!site?.address) return undefined
  return {
    '@type': 'PostalAddress',
    streetAddress: site.address,
    ...(site.addressLocality && { addressLocality: site.addressLocality }),
    ...(site.addressRegion && { addressRegion: site.addressRegion }),
    ...(site.postalCode && { postalCode: site.postalCode }),
    ...(site.addressCountry && { addressCountry: site.addressCountry }),
  }
}

/** Recurring-Event JSON-LD for the weekly jam (home page). */
export function generateJamEventJsonLd(site: SiteType | null) {
  const orgName = site?.organizationJsonLd?.name || site?.title || 'Denver Contact Jam'
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Denver Contact Jam (weekly contact improvisation jam)',
    description:
      'A community-led contact improvisation jam in Denver, Colorado. Every Monday, 6 to 8 PM. All experience levels welcome; pay what you can, $10 to $20, and no one is turned away.',
    url: baseUrl,
    // Google requires startDate even for schedule-based recurring events;
    // the jam has run weekly since April 1, 2025 (no planned end).
    startDate: '2025-04-01T18:00:00-06:00',
    eventSchedule: { ...JAM_SCHEDULE, startDate: '2025-04-01' },
    image: [buildUrl('/api/og?slug=home&type=page')],
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    isAccessibleForFree: false,
    location: {
      '@type': 'Place',
      name: JAM_VENUE_NAME,
      ...(sitePostalAddress(site) && { address: sitePostalAddress(site) }),
      ...(typeof site?.latitude === 'number' &&
        typeof site?.longitude === 'number' && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: site.latitude,
            longitude: site.longitude,
          },
        }),
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: 10,
      highPrice: 20,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: baseUrl,
      description: 'Pay what you can. No one is turned away.',
    },
    organizer: {
      '@type': 'Organization',
      name: orgName,
      url: baseUrl,
      ...(site?.email && { email: site.email }),
    },
  }
}

export function generateWebSiteJsonLd(site: SiteType | null) {
  const name = site?.organizationJsonLd?.name || site?.title || 'Denver Contact Jam'
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: baseUrl,
    publisher: { '@type': 'Organization', name },
  }
}

/** Loose section shape shared by page/event sections; generated query types are wider. */
export type SectionLike = {
  _type?: string | null
  active?: boolean | null
  faqs?: Array<{ question?: string | null; answer?: unknown }> | null
}

/** Collect FAQ JSON-LD from active faqBlock sections on a page/event. */
export function faqJsonLdFromSections(sections?: SectionLike[] | null) {
  const faqBlocks = sections?.filter((s) => s._type === 'faqBlock' && s.active !== false) || []
  const allFaqs = faqBlocks.flatMap((b) =>
    (b.faqs || [])
      .filter((f): f is { question: string; answer: unknown } => Boolean(f?.question))
      .map((f) => ({ question: f.question as string, answer: f.answer }))
  )
  return generateFAQJsonLd(allFaqs)
}

export function generateFAQJsonLd(faqs: Array<{ question: string; answer: unknown }>) {
  if (!faqs?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs
      .map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: extractTextFromPortableText(faq.answer),
        },
      }))
      .filter((item) => item.acceptedAnswer.text),
  }
}
