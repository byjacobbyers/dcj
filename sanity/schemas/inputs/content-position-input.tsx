'use client'

import { StringInputProps, set } from 'sanity'
import { Grid, Card, Stack, Text, Flex } from '@sanity/ui'

type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

const positionLabels: Record<Position, string> = {
  'top-left': '↖',
  'top-center': '↑',
  'top-right': '↗',
  'center-left': '←',
  center: '●',
  'center-right': '→',
  'bottom-left': '↙',
  'bottom-center': '↓',
  'bottom-right': '↘',
}

const positions: Position[][] = [
  ['top-left', 'top-center', 'top-right'],
  ['center-left', 'center', 'center-right'],
  ['bottom-left', 'bottom-center', 'bottom-right'],
]

export default function ContentPositionInput(props: StringInputProps) {
  const { value, onChange } = props
  const selectedPosition = (value as Position) || 'center'

  return (
    <Stack space={3}>
      <Grid columns={3} gap={2} style={{ maxWidth: '240px' }}>
        {positions.flat().map((position) => {
          const isSelected = selectedPosition === position
          return (
            <Card
              key={position}
              padding={3}
              radius={2}
              shadow={isSelected ? 2 : 1}
              tone={isSelected ? 'primary' : 'default'}
              style={{
                cursor: 'pointer',
                border: isSelected
                  ? '2px solid var(--card-focus-ring-color)'
                  : '1px solid var(--card-border-color)',
                transition: 'all 0.2s ease',
              }}
              onClick={() => onChange(set(position))}
            >
              <Flex align="center" justify="center">
                <Text
                  size={3}
                  weight={isSelected ? 'semibold' : 'regular'}
                  style={{
                    fontSize: '28px',
                    lineHeight: '1',
                  }}
                >
                  {positionLabels[position]}
                </Text>
              </Flex>
            </Card>
          )
        })}
      </Grid>
      <Text size={1} muted>
        Selected: {selectedPosition.replace(/-/g, ' ')}
      </Text>
    </Stack>
  )
}
