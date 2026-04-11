export type ProblemBlockIcon = 'LuClock' | 'LuCode' | 'LuLayers'

export type ProblemBlockColumn = {
  _key?: string
  icon?: ProblemBlockIcon | string
  image?: {
    asset?: { metadata?: { dimensions?: { width?: number; height?: number } } }
    alt?: string
    [key: string]: unknown
  } | null
  content?: unknown
}

export type ProblemColumnVisualProps = {
  column: ProblemBlockColumn
}

export type ProblemBlockType = {
  _type: 'problemBlock'
  _key?: string
  active?: boolean
  anchor?: string
  content?: unknown
  columns?: ProblemBlockColumn[]
  excerpt?: unknown
}

export type ProblemBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  content?: unknown
  columns?: ProblemBlockColumn[]
  excerpt?: unknown
}
