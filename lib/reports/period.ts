/**
 * Report periods, in Denver local dates (YYYY-MM-DD). Start is inclusive, end
 * exclusive. Working in local dates keeps a Monday-night jam on its Monday
 * whatever the UTC clock says, and handles daylight saving for free.
 */

export const REPORT_TIME_ZONE = 'America/Denver'

export type Period = { start: string; end: string }

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false
  const d = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

/** The Denver calendar date of an instant. */
export function localDate(instant: Date, timeZone = REPORT_TIME_ZONE): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant)
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function firstOfMonth(date: string, monthsBack = 0): string {
  const [y, m] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1 - monthsBack, 1)).toISOString().slice(0, 10)
}

/**
 * The 7 days before `today` (the report runs Tuesday morning, so Tuesday to
 * Monday), plus the 4 weeks before that for the comparison average.
 */
export function weeklyPeriods(today: string): { week: Period; prior: Period } {
  const start = addDays(today, -7)
  return {
    week: { start, end: today },
    prior: { start: addDays(start, -28), end: start },
  }
}

/** The calendar month before `today`'s month, and the month before that. */
export function monthlyPeriods(today: string): { month: Period; previous: Period } {
  const start = firstOfMonth(today, 1)
  return {
    month: { start, end: firstOfMonth(today) },
    previous: { start: firstOfMonth(today, 2), end: start },
  }
}
