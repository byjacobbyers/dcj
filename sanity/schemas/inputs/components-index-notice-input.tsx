'use client'

import { Card, Text } from '@sanity/ui'
import type { StringInputProps } from 'sanity'

/** Read-only banner for the /components reference page (slug: components). */
export default function ComponentsIndexNoticeInput(_props: StringInputProps) {
  return (
    <Card padding={4} radius={2} shadow={1} tone="caution" border>
      <Text size={1}>
        This URL is unindexed. This page exists only as an internal reference so you can see all
        components in one place.
      </Text>
    </Card>
  )
}
