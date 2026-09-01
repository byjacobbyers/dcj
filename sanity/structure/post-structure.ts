import type { StructureBuilder } from 'sanity/structure'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'
import { TagIcon } from '@sanity/icons/Tag'

export default function Post(S: StructureBuilder) {
  return S.listItem()
    .title('Posts')
    .icon(DocumentTextIcon)
    .child(
      S.list()
        .title('Posts')
        .items([
          S.listItem()
            .title('All posts')
            .icon(DocumentTextIcon)
            .child(
              S.documentTypeList('post')
                .title('Posts')
                .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                .child((documentId) =>
                  S.document().documentId(documentId).schemaType('post')
                )
            ),
          S.listItem()
            .title('Categories')
            .icon(TagIcon)
            .child(
              S.documentTypeList('postCategory')
                .title('Categories')
                .child((documentId) =>
                  S.document().documentId(documentId).schemaType('postCategory')
                )
            ),
        ])
    )
}
