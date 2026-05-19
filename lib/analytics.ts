/** Public analytics IDs (safe to expose in the client bundle). */

export const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || undefined

export const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || undefined

export function hasAnalytics(): boolean {
  return Boolean(gtmId || gaMeasurementId)
}
