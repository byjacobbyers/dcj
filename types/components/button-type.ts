import type * as React from 'react'
import type { VariantProps } from 'class-variance-authority'

import type { buttonVariants } from '@/components/ui/button-variants'

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }
