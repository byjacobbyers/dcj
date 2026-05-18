'use client'

import { ObjectInputProps, useFormValue } from 'sanity'
import { Stack, Text, Box } from '@sanity/ui'

export default function SeoInput(props: ObjectInputProps) {
  const { value } = props
  const document = useFormValue([]) as Record<string, unknown> | undefined

  const docTitle = (document?.title as string) || ''

  let docDescription = ''
  const rawDesc = document?.description
  if (Array.isArray(rawDesc)) {
    docDescription = rawDesc
      .map((block: { _type?: string; children?: { text?: string }[] }) => {
        if (block._type === 'block' && block.children) {
          return block.children.map((child) => child.text ?? '').join('')
        }
        return ''
      })
      .join(' ')
      .substring(0, 160)
  } else if (typeof rawDesc === 'string') {
    docDescription = rawDesc
  }

  const showTitleDefault = !value?.metaTitle && docTitle
  const showDescDefault = !value?.metaDesc && docDescription
  const hasNoDescription = !value?.metaDesc && !docDescription

  const descPreview =
    docDescription.length > 160
      ? `${docDescription.substring(0, 160)}…`
      : docDescription

  return (
    <Stack space={4}>
      <Box
        padding={3}
        style={{
          background: 'var(--card-bg-color)',
          borderRadius: '4px',
          border: '1px solid var(--card-border-color)',
        }}
      >
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Defaults (if fields left empty):
          </Text>
          {showTitleDefault && (
            <Text size={1} muted>{`• Meta Title: "${docTitle}"`}</Text>
          )}
          {showDescDefault && (
            <Text size={1} muted>{`• Meta Description: "${descPreview}"`}</Text>
          )}
          {hasNoDescription && (
            <Text size={1} style={{ color: 'var(--card-badge-caution-fg-color)' }}>
              • Meta Description: No description found — add a description field to the
              document or fill in this field.
            </Text>
          )}
          <Text size={1} muted>
            • Auto share image: Generated 1200×630 image from heading, background, and site name unless you
            upload a custom image below.
          </Text>
          <Text size={1} muted>
            • Custom share image: Replaces the auto-generated image for this document only. Open Graph does
            not use a site-wide upload as a fallback for other pages.
          </Text>
        </Stack>
      </Box>

      {props.renderDefault(props)}
    </Stack>
  )
}
