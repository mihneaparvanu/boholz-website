---
name: feedback-sandbox-convention
description: How sandbox pages bypass Layout.astro to avoid DB calls and what they import
type: feedback
---

**Rule:** Sandbox pages under `src/pages/sandbox/` MUST NOT import `Layout.astro` — the layout fetches `getCategories()` and `getShowhouses()` from the DB on every render, which is overkill for component demos and slows the dev loop.

**Why:** Sandbox pages exist to showcase visual primitives in isolation, with no nav, no footer, no real data. Pulling in Layout would pollute the rendering and require a live DB.

**How to apply:** New sandbox pages should:
1. Skip `Layout.astro`
2. Import the three style files directly at the top of the frontmatter:
   ```ts
   import "@/style/reset.css";
   import "@/style/design-system.css";
   import "@/style/wrapper.css";
   ```
3. Render the full `<html><head><body>` themselves
4. Wrap content in `<main class="wrapper">` to participate in the wrapper grid
5. Include a `.faux-nav` header so sticky/scroll behavior reads correctly
6. Use German placeholder content matching the brand (Premium-Fertighäuser, KfW 40, energieeffizient, etc.)

Pattern is established in `src/pages/sandbox/components.astro`.
