import { JetBrains_Mono, Merriweather, Source_Serif_4 } from 'next/font/google'

/**
 * next/font injects CSS variables on the element that applies `.variable` classes.
 * `globals.css` :root lists human-readable fallbacks; these loaders supply real files + metrics.
 *
 * - Merriweather → headings (h1–h6, .display) via `font-heading` / `--font-heading`
 * - Source Serif 4 → body copy via `font-serif` / `--font-serif` (site layout uses `font-serif`)
 * - JetBrains Mono → code / mono via `font-mono` / `--font-mono`
 */
export const heading = Merriweather({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['300', '400', '700', '900'],
})

export const serif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
})

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})
