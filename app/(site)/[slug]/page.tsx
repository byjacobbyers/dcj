import { Metadata } from "next"
import { QueryParams, SanityDocument } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { pagesQuery, pageQuery } from "@/sanity/queries/documents/page-query"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import Page from "@/components/page-single"
import Script from "next/script"
import {
  generateWebPageJsonLd,
  generateFAQJsonLd,
  generateMetadata as generateSeoMetadata,
} from "@/lib/seo"

export async function generateStaticParams() {
  try {
    const { data: posts } = await sanityFetch({ query: pagesQuery })
    const excludedSlugs = ['quiz', 'resources']
    return (posts || [])
      .filter((p: SanityDocument) => {
        const slug = p?.slug
        return slug && typeof slug === 'string' && !excludedSlugs.includes(slug)
      })
      .map((p: SanityDocument) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

type Props = { params: Promise<QueryParams> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  try {
    const resolved = await params
    if (resolved?.slug?.toString().startsWith('__') || !resolved?.slug) return generateSeoMetadata()

    const [{ data: page }, { data: global }] = await Promise.all([
      sanityFetch({ query: pageQuery, params: { slug: resolved.slug } }),
      sanityFetch({ query: SiteQuery }),
    ])

    if (!page) return generateSeoMetadata()

    return generateSeoMetadata(page?.seo, global?.seo, page?.title, undefined, {
      url: `/${resolved.slug}`,
      titleSuffix: ' :: Denver Contact Jam',
    })
  } catch {
    return generateSeoMetadata()
  }
}

export default async function SinglePage({ params }: { params: Promise<QueryParams> }) {
  try {
    const resolved = await params
    if (resolved?.slug?.toString().startsWith('__') || !resolved?.slug) return notFound()

    const { data: page } = await sanityFetch({
      query: pageQuery,
      params: { slug: resolved.slug },
    })

    if (!page) return notFound()

    const schemas = []
    const pageSeo = page?.seo || {}
    schemas.push(generateWebPageJsonLd({
      title: page.title,
      description: pageSeo.metaDesc,
      url: `/${resolved.slug}`,
      seo: pageSeo,
      _updatedAt: page._updatedAt,
    }))

    const faqBlocks = page.sections?.filter((s: { _type?: string; active?: boolean }) => s._type === 'faqBlock' && s.active !== false) || []
    const allFaqs = faqBlocks.flatMap((b: { faqs?: Array<{ question: string; answer: unknown }> }) => b.faqs || [])
    const faqSchema = generateFAQJsonLd(allFaqs)
    if (faqSchema) schemas.push(faqSchema)

    return (
      <>
        {schemas.length > 0 && (
          <Script id="page-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
        )}
        <Page page={page} key={page._id} />
      </>
    )
  } catch {
    return notFound()
  }
}
