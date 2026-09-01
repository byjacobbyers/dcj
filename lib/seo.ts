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

export type OgDocumentRef = { slug: string; type: 'page' | 'event' }

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

export function generateWebPageJsonLd(data: {
  title: string
  description?: string | null
  url: string
  seo?: SeoType | null
  _updatedAt?: string | null
}) {
  const pageUrl = data.url.startsWith('http') ? data.url : buildUrl(data.url)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.title,
    ...(data.description && { description: data.description }),
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
}) {
  const articleUrl = data.url.startsWith('http') ? data.url : buildUrl(data.url)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    ...(data.description && { description: data.description }),
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    ...(data.image?.asset?.url && { image: data.image.asset.url }),
    ...(data.datePublished && { datePublished: data.datePublished }),
    ...(data._updatedAt && { dateModified: new Date(data._updatedAt).toISOString() }),
    ...(data.author?.title && {
      author: {
        '@type': 'Person',
        name: data.author.title,
        ...(data.author.primaryJobTitle && { jobTitle: data.author.primaryJobTitle }),
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
}) {
  const eventUrl = data.url.startsWith('http') ? data.url : buildUrl(data.url)
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.title,
    ...(data.description && { description: data.description }),
    url: eventUrl,
    startDate: data.startDate,
    ...(data.endDate && { endDate: data.endDate }),
    ...(data.location && { location: { '@type': 'Place', name: data.location } }),
    ...(data.image?.asset?.url && {
      image: urlFor(data.image.asset as Parameters<typeof urlFor>[0]).width(1200).height(630).url(),
    }),
    ...(data._updatedAt && { dateModified: new Date(data._updatedAt).toISOString() }),
  }
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
  const org = site.organizationJsonLd
  const logoUrl = org?.logo?.asset?.url
    ? (urlFor(org.logo.asset as Parameters<typeof urlFor>[0]).width(600).height(60).url())
    : undefined
  const name = org?.name || site.title || 'Denver Contact Jam'
  const siteUrl = org?.url || baseUrl
  const email = site.email || org?.email

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
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

  if (Array.isArray(site.sameAs) && site.sameAs.length > 0) {
    ;(schema as Record<string, unknown>).sameAs = site.sameAs.filter(Boolean)
  }

  return schema
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
