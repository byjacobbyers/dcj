import { sanityFetch } from "@/sanity/lib/live"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { pageQuery } from "@/sanity/queries/documents/page-query"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import Page from "@/components/page-single"
import Script from "next/script"
import {
  generateWebPageJsonLd,
  generateFAQJsonLd,
  generateMetadata as generateSeoMetadata,
} from "@/lib/seo"

export const generateMetadata = async (): Promise<Metadata> => {
  try {
    const { data: global } = await sanityFetch({ query: SiteQuery })
    const globalSeo = global?.seo
    return generateSeoMetadata(undefined, globalSeo, undefined, undefined, { url: '/' })
  } catch {
    return generateSeoMetadata()
  }
}

export default async function Home() {
  try {
    const { data: page } = await sanityFetch({
      query: pageQuery,
      params: { slug: "home" },
    })

    if (!page) return notFound()

    const schemas = []
    const pageSeo = page?.seo || {}
    schemas.push(generateWebPageJsonLd({
      title: page.title,
      description: pageSeo.metaDesc,
      url: '/',
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
          <Script id="home-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
        )}
        <Page page={page} key={page._id} />
      </>
    )
  } catch {
    return notFound()
  }
}
