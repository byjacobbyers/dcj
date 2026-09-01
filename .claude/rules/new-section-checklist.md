# New section checklist

When you **do** add or rename a page-builder block `_type`, finish the catalog pipeline — not just the React component.

1. **Schema** — `sanity/schemas/components/*-block-schema.ts` with icon + description; shared chrome via `sanity/schemas/fields/` (`sectionPaddingField`, `sectionBackgroundColorField`) plus inline `active`/`anchor`. Register in `sanity/schemas/index.ts`.
2. **Insert menu** — Add `{ type: '<name>' }` to `sanity/schemas/components/page-builder-schema.ts`.
3. **Frontend** — Follow the shell pattern from a peer block (`section-composition.md`); register in `components/sections/index.tsx`; add a projection to `sanity/queries/components/sections-query.ts` if the block needs references or images resolved.
4. **Types** — Prop contract in `types/components/<name>-type.ts`; rerun `pnpm typegen`.
5. **Stega guard** — New enum-like/logic fields go in `STEGA_LOGIC_FIELDS` (`sanity/lib/client.ts`).
6. **Markdown** — A `case` in `sectionToMarkdown` (`lib/llms.ts`) when the block has readable copy, or its `_type` in `MARKDOWN_SKIPPED_BLOCKS` when it has none.
7. **Design playground** — Entry in `app/(site)/design/sections/playgrounds.tsx` (`<SectionChrome id title type>`, fixtures from `fixtures.ts`); wire `page.tsx` `NAV`.
8. **Snapshot map** — `[anchorId, schemaType]` in `scripts/capture-section-previews.mjs`.
9. **Capture** — Dev server up → `pnpm sections:previews` → commit `public/section-previews/<type>.png`.

**Enforced:** `lib/section-registry.test.ts` fails until all of the above are done — see `design-gallery-registry.md`.
