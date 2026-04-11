import type { ReactNode } from 'react'
import { Text } from '@sanity/ui'

/** Studio preview for block style `large` — matches front-end `text-body-lg` / `.lead` */
export function LargeBlockStyle(props: { children?: ReactNode }) {
  return (
    <Text size={3} weight="regular">
      {props.children}
    </Text>
  )
}
