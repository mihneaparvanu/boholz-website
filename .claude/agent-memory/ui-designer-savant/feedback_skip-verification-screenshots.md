---
name: feedback-skip-verification-screenshots
description: User prefers to skip Playwright/screenshot verification on this project — it's mostly wasted time given the workflow
metadata:
  type: feedback
---

When building components or pages for BoHolz, **skip the Playwright render →
screenshot → save → log loop** unless the user explicitly asks for it.

**Why:** the user has stated this is mostly wasted time on this project. Their
workflow is to review the rendered result themselves in the running dev server
(or on staging) when they're ready to look — not to scroll through agent-saved
PNGs after the fact. Screenshots also balloon the EXECUTION-LOG with paths the
user never opens. Additionally, the local dev environment frequently can't
render full pages (e.g. the homepage's `getCategories()` Drizzle loader fails
without DB env vars on some machines), so the screenshot step often blocks or
captures errors rather than the work.

**How to apply:**
- Build components, ship them. Don't run Playwright unless the user requests it.
- a11y-contrast-auditor is still valuable when color decisions are involved —
  it can audit the running dev server without saving comparative PNGs. Keep it.
- Continue to verify behaviour in source review (`useReducedMotion()` paths,
  ARIA, focus order) — that's code review, not screenshot work, and it's
  cheap to do thoroughly.
- If a layout decision genuinely needs a render to evaluate (e.g. "does this
  composition feel right on mobile?"), ask the user before reaching for
  Playwright rather than doing it speculatively.
- Save tokens, file paths, contrast numbers in the log. Skip the
  "screenshots saved at..." section unless screenshots were actually taken.

This applies project-wide. See [[coordination-with-pages-team]] for related
process rules.
