/**
 * The monthly one-sheet, drawn by Satori (next/og) into a letter-size PNG.
 * Satori lays out flexbox only: every element with more than one child needs
 * `display: flex`.
 */
import { formatChange, formatMoney, formatMonth, formatNumber, formatShortDate, formatLongDate } from '@/lib/reports/format'
import { percentChange, PLEDGE_AMOUNTS, REPORT_METHODS, type JamSummary, type PeriodTotals } from '@/lib/reports/summarize'
import { INK, METHOD_COLORS, PLEDGE_NOTE } from './shared'

/** 8.5 × 11 in at 150 dpi. */
export const SHEET_SIZE = { width: 1275, height: 1650 }

/** Single-series charts (attendance, pledged, amounts): a hue no payment method uses. */
const SERIES = '#6250d6'

export type MonthlyReportData = {
  monthStart: string
  preparedOn: string
  jams: JamSummary[]
  totals: PeriodTotals
  /** The month before, or null when there were no sign-ins to compare with. */
  previous: PeriodTotals | null
  previousStart: string
}

function Stat({ label, value, change }: { label: string; value: string; change?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 365,
        padding: '18px 22px',
        background: '#ffffff',
        border: `1px solid ${INK.hairline}`,
        borderRadius: 10,
      }}
    >
      <div style={{ fontSize: 20, color: INK.secondary }}>{label}</div>
      <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.15 }}>{value}</div>
      <div style={{ fontSize: 18, color: INK.muted, height: 24 }}>{change ?? ''}</div>
    </div>
  )
}

function Section({ title, aside, children }: { title: string; aside?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 36 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>{title}</div>
        {aside ? <div style={{ fontSize: 20, color: INK.secondary }}>{aside}</div> : null}
      </div>
      {children}
    </div>
  )
}

