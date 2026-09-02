import Route from '@/components/route'
import { JAM_VENUE_NAME } from '@/lib/seo'
import type { FooterProps } from '@/types/components/footer-type'

export default function Footer({ navigation, site }: FooterProps) {
  const year = new Date().getFullYear()

  const addressParts = [
    site?.address,
    [site?.addressLocality, site?.addressRegion].filter(Boolean).join(', '),
    site?.postalCode,
  ].filter(Boolean)
  const address = addressParts.join(', ')

  return (
    <footer className="px-4 py-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <small className="text-sm">
            © {year} Denver Contact Jam. All rights reserved.
          </small>
          {address ? (
            <small className="text-sm text-muted-foreground">
              {JAM_VENUE_NAME}, {address}
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
        <nav className="flex items-center gap-6">
          {navigation?.items?.map((item, i) => (
            <Route key={i} data={item} className="text-sm hover:opacity-80">
              {item.title || 'Link'}
            </Route>
          ))}
        </nav>
      </div>
    </footer>
  )
}
