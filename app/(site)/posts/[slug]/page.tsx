import { Metadata } from "next"
import { QueryParams } from "next-sanity"
import type { PostQueryResult, PostsQueryResult } from "@/sanity.types"
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { postsQuery, postQuery } from "@/sanity/queries/documents/post-query"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import PostSingle from "@/components/post-single"
import {
  generateArticleJsonLd,
  generateMetadata as generateSeoMetadata,
  type SeoType,
} from "@/lib/seo"
import type { PostSingleData } from "@/types/components/post-single-type"

export async function generateStaticParams() {
  try {
    const { data } = await sanityFetch({ query: postsQuery })
    return ((data ?? []) as PostsQueryResult)
      .filter((p) => typeof p.slug === 'string' && p.slug)
      .map((p) => ({ slug: p.slug as string }))
  } catch {
    return []
  }
}

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  try {
    const resolved = await params
    const [{ data: postData }, { data: globalData }] = await Promise.all([
      sanityFetch({ query: postQuery, params: { slug: resolved.slug } }),
      sanityFetch({ query: SiteQuery }),
    ])
    const post = postData as PostQueryResult

    if (!post) return generateSeoMetadata()

    return generateSeoMetadata(
      (post.seo ?? undefined) as SeoType | undefined,
      ((globalData as { seo?: unknown } | null)?.seo ?? undefined) as SeoType | undefined,
      post.title,
      post.excerpt ?? undefined,
      {
        url: `/posts/${resolved.slug}`,
        titleSuffix: ' | Denver Contact Jam',
        ogDocument: { slug: resolved.slug, type: 'post' },
      }
    )
  } catch {
    return generateSeoMetadata()
  }
}

export default async function PostPage({ params }: { params: Promise<QueryParams> }) {
  try {
    const resolved = await params
    const slug = resolved?.slug
    if (!slug || typeof slug !== 'string') return notFound()

    const { data } = await sanityFetch({ query: postQuery, params: { slug } })
    const post = data as PostQueryResult

    if (!post) return notFound()

    const jsonLd = generateArticleJsonLd({
      title: post.title,
      description: post.excerpt ?? post.seo?.metaDesc,
      url: `/posts/${slug}`,
      image: post.image,
      datePublished: post.publishedAt,
      _updatedAt: post._updatedAt,
      author: post.author,
      jsonLd: post.jsonLd,
    })

    return (
      <>
        <script
          id="post-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PostSingle post={post as PostSingleData} key={post._id} />
      </>
    )
  } catch {
    return notFound()
  }
}
