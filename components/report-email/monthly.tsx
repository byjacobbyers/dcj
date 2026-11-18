import { formatMoney, formatMonth, formatNumber } from '@/lib/reports/format'
import { REPORT_METHODS } from '@/lib/reports/summarize'
import type { MonthlyReportData } from './monthly-sheet'
import { DataTable, EmailShell, METHOD_COLORS, Note, PLEDGE_NOTE } from './shared'

export const SHEET_CONTENT_ID = 'monthly-report-sheet'

export function monthlySubject(data: MonthlyReportData): string {
  const month = formatMonth(data.monthStart)
  if (data.jams.length === 0) return `${month} jam report: no sign-ins`
  return `${month} jam report: ${formatMoney(data.totals.pledged)} pledged, ${data.totals.checkins} attendance`
}

/**
 * The email: the one-sheet image inline, with the same numbers as a table
 * underneath for anyone whose mail app blocks images.
 */
export function MonthlyReportEmail(data: MonthlyReportData) {
  const { totals } = data
  const month = formatMonth(data.monthStart)
  return (
    <EmailShell title={`${month} report`} subtitle="Monthly totals. Save the sheet below to print it.">
      {/* An email, not a page: next/image can't serve a cid: attachment. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`cid:${SHEET_CONTENT_ID}`}
        alt={`${month} report sheet`}
        width={552}
        style={{ display: 'block', width: '100%', height: 'auto', border: '1px solid #e1e0d9', borderRadius: 4, marginBottom: 24 }}
      />
      {data.jams.length > 0 ? (
        <>
          <DataTable
            head={['', month]}
            rows={[
              ['Pledged', formatMoney(totals.pledged)],
              ['Jams held', totals.jams],
              ['Total attendance', totals.checkins],
              ['Average per jam', formatNumber(totals.avgAttendance, 1)],
              ['Different people', totals.uniquePeople],
              ['New people', totals.newPeople],
              ['Came 2+ times', totals.regulars],
            ].map(([label, value]) => ({ key: String(label), cells: [label, value] }))}
          />
          <DataTable
            head={['Method', 'Sign-ins', 'Pledged']}
            rows={REPORT_METHODS.filter((m) => totals.byMethod[m.key].checkins > 0).map((m) => ({
              key: m.key,
              swatch: METHOD_COLORS[m.key],
              cells: [
                m.label,
                totals.byMethod[m.key].checkins,
                m.key === 'cash' || m.key === 'card' ? formatMoney(totals.byMethod[m.key].pledged) : '–',
              ],
            }))}
          />
        </>
      ) : null}
      <Note>{PLEDGE_NOTE}</Note>
    </EmailShell>
  )
}

export function monthlyText(data: MonthlyReportData): string {
  const { totals } = data
  const month = formatMonth(data.monthStart)
  if (data.jams.length === 0) return `${month} report\n\nNo one signed in this month.`
  return [
    `${month} report`,
    '',
    `Pledged: ${formatMoney(totals.pledged)}`,
    `Jams held: ${totals.jams}`,
    `Total attendance: ${totals.checkins} (average ${formatNumber(totals.avgAttendance, 1)} per jam)`,
    `Different people: ${totals.uniquePeople}`,
    `New people: ${totals.newPeople}`,
    `Came 2+ times: ${totals.regulars}`,
    '',
    ...REPORT_METHODS.filter((m) => totals.byMethod[m.key].checkins > 0).map(
      (m) => `${m.label}: ${totals.byMethod[m.key].checkins} sign-ins, ${formatMoney(totals.byMethod[m.key].pledged)}`
    ),
    '',
    PLEDGE_NOTE,
  ].join('\n')
}
