import PageBackdrop from '@/components/page-backdrop'
import Sections from '@/components/sections'
import { cn } from '@/lib/utils'
import type { PageSingleProps } from '@/types/components/page-single-type'

export default function Page({ page }: PageSingleProps) {
  if (!page) return null
  const { sections = [], backgroundColor = 'primary' } = page
  const isSilk = backgroundColor === 'silk'
  const surfaceProps =
    backgroundColor === 'primary' || backgroundColor === 'secondary'
      ? { 'data-surface': backgroundColor as 'primary' | 'secondary' }
      : {}

  return (
    <div
      className={cn(
        'relative flex w-full min-h-0 flex-1 flex-col items-center text-foreground',
        !isSilk && 'bg-background',
      )}
    >
      {isSilk ? <PageBackdrop /> : null}
      <main
        data-background-color={backgroundColor}
        {...surfaceProps}
        className={cn(
          'relative z-10 flex w-full flex-1 flex-col items-center justify-center',
          isSilk ? 'bg-transparent' : 'bg-background',
        )}
      >
        <Sections body={sections} />
      </main>
    </div>
  )
}
