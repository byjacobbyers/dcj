'use client'

import { useState } from 'react'
import Link from 'next/link'
import SanityImage from '@/components/sanity-image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatShortDate, parseSanityDate } from '@/lib/format-date'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cn } from '@/lib/utils'
import type { PostCard, PostsBlockProps } from '@/types/components/posts-block-type'
import type { SanityImageSource } from '@/types/components/sanity-image-type'

const DEFAULT_PAGE_SIZE = 6

export default function PostsBlock({
  active = true,
  componentIndex = 0,
  anchor,
  sectionPadding,
  backgroundColor,
  title,
  count = DEFAULT_PAGE_SIZE,
  initialPosts,
}: PostsBlockProps) {
  const allPosts: PostCard[] = (initialPosts ?? []).filter((p) => p?.slug)
  const pageSize = Math.max(1, count || DEFAULT_PAGE_SIZE)

  // Hooks first: an early return above a hook breaks the rules of hooks.
  const [visibleCount, setVisibleCount] = useState(pageSize)

  if (active === false) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const sectionClasses = cn(
    'posts-block w-full flex justify-center px-5',
    sectionSemanticSurfaceClasses(bg),
    sectionPaddingToClass(sectionPadding, 'default')
  )

  if (allPosts.length === 0) {
    return (
      <section
        id={anchor || `posts-block-${componentIndex}`}
        data-background-color={bg}
        {...sectionSurfaceAttrs(bg)}
        className={sectionClasses}
      >
        <p className="container text-center text-muted-foreground">No posts yet — check back soon.</p>
      </section>
    )
  }

  const displayedPosts = allPosts.slice(0, visibleCount)
  const hasMore = visibleCount < allPosts.length
  const buttonVariant = bg === 'secondary' ? 'secondary' : 'default'

  return (
    <section
      id={anchor || `posts-block-${componentIndex}`}
      data-background-color={bg}
      {...sectionSurfaceAttrs(bg)}
      className={sectionClasses}
    >
      <div className="container flex w-full max-w-3xl flex-col items-stretch">
        {title ? <h2 className="mb-8 w-full text-center text-h2 font-heading md:mb-12">{title}</h2> : null}

        <ul className="flex w-full list-none flex-col gap-6 p-0">
          {displayedPosts.map((post) => {
            const authorName =
              typeof post.author === 'string' ? post.author : post.author?.title
            const meta = [
              post.category,
              post.publishedAt ? formatShortDate(parseSanityDate(post.publishedAt)) : null,
              authorName,
            ]
              .filter(Boolean)
              .join(' · ')

            return (
              <li key={post._id} className="list-none">
                <Link href={`/posts/${post.slug}`} className="group block no-underline">
                  <Card className="flex w-full flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground transition-colors group-hover:border-primary">
                    {post.image ? (
                      <div className="relative w-full overflow-hidden border-b border-border">
                        <SanityImage
                          image={post.image as SanityImageSource}
                          fill={false}
                          sizes="(max-width: 768px) 100vw, 768px"
                          className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                    ) : null}
                    <CardContent className="flex w-full flex-col gap-2 px-4 py-5 sm:px-6">
                      {meta ? (
                        <p className="text-sm tracking-wide text-muted-foreground uppercase no-underline">
                          {meta}
                        </p>
                      ) : null}
                      <h3 className="text-h4 no-underline">{post.title}</h3>
                      {post.excerpt ? (
                        <p className="line-clamp-2 text-base text-muted-foreground no-underline">
                          {post.excerpt}
                        </p>
                      ) : null}
                      <span className="mt-1 text-sm font-medium tracking-wider text-primary uppercase no-underline">
                        Read more
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          })}
        </ul>

        {hasMore ? (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              variant={buttonVariant}
              onClick={() => setVisibleCount((n) => Math.min(n + pageSize, allPosts.length))}
            >
              Load more
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
