import type { StructureBuilder } from 'sanity/structure'
import { UsersIcon } from '@sanity/icons/Users'

export default function Team(S: StructureBuilder) {
  return S.listItem()
    .title('Team')
    .icon(UsersIcon)
    .child(
      S.documentTypeList('team')
        .title('Team Members')
        .child((documentId) =>
          S.document().documentId(documentId).schemaType('team')
        )
    )
}
