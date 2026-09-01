# Tokens and styling

- **Source of truth** — Edit DTCG JSON under `tokens/`. Run `pnpm tokens:build` (also on `predev` / `prebuild`). Do **not** hand-edit `app/(site)/generated/tokens.css` or re-add `:root`/`.dark` variable blocks to `globals.css`.
- **Use tokens in UI** — Prefer theme utilities (`bg-primary`, `text-muted-foreground`, `text-h2`, `text-body`, radius/shadow tokens) over one-off hex, raw `px`, or new CSS variables. The type scale's responsive overrides live in `globals.css` media queries (`--type-*-size`).
- **shadcn/ui first** — Build with `components/ui/*`. Check `/design/components` before inventing controls. If a needed primitive is missing, install it with the shadcn CLI (`pnpm dlx shadcn@latest add <component>`) using this repo's `components.json` — then reuse it. Do not hand-roll parallel Button/Input/etc.
- **Portable Text / section copy** — Wrap CMS rich text in `.content` so type and spacing stay consistent (`globals.css`).
- **Dark only** — The site hard-codes `class="dark"` on `<html>`. Both palettes exist in `tokens/color.json`, but only the dark values render; keep them in sync when changing colors.
- **Fonts** — `--font-heading` is Major Mono Display (via `next/font` in `app/(site)/fonts.ts`); headings in `.content` use it automatically.
