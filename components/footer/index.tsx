import Route from '@/components/route'
import { CookieSettingsTrigger } from '@/components/cookie-consent-banner/cookie-settings-trigger'

import type { FooterProps } from '@/types/components/footer-type'
import Link from 'next/link'

export default function Footer({ navigation }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="px-4 py-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <small className="text-sm">
            © {year} Denver Contact Jam. All rights reserved.
          </small>
          
        </div>
        <nav className="flex items-center gap-6">
          {navigation?.items?.map((item, i) => (
            <Route key={i} data={item} className="text-sm hover:opacity-80">
              {item.title || 'Link'}
            </Route>
          ))}
        </nav>
        <CookieSettingsTrigger />
        {/* <Link 
          href="https://www.jacobbyers.me/" 
          target="_blank"
          className="text-sm hover:opacity-90 transition-opacity"
        >
          Website by Jacob Byers
        </Link> */}
      </div>
    </footer>
  )
}
