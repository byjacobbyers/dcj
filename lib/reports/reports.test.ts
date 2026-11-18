import { describe, expect, it } from 'vitest'
import { formatChange, formatJamDate, formatMoney, formatMonth } from './format'
import { isIsoDate, localDate, monthlyPeriods, weeklyPeriods } from './period'
import { percentChange, summarizeJams, summarizePeriod, type SigninRow } from './summarize'

const row = (overrides: Partial<SigninRow>): SigninRow => ({
  personKey: '1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  paymentMethod: 'cash',
  amount: 15,
  jamDate: '2026-11-16',
  firstDate: '2026-11-02',
  ...overrides,
})

describe('periods', () => {
  it('reads the Denver date, not the UTC one', () => {
    // 8:30pm Monday in Denver is already Tuesday in UTC.
    expect(localDate(new Date('2026-11-17T03:30:00Z'))).toBe('2026-11-16')
    // 9am Tuesday in Denver during daylight saving.
    expect(localDate(new Date('2026-06-02T15:00:00Z'))).toBe('2026-06-02')
  })

  it('covers the 7 days before a Tuesday run, plus 4 prior weeks', () => {
    expect(weeklyPeriods('2026-11-17')).toEqual({
      week: { start: '2026-11-10', end: '2026-11-17' },
      prior: { start: '2026-10-13', end: '2026-11-10' },
    })
  })

  it('covers the previous calendar month, across a year boundary', () => {
    expect(monthlyPeriods('2027-01-01')).toEqual({
      month: { start: '2026-12-01', end: '2027-01-01' },
      previous: { start: '2026-11-01', end: '2026-12-01' },
    })
    expect(monthlyPeriods('2026-03-15').month).toEqual({ start: '2026-02-01', end: '2026-03-01' })
  })

  it('validates ISO dates', () => {
    expect(isIsoDate('2026-11-01')).toBe(true)
    expect(isIsoDate('2026-02-30')).toBe(false)
    expect(isIsoDate('11/01/2026')).toBe(false)
  })
})

describe('summarizeJams', () => {
  it('counts each person once per night and lists first-timers', () => {
    const jams = summarizeJams([
      row({ personKey: '1' }),
      row({ personKey: '1', amount: 10 }), // signed in twice
      row({ personKey: '2', firstName: 'Bo', lastName: 'Diddley', firstDate: '2026-11-16' }),
      row({ personKey: '3', paymentMethod: 'work_trade', amount: null }),
      row({ personKey: '4', jamDate: '2026-11-09', paymentMethod: 'card', amount: 20 }),
    ])
    expect(jams.map((j) => j.date)).toEqual(['2026-11-09', '2026-11-16'])
    const monday = jams[1]
    expect(monday.attendance).toBe(3)
    expect(monday.firstTimers).toEqual(['Bo Diddley'])
    expect(monday.pledged).toBe(15 + 10 + 15)
    expect(monday.byMethod.cash).toEqual({ checkins: 3, pledged: 40 })
    expect(monday.byMethod.work_trade).toEqual({ checkins: 1, pledged: 0 })
    expect(monday.roster).toEqual([
      { name: 'Ada Lovelace', method: 'cash', amount: 15, firstTime: false },
      { name: 'Ada Lovelace', method: 'cash', amount: 10, firstTime: false },
      { name: 'Ada Lovelace', method: 'work_trade', amount: null, firstTime: false },
      { name: 'Bo Diddley', method: 'cash', amount: 15, firstTime: true },
    ])
  })
})

describe('summarizePeriod', () => {
  const period = { start: '2026-11-01', end: '2026-12-01' }

  it('totals a month', () => {
    const totals = summarizePeriod(
      [
        row({ personKey: '1', jamDate: '2026-11-02', amount: 20 }),
        row({ personKey: '1', jamDate: '2026-11-09', amount: 20 }),
        row({ personKey: '2', jamDate: '2026-11-09', paymentMethod: 'card', amount: 10, firstDate: '2026-11-09' }),
        row({ personKey: '3', jamDate: '2026-11-09', paymentMethod: 'work_trade', amount: null, firstDate: '2026-10-05' }),
        row({ personKey: '4', jamDate: '2026-11-02', paymentMethod: 'cash', amount: null }),
        row({ personKey: '5', jamDate: '2026-11-02', paymentMethod: 'none', amount: null }),
      ],
      period
    )
    expect(totals.jams).toBe(2)
    expect(totals.checkins).toBe(6)
    expect(totals.uniquePeople).toBe(5)
    // Person 1's first date (Nov 2) is in the month; person 3's is not.
    expect(totals.newPeople).toBe(4)
    expect(totals.regulars).toBe(1)
    expect(totals.pledged).toBe(50)
    expect(totals.paidCheckins).toBe(3)
    expect(totals.paidWithoutAmount).toBe(1)
    expect(totals.avgPledge).toBeCloseTo(50 / 3)
    expect(totals.avgAttendance).toBe(3)
    expect(totals.byMethod.none.checkins).toBe(1)
    expect(totals.amounts).toEqual({ 20: 2, 15: 0, 10: 1 })
  })

  it('has no averages for an empty period', () => {
    const totals = summarizePeriod([], period)
    expect(totals.jams).toBe(0)
    expect(totals.avgAttendance).toBeNull()
    expect(totals.avgPledge).toBeNull()
  })
})

describe('format', () => {
  it('formats money, months and dates', () => {
    expect(formatMoney(1234.4)).toBe('$1,234')
    expect(formatMonth('2026-10-01')).toBe('October 2026')
    expect(formatJamDate('2026-11-16')).toBe('Mon, Nov 16')
  })

  it('formats changes and skips missing comparisons', () => {
    expect(formatChange(percentChange(120, 100))).toBe('+20%')
    expect(formatChange(percentChange(95, 100))).toBe('−5%')
    expect(formatChange(percentChange(5, 0))).toBe('')
    expect(formatChange(percentChange(5, null))).toBe('')
  })
})
