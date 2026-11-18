import Link from 'next/link'
import EventDetails from '@/components/event-details'
import SanityImage from '@/components/sanity-image'
import Sections from '@/components/sections'
import type { EventSingleProps } from '@/types/components/event-single-type'

const EVENT_TYPE_LABELS: Record<string, string> = {
  series: 'Series',
  workshop: 'Workshop',
  jam: 'Jam / Practice',
}

export default function EventSingle({ event }: EventSingleProps) {
  if (!event) {
    return (
      <article className="flex min-h-screen flex-col items-center gap-y-24 pb-12">
        <div className="container text-center">
          <p className="text-lg text-muted-foreground">Event not found</p>
        </div>
      </article>
    )
  }

  const { title, image, eventType, soldOut, sections = [], ...details } = event
  const typeLabel = eventType ? EVENT_TYPE_LABELS[eventType] : null

  return (
    <article className="flex w-full flex-col items-center pb-12">
      <header className="container flex flex-col items-center px-5 pt-12 pb-10 text-center md:pt-16">
        <Link
          href="/events"
          className="mb-6 text-small tracking-wider text-muted-foreground uppercase no-underline hover:text-foreground"
        >
          ← All events
        </Link>
        {typeLabel ? (
          <p className="mb-3 text-small font-semibold tracking-wider text-muted-foreground uppercase">
            {typeLabel}
          </p>
        ) : null}
        <h1 className="w-full font-heading text-h1 text-balance">{title || 'Untitled Event'}</h1>
        {soldOut ? (
          <p className="mt-4 rounded-full border border-border px-4 py-1 text-small font-semibold">Sold out</p>
        ) : null}
      </header>

      {/* Posters carry text, so the image is shown whole at its own shape,
          never cropped. With no poster the details card sits centred. */}
      <section
        className={
          image
            ? 'container grid w-full items-start gap-8 px-5 lg:grid-cols-[1.4fr_1fr] lg:gap-10'
            : 'container flex w-full max-w-2xl justify-center px-5'
        }
      >
        {image ? (
          <div className="overflow-hidden rounded-md border border-border">
            <SanityImage
              image={image}
              fill={false}
              alt={(image as { alt?: string }).alt || `${title} poster`}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>
        ) : null}
        <EventDetails soldOut={soldOut} {...details} className="w-full p-6 md:p-8" />
      </section>

      <Sections body={sections as Array<{ _type?: string }>} />
    </article>
  )
}
