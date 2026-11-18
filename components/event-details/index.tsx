import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatFullDate, parseSanityDate } from '@/lib/format-date'
import { cn } from '@/lib/utils'
import type { EventDetailsProps } from '@/types/components/event-single-type'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * The practical facts of an event: when, where, how much, how to register.
 * Labelled rows, because a first-timer scans for "can I make this" before
 * reading anything else.
 */
export default function EventDetails({
  startDate,
  endDate,
  timeString,
  location,
  price,
  registration,
  contact,
  soldOut,
  bookingUrl,
  bookingLabel,
  className,
}: EventDetailsProps) {
  const start = startDate ? formatFullDate(parseSanityDate(startDate)) : null
  const end = endDate && endDate !== startDate ? formatFullDate(parseSanityDate(endDate)) : null
  const contactValue: ReactNode =
    contact && EMAIL.test(contact.trim()) ? (
      <a href={`mailto:${contact.trim()}`} className="text-primary underline underline-offset-4">
        {contact.trim()}
      </a>
    ) : (
      contact
    )

  const rows = [
    start ? { label: 'When', value: end ? `${start} to ${end}` : start } : null,
    timeString ? { label: 'Time', value: timeString } : null,
    location ? { label: 'Where', value: location } : null,
    price ? { label: 'Price', value: price } : null,
    registration ? { label: 'How to register', value: registration } : null,
    contact ? { label: 'Questions', value: contactValue } : null,
  ].filter(Boolean) as Array<{ label: string; value: ReactNode }>

  const canBook = Boolean(bookingUrl) && !soldOut

  return (
    <Card className={cn('gap-0', className)}>
      {rows.length > 0 ? (
        <dl className="flex flex-col gap-5">
          {rows.map((row) => (
            <div key={row.label}>
              <dt className="text-small font-semibold tracking-wider text-muted-foreground uppercase">
                {row.label}
              </dt>
              <dd className="mt-1 text-body text-balance">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {soldOut ? (
        <div className="mt-6 border-t border-border pt-6">
          <p className="text-body font-semibold">This one is full.</p>
        </div>
      ) : canBook ? (
        <div className="mt-6 border-t border-border pt-6">
          <Button asChild className="w-full no-underline sm:w-auto">
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
              {bookingLabel?.trim() || 'Reserve your spot'}
            </a>
          </Button>
        </div>
      ) : null}
    </Card>
  )
}
