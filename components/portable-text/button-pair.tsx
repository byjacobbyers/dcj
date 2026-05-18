'use client'

import Route from '@/components/route'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ButtonPairType } from '@/types/objects/button-pair-type'

const buttonClassName =
  'bg-foreground text-background !no-underline shadow hover:bg-foreground/90 hover:text-background hover:!no-underline hover:scale-105'

type ButtonPairProps = {
  value?: ButtonPairType
}

function PairButton({ route }: { route?: ButtonPairType['left'] }) {
  if (!route?.linkType) return null

  return (
    <Button asChild className={cn(buttonClassName)}>
      <Route data={route} className="!no-underline hover:!no-underline">
        {route.title?.trim() || 'Learn more'}
      </Route>
    </Button>
  )
}

export default function ButtonPair({ value }: ButtonPairProps) {
  if (!value) return null

  const hasLeft = Boolean(value.left?.linkType)
  const hasRight = Boolean(value.right?.linkType)
  if (!hasLeft && !hasRight) return null

  return (
    <div className="not-prose my-4 flex flex-wrap gap-5">
      {hasLeft ? <PairButton route={value.left} /> : null}
      {hasRight ? <PairButton route={value.right} /> : null}
    </div>
  )
}
