import type { StructureBuilder } from 'sanity/structure'
import {LinkIcon} from '@sanity/icons/Link'

export default function Redirect(S: StructureBuilder) {
  return S.listItem()
    .title('Redirects')
    .icon(LinkIcon)
    .child(
      S.documentTypeList('redirect')
        .title('Redirects')
        .child((documentId) =>
          S.document().documentId(documentId).schemaType('redirect')
        )
    )
}
