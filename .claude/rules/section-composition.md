# Section composition

## Shell pattern (match existing blocks)

New sections should follow the same outer structure as peers (e.g. `gallery-block`, `posts-block`, `team-member-block`):

```tsx
const bg = normalizeSectionBackground(backgroundColor)
<section
  id={anchor || `…-block-${componentIndex}`}
  data-background-color={bg}
  {...sectionSurfaceAttrs(bg)}
  className={cn(
    '…-block w-full flex justify-center px-5',
    sectionSemanticSurfaceClasses(bg),
    sectionPaddingToClass(sectionPadding, 'default')
  )}
>
  <div className="container …">{/* content */}</div>
</section>
```

- **Backgrounds** — `lib/section-background.ts` (`transparent | primary | secondary`); the CMS field is `sectionBackgroundColorField()` from `sanity/schemas/fields/`.
- **Padding** — `sectionPaddingToClass` + `sectionPaddingField()`; never hardcode `py-*` on a section shell.
- **Copy** — Portable Text in `.content`. Prefer shared content spacing over custom prose hierarchies.
- **Motion** — `AppearAnimation` (framer-motion) for entrance where peers use it; keep motion purposeful, not decorative noise.
- **Stega guard** — If a block adds a field whose *value* is compared or used to build a URL (enum-like `variant`, `layout`, `size`, and identifiers like `anchor`), add its name to `STEGA_LOGIC_FIELDS` in `sanity/lib/client.ts` or clean it with `cleanStega` at the comparison. Visual editing encodes invisible characters into strings; unguarded comparisons fail only in Presentation preview.
- **Server vs client** — `components/sections/index.tsx` is a Server Component; server-fetching blocks (like `posts-block/server.tsx`) work in the blockMap. Keep `'use client'` off dispatcher-level components unless they use hooks.
