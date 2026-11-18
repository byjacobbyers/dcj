import { monthlyReportData, renderMonthly } from '@/lib/reports/build'
import { handleReportRequest } from '@/lib/reports/handler'
import { REPORT_RECIPIENTS } from '@/lib/reports/send'

// Vercel Cron, the 1st of each month (see vercel.json): last month's totals.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  return handleReportRequest(request, {
    name: 'monthly',
    recipients: REPORT_RECIPIENTS.monthly,
    build: async (today) => renderMonthly(await monthlyReportData(today)),
  })
}
