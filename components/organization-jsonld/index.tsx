import Script from 'next/script'
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo'
import type { OrganizationJsonLdProps } from '@/types/components/organization-jsonld-type'

export default function OrganizationJsonLd({ site }: OrganizationJsonLdProps) {
  const org = generateOrganizationJsonLd(site ?? null)
  const web = generateWebSiteJsonLd(site ?? null)
  const schemas = [org, web]

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  )
}
