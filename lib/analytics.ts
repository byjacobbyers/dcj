/** Public analytics IDs (safe to expose in the client bundle). */

/** Default GA4 property — used when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset at build time. */
export const DEFAULT_GA_MEASUREMENT_ID = 'G-5NRY07ZQGK'

export const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || undefined

export const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || DEFAULT_GA_MEASUREMENT_ID

export function hasAnalytics(): boolean {
  return Boolean(gtmId || gaMeasurementId)
}
