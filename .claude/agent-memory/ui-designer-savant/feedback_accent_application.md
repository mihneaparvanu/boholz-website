---
name: feedback-accent-application
description: BoHolz accent rule — primary accent on larger elements, secondary on smaller elements, encoded as a real convention not a one-off
metadata:
  type: feedback
---

When applying accent color in BoHolz components, use **`--clr-accent-primary` on larger
elements** (large surfaces, inline-overview entries, page-level CTAs) and
**`--clr-accent-secondary` on smaller elements** (sticky-rail pills, badges, dense controls).

**Why:** Confirmed by user on 2026-05-17 (SectionNavigator design). The primary accent
(`#0a78c2`) has comfortable contrast against light surfaces at large sizes but is
borderline as a saturated fill with white text at small sizes. The secondary accent
(`#0F598A`, deeper blue) is darker, so white text on it stays AAA at 13px (verified
7.46:1). Primary on small fills would be borderline AA.

**How to apply:**
- A "primary CTA" button → primary accent.
- A small active-state pill, dense tab indicator, or accent dot → secondary accent.
- Verify contrast when in doubt — content-on-tint via `color-mix()` is also a way to
  use primary accent at a small visual size without contrast risk.
- This is a real encoded rule, not optional. Use both accents, both serving distinct
  roles — never substitute one for the other to "simplify".

See [[style-system-tokens]] for token values.
