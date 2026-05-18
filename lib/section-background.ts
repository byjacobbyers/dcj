import { cleanStega } from '@/lib/stega'

export type SectionBackgroundColor = 'transparent' | 'primary' | 'secondary'

export function normalizeSectionBackground(raw: unknown): SectionBackgroundColor {
  const v = cleanStega(typeof raw === 'string' ? raw : '')
  if (v === 'primary' || v === 'secondary' || v === 'transparent') return v
  return 'transparent'
}

/** Standard blocks: semantic background fill + text on primary/secondary surfaces. */
export function sectionSemanticSurfaceClasses(bg: SectionBackgroundColor): string {
  return bg === 'transparent'
    ? 'bg-transparent text-foreground'
    : 'bg-background text-foreground'
}

export function sectionSurfaceAttrs(bg: SectionBackgroundColor): {
  'data-surface'?: 'primary' | 'secondary'
} {
  if (bg === 'primary' || bg === 'secondary') return { 'data-surface': bg }
  return {}
}

/** Form block uses solid primary/secondary tokens instead of semantic `bg-background`. */
export function formSectionSurfaceClasses(bg: SectionBackgroundColor): string {
  if (bg === 'transparent') return 'bg-transparent text-foreground'
  if (bg === 'secondary') return 'bg-secondary text-secondary-foreground'
  return 'bg-primary text-primary-foreground'
}
