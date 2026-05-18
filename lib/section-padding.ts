import { cleanStega } from '@/lib/stega'

export type SectionPaddingValue = 'none' | 'tiny' | 'small' | 'default'

const MAP: Record<SectionPaddingValue, string> = {
  none: 'py-0',
  tiny: 'py-6',
  small: 'py-12',
  default: 'py-24',
}

/** Maps Sanity `sectionPadding` to a Tailwind py-* class. When value is missing: `default` → py-24; `none` → no class (legacy blocks had no vertical padding). */
export function sectionPaddingToClass(
  value: string | undefined | null,
  whenUnset: 'default' | 'none'
): string {
  if (value === undefined || value === null || value === '') {
    return whenUnset === 'default' ? MAP.default : ''
  }
  const v = cleanStega(value) as SectionPaddingValue
  if (v in MAP) return MAP[v]
  return whenUnset === 'default' ? MAP.default : ''
}
