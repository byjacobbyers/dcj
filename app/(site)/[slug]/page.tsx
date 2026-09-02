import { Metadata } from "next"
import { QueryParams } from "next-sanity"
import type { PageQueryResult, PagesQueryResult, SiteQueryResult } from "@/sanity.types"
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { pagesQuery, pageQuery } from "@/sanity/queries/documents/page-query"
import { EXCLUDED_PAGE_SLUGS } from "@/sanity/queries/documents/sitemap-queries"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import Page from "@/components/page-single"
import {
  generateWebPageJsonLd,
  faqJsonLdFromSections,
  generateMetadata as generateSeoMetadata,
  type SeoType,
} from "@/lib/seo"

export async function generateStaticParams() {
  try {
    const { data: posts } = await sanityFetch({ query: pagesQuery })
    return ((posts ?? []) as PagesQueryResult)
      .filter((p) => {
        const slug = p?.slug
        return !!slug && typeof slug === 'string' && !EXCLUDED_PAGE_SLUGS.includes(slug)
      })
      .map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

type Props = { params: Promise<QueryParams> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  try {
    const resolved = await params
    if (resolved?.slug?.toString().startsWith('__') || !resolved?.slug) return generateSeoMetadata()

    const [{ data: pageData }, { data: globalData }] = await Promise.all([
      sanityFetch({ query: pageQuery, params: { slug: resolved.slug } }),
      sanityFetch({ query: SiteQuery }),
    ])
    const page = pageData as PageQueryResult
    const global = globalData as SiteQueryResult

    if (!page) return generateSeoMetadata()

    const slug = String(resolved.slug)
    const isHome = slug === 'home'

    return generateSeoMetadata(
      (page?.seo ?? undefined) as SeoType | undefined,
      (global?.seo ?? undefined) as SeoType | undefined,
      isHome ? undefined : page?.title,
      undefined,
      {
        url: isHome ? '/' : `/${slug}`,
        titleSuffix: isHome ? undefined : ' | Denver Contact Jam',
        ogDocument: isHome ? undefined : { slug, type: 'page' },
        siteTitle: global?.title ?? undefined,
      }
    )
  } catch {
    return generateSeoMetadata()
  }
}

export default async function SinglePage({ params }: { params: Promise<QueryParams> }) {
  try {
    const resolved = await params
    if (resolved?.slug?.toString().startsWith('__') || !resolved?.slug) return notFound()

    const { data } = await sanityFetch({
      query: pageQuery,
      params: { slug: resolved.slug },
    })
    const page = data as PageQueryResult

    if (!page) return notFound()

    const schemas = []
    const pageSeo = (page.seo ?? undefined) as SeoType | undefined
    schemas.push(generateWebPageJsonLd({
      title: page.title,
      description: pageSeo?.metaDesc,
      url: `/${resolved.slug}`,
      seo: pageSeo,
      _updatedAt: page._updatedAt,
      jsonLd: page.jsonLd,
    }))

    const faqSchema = faqJsonLdFromSections(page.sections)
    if (faqSchema) schemas.push(faqSchema)

    return (
      <>
        {schemas.length > 0 && (
          <script id="page-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
        )}
        <Page page={page} key={page._id} />
      </>
    )
  } catch {
    return notFound()
  }
}
