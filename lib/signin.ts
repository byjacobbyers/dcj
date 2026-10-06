export type PaymentMethod = 'cash' | 'card' | 'work_trade'

export const PAYMENT_OPTIONS: ReadonlyArray<{ value: PaymentMethod; label: string }> = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card / Venmo' },
  { value: 'work_trade', label: 'Work Trade' },
]

export const PAYMENT_AMOUNTS = [10, 15, 20] as const
export type PaymentAmount = (typeof PAYMENT_AMOUNTS)[number]

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return PAYMENT_OPTIONS.some((option) => option.value === value)
}

export function isPaymentAmount(value: unknown): value is PaymentAmount {
  return PAYMENT_AMOUNTS.includes(value as PaymentAmount)
}

/** Work trade is the only method that does not take an amount. */
export function paymentNeedsAmount(method: PaymentMethod | ''): boolean {
  return method === 'cash' || method === 'card'
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** A Sanity `date` value (YYYY-MM-DD), or null for anything else. */
export function parseVersionDate(value: unknown): string | null {
  return typeof value === 'string' && ISO_DATE.test(value) ? value : null
}

/**
 * Whether someone's last agreement still covers the current guidelines.
 * Without a current version set in Sanity nobody is pre-checked, so everyone
 * ticks the box until a date is set.
 */
export function hasAgreedToCurrentVersion(
  agreedVersion: string | null,
  currentVersion: string | null
): boolean {
  if (!agreedVersion || !currentVersion) return false
  return agreedVersion >= currentVersion
}
