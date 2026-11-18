import 'server-only'

import { ImageResponse } from 'next/og'
import { render } from '@react-email/render'
import { MonthlyReportEmail, monthlySubject, monthlyText, SHEET_CONTENT_ID } from '@/components/report-email/monthly'
import { MonthlySheet, SHEET_SIZE, type MonthlyReportData } from '@/components/report-email/monthly-sheet'
import { WeeklyReportEmail, weeklySubject, weeklyText, type WeeklyReportData } from '@/components/report-email/weekly'
import { loadOgFonts } from '@/lib/og-fonts'
import { monthlyPeriods, weeklyPeriods } from './period'
import { fetchSignins } from './queries'
import { summarizeJams, summarizePeriod } from './summarize'

export type BuiltReport = {
  subject: string
  html: string
  text: string
  images: Array<{ filename: string; content: Buffer; contentId: string }>
}

export async function weeklyReportData(today: string): Promise<WeeklyReportData> {
  const { week, prior } = weeklyPeriods(today)
  const [rows, priorRows] = await Promise.all([fetchSignins(week), fetchSignins(prior)])
  return {
    period: week,
    jams: summarizeJams(rows),
    totals: summarizePeriod(rows, week),
    priorAvgAttendance: summarizePeriod(priorRows, prior).avgAttendance,
  }
}

export async function monthlyReportData(today: string): Promise<MonthlyReportData> {
  const { month, previous } = monthlyPeriods(today)
  const [rows, previousRows] = await Promise.all([fetchSignins(month), fetchSignins(previous)])
  return {
    monthStart: month.start,
    preparedOn: today,
    jams: summarizeJams(rows),
    totals: summarizePeriod(rows, month),
    previous: previousRows.length ? summarizePeriod(previousRows, previous) : null,
    previousStart: previous.start,
  }
}

export async function renderWeekly(data: WeeklyReportData): Promise<BuiltReport> {
  return {
    subject: weeklySubject(data),
    html: await render(<WeeklyReportEmail {...data} />),
    text: weeklyText(data),
    images: [],
  }
}

export async function renderSheetPng(data: MonthlyReportData): Promise<Buffer> {
  const image = new ImageResponse(<MonthlySheet {...data} />, {
    ...SHEET_SIZE,
    fonts: await loadOgFonts(),
  })
  return Buffer.from(await image.arrayBuffer())
}

export async function renderMonthly(data: MonthlyReportData): Promise<BuiltReport> {
  return {
    subject: monthlySubject(data),
    html: await render(<MonthlyReportEmail {...data} />),
    text: monthlyText(data),
    images: [
      {
        filename: `denver-contact-jam-${data.monthStart.slice(0, 7)}.png`,
        content: await renderSheetPng(data),
        contentId: SHEET_CONTENT_ID,
      },
    ],
  }
}
