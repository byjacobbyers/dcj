import { cleanStega } from '@/lib/stega'

export type CoverOverlayColor = 'none' | 'black' | 'primary' | 'secondary'

export function normalizeCoverOverlay(raw: string | undefined): CoverOverlayColor {
  const v = cleanStega(raw ?? '')
  if (v === 'black' || v === 'primary' || v === 'secondary') return v
  return 'none'
}
