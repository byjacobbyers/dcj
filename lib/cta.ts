import type { BaseRouteType } from '@/types/objects/route-type'

/** Pure helper — safe to call from RSC shells. */
export function isActiveCta(cta?: {
  active?: boolean
  route?: unknown
} | null): cta is { active?: boolean; route: BaseRouteType | Record<string, unknown> } {
  return Boolean(cta && cta.active !== false && cta.route)
}
