export type FaqBlockFaq = {
  question?: string
  answer?: unknown
}

export type FaqBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  faqs?: FaqBlockFaq[]
}
