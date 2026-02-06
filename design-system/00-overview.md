# Design System Overview

## Philosophy

Code is the source of truth. This documentation exists to explain and demonstrate the system, not redefine it.

The design system lives in:

- **Token definitions**: `src/app/globals.css` (CSS variables + `@theme inline` Tailwind v4 mappings)
- **Component implementations**: `src/components/ui/`, `src/components/meetings/`, `src/components/departments/`
- **Interactive reference**: Storybook (`npm run storybook`)

## Token Architecture

Tokens are organized in three layers:

1. **Brand Primitives** — raw palette values that define the brand identity. Never used directly in components.
2. **Semantic Tokens** — functional roles (surfaces, typography, borders, interactive states). Consumed by components via Tailwind classes.
3. **Functional/Component Tokens** — scoped to specific contexts (category badges, status badges, folder card).

## Rules

### When to use tokens

- **Always** use a token-backed Tailwind class for colors, surfaces, borders, and typography in components.
- **Never** use raw hex values (`#XXXXXX`) in component files. All color values must flow through CSS variables.
- If a new value is needed, add it as a token in `globals.css` with both light and dark mode values, map it in `@theme inline`, then consume it.

### When to create vs extend

- **Create** a new token when the value represents a distinct role not covered by existing tokens (e.g., a new component surface).
- **Extend** an existing token when the use case semantically matches (e.g., use `--surface` for any light content background).
- **Never** create a one-off token for a single component unless it has a genuinely unique visual identity (like the folder card).

### Naming conventions

- Brand primitives: `--brand-*` (e.g., `--brand-primary`, `--brand-gradient-start`)
- Semantic: descriptive role names (e.g., `--heading-1`, `--surface-alt`, `--border-table`)
- Category/status: category name (e.g., `--operations`, `--design-bg`, `--live`)
- Folder card: `--folder-*` prefix for component-scoped tokens

## Dark Mode

Every token must have a dark mode override in `.dark { }`. The `@custom-variant dark` directive maps dark mode to `.dark` class descendants.

Toggle dark mode by adding/removing the `dark` class on the document root.

## Variant Authoring (CVA)

Components with discrete variants use `class-variance-authority`:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});
```

## Animation

Shared motion configs live in `src/lib/animation.ts`. Import transition presets (`springDrawer`, `fadeFast`, `expandCollapse`, etc.) instead of inlining duplicate values.

## Storybook

Run `npm run storybook` to browse the component library. Build a static version with `npm run build-storybook`.

The toolbar includes a theme toggle (sun/moon) for switching between light and dark mode.

## Constraints

| Constraint | Value | Token |
|---|---|---|
| Primary brand color | `#00bcd4` | `--brand-primary` |
| H1 heading color | `#2D4A50` | `--heading-1` |
| Folder visual identity | Preserved | `--folder-*` tokens |
| No external UI library | shadcn primitives only | — |
| No raw hex in components | Tokens only | — |
