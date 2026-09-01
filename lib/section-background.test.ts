import { describe, expect, it } from 'vitest'
import {
  formSectionSurfaceClasses,
  normalizeSectionBackground,
  sectionSemanticSurfaceClasses,
  sectionSurfaceAttrs,
} from '@/lib/section-background'

describe('normalizeSectionBackground', () => {
  it('passes through valid values', () => {
    expect(normalizeSectionBackground('primary')).toBe('primary')
    expect(normalizeSectionBackground('secondary')).toBe('secondary')
    expect(normalizeSectionBackground('transparent')).toBe('transparent')
  })

  it('falls back to transparent for unknown or non-string input', () => {
    expect(normalizeSectionBackground('neon')).toBe('transparent')
    expect(normalizeSectionBackground(undefined)).toBe('transparent')
    expect(normalizeSectionBackground(42)).toBe('transparent')
  })

  it('strips stega characters before comparing', () => {
    expect(normalizeSectionBackground('primary​‌')).toBe('primary')
  })
})

describe('sectionSemanticSurfaceClasses', () => {
  it('is transparent only for transparent backgrounds', () => {
    expect(sectionSemanticSurfaceClasses('transparent')).toContain('bg-transparent')
    expect(sectionSemanticSurfaceClasses('primary')).toContain('bg-background')
    expect(sectionSemanticSurfaceClasses('secondary')).toContain('bg-background')
  })
})

describe('sectionSurfaceAttrs', () => {
  it('emits data-surface only for primary/secondary', () => {
    expect(sectionSurfaceAttrs('primary')).toEqual({ 'data-surface': 'primary' })
    expect(sectionSurfaceAttrs('secondary')).toEqual({ 'data-surface': 'secondary' })
    expect(sectionSurfaceAttrs('transparent')).toEqual({})
  })
})

describe('formSectionSurfaceClasses', () => {
  it('uses solid tokens per background', () => {
    expect(formSectionSurfaceClasses('transparent')).toContain('bg-transparent')
    expect(formSectionSurfaceClasses('secondary')).toContain('bg-secondary')
    expect(formSectionSurfaceClasses('primary')).toContain('bg-primary')
  })
})
