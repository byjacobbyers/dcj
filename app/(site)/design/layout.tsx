import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

const NAV = [
  { href: '/design#colors', label: 'Colors' },
  { href: '/design#type', label: 'Type' },
  { href: '/design#fonts', label: 'Fonts' },
  { href: '/design#space', label: 'Space' },
  { href: '/design#shadows', label: 'Shadows' },
  { href: '/design#tracking', label: 'Tracking' },
  { href: '/design/components', label: 'Components' },
  { href: '/design/sections', label: 'Sections' },
] as const

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav
        aria-label="Design reference"
        className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link
            href="/design"
            className="font-mono text-sm font-medium text-foreground no-underline"
          >
            /design
          </Link>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground no-underline hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {children}
    </div>
  )
}
