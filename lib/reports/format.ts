import { REPORT_TIME_ZONE } from './period'

export function formatMoney(dollars: number): string {
  return `$${Math.round(dollars).toLocaleString('en-US')}`
}

export function formatNumber(value: number | null, digits = 0): string {
  if (value == null) return '–'
  return value.toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

const fmt = (date: string, options: Intl.DateTimeFormatOptions) =>
  // Noon UTC is the same calendar day in Denver.
  new Intl.DateTimeFormat('en-US', { timeZone: REPORT_TIME_ZONE, ...options }).format(
    new Date(`${date}T12:00:00Z`)
  )

/** "Mon, Nov 16" */
export const formatJamDate = (date: string) =>
  fmt(date, { weekday: 'short', month: 'short', day: 'numeric' })
/** "Nov 16" */
export const formatShortDate = (date: string) => fmt(date, { month: 'short', day: 'numeric' })
/** "Nov 16, 2026" */
export const formatLongDate = (date: string) =>
  fmt(date, { month: 'short', day: 'numeric', year: 'numeric' })
/** "October 2026" */
export const formatMonth = (date: string) => fmt(date, { month: 'long', year: 'numeric' })

/** "+12%", "−5%", "no change", or "" when there is no comparison. */
export function formatChange(percent: number | null): string {
  if (percent == null || !Number.isFinite(percent)) return ''
  const rounded = Math.round(percent)
  if (rounded === 0) return 'no change'
  return `${rounded > 0 ? '+' : '−'}${Math.abs(rounded)}%`
}
