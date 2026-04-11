import type { StructureBuilder } from 'sanity/structure'
import { CalendarIcon } from '@sanity/icons'

export default function Event(S: StructureBuilder) {
  return S.listItem()
    .title('Events')
    .icon(CalendarIcon)
    .child(
      S.documentTypeList('event')
        .title('Events')
        .child((documentId) =>
          S.document().documentId(documentId).schemaType('event')
        )
    )
}
