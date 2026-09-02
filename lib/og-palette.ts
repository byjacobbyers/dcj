/**
 * Light-theme surfaces from `app/(site)/globals.css` default `:root`
 * (OG images use this palette; no dark-mode variant for shares).
 * `wave` is the default: dark satin-wave image (lib/og-wave.ts) with light text.
 */
export type OgSurface = 'wave' | 'primary' | 'secondary'

export function normalizeOgSurface(raw: string | undefined | null): OgSurface {
  if (raw === 'primary') return 'primary'
  if (raw === 'secondary') return 'secondary'
  return 'wave'
}

export function ogSurfaceColors(surface: OgSurface): { background: string; color: string } {
  if (surface === 'secondary') {
    return { background: '#f5f5f5', color: '#171717' }
  }
  // primary, and the solid ground under the wave image
  return { background: '#171717', color: '#fafafa' }
}
