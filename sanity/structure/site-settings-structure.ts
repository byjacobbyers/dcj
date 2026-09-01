import type { StructureBuilder } from 'sanity/structure'
import { EarthAmericasIcon } from '@sanity/icons/EarthAmericas'

export default function SiteSettings(S: StructureBuilder) {
  return S.listItem()
    .title('Site Settings')
    .icon(EarthAmericasIcon)
    .child(
      S.editor()
        .id('site')
        .schemaType('site')
        .documentId('site')
    )
}
