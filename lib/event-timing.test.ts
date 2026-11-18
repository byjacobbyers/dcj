import { describe, expect, it } from 'vitest'
import {
  classifyEventTiming,
  filterAndSortPastEvents,
  filterAndSortUpcomingEvents,
  todayDateKey,
} from './event-timing'

const TODAY = '2026-11-18'

describe('todayDateKey', () => {
  it('uses the Denver date, not UTC', () => {
    // 7pm Wednesday in Denver is already Thursday in UTC.
    expect(todayDateKey(new Date('2026-11-19T02:00:00Z'))).toBe('2026-11-18')
  })
})

describe('classifyEventTiming', () => {
  it('classifies one-day events', () => {
    expect(classifyEventTiming({ startDate: '2026-12-09' }, TODAY)).toBe('upcoming')
    expect(classifyEventTiming({ startDate: TODAY }, TODAY)).toBe('happening')
    expect(classifyEventTiming({ startDate: '2026-11-17' }, TODAY)).toBe('past')
  })

  it('keeps a series current until its last date', () => {
    const series = { startDate: '2026-11-04', endDate: '2026-11-25' }
    expect(classifyEventTiming(series, TODAY)).toBe('happening')
    expect(classifyEventTiming(series, '2026-11-26')).toBe('past')
  })

  it('ignores events without a date', () => {
    expect(classifyEventTiming({}, TODAY)).toBeNull()
  })
})

describe('filtering and sorting', () => {
  const events = [
    { id: 'old', startDate: '2026-10-01' },
    { id: 'dec', startDate: '2026-12-09' },
    { id: 'series', startDate: '2026-11-04', endDate: '2026-11-25' },
    { id: 'jan', startDate: '2027-01-14' },
    { id: 'sept', startDate: '2026-09-12' },
    { id: 'undated' },
  ]

  it('lists upcoming events soonest first, including ones in progress', () => {
    expect(filterAndSortUpcomingEvents(events, TODAY).map((e) => e.id)).toEqual(['series', 'dec', 'jan'])
  })

  it('lists past events most recent first', () => {
    expect(filterAndSortPastEvents(events, TODAY).map((e) => e.id)).toEqual(['old', 'sept'])
  })
})
