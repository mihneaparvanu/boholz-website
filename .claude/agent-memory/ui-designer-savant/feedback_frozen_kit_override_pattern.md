---
name: frozen-kit-override-pattern
description: How to surgically override a frozen UI kit component's hardcoded icon/text size from a consumer without proposing a new prop
metadata:
  type: feedback
---

When a frozen `components/ui/*` component hardcodes a Lucide icon size via `:size="N"`, you can override it from a consumer using a scoped `:deep(.icon svg) { width: Xpx; height: Xpx; }` rule. Lucide's `:size` prop sets SVG `width`/`height` *attributes* — CSS *properties* win.

**Why:** First instinct when a kit feels too small is to propose adding an `iconSize` prop to the kit. That's over-engineering for a single consumer's mobile tweak. The `:deep` SVG override is one rule, no kit API churn, no breaking change for other consumers.

**How to apply:**
- Use this pattern when exactly *one* consumer needs a different size, especially at one breakpoint.
- When a *second* consumer needs a different size — that's the trigger to add a real prop to the kit. Don't accumulate `:deep` hacks; two consumers means the variation belongs in the API.
- Same pattern works for any frozen-kit primitive that hardcodes a Lucide `:size`. The `.icon` wrapper class is conventional across the kit (`IconList`, `StatBlock`, etc.).

**First applied:** 2026-05-17, Overview.vue mobile pillar icon bump (18→24px) against frozen IconList.vue. See [[style-system-tokens]] for the kit's icon-size conventions.
