---
name: feedback-lucide-conventions
description: Stroke-width and size conventions for Lucide icons across the BoHolz codebase
type: feedback
---

**Lucide stroke-width tiers in this project:**
- `stroke-width="1.25"` — large decorative glyphs inside placeholder/empty states (VideoPlaceholder)
- `stroke-width="1.5"` — IconButton internals (`stroke-width: 1.5` set via CSS on `:deep(svg)`)
- `stroke-width="1.75"` — content-tier icons inside list items, stat blocks, step cards
- `stroke-width="2"` — UI affordances (close, check, plus, chevrons, callouts)

**Sizes:**
- 14 — small affordance (SectionNavigator chevron)
- 16 — compact UI (close, check)
- 18 — list/content icons, accordion chevrons
- Larger glyphs via `--sz-*` em-based tokens

**Why:** Mixing stroke weights without a rule looks sloppy — but BoHolz deliberately tiers weight to content vs UI affordances. Content reads softer (1.75), UI reads more authoritative (2). Match the tier of the surrounding usage when picking a weight.

**How to apply:** Default to `:stroke-width="1.75"` for any icon embedded inside body copy or a content tile (eg a spec-card thumbnail label). Use `2` only for explicit interactive affordances (CTA trailing-arrow icons, accordion plus/minus, close X).
