import type { StructureBuilder } from 'sanity/structure'
import { BoltIcon } from '@sanity/icons'

export default function Announcement(S: StructureBuilder) {
  return S.listItem()
    .title('Announcement')
    .icon(BoltIcon)
    .child(
      S.editor()
        .id('announcement')
        .schemaType('announcement')
        .documentId('announcement')
    )
}
