/**
 * Cleans stega markers from Sanity Visual Editing strings
 * Removes both bracket-wrapped markers (⟬...⟭) and zero-width Unicode characters
 */
export const cleanStega = (value?: string): string => {
  if (typeof value !== 'string') return ''
  let cleaned = value.replace(/⟬.*?⟭/g, '')
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E\u2060-\u206F]/g, '')
  return cleaned.trim()
}
