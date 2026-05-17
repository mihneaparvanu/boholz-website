---
name: feedback-grid-layout-explicit-placement
description: For complex grid tables (compare/data), prefer explicit grid-column/grid-row inline styles per cell over display:contents + nth-of-type — the latter fights sticky-column layout
metadata:
  type: feedback
---

When building grid-based comparison/data tables in Astro/Vue, **emit each
cell with explicit `style="grid-column: N; grid-row: M;"`** rather than
grouping cells into `display: contents` wrapper columns and using
`:nth-of-type` to assign grid-columns.

**Why:** Built ComparisonStrip.astro on 2026-05-17 with the wrapper-per-column
pattern (each `.col` was `display: contents`, then `.col:nth-of-type(2) > .cell
{ grid-column: 2; }`). At desktop it rendered as a vertical stack — model
columns piled below the label column. Cause: `display: contents` removes the
wrapper from layout, so the inner cells are direct grid children, and the
combination with explicit `grid-column: 1` on the label cells + `position:
sticky` on the same cells confused the auto-row-placement enough that rows
never aligned across columns.

Rewriting with a single flat grid where each cell carries its own
`style="grid-column: X; grid-row: Y;"` inline made it work first try.
Tradeoff: ~20% more verbose template, but bulletproof.

**How to apply:**
- For tables of 2+ columns × 5+ rows where you also need a sticky first
  column for mobile horizontal-scroll: use explicit placement per cell.
- For simple 2-up or 3-up display grids (no sticky, no horizontal scroll):
  the conventional grid-template-columns + row-auto approach is fine.
- The threshold: if the grid needs a column to behave structurally
  different (sticky, span, etc.), drop the column-wrapper abstraction.

See ComparisonStrip.astro for the working pattern.
