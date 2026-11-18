import 'server-only'

import { isAuthorizedCronRequest } from './auth'
import type { BuiltReport } from './build'
import { isIsoDate, localDate } from './period'
import { sendReport } from './send'

/**
 * Shared GET handler for the report routes.
 *
 * - Requires `Authorization: Bearer $CRON_SECRET` (Vercel Cron sends it).
 * - `?date=YYYY-MM-DD` runs the report as if today were that Denver date, to
 *   re-send a missed one.
 * - `?preview=html` (or `png` for the monthly sheet) returns the report
 *   instead of emailing it.
 */
export async function handleReportRequest(
  request: Request,
  options: {
    name: string
    recipients: readonly string[]
    build: (today: string) => Promise<BuiltReport>
  }
): Promise<Response> {
  if (!isAuthorizedCronRequest(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const params = new URL(request.url).searchParams
  const dateParam = params.get('date')
  if (dateParam && !isIsoDate(dateParam)) {
    return Response.json({ error: 'date must be YYYY-MM-DD' }, { status: 400 })
  }
  const today = dateParam ?? localDate(new Date())

  try {
    const report = await options.build(today)
    const preview = params.get('preview')
    if (preview === 'html') {
      return new Response(report.html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }
    if (preview === 'png' && report.images[0]) {
      return new Response(new Uint8Array(report.images[0].content), {
        headers: { 'Content-Type': 'image/png' },
      })
    }

    const id = await sendReport({ to: options.recipients, ...report })
    console.log(`[Reports] Sent ${options.name} report for ${today}: ${id}`)
    return Response.json({ sent: true, id, subject: report.subject, to: options.recipients })
  } catch (error) {
    console.error(`[Reports] ${options.name} report failed:`, error)
    return Response.json({ error: 'Report failed' }, { status: 500 })
  }
}
