/**
 * Light-theme surfaces from `app/(site)/globals.css` default `:root`
 * (OG images use this palette; no dark-mode variant for shares).
 */
export type OgSurface = 'primary' | 'secondary'

export function normalizeOgSurface(raw: string | undefined | null): OgSurface {
  return raw === 'secondary' ? 'secondary' : 'primary'
}

export function ogSurfaceColors(surface: OgSurface): { background: string; color: string } {
  if (surface === 'secondary') {
    return { background: '#f5f5f5', color: '#171717' }
  }
  return { background: '#171717', color: '#fafafa' }
}
