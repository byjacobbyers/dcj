import { generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo'
import type { OrganizationJsonLdProps } from '@/types/components/organization-jsonld-type'

export default function OrganizationJsonLd({ site }: OrganizationJsonLdProps) {
  const org = generateOrganizationJsonLd(site ?? null)
  const web = generateWebSiteJsonLd(site ?? null)
  const schemas = [org, web]

  return (
    // Plain <script>, not next/script: JSON-LD must ship in the initial
    // server-rendered HTML, and next/script injects after hydration.
    <script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  )
}
