import { Inter, JetBrains_Mono, Major_Mono_Display } from 'next/font/google'

/**
 * next/font injects CSS variables on the element that applies `.variable` classes.
 * `globals.css` :root lists human-readable fallbacks; these loaders supply real files + metrics.
 *
 * - Major Mono Display → headings (h1–h6, .display) via `font-heading` / `--font-heading`
 * - Inter → body copy via `font-sans` / `--font-sans` (site layout uses `font-sans`)
 * - JetBrains Mono → code / mono via `font-mono` / `--font-mono`
 */
export const heading = Major_Mono_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: '400',
})

export const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})
