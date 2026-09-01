# Design gallery registry (enforced)

`lib/section-registry.test.ts` fails the test suite until a block `_type` in the Studio insert menu is registered everywhere it has to be:

| Where | What the test reads |
|---|---|
| `sanity/schemas/index.ts` | the schema is registered |
| `components/sections/index.tsx` | a `blockMap` entry renders it |
| `app/(site)/design/sections/playgrounds.tsx` | a `<SectionChrome id="…" type="…">` playground |
| `app/(site)/design/sections/page.tsx` | a `NAV` entry for that playground id |
| `scripts/capture-section-previews.mjs` | `[id, type]` in the snapshot map |
| `public/section-previews/<type>.png` | the captured thumbnail |
| `lib/llms.ts` | a `sectionToMarkdown` case or `MARKDOWN_SKIPPED_BLOCKS` entry |

So: add the `_type` to the page-builder list, run `pnpm test`, and the failures are the remaining steps of `new-section-checklist.md`.

Do not skip the test or special-case a type in it. A block without a playground cannot be previewed by an editor, and a block without a thumbnail ships as a generic icon in the insert menu.
