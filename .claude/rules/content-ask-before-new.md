# Content writing — ask before new components

When the user asks you to **write content**, draft copy, plan a page, or fill CMS fields:

## Default behavior

1. **Propose content and structure first** — headlines, body, CTAs, which existing sections to use. Prefer Studio/page-builder composition over code edits.
2. **Use existing building blocks** — page-builder sections (`/design/sections`, `page-builder-schema.ts`) and `components/ui/*`. Reconfigure layout/background/content; do not invent a new `_type` or React component by default.
3. **Do not change application code** unless the user explicitly asks for implementation, or they approve a proposed code change after you asked.

## Permission gate (required)

Before creating or scaffolding any of the following, **stop and ask**:

- A new page-builder section `_type` / block schema
- A new React component (under `components/` or elsewhere)
- A new shadcn primitive install "just for this page"
- Non-trivial refactors or design-system changes "to make the content fit"

When asking, briefly explain what you want to add, why existing sections/components are insufficient (name the ones you considered), and what the user gains if they approve. Only proceed after a clear go-ahead.
