import type { BaseRouteType } from '@/types/objects/route-type'

export type ButtonPairType = {
  _type: 'buttonPair'
  _key?: string
  left?: BaseRouteType
  right?: BaseRouteType
}
