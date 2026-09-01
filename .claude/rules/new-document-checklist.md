# New document type checklist

The block-level version of this lives in `new-section-checklist.md`. This is the pipeline for a new **document** `_type` (see `post`/`team` for worked examples).

1. **Schema** — `sanity/schemas/documents/*-schema.ts`, icon and preview included. Register in `sanity/schemas/index.ts`.
2. **Studio structure** — `sanity/structure/*-structure.ts`, added to the list in `structure/index.ts`. Otherwise editors cannot find it.
3. **Query** — `sanity/queries/documents/*-query.ts` using `defineQuery`. Reuse existing fragments (`sectionsQuery`, `imageQuery`, `routeQuery`) rather than re-projecting; fragments stay `groq` + `// @sanity-typegen-ignore`.
4. **Types** — run `pnpm typegen`, commit `schema.json` + `sanity.types.ts`, and cast fetch results (`.data as XQueryResult`) the way `app/(site)/[slug]/page.tsx` does.
5. **Revalidation** — add a `case` to the `_type` switch in `app/api/revalidate/path/route.ts`. Without it a publish falls through to the generic `/` bust and the new route never updates.
6. **Presentation** — a `locations` resolver entry in `sanity.config.ts` so the Studio can jump to the page.
7. **Route** — if it needs one; `sitemap.ts` and (for readable content) the llms surfaces (`ai-readability.md`).

## New route groups

A route group outside `(site)` inherits none of the site layout. It needs the font variables and `globals.css` from `(site)`, the `#advanced-texture` SVG filter if any section uses a texture background, **`<SanityLive />`** (without it `sanityFetch` responses never revalidate — fails silently, looks like a Next cache bug), and `robots: { index: false }` plus a `robots.ts` disallow when it should stay unlisted.
