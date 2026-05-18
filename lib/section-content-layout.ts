import { cleanStega } from '@/lib/stega'

export type SectionContentLayout = 'flush' | 'card'

export function normalizeSectionContentLayout(raw: unknown): SectionContentLayout {
  const v = cleanStega(typeof raw === 'string' ? raw : '')
  if (v === 'card') return 'card'
  return 'flush'
}
