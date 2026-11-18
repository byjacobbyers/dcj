'use client'

import { useState } from 'react'
import Link from 'next/link'
import SanityImage from '@/components/sanity-image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  classifyEventTiming,
  filterAndSortPastEvents,
  filterAndSortUpcomingEvents,
} from '@/lib/event-timing'
import { formatShortDate, parseSanityDate } from '@/lib/format-date'
import {
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'
import { sectionPaddingToClass } from '@/lib/section-padding'
import { cn } from '@/lib/utils'
import type { EventCard, EventsBlockProps } from '@/types/components/events-block-type'

const DEFAULT_PAGE_SIZE = 3

function dateLine(event: EventCard): string | null {
  if (!event.startDate) return null
  const start = formatShortDate(parseSanityDate(event.startDate))
  const end =
    event.endDate && event.endDate !== event.startDate
      ? formatShortDate(parseSanityDate(event.endDate))
      : null
  return end ? `${start} to ${end}` : start
}

export default function EventsBlock({
  active = true,
  componentIndex = 0,
  sectionPadding,
  anchor,
  backgroundColor,
  title,
  count = DEFAULT_PAGE_SIZE,
  hideWhenEmpty = false,
  initialEvents,
  listMode = 'upcoming',
}: EventsBlockProps) {
  const pageSize = Math.max(1, count || DEFAULT_PAGE_SIZE)
  // Hooks first: an early return above a hook breaks the rules of hooks.
  const [visibleCount, setVisibleCount] = useState(pageSize)

  if (active === false) return null

  const listed = (initialEvents ?? []).filter((e) => e?.slug)
  const events =
    listMode === 'past' ? filterAndSortPastEvents(listed) : filterAndSortUpcomingEvents(listed)

  if (events.length === 0 && hideWhenEmpty) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const displayed = events.slice(0, visibleCount)
  const hasMore = visibleCount < events.length

  return (
    <section
      id={anchor || `events-block-${componentIndex}`}
      data-background-color={bg}
      {...sectionSurfaceAttrs(bg)}
      className={cn(
        'events-block flex w-full justify-center px-5',
        sectionSemanticSurfaceClasses(bg),
        sectionPaddingToClass(sectionPadding, 'default')
      )}
    >
      <div className="container flex w-full max-w-4xl flex-col items-stretch">
        {title ? <h2 className="mb-8 w-full text-center font-heading text-h2 md:mb-12">{title}</h2> : null}

        {events.length === 0 ? (
          <p className="text-center text-body text-muted-foreground">
            {listMode === 'past'
              ? 'No past events yet.'
              : 'Nothing extra on the calendar right now. The weekly jam is still on every Monday.'}
          </p>
        ) : (
          <ul className="flex w-full list-none flex-col gap-6 p-0">
            {displayed.map((event) => {
              const happening = listMode === 'upcoming' && classifyEventTiming(event) === 'happening'
              const meta = [dateLine(event), event.timeString].filter(Boolean).join(' · ')
              return (
                <li key={event._id} className="list-none">
                  <Link href={`/events/${event.slug}`} className="group block no-underline">
                    <Card className="flex w-full flex-col overflow-hidden rounded-md border border-border p-0 transition-colors group-hover:border-primary sm:flex-row">
                      {event.image ? (
                        // Inset and centred: a poster is never cropped, so it rarely
                        // matches the card's height.
                        <div className="w-full shrink-0 overflow-hidden border-b border-border sm:m-4 sm:mr-0 sm:w-60 sm:self-center sm:rounded-sm sm:border">
                          <SanityImage
                            image={event.image}
                            fill={false}
                            alt={`${event.title} poster`}
                            sizes="(max-width: 640px) 100vw, 256px"
                            className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </div>
                      ) : null}
                      <CardContent className="flex w-full flex-col justify-center gap-2 px-4 py-5 sm:px-6">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          {meta ? (
                            <p className="text-sm tracking-wide text-muted-foreground uppercase">{meta}</p>
                          ) : null}
                          {happening ? (
                            <span className="text-sm font-semibold tracking-wide text-primary uppercase">
                              Happening now
                            </span>
                          ) : null}
                          {event.soldOut ? (
                            <span className="text-sm font-semibold tracking-wide text-destructive uppercase">
                              Sold out
                            </span>
                          ) : null}
                        </div>
                        <h3 className="text-h4">{event.title}</h3>
                        {event.price ? <p className="text-base text-muted-foreground">{event.price}</p> : null}
                        <span className="mt-1 text-sm font-medium tracking-wider text-primary uppercase">
                          Details
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}

        {hasMore ? (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              variant={bg === 'secondary' ? 'secondary' : 'default'}
              onClick={() => setVisibleCount((n) => Math.min(n + pageSize, events.length))}
            >
              Load more
            </Button>
          </div>
        ) : null}

        <div className="mt-8 flex justify-center">
          <Link
            href={listMode === 'past' ? '/events' : '/past-events'}
            className="text-sm font-medium tracking-wider text-muted-foreground uppercase no-underline hover:text-foreground"
          >
            {listMode === 'past' ? '← Upcoming events' : 'View past events →'}
          </Link>
        </div>
      </div>
    </section>
  )
}
