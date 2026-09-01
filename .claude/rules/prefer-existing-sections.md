# Prefer existing sections first

When building pages or proposing content structure, **compose with existing blocks** before inventing a new `_type`. Check `/design/sections`, Studio insert thumbnails, and `sanity/schemas/components/page-builder-schema.ts`.

Reuse / reconfigure when the need fits:

- `coverBlock` / `coverVideo` / `heroBlock` — heroes and full-bleed openers
- `textBlock` / `imageBlock` / `galleryBlock` / `columnBlock` / `videoBlock` — copy and media
- `ctaBlock` / `formBlock` / `faqBlock` / `problemBlock` / `splitScrollBlock` — conversion and proof
- `postsBlock` / `teamMemberBlock` — lists and people
- `spacerBlock` / `dividerBlock` / `embedBlock` — spacing and special content

Only add a **new** section type when no existing block can cover it via content, layout, or background options. If unsure, say which existing blocks you considered and why they fall short.

**Permission:** When the task is content/copy/page planning, do **not** create a new section or component without asking first — see `content-ask-before-new.md`.
