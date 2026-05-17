---
name: user-decisions-import-style
description: User's confirmed preferences for how WP content maps onto the new site
metadata:
  type: feedback
---

Confirmed user preferences during the May 2026 boholz-haus.de migration:

1. **News template-duplicates are KEPT as distinct events.** Two pairs of posts share identical body copy but represent distinct events (Werksführung 13.06 + 02.05, Richtfest Münsingen + Steinheim). User explicitly said "keep both as is for both."
   - **Why:** Each post represents a real, future-dated event with a unique location/date even though the marketing copy was templated.
   - **How to apply:** When the WP REST finds identical body copy across posts, do NOT auto-dedupe. Surface as a question, then default to keeping all unless user says otherwise.

2. **Bauphasen content feeds BOTH homepage AND /your-house** — homepage uses compact 3-step strip (just the 3 phase teasers), /your-house uses full hero + 3 phases + copy. Same 4 R2 assets, downstream picks subset.
   - **Why:** "I want this on the homepage and we can add it on your house page too."
   - **How to apply:** When a single WP source page feeds multiple destinations with different shapes, upload to ONE R2 path set and let the downstream designer agent pick which subset to render per destination.

3. **Specs (fertighaus-bauen) gets NO imagery imported.** Pure text-only glossary; downstream uses icons.
   - **Why:** User said "b we use icons for now."
   - **How to apply:** When a source page is text-heavy with no meaningful imagery, do not import the WP-template thumbnails. Note in MANIFEST that the destination is icon-based.

4. **Low resolution is acceptable for some pillar images.** Specifically `sommer.jpg` and `winter.jpg` on /advantage/holzfaserdaemmung are kept at 800x546 even though it's <1200px on shortest side.
   - **Why:** "no need to refetch they are terreible res" — user accepts the visual quality trade-off because these are diagram-like illustrations, not photography.
   - **How to apply:** The 1200px min-shortest-side rule applies to photography (hero/lifestyle/interior/exterior) but NOT to diagrams/illustrations the user explicitly accepts at lower res. Surface the exception in MANIFEST `exception_low_res_accepted`.

5. **YouTube embeds get poster frames extracted from img.youtube.com.** For `youtube.com/embed/<id>` iframes, fetch `https://img.youtube.com/vi/<id>/maxresdefault.jpg` and upload as `video-poster.webp` next to where the iframe will render.
   - **Why:** User wants the iframe lazy-loaded behind a click-to-play poster to avoid YouTube tracking on page load.
   - **How to apply:** Whenever importing a `video-embed`, also add a `video-poster` asset to MANIFEST pointing at the maxresdefault thumbnail (with hqdefault fallback).
