import AppearAnimation from '@/components/appear-animation'
import SanityImage from '@/components/sanity-image'
import SimpleText from '@/components/simple-text'
import CtaBlock from '@/components/cta-block'
import { isActiveCta } from '@/lib/cta'
import { formatFullDate, parseSanityDate } from '@/lib/format-date'
import {
  authorDisplayName,
  authorObject,
  type PostCtaSection,
  type PostSingleProps,
} from '@/types/components/post-single-type'
import type { SanityImageSource } from '@/types/components/sanity-image-type'

/** Shared section shell, same rhythm and container as the page-builder blocks. */
const SECTION = 'w-full flex justify-center px-5 py-16 md:py-24'

/**
 * Article layout. An <article> parent holding standard section shells, so posts
 * follow the same structure as page sections. Typography comes from `.content`;
 * the only article-specific rule is the reading measure on the body column.
 */
export default function PostSingle({ post }: PostSingleProps) {
  if (!post) {
    return (
      <article className={SECTION}>
        <div className="container text-center">
          <p className="text-lg text-muted-foreground">Post not found.</p>
        </div>
      </article>
    )
  }

  const { title, publishedAt, author, category, excerpt, image, body, cta } = post
  const authorName = authorDisplayName(author)
  const person = authorObject(author)
  const dateLine = publishedAt ? formatFullDate(parseSanityDate(publishedAt)) : null
  const credit = [person?.primaryJobTitle, dateLine].filter(Boolean).join(' · ')

  // A closing section counts if it is active and actually has a button.
  const usable = (s?: PostCtaSection | null) =>
    s && s.active !== false && isActiveCta(s.cta) ? s : null
  const closingCta = usable(cta)

  return (
    <article className="post-article w-full bg-background text-foreground">
      <section className={`post-header-block ${SECTION} pb-24 md:pb-32`}>
        <div className="container flex flex-col items-center text-center">
          <div className="content items-center">
            {category ? <small className="post-eyebrow">{category}</small> : null}
            <h1 className="text-balance">{title || 'Untitled Post'}</h1>
            {excerpt ? <p className="text-balance">{excerpt}</p> : null}
          </div>

          {authorName || dateLine ? (
            <div className="post-byline mt-8">
              {person?.image ? (
                <span className="post-avatar">
                  <SanityImage
                    image={person.image as SanityImageSource}
                    fill
                    sizes="48px"
                    className="object-cover object-center"
                  />
                </span>
              ) : null}
              <span className="flex flex-col items-start text-left">
                {authorName ? <strong>{authorName}</strong> : null}
                {credit ? (
                  <span className="text-sm text-muted-foreground">{credit}</span>
                ) : null}
              </span>
            </div>
          ) : null}
        </div>
      </section>

      {image ? (
        <section className="post-banner-block w-full flex justify-center px-5 pb-10 md:pb-14">
          <AppearAnimation className="container">
            {/* Lifts into the masthead above, so the article opens on a card */}
            <figure className="post-banner">
              <SanityImage
                image={image as SanityImageSource}
                fill={false}
                priority
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="h-auto w-full"
              />
            </figure>
          </AppearAnimation>
        </section>
      ) : null}

      <section className={`post-body-block ${SECTION} pt-4 md:pt-6`}>
        <div className="container post-body">
          <div className="content content-measure">
            <SimpleText content={body} />
          </div>
        </div>
      </section>

      {closingCta ? <CtaBlock {...closingCta} /> : null}
    </article>
  )
}
