import { formatChange, formatJamDate, formatLongDate, formatMoney, formatNumber } from '@/lib/reports/format'
import { addDays, type Period } from '@/lib/reports/period'
import {
  percentChange,
  REPORT_METHODS,
  type JamSummary,
  type PeriodTotals,
  type RosterEntry,
} from '@/lib/reports/summarize'
import { DataTable, EmailShell, INK, METHOD_COLORS, Note, PLEDGE_NOTE, SectionTitle, StatRow } from './shared'

export type WeeklyReportData = {
  period: Period
  jams: JamSummary[]
  totals: PeriodTotals
  /** Average attendance per jam over the 4 weeks before. */
  priorAvgAttendance: number | null
}

export function weeklySubject(data: WeeklyReportData): string {
  const { jams, totals } = data
  if (jams.length === 0) return `Weekly jam report: no sign-ins (week of ${formatLongDate(data.period.start)})`
  const when = jams.length === 1 ? formatJamDate(jams[0].date) : `week of ${formatLongDate(data.period.start)}`
  return `Weekly jam report: ${totals.checkins} people, ${formatMoney(totals.pledged)} pledged (${when})`
}

const methodLabel = (entry: RosterEntry) => REPORT_METHODS.find((m) => m.key === entry.method)!.label

function rosterAmount(entry: RosterEntry): string {
  if (entry.method === 'work_trade' || entry.method === 'none') return '–'
  return entry.amount == null ? 'not recorded' : formatMoney(entry.amount)
}

const weekRange = (p: Period) => `${formatLongDate(p.start)} – ${formatLongDate(addDays(p.end, -1))}`

function vsAverage(data: WeeklyReportData): string | undefined {
  const avg = data.priorAvgAttendance
  if (avg == null || data.totals.avgAttendance == null) return undefined
  const change = formatChange(percentChange(data.totals.avgAttendance, avg))
  return `4-week average ${formatNumber(avg, 1)}${change ? ` (${change})` : ''}`
}

export function WeeklyReportEmail(data: WeeklyReportData) {
  const { jams, totals } = data
  const subtitle = weekRange(data.period)

  if (jams.length === 0) {
    return (
      <EmailShell title="Weekly jam report" subtitle={subtitle}>
        <p style={{ fontSize: 15 }}>No one signed in this week.</p>
      </EmailShell>
    )
  }

  const methods = REPORT_METHODS.filter((m) => m.key !== 'none' || totals.byMethod.none.checkins > 0)

  return (
    <EmailShell
      title={jams.length === 1 ? `Jam on ${formatJamDate(jams[0].date)}` : 'Weekly jam report'}
      subtitle={subtitle}
    >
      <StatRow
        stats={[
          {
            label: jams.length === 1 ? 'Attendance' : `Attendance (${jams.length} jams)`,
            value: String(totals.checkins),
            note: vsAverage(data),
          },
          { label: 'First-timers', value: String(totals.newPeople) },
          { label: 'Pledged', value: formatMoney(totals.pledged) },
          {
            label: 'Average pledge',
            value: totals.avgPledge == null ? '–' : formatMoney(totals.avgPledge),
            note: 'per paid sign-in',
          },
        ]}
      />

      <SectionTitle>How people paid</SectionTitle>
      <DataTable
        head={['Method', 'Sign-ins', 'Pledged']}
        rows={methods.map((m) => ({
          key: m.key,
          swatch: METHOD_COLORS[m.key],
          cells: [m.label, totals.byMethod[m.key].checkins, m.key === 'cash' || m.key === 'card' ? formatMoney(totals.byMethod[m.key].pledged) : '–'],
        }))}
        foot={['Total', methods.reduce((n, m) => n + totals.byMethod[m.key].checkins, 0), formatMoney(totals.pledged)]}
      />

      {jams.length > 1 ? (
        <>
          <SectionTitle>By jam</SectionTitle>
          <DataTable
            head={['Jam', 'People', 'First-timers', 'Pledged']}
            rows={jams.map((j) => ({
              key: j.date,
              cells: [formatJamDate(j.date), j.attendance, j.firstTimers.length, formatMoney(j.pledged)],
            }))}
          />
        </>
      ) : null}

      {jams.map((jam) => (
        <div key={jam.date}>
          <SectionTitle>{jams.length === 1 ? 'Who signed in' : `Who signed in: ${formatJamDate(jam.date)}`}</SectionTitle>
          <DataTable
            head={['Name', 'Paid with', 'Amount']}
            rows={jam.roster.map((entry, i) => ({
              key: `${entry.name}-${i}`,
              swatch: METHOD_COLORS[entry.method],
              cells: [
                <>
                  {entry.name}
                  {entry.firstTime ? <span style={{ color: INK.muted, fontSize: 12 }}> · first time</span> : null}
                </>,
                methodLabel(entry),
                rosterAmount(entry),
              ],
            }))}
            foot={[`${jam.roster.length} sign-in${jam.roster.length === 1 ? '' : 's'}`, '', formatMoney(jam.pledged)]}
          />
        </div>
      ))}

      <Note>
        {PLEDGE_NOTE}
        {totals.paidWithoutAmount > 0
          ? ` ${totals.paidWithoutAmount} paid sign-in${totals.paidWithoutAmount === 1 ? '' : 's'} had no amount recorded.`
          : ''}
      </Note>
    </EmailShell>
  )
}

export function weeklyText(data: WeeklyReportData): string {
  const { jams, totals } = data
  const lines = [`Weekly jam report, ${weekRange(data.period)}`, '']
  if (jams.length === 0) return [...lines, 'No one signed in this week.'].join('\n')
  lines.push(
    `Attendance: ${totals.checkins}${vsAverage(data) ? ` (${vsAverage(data)})` : ''}`,
    `First-timers: ${totals.newPeople}`,
    `Pledged: ${formatMoney(totals.pledged)}`,
    `Average pledge: ${totals.avgPledge == null ? '–' : formatMoney(totals.avgPledge)}`,
    '',
    ...REPORT_METHODS.filter((m) => totals.byMethod[m.key].checkins > 0).map(
      (m) => `${m.label}: ${totals.byMethod[m.key].checkins} sign-ins, ${formatMoney(totals.byMethod[m.key].pledged)}`
    ),
    ...jams.flatMap((jam) => [
      '',
      `Who signed in, ${formatJamDate(jam.date)}:`,
      ...jam.roster.map(
        (e) => `- ${e.name}${e.firstTime ? ' (first time)' : ''}: ${methodLabel(e)}, ${rosterAmount(e)}`
      ),
    ]),
    '',
    PLEDGE_NOTE
  )
  return lines.join('\n')
}
