/**
 * Required: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 * Optional: NEXT_PUBLIC_SANITY_API_VERSION
 * Also used elsewhere (no secrets in repo): NEXT_PUBLIC_SITE_URL, SANITY_STUDIO_PREVIEW_ORIGIN,
 * SANITY_API_READ_TOKEN (live), NEXT_PUBLIC_SANITY_STUDIO_URL, SANITY_REVALIDATE_SECRET, RESEND_API_KEY,
 * NEXT_PUBLIC_GTM_ID, etc.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-08'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
