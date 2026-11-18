import 'server-only'

import { Resend } from 'resend'

/** Wiggelruhm, the parent organization: gets every report. */
const WIGGELRUHM = 'hello@wiggelruhm.org'
const DENVER_CONTACT_JAM = 'denvercontactjam@gmail.com'

export const REPORT_RECIPIENTS = {
  weekly: [WIGGELRUHM],
  monthly: [WIGGELRUHM, DENVER_CONTACT_JAM],
} as const

function siteHost(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.denvercontactjam.com'
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
}

/** Same verified sender as the contact form. */
function fromAddress(): string {
  return (
    process.env.CONTACT_FORM_FROM_EMAIL?.trim() || `Denver Contact Jam <noreply@${siteHost()}>`
  )
}

export async function sendReport(options: {
  to: readonly string[]
  subject: string
  html: string
  text: string
  /** Inline images, referenced in the HTML as `cid:<contentId>`. */
  images?: Array<{ filename: string; content: Buffer; contentId: string }>
}): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')

  const { data, error } = await new Resend(apiKey).emails.send({
    from: fromAddress(),
    to: [...options.to],
    replyTo: DENVER_CONTACT_JAM,
    subject: options.subject,
    html: options.html,
    text: options.text,
    attachments: options.images?.map((image) => ({ ...image, contentType: 'image/png' })),
  })
  if (error) throw new Error(`Resend: ${error.message}`)
  return data?.id ?? ''
}
