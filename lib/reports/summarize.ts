/**
 * Pure report math over sign-in rows. Fetching lives in `queries.ts`.
 *
 * Attendance counts people, not rows: someone who signs in twice on one night
 * is one attendee. Pledged money sums every row, since each sign-in pledged.
 */

export type ReportMethod = 'cash' | 'card' | 'work_trade' | 'none'

export const REPORT_METHODS: ReadonlyArray<{ key: ReportMethod; label: string }> = [
  { key: 'cash', label: 'Cash' },
  { key: 'card', label: 'Card / Venmo' },
  { key: 'work_trade', label: 'Work Trade' },
  { key: 'none', label: 'Not recorded' },
]

export const PLEDGE_AMOUNTS = [20, 15, 10] as const
type PledgeAmount = (typeof PLEDGE_AMOUNTS)[number]

export type SigninRow = {
  personKey: string
  firstName: string
  lastName: string
  paymentMethod: string
  amount: number | null
  /** Denver date of this sign-in. */
  jamDate: string
  /** Denver date of this person's first ever sign-in. */
  firstDate: string
}

export type MethodTotals = Record<ReportMethod, { checkins: number; pledged: number }>

export type JamSummary = {
  date: string
  attendance: number
  firstTimers: string[]
  pledged: number
  byMethod: MethodTotals
}

export type PeriodTotals = {
  jams: number
  /** Attendance summed over jams. */
  checkins: number
  uniquePeople: number
  newPeople: number
  /** People who came to two or more jams. */
  regulars: number
  pledged: number
  /** Cash and card sign-ins that recorded an amount. */
  paidCheckins: number
  /** Cash and card sign-ins from before amounts were recorded. */
  paidWithoutAmount: number
  avgPledge: number | null
  avgAttendance: number | null
  avgPledgedPerJam: number | null
  byMethod: MethodTotals
  /** How many sign-ins chose each amount. */
  amounts: Record<PledgeAmount, number>
}

export function toMethod(value: string): ReportMethod {
  return value === 'cash' || value === 'card' || value === 'work_trade' ? value : 'none'
}

function emptyMethods(): MethodTotals {
  return {
    cash: { checkins: 0, pledged: 0 },
    card: { checkins: 0, pledged: 0 },
    work_trade: { checkins: 0, pledged: 0 },
    none: { checkins: 0, pledged: 0 },
  }
}

const fullName = (r: SigninRow) => [r.firstName, r.lastName].filter(Boolean).join(' ')

const average = (total: number, count: number) => (count > 0 ? total / count : null)

/** One summary per jam date, oldest first. */
export function summarizeJams(rows: SigninRow[]): JamSummary[] {
  const byDate = new Map<string, SigninRow[]>()
  for (const row of rows) {
    const list = byDate.get(row.jamDate) ?? []
    list.push(row)
    byDate.set(row.jamDate, list)
  }
  return [...byDate.keys()].sort().map((date) => {
    const dayRows = byDate.get(date)!
    const byMethod = emptyMethods()
    const firstTimers = new Map<string, string>()
    let pledged = 0
    for (const row of dayRows) {
      const m = byMethod[toMethod(row.paymentMethod)]
      m.checkins += 1
      m.pledged += row.amount ?? 0
      pledged += row.amount ?? 0
      if (row.firstDate === date) firstTimers.set(row.personKey, fullName(row))
    }
    return {
      date,
      attendance: new Set(dayRows.map((r) => r.personKey)).size,
      firstTimers: [...firstTimers.values()].sort((a, b) => a.localeCompare(b)),
      pledged,
      byMethod,
    }
  })
}

export function summarizePeriod(
  rows: SigninRow[],
  period: { start: string; end: string }
): PeriodTotals {
  const jams = summarizeJams(rows)
  const byMethod = emptyMethods()
  const amounts: Record<PledgeAmount, number> = { 20: 0, 15: 0, 10: 0 }
  const jamsPerPerson = new Map<string, Set<string>>()
  const newPeople = new Set<string>()
  let pledged = 0
  let paidCheckins = 0
  let paidWithoutAmount = 0

  for (const row of rows) {
    const method = toMethod(row.paymentMethod)
    byMethod[method].checkins += 1
    byMethod[method].pledged += row.amount ?? 0
    pledged += row.amount ?? 0
    if (method === 'cash' || method === 'card') {
      if (row.amount == null) paidWithoutAmount += 1
      else paidCheckins += 1
    }
    if (row.amount === 20 || row.amount === 15 || row.amount === 10) amounts[row.amount] += 1
    const seen = jamsPerPerson.get(row.personKey) ?? new Set<string>()
    seen.add(row.jamDate)
    jamsPerPerson.set(row.personKey, seen)
    if (row.firstDate >= period.start && row.firstDate < period.end) newPeople.add(row.personKey)
  }

  const checkins = jams.reduce((sum, j) => sum + j.attendance, 0)
  return {
    jams: jams.length,
    checkins,
    uniquePeople: jamsPerPerson.size,
    newPeople: newPeople.size,
    regulars: [...jamsPerPerson.values()].filter((s) => s.size >= 2).length,
    pledged,
    paidCheckins,
    paidWithoutAmount,
    avgPledge: average(pledged, paidCheckins),
    avgAttendance: average(checkins, jams.length),
    avgPledgedPerJam: average(pledged, jams.length),
    byMethod,
    amounts,
  }
}

/** Percent change, or null when there is nothing to compare against. */
export function percentChange(current: number, previous: number | null | undefined): number | null {
  if (previous == null || previous === 0) return null
  return ((current - previous) / previous) * 100
}
