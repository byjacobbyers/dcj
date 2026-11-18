import { renderWeekly, weeklyReportData } from '@/lib/reports/build'
import { handleReportRequest } from '@/lib/reports/handler'
import { REPORT_RECIPIENTS } from '@/lib/reports/send'

// Vercel Cron, Tuesdays (see vercel.json): the past week's jam.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  return handleReportRequest(request, {
    name: 'weekly',
    recipients: REPORT_RECIPIENTS.weekly,
    build: async (today) => renderWeekly(await weeklyReportData(today)),
  })
}
