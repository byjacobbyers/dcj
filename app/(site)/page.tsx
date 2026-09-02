import { sanityFetch } from "@/sanity/lib/live"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { pageQuery } from "@/sanity/queries/documents/page-query"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import Page from "@/components/page-single"
import {
  generateWebPageJsonLd,
  faqJsonLdFromSections,
  generateJamEventJsonLd,
  generateMetadata as generateSeoMetadata,
  type SeoType,
  type SiteType,
} from "@/lib/seo"
import type { PageQueryResult, SiteQueryResult } from "@/sanity.types"

export const generateMetadata = async (): Promise<Metadata> => {
  try {
    const [{ data: globalData }, { data: pageData }] = await Promise.all([
      sanityFetch({ query: SiteQuery }),
      sanityFetch({ query: pageQuery, params: { slug: 'home' } }),
    ])
    const global = globalData as SiteQueryResult
    const page = pageData as PageQueryResult
    return generateSeoMetadata(
      (page?.seo ?? undefined) as SeoType | undefined,
      (global?.seo ?? undefined) as SeoType | undefined,
      undefined,
      undefined,
      {
        url: '/',
        siteTitle: global?.title ?? undefined,
      }
    )
  } catch {
    return generateSeoMetadata()
  }
}

export default async function Home() {
  try {
    const [{ data }, { data: siteData }] = await Promise.all([
      sanityFetch({ query: pageQuery, params: { slug: "home" } }),
      sanityFetch({ query: SiteQuery }),
    ])
    const page = data as PageQueryResult
    const site = siteData as SiteQueryResult

    if (!page) return notFound()

    const schemas = []
    schemas.push(generateJamEventJsonLd(site as SiteType | null))
    const pageSeo = (page.seo ?? undefined) as SeoType | undefined
    schemas.push(generateWebPageJsonLd({
      title: page.title,
      description: pageSeo?.metaDesc,
      url: '/',
      seo: pageSeo,
      _updatedAt: page._updatedAt,
      jsonLd: page.jsonLd,
    }))

    const faqSchema = faqJsonLdFromSections(page.sections)
    if (faqSchema) schemas.push(faqSchema)

    return (
      <>
        {schemas.length > 0 && (
          <script id="home-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
        )}
        <Page page={page} key={page._id} />
      </>
    )
  } catch {
    return notFound()
  }
}
