'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'

import { PrimaryButtonAuroraLayers } from '@/components/ui/primary-button-aurora-layers'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import type { ButtonProps } from '@/types/components/button-type'

function isPrimaryAuroraVariant(variant: VariantProps<typeof buttonVariants>['variant']) {
  return variant === 'default' || variant === 'huge'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, onMouseEnter, ...props }, ref) => {
    const resolvedVariant = variant ?? 'default'
    const primaryAurora = isPrimaryAuroraVariant(resolvedVariant)
    const [mountAurora, setMountAurora] = React.useState(false)

    const handleMouseEnter = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        setMountAurora(true)
        onMouseEnter?.(e)
      },
      [onMouseEnter]
    )

    if (!primaryAurora) {
      const Comp = asChild ? Slot : 'button'
      return (
        <Comp
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
          onMouseEnter={onMouseEnter}
        >
          {children}
        </Comp>
      )
    }

    const mergedClassName = cn(
      buttonVariants({ variant, size, className }),
      'group relative isolate overflow-hidden'
    )

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        children?: React.ReactNode
        className?: string
        onMouseEnter?: React.MouseEventHandler<HTMLElement>
      }>

      const prevOnEnter = child.props.onMouseEnter
      const mergedOnEnter = (e: React.MouseEvent<HTMLElement>) => {
        setMountAurora(true)
        prevOnEnter?.(e)
      }

      return (
        <Slot ref={ref} className={mergedClassName} {...props}>
          {React.cloneElement(child, {
            onMouseEnter: mergedOnEnter,
            children: (
              <PrimaryButtonAuroraLayers mountAurora={mountAurora}>
                {child.props.children}
              </PrimaryButtonAuroraLayers>
            ),
          })}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        className={mergedClassName}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        <PrimaryButtonAuroraLayers mountAurora={mountAurora}>{children}</PrimaryButtonAuroraLayers>
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
