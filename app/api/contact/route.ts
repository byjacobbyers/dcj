import { EmailTemplate } from '@/components/email-template'
import { render } from '@react-email/render'
import { Resend } from 'resend'
import * as React from 'react'

import { sanityFetch } from '@/sanity/lib/live'
import { SiteQuery } from '@/sanity/queries/documents/site-query'

const ADDITIONAL_CONTACT_RECIPIENTS = ['byers.jacob@gmail.com'] as const

function parseRecipientEnv(): string[] {
  const raw = process.env.CONTACT_FORM_RECIPIENT_EMAIL
  const fromEnv = raw?.trim()
    ? raw.split(',').map((e) => e.trim()).filter(Boolean)
    : []
  return [...new Set([...fromEnv, ...ADDITIONAL_CONTACT_RECIPIENTS])]
}

function siteUrlHost(): string {
  const u = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.denvercontactjam.com'
  return u.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'denvercontactjam.com'
}

type SiteForSend = {
  title?: string | null
  email?: string | null
  organizationJsonLd?: { email?: string | null } | null
} | null

function inboxFromSite(site: SiteForSend): string {
  const a = site?.email?.trim()
  const b = site?.organizationJsonLd?.email?.trim()
  return a || b || ''
}

async function postToGoogleSheet(body: {
  name: string
  email: string
  message: string
  isAnonymous: boolean
}): Promise<void> {
  const sheetUrl = process.env.GOOGLE_SHEET_URL?.trim()
  if (!sheetUrl) {
    console.warn('[API Contact] GOOGLE_SHEET_URL not set; skipping sheet append')
    return
  }
  try {
    await fetch(sheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (err) {
    console.error('[API Contact] Google Sheet append fetch failed:', err)
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('[API Contact] Missing RESEND_API_KEY')
      return Response.json(
        { error: 'Server configuration error', code: 'MISSING_RESEND_API_KEY' },
        { status: 500 }
      )
    }

    let body: Record<string, unknown>
    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const name = typeof body.name === 'string' ? body.name : ''
    const email = typeof body.email === 'string' ? body.email : ''
    const message = typeof body.message === 'string' ? body.message : ''
    const isAnonymous = Boolean(body.isAnonymous)
    const website = typeof body.website === 'string' ? body.website : ''

    if (website.trim().length > 0) {
      return Response.json({ success: true })
    }

    if (!message.trim()) {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!isAnonymous) {
      if (!name.trim()) {
        return Response.json(
          { error: 'Name is required when not sending anonymously' },
          { status: 400 }
        )
      }
      if (!email.trim()) {
        return Response.json(
          { error: 'Email is required when not sending anonymously' },
          { status: 400 }
        )
      }
      const emailRegex = /\S+@\S+\.\S+/
      if (!emailRegex.test(email)) {
        return Response.json(
          { error: 'Please enter a valid email address' },
          { status: 400 }
        )
      }
    }

    const { data: site } = await sanityFetch({ query: SiteQuery, params: {} })
    const sanityInbox = inboxFromSite(site as SiteForSend)

    let recipientEmail = parseRecipientEnv()
    const hasEnvRecipients = Boolean(process.env.CONTACT_FORM_RECIPIENT_EMAIL?.trim())
    if (!hasEnvRecipients && sanityInbox) {
      recipientEmail = [...new Set([sanityInbox, ...recipientEmail])]
    }

    if (recipientEmail.length === 0) {
      console.error('[API Contact] No recipient: set CONTACT_FORM_RECIPIENT_EMAIL or Site email in Sanity')
      return Response.json(
        { error: 'Server configuration error', code: 'MISSING_CONTACT_RECIPIENT' },
        { status: 500 }
      )
    }

    const siteTitle = (site as SiteForSend)?.title?.trim() || 'Denver Contact Jam'
    const fromEnv = process.env.CONTACT_FORM_FROM_EMAIL?.trim()
    const sanityFrom = inboxFromSite(site as SiteForSend)
    const fromEmail =
      fromEnv ||
      (sanityFrom ? `${siteTitle} <${sanityFrom}>` : `Denver Contact Jam <noreply@${siteUrlHost()}>`)

    const replyToDefault =
      process.env.CONTACT_FORM_REPLY_TO?.trim() ||
      sanityInbox ||
      `noreply@${siteUrlHost()}`
    const replyTo = isAnonymous ? replyToDefault : email

    const html = await render(
      React.createElement(EmailTemplate, {
        name: isAnonymous ? undefined : name,
        email: isAnonymous ? undefined : email,
        message: message.trim(),
        isAnonymous,
      })
    )

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo,
      subject: isAnonymous
        ? 'Denver Contact Jam - Anonymous Contact Form Submission'
        : `Denver Contact Jam - Contact Form Submission from ${name}`,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      const detail =
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
          ? (error as { message: string }).message
          : undefined
      return Response.json(
        {
          error: 'Failed to send email',
          code: 'RESEND_REJECTED',
          ...(detail ? { detail } : {}),
        },
        { status: 500 }
      )
    }

    await postToGoogleSheet({
      name,
      email,
      message: message.trim(),
      isAnonymous,
    })

    return Response.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: 'Internal server error', code: 'UNHANDLED' },
      { status: 500 }
    )
  }
}
