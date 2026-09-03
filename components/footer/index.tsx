import Route from '@/components/route'
import { Facebook, Instagram } from 'lucide-react'
import { GBP_PROFILE_URL, JAM_VENUE_NAME } from '@/lib/seo'
import type { FooterProps } from '@/types/components/footer-type'

/** Icons for profiles found in the site doc's sameAs (same source as JSON-LD). */
const SOCIAL_ICONS = [
  { match: 'instagram.com', label: 'Instagram', Icon: Instagram },
  { match: 'facebook.com', label: 'Facebook', Icon: Facebook },
]

export default function Footer({ navigation, site }: FooterProps) {
  const year = new Date().getFullYear()

  // Format matches the Google Business Profile listing character for character:
  // "125 S Sherman St, Denver, CO 80209" (no comma before the zip).
  const cityLine = [
    [site?.addressLocality, site?.addressRegion].filter(Boolean).join(', '),
    site?.postalCode,
  ]
    .filter(Boolean)
    .join(' ')
  const address = [site?.address, cityLine].filter(Boolean).join(', ')

  const socials = SOCIAL_ICONS.flatMap(({ match, label, Icon }) => {
    const url = site?.sameAs?.find((u) => u?.includes(match))
    return url ? [{ url, label, Icon }] : []
  })

  return (
    <footer className="px-4 py-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <small className="text-sm">
            © {year} Denver Contact Jam. All rights reserved.
          </small>
          {address ? (
            <small className="text-sm text-muted-foreground">
              <a
                href={GBP_PROFILE_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-80"
              >
                {JAM_VENUE_NAME}, {address}
              </a>
            </small>
          ) : null}
          {site?.email ? (
            <small className="text-sm text-muted-foreground">
              <a href={`mailto:${site.email}`} className="hover:opacity-80">
                {site.email}
              </a>
            </small>
          ) : null}
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {navigation?.items?.map((item, i) => (
              <Route key={i} data={item} className="text-sm hover:opacity-80">
                {item.title || 'Link'}
              </Route>
            ))}
          </nav>
          {socials.length > 0 ? (
            <div className="flex items-center gap-3">
              {socials.map(({ url, label, Icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="hover:opacity-80"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
