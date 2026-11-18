import type { CSSProperties, ReactNode } from 'react'

/** Light, print-friendly ink for emails (email clients ignore the site's dark theme). */
export const INK = {
  surface: '#fcfcfb',
  page: '#f9f9f7',
  primary: '#0b0b0b',
  secondary: '#52514e',
  muted: '#898781',
  hairline: '#e1e0d9',
}

/** Payment colors: categorical slots 1–3, validated for color-vision deficiency. */
export const METHOD_COLORS = {
  cash: '#2a78d6',
  card: '#eb6834',
  work_trade: '#1baf7a',
  none: '#c3c2b7',
} as const

export const PLEDGE_NOTE =
  'Amounts are what people chose at sign-in, not counted cash or Venmo receipts. Work Trade has no amount.'

const font = 'Helvetica, Arial, sans-serif'

export function EmailShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <html lang="en">
      {/* An email document, not a Next.js page: the charset keeps dashes intact. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
      </head>
      <body style={{ margin: 0, background: INK.page, padding: '24px 12px', fontFamily: font, color: INK.primary }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: INK.surface, padding: 24, borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: INK.muted }}>
            Denver Contact Jam
          </p>
          <h1 style={{ margin: '4px 0 0', fontSize: 24, lineHeight: 1.25 }}>{title}</h1>
          <p style={{ margin: '4px 0 20px', fontSize: 14, color: INK.secondary }}>{subtitle}</p>
          {children}
        </div>
      </body>
    </html>
  )
}

/** A row of headline numbers. A table, because email clients don't do flexbox. */
export function StatRow({ stats }: { stats: Array<{ label: string; value: string; note?: string }> }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 20 }}>
      <tbody>
        <tr>
          {stats.map((s) => (
            <td key={s.label} style={{ verticalAlign: 'top', padding: '0 8px 0 0', width: `${100 / stats.length}%` }}>
              <div style={{ fontSize: 12, color: INK.secondary }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>{s.value}</div>
              {s.note ? <div style={{ fontSize: 12, color: INK.muted }}>{s.note}</div> : null}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

const cell: CSSProperties = { padding: '6px 8px', borderBottom: `1px solid ${INK.hairline}`, fontSize: 14 }
const num: CSSProperties = { ...cell, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }

export function DataTable({
  head,
  rows,
  foot,
}: {
  head: string[]
  rows: Array<{ key: string; cells: ReactNode[]; swatch?: string }>
  foot?: ReactNode[]
}) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse', marginBottom: 20 }}>
      <thead>
        <tr>
          {head.map((h, i) => (
            <th
              key={h}
              style={{ ...(i === 0 ? { ...cell, textAlign: 'left' } : num), fontSize: 12, fontWeight: 400, color: INK.secondary }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key}>
            {r.cells.map((c, i) => (
              <td key={i} style={i === 0 ? cell : num}>
                {i === 0 && r.swatch ? (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: r.swatch,
                      marginRight: 8,
                    }}
                  />
                ) : null}
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {foot ? (
        <tfoot>
          <tr>
            {foot.map((c, i) => (
              <td key={i} style={{ ...(i === 0 ? cell : num), fontWeight: 700, borderBottom: 'none' }}>
                {c}
              </td>
            ))}
          </tr>
        </tfoot>
      ) : null}
    </table>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 style={{ margin: '0 0 8px', fontSize: 16 }}>{children}</h2>
}

export function Note({ children }: { children: ReactNode }) {
  return <p style={{ margin: '16px 0 0', fontSize: 12, lineHeight: 1.5, color: INK.muted }}>{children}</p>
}
