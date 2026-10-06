import { describe, expect, it } from 'vitest'
import {
  hasAgreedToCurrentVersion,
  isPaymentAmount,
  isPaymentMethod,
  normalizeEmail,
  parseVersionDate,
  paymentNeedsAmount,
} from '@/lib/signin'

describe('isPaymentMethod', () => {
  it('accepts the current options', () => {
    expect(isPaymentMethod('cash')).toBe(true)
    expect(isPaymentMethod('card')).toBe(true)
    expect(isPaymentMethod('work_trade')).toBe(true)
  })

  it('rejects the retired "none" option and junk', () => {
    expect(isPaymentMethod('none')).toBe(false)
    expect(isPaymentMethod('')).toBe(false)
    expect(isPaymentMethod(undefined)).toBe(false)
  })
})

describe('isPaymentAmount', () => {
  it('accepts only the three tiers', () => {
    expect(isPaymentAmount(10)).toBe(true)
    expect(isPaymentAmount(15)).toBe(true)
    expect(isPaymentAmount(20)).toBe(true)
    expect(isPaymentAmount(5)).toBe(false)
    expect(isPaymentAmount('10')).toBe(false)
  })
})

describe('paymentNeedsAmount', () => {
  it('asks for an amount for cash and card, not work trade', () => {
    expect(paymentNeedsAmount('cash')).toBe(true)
    expect(paymentNeedsAmount('card')).toBe(true)
    expect(paymentNeedsAmount('work_trade')).toBe(false)
    expect(paymentNeedsAmount('')).toBe(false)
  })
})

describe('normalizeEmail', () => {
  it('trims and lower-cases', () => {
    expect(normalizeEmail('  Jen@Example.COM ')).toBe('jen@example.com')
  })
})

describe('parseVersionDate', () => {
  it('keeps Sanity date strings', () => {
    expect(parseVersionDate('2026-10-06')).toBe('2026-10-06')
  })

  it('drops anything else', () => {
    expect(parseVersionDate('2026-10-06T00:00:00Z')).toBeNull()
    expect(parseVersionDate(null)).toBeNull()
    expect(parseVersionDate(undefined)).toBeNull()
  })
})

describe('hasAgreedToCurrentVersion', () => {
  it('is true when the agreement is on or after the current version', () => {
    expect(hasAgreedToCurrentVersion('2026-10-06', '2026-10-06')).toBe(true)
    expect(hasAgreedToCurrentVersion('2026-11-01', '2026-10-06')).toBe(true)
  })

  it('is false when the guidelines changed since', () => {
    expect(hasAgreedToCurrentVersion('2026-09-01', '2026-10-06')).toBe(false)
  })

  it('is false with no agreement or no current version', () => {
    expect(hasAgreedToCurrentVersion(null, '2026-10-06')).toBe(false)
    expect(hasAgreedToCurrentVersion('2026-10-06', null)).toBe(false)
  })
})
