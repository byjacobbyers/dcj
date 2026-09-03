'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-border', className)}
    {...props}
  />
))
AccordionItem.displayName = AccordionPrimitive.Item.displayName

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  // forceMount: collapsed answers must ship in the server HTML for SEO; Radix
  // otherwise unmounts them until first open. `block` overrides the UA
  // display:none from the `hidden` attribute Radix sets while closed. The
  // animated grid-rows collapse lives on the inner wrapper because Radix
  // zeroes transition durations inline on this node during measurement;
  // `invisible` keeps closed content out of the a11y tree and focus order.
  <AccordionPrimitive.Content ref={ref} forceMount className="group block text-sm" {...props}>
    <div className="invisible grid grid-rows-[0fr] [transition:grid-template-rows_200ms_ease-out,visibility_200ms] group-data-[state=open]:visible group-data-[state=open]:grid-rows-[1fr] motion-reduce:[transition:none]">
      <div className="min-h-0 overflow-hidden">
        <div className={cn('pb-4 pt-0', className)}>{children}</div>
      </div>
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
