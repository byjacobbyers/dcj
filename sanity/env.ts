/**
 * Required: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 * Optional: NEXT_PUBLIC_SANITY_API_VERSION
 * Also used elsewhere (no secrets in repo): NEXT_PUBLIC_SITE_URL, SANITY_STUDIO_PREVIEW_ORIGIN,
 * SANITY_API_READ_TOKEN (live), NEXT_PUBLIC_SANITY_STUDIO_URL, SANITY_REVALIDATE_SECRET, RESEND_API_KEY,
 * NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_GA_MEASUREMENT_ID (GA4, e.g. G-XXXXXXXX), etc.
 *
 * Contact form (app/api/contact): RESEND_API_KEY, CONTACT_FORM_RECIPIENT_EMAIL (comma-separated),
 * CONTACT_FORM_FROM_EMAIL, CONTACT_FORM_REPLY_TO, optional GOOGLE_SHEET_URL (Apps Script web app URL).
 *
 * Google Sheets / Apps Script (deploy as web app, execute as you, access “Anyone”):
 * - doPost reads JSON: name, email, message, isAnonymous.
 * - Appends one row: Name, Email, Message, Date — use "Anonymous" for Name and Email when isAnonymous is true;
 *   Date should be set in the script (e.g. new Date()).
 * - GOOGLE_SHEET_URL is the published web app URL; treat as a secret (Vercel env, not NEXT_PUBLIC_*).
 * - Next.js POSTs with mode: 'no-cors' (opaque response; sheet errors are not surfaced to the client).
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
