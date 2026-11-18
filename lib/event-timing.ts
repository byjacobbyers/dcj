/**
 * Upcoming vs past, by Denver calendar date. Event dates are plain YYYY-MM-DD
 * strings from Sanity, so comparing them as strings is enough once "today" is
 * the Denver date too (a server in UTC would roll over at 5pm local).
 */

export const EVENT_TIME_ZONE = 'America/Denver'

export type EventTimingStatus = 'happening' | 'upcoming' | 'past'

export type EventTimingInput = {
  startDate?: string | null
  endDate?: string | null
}

/** Today's Denver date as YYYY-MM-DD. */
export function todayDateKey(now = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: EVENT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/** Last day of the event: the end date, or the start date for a one-day event. */
export function effectiveEndDate(event: EventTimingInput): string | null {
  return event.endDate?.trim() || event.startDate?.trim() || null
}

/**
 * - upcoming: starts after today
 * - happening: today is between the start and end dates (inclusive)
 * - past: ended before today
 */
export function classifyEventTiming(
  event: EventTimingInput,
  todayKey = todayDateKey()
): EventTimingStatus | null {
  const start = event.startDate?.trim()
  const end = effectiveEndDate(event)
  if (!start || !end) return null
  if (end < todayKey) return 'past'
  if (start > todayKey) return 'upcoming'
  return 'happening'
}

/** Happening and upcoming events, soonest first. */
export function filterAndSortUpcomingEvents<T extends EventTimingInput>(
  events: T[],
  todayKey = todayDateKey()
): T[] {
  return events
    .filter((e) => {
      const status = classifyEventTiming(e, todayKey)
      return status === 'happening' || status === 'upcoming'
    })
    .sort((a, b) => {
      const byStart = (a.startDate ?? '').localeCompare(b.startDate ?? '')
      return byStart || (effectiveEndDate(a) ?? '').localeCompare(effectiveEndDate(b) ?? '')
    })
}

/** Past events, most recent first. */
export function filterAndSortPastEvents<T extends EventTimingInput>(
  events: T[],
  todayKey = todayDateKey()
): T[] {
  return events
    .filter((e) => classifyEventTiming(e, todayKey) === 'past')
    .sort((a, b) => {
      const byEnd = (effectiveEndDate(b) ?? '').localeCompare(effectiveEndDate(a) ?? '')
      return byEnd || (b.startDate ?? '').localeCompare(a.startDate ?? '')
    })
}
