'use client'

import { NumberInputProps, set, unset } from 'sanity'
import { Stack, Flex, TextInput, Text, Box } from '@sanity/ui'
import { useCallback } from 'react'

export default function ImagesPerRowInput(props: NumberInputProps) {
  const { value, onChange } = props
  const imagesPerRow = typeof value === 'number' ? value : 3

  const handleSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(event.currentTarget.value, 10)
      onChange(newValue ? set(newValue) : unset())
    },
    [onChange]
  )

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(event.currentTarget.value, 10)
      if (!isNaN(newValue) && newValue >= 2 && newValue <= 4) {
        onChange(set(newValue))
      } else if (event.currentTarget.value === '') {
        onChange(unset())
      }
    },
    [onChange]
  )

  return (
    <Stack space={2}>
      <Flex gap={3} align="center">
        <Box flex={1}>
          <input
            type="range"
            min={2}
            max={4}
            step={1}
            value={imagesPerRow}
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
        <Flex gap={1} align="center">
          <TextInput
            type="number"
            min={2}
            max={4}
            value={imagesPerRow}
            onChange={handleTextChange}
            style={{ width: '70px' }}
          />
          <Text size={1} muted>per row</Text>
        </Flex>
      </Flex>
    </Stack>
  )
}