/** Tall segmented bar: one whole (sign-ins) split by payment method. */
function PaymentSplit({ totals }: { totals: PeriodTotals }) {
  const parts = REPORT_METHODS.map((m) => ({ ...m, ...totals.byMethod[m.key] })).filter((p) => p.checkins > 0)
  const whole = parts.reduce((n, p) => n + p.checkins, 0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', width: '100%', height: 28 }}>
        {parts.map((p, i) => {
          const share = p.checkins / whole
          return (
            <div
              key={p.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: `${share * 100}%`,
                height: 28,
                marginLeft: i === 0 ? 0 : 2,
                paddingLeft: 8,
                background: METHOD_COLORS[p.key],
                borderRadius: 4,
                color: p.key === 'none' ? INK.primary : '#ffffff',
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              {share >= 0.07 ? `${Math.round(share * 100)}%` : ''}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', marginTop: 16, flexWrap: 'wrap' }}>
        {parts.map((p) => (
          <div key={p.key} style={{ display: 'flex', alignItems: 'center', marginRight: 40, fontSize: 21 }}>
            <div style={{ width: 16, height: 16, borderRadius: 3, background: METHOD_COLORS[p.key], marginRight: 10 }} />
            <div style={{ display: 'flex', color: INK.primary }}>
              {`${p.label}: ${p.checkins} sign-in${p.checkins === 1 ? '' : 's'}`}
              {p.key === 'cash' || p.key === 'card' ? `, ${formatMoney(p.pledged)}` : ''}
              {p.checkins / whole < 0.07 ? ` (${Math.round((p.checkins / whole) * 100)}%)` : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** One column per jam, value printed above each bar. */
function JamColumns({ jams, value, format }: { jams: JamSummary[]; value: (j: JamSummary) => number; format: (n: number) => string }) {
  const max = Math.max(1, ...jams.map(value))
  const plotHeight = 320
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 555 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: plotHeight + 30, borderBottom: '2px solid #c3c2b7' }}>
        {jams.map((j) => (
          <div key={j.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, margin: '0 6px' }}>
            <div style={{ fontSize: 20, color: INK.primary, marginBottom: 6 }}>{format(value(j))}</div>
            <div
              style={{
                width: '100%',
                maxWidth: 64,
                height: Math.max(2, (value(j) / max) * plotHeight),
                background: SERIES,
                borderRadius: '4px 4px 0 0',
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        {jams.map((j) => (
          <div key={j.date} style={{ display: 'flex', justifyContent: 'center', flex: 1, margin: '8px 6px 0', fontSize: 17, color: INK.secondary }}>
            {formatShortDate(j.date)}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Meter list: how often each pledge amount was chosen. */
function AmountMeters({ totals }: { totals: PeriodTotals }) {
  const total = PLEDGE_AMOUNTS.reduce((n, a) => n + totals.amounts[a], 0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {PLEDGE_AMOUNTS.map((amount) => {
        const count = totals.amounts[amount]
        const share = total ? count / total : 0
        return (
          <div key={amount} style={{ display: 'flex', alignItems: 'center', marginBottom: 12, fontSize: 21 }}>
            <div style={{ width: 70 }}>{`$${amount}`}</div>
            <div style={{ display: 'flex', flex: 1, height: 16, background: '#e6e3fb', borderRadius: 8 }}>
              <div style={{ width: `${share * 100}%`, height: 16, background: SERIES, borderRadius: 8 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: 250, color: INK.secondary }}>
              {`${count} sign-in${count === 1 ? '' : 's'} · ${Math.round(share * 100)}%`}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function MonthlySheet(data: MonthlyReportData) {
  const { totals, previous, jams } = data
  const prevLabel = formatMonth(data.previousStart).split(' ')[0].slice(0, 3)
  const vs = (current: number, prev: number | null | undefined) => {
    const change = formatChange(percentChange(current, prev))
    return change ? `${change} vs ${prevLabel}` : undefined
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '64px 72px',
        background: INK.surface,
        color: INK.primary,
        fontFamily: 'Roboto',
      }}
    >
      <div style={{ fontSize: 20, letterSpacing: 2, color: INK.muted }}>DENVER CONTACT JAM</div>
      <div style={{ fontSize: 56, fontWeight: 700, marginTop: 6 }}>{`${formatMonth(data.monthStart)} report`}</div>
      <div style={{ fontSize: 22, color: INK.secondary, marginTop: 6 }}>
        {`Monthly totals · prepared ${formatLongDate(data.preparedOn)}`}
      </div>

      {jams.length === 0 ? (
        <div style={{ fontSize: 30, marginTop: 80 }}>No one signed in this month.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 36, rowGap: 18 }}>
            <Stat label="Pledged" value={formatMoney(totals.pledged)} change={vs(totals.pledged, previous?.pledged)} />
            <Stat label="Jams held" value={String(totals.jams)} change={vs(totals.jams, previous?.jams)} />
            <Stat label="Total attendance" value={String(totals.checkins)} change={vs(totals.checkins, previous?.checkins)} />
            <Stat label="Different people" value={String(totals.uniquePeople)} change={vs(totals.uniquePeople, previous?.uniquePeople)} />
            <Stat label="New people" value={String(totals.newPeople)} change={vs(totals.newPeople, previous?.newPeople)} />
            <Stat label="Came 2+ times" value={String(totals.regulars)} change={vs(totals.regulars, previous?.regulars)} />
          </div>

          <Section title="How people paid" aside={`${totals.checkins} sign-ins`}>
            <PaymentSplit totals={totals} />
          </Section>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Section title="Attendance by jam" aside={`avg ${formatNumber(totals.avgAttendance, 1)}`}>
              <JamColumns jams={jams} value={(j) => j.attendance} format={String} />
            </Section>
            <Section title="Pledged by jam" aside={`avg ${totals.avgPledgedPerJam == null ? '–' : formatMoney(totals.avgPledgedPerJam)}`}>
              <JamColumns jams={jams} value={(j) => j.pledged} format={formatMoney} />
            </Section>
          </div>

          <Section
            title="Pledge amounts chosen"
            aside={`average ${totals.avgPledge == null ? '–' : formatMoney(totals.avgPledge)} per paid sign-in`}
          >
            <AmountMeters totals={totals} />
          </Section>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', fontSize: 17, color: INK.muted, lineHeight: 1.5 }}>
        <div>{PLEDGE_NOTE}</div>
        {totals.paidWithoutAmount > 0 ? (
          <div>{`${totals.paidWithoutAmount} paid sign-in${totals.paidWithoutAmount === 1 ? '' : 's'} had no amount recorded (before amounts were tracked).`}</div>
        ) : null}
      </div>
    </div>
  )
}
