# Design Tokens

All tokens are defined in `src/app/globals.css` and mapped to Tailwind v4 via `@theme inline`.

## Brand Primitives

Raw palette values. These do not change between light and dark mode.

| Token | Light | Tailwind Class | Usage |
|---|---|---|---|
| `--brand-primary` | `#00bcd4` | (internal) | Source for `--primary`, `--cyan` |
| `--brand-primary-light` | `#e0f7fa` | (internal) | Source for `--cyan-light` |
| `--brand-primary-dark` | `#00838f` | (internal) | Source for `--cyan-dark` |
| `--brand-gradient-start` | `#4DD0E1` | `from-brand-gradient-start` | Logo gradient start |
| `--brand-gradient-end` | `#26C6DA` | `to-brand-gradient-end` | Logo gradient end |

## Core Semantic (shadcn/ui)

| Token | Light | Dark | Tailwind Class |
|---|---|---|---|
| `--background` | `#ffffff` | `#1a1a2e` | `bg-background` |
| `--foreground` | `#1a1a2e` | `#f8f9fa` | `text-foreground` |
| `--card` | `#ffffff` | `#262640` | `bg-card` |
| `--primary` | `var(--brand-primary)` | `var(--brand-primary)` | `bg-primary`, `text-primary` |
| `--secondary` | `#f5f5f5` | `#3d3d5c` | `bg-secondary` |
| `--muted` | `#f8f9fa` | `#3d3d5c` | `bg-muted` |
| `--muted-foreground` | `#6b7280` | `#9ca3af` | `text-muted-foreground` |
| `--accent` | `var(--brand-primary-light)` | `#1a3a3d` | `bg-accent` |
| `--destructive` | `#ef4444` | `#ef4444` | `bg-destructive` |
| `--border` | `#e5e7eb` | `#3d3d5c` | `border-border` |
| `--input` | `#e5e7eb` | `#3d3d5c` | `border-input` |
| `--ring` | `var(--brand-primary)` | `var(--brand-primary)` | `ring-ring` |

## Brand Aliases

| Token | Light | Dark | Tailwind Class |
|---|---|---|---|
| `--cyan` | `var(--brand-primary)` | `var(--brand-primary)` | `text-cyan`, `bg-cyan` |
| `--cyan-light` | `var(--brand-primary-light)` | `#1a3a3d` | `bg-cyan-light` |
| `--cyan-dark` | `var(--brand-primary-dark)` | `#4dd0e1` | `text-cyan-dark` |

## Semantic Typography

| Token | Light | Dark | Tailwind Class | Usage |
|---|---|---|---|---|
| `--heading-1` | `#2D4A50` | `#e0f2f1` | `text-heading-1` | H1, page titles, heading icons |
| `--heading-2` | `#2D4A50` | `#e0f2f1` | `text-heading-2` | H2 headings |
| `--text-secondary` | `#6D9097` | `#8faab0` | `text-text-secondary` | Secondary text, timestamps, icons |

## Semantic Surfaces

| Token | Light | Dark | Tailwind Class | Usage |
|---|---|---|---|---|
| `--surface` | `#FCFCFC` | `#2a2a45` | `bg-surface` | Card backgrounds, containers |
| `--surface-alt` | `#F7FDFE` | `#1e2e35` | `bg-surface-alt` | Alternating table rows |
| `--surface-filter` | `#F6F7F9` | `#33334d` | `bg-surface-filter` | Filter bars, inactive buttons |

## Semantic Borders

| Token | Light | Dark | Tailwind Class | Usage |
|---|---|---|---|---|
| `--border-light` | `#E6E6E6` | `#3d3d5c` | `border-border-light` | Notification borders, filter borders |
| `--border-table` | `#e0f2fe` | `#1a3a4d` | `border-border-table` | Department table row/header borders |

## Interactive

| Token | Light | Dark | Tailwind Class | Usage |
|---|---|---|---|---|
| `--highlight-hover` | `#67e8f9` | `#0e7490` | (shadow utility) | Cell hover inset highlight |

## Category Badge Colors

| Token | Light | Dark | Tailwind Class |
|---|---|---|---|
| `--operations` | `#00838f` | `#4dd0e1` | `text-operations` |
| `--operations-bg` | `#e0f7fa` | `#0d2f33` | `bg-operations-bg` |
| `--design` | `#d81b60` | `#f06292` | `text-design` |
| `--design-bg` | `#fce4ec` | `#3d1a2a` | `bg-design-bg` |
| `--engineering` | `#00897b` | `#4db6ac` | `text-engineering` |
| `--engineering-bg` | `#e0f2f1` | `#1a3330` | `bg-engineering-bg` |
| `--marketing` | `#1e88e5` | `#64b5f6` | `text-marketing` |
| `--marketing-bg` | `#e3f2fd` | `#1a2a3d` | `bg-marketing-bg` |
| `--sales` | `#f4511e` | `#ff8a65` | `text-sales` |
| `--sales-bg` | `#fbe9e7` | `#3d2420` | `bg-sales-bg` |

## Status Badge Colors

| Token | Light | Dark | Tailwind Class |
|---|---|---|---|
| `--live` | `#4caf50` | `#81c784` | `text-live`, `bg-live` |
| `--live-bg` | `#e8f5e9` | `#1b3320` | `bg-live-bg` |
| `--recurring` | `#ff9800` | `#ffb74d` | `text-recurring` |
| `--recurring-bg` | `#fff3e0` | `#3d2e1a` | `bg-recurring-bg` |

## Folder Card Tokens

| Token | Light | Dark | Tailwind Class |
|---|---|---|---|
| `--folder-paper-border` | `#D1D1D1` | `#4a4a6a` | `border-folder-paper-border` |
| `--folder-agenda-title` | `#7a7a7a` | `#9ca3af` | `text-folder-agenda-title` |
| `--folder-agenda-text` | `#4a4a4a` | `#d1d5db` | `text-folder-agenda-text` |
| `--folder-agenda-bullet` | `#b0b0b0` | `#6b7280` | `text-folder-agenda-bullet` |
| `--folder-focus-ring` | `#7161d1` | `#8b7cf7` | `ring-folder-focus-ring` |
