import type { StructureBuilder } from 'sanity/structure'
import { LinkIcon } from '@sanity/icons'

export default function Navigation(S: StructureBuilder) {
  return S.listItem()
    .title('Navigation')
    .icon(LinkIcon)
    .child(
      S.list()
        .title('Navigation')
        .items([
          S.listItem()
            .title('Header')
            .icon(LinkIcon)
            .child(
              S.editor()
                .id('header')
                .schemaType('navigation')
                .documentId('header')
            ),
          S.listItem()
            .title('Footer')
            .icon(LinkIcon)
            .child(
              S.editor()
                .id('footer')
                .schemaType('navigation')
                .documentId('footer')
            ),
        ])
    )
}
