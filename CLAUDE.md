@AGENTS.md

# Denver Contact Jam — agent notes

Project instructions are split under [`.claude/rules/`](.claude/rules/). Claude Code loads every `*.md` there automatically. Keep this file thin — add new topics as separate rule files, not more sections here.

| File | Topic |
|------|--------|
| `prefer-existing-sections.md` | Reuse page-builder blocks before inventing new ones |
| `content-ask-before-new.md` | Content work: use existing blocks; ask before new components/code |
| `tokens-and-styling.md` | DTCG tokens → `pnpm tokens:build`, theme utilities, shadcn/ui |
| `section-composition.md` | Section shell, backgrounds/padding helpers, stega guard, server-vs-client |
| `new-section-checklist.md` | Full pipeline when adding a new block `_type` |
| `design-gallery-registry.md` | The test that fails until a block is in the gallery, nav, snapshot map and thumbnails |
| `new-document-checklist.md` | Pipeline for a new document `_type`, and new route groups |
| `ai-readability.md` | llms.txt, `.md` twins, the serializer gate |

**Adding a rule:** create `.claude/rules/<topic>.md`.

**Verification floor:** run `pnpm lint && pnpm test && pnpm build` locally before pushing (deploys go through Vercel; there is no separate CI), plus `pnpm typegen` after schema/query changes and commit the regenerated `schema.json` / `sanity.types.ts`.
