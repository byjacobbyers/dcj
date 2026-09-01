'use client'

import { cn } from '@/lib/utils'

export type ControlOption = { value: string; label: string }

export type ControlGroup = {
  key: string
  label: string
  options: ControlOption[]
}

export function SectionControls({
  groups,
  values,
  onChange,
}: {
  groups: ControlGroup[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}) {
  return (
    <div className="border-b border-border bg-background px-4 py-3">
      <div className="mx-auto flex max-w-5xl flex-wrap gap-x-6 gap-y-3">
        {groups.map((group) => (
          <div key={group.key} className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
              {group.label}
            </span>
            <div className="flex flex-wrap gap-1" role="group" aria-label={group.label}>
              {group.options.map((option) => {
                const active = values[group.key] === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(group.key, option.value)}
                    className={cn(
                      'border px-2.5 py-1 font-mono text-xs transition-colors',
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground'
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SectionChrome({
  id,
  title,
  type,
  note,
  children,
}: {
  id: string
  title: string
  type: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="border-y border-border bg-muted/40 px-4 py-2">
        <div className="mx-auto flex max-w-5xl flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-xs font-medium text-foreground">{title}</span>
          <code className="font-mono text-xs font-medium text-muted-foreground">{type}</code>
          {note ? (
            <span className="font-mono text-[10px] text-muted-foreground">{note}</span>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  )
}

export const BG_OPTIONS: ControlOption[] = [
  { value: 'transparent', label: 'Transparent' },
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
]

export const BG_GROUP: ControlGroup = {
  key: 'backgroundColor',
  label: 'Background',
  options: BG_OPTIONS,
}
