export type FormBlockFields = {
  name: string
  email: string
  message: string
  isAnonymous: boolean
  website?: string
}

export type FormBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  content?: unknown
}
