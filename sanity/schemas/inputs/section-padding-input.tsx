'use client'

import { StringInputProps, set, unset } from 'sanity'
import { Stack, Flex, Text, Box } from '@sanity/ui'
import { useCallback } from 'react'

const ORDER = ['none', 'tiny', 'small', 'default'] as const
const LABELS = ['None (0)', 'Tiny', 'Small', 'Default'] as const

function valueToIndex(value: string | undefined): number {
  if (!value) return 3
  const i = ORDER.indexOf(value as (typeof ORDER)[number])
  return i >= 0 ? i : 3
}

export default function SectionPaddingInput(props: StringInputProps) {
  const { value, onChange } = props
  const index = valueToIndex(typeof value === 'string' ? value : undefined)

  const handleSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const i = parseInt(event.currentTarget.value, 10)
      const next = ORDER[i]
      if (next) onChange(set(next))
      else onChange(unset())
    },
    [onChange]
  )

  return (
    <Stack space={2}>
      <Flex gap={3} align="center">
        <Box flex={1}>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={index}
            onChange={handleSliderChange}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
        </Box>
        <Text size={1} weight="medium">
          {LABELS[index]}
        </Text>
      </Flex>
    </Stack>
  )
}
