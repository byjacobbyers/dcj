import { EmailTemplate } from '@/components/email-template'
import { Resend } from 'resend'
import * as React from 'react'

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('[API Send] Missing RESEND_API_KEY')
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await request.json()
    const { name, email, message, isAnonymous, website } = body

    if (website && website.trim().length > 0) {
      return Response.json({ success: true })
    }

    if (!message || message.trim().length === 0) {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!isAnonymous) {
      if (!name || name.trim().length === 0) {
        return Response.json(
          { error: 'Name is required when not sending anonymously' },
          { status: 400 }
        )
      }
      if (!email || email.trim().length === 0) {
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

    const recipientEmail =
      process.env.CONTACT_FORM_RECIPIENT_EMAIL?.split(',').map((e) => e.trim()) ??
      []
    const fromEmail =
      process.env.CONTACT_FORM_FROM_EMAIL ??
      'Denver Contact Jam <no-reply@example.com>'
    const replyToDefault =
      process.env.CONTACT_FORM_REPLY_TO ?? 'no-reply@example.com'
    const replyTo = isAnonymous ? replyToDefault : email

    if (recipientEmail.length === 0) {
      console.error('[API Send] CONTACT_FORM_RECIPIENT_EMAIL not set')
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo,
      subject: isAnonymous
        ? 'Denver Contact Jam - Anonymous Contact Form Submission'
        : `Denver Contact Jam - Contact Form Submission from ${name}`,
      react: EmailTemplate({
        name: isAnonymous ? undefined : name,
        email: isAnonymous ? undefined : email,
        message: message.trim(),
        isAnonymous,
      }) as React.ReactElement,
    })

    if (error) {
      console.error('Resend error:', error)
      return Response.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return Response.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
