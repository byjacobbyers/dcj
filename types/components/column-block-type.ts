export type ColumnBlockColumn = {
  _key?: string
  title?: string
  content?: unknown
  image?: {
    asset?: { metadata?: { dimensions?: { width?: number; height?: number } } }
    [key: string]: unknown
  } | null
  cta?: { active?: boolean; route?: { title?: string; [key: string]: unknown } } | null
}

export type ColumnBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  title?: string
  columnsPerRow?: number
  columns?: ColumnBlockColumn[]
}
