---
name: count-up-composable
description: src/composables/useCountUp.ts — shared count-up primitive for scroll-triggered stat numbers (parses "100%" → 100 + "%", easeOutExpo, IO threshold 0.3, reduced-motion aware)
metadata:
  type: project
---

`src/composables/useCountUp.ts` exposes two functions:

- `parseCountTarget(raw: string)` → `{ target, suffix } | null`. Splits "100%" into 100 + "%", "18" into 18 + "". Non-numeric strings return null so callers render verbatim with no animation.
- `useCountUp(to: number, opts?)` → `{ targetEl, display }`. Attach `targetEl` to the element that should trigger the count; `display` is the integer to render each frame. Defaults: duration 1600ms, IO threshold 0.3. easeOutExpo curve. Fires once, observer disconnects after trigger. Respects `prefers-reduced-motion: reduce` (snaps to final value).

**Why:** the homepage TrustBadges section needed count-up, and other surfaces (landing-page stat strips, about-us proof bands) will want the same behavior. Centralised so the easing curve and reduced-motion handling stay consistent.

**How to apply:** any time a stat/proof point needs a scroll-triggered count, use this rather than writing fresh rAF code. If the value string has a non-trivial format (e.g. "1.2k", "€500", "5+"), extend `parseCountTarget()` here rather than parsing inline in the consumer.

Consumer reference: `src/features/Home/TrustBadges/TrustStatCard.vue` (feature-local replacement for the frozen `src/components/ui/StatBlock.vue` — see [[frozen_kit_override_pattern]] for the override rationale).
