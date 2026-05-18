import type { BaseRouteType } from '@/types/objects/route-type'

export type AnnouncementType = {
  _id: string
  message?: string | null
  route?: BaseRouteType | null
}
