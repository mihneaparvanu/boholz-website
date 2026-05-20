# /dev/wp-import — WordPress migration reference

Long-term reference material from the one-shot WordPress → BoHolz site
migration. Source data and pipeline artifacts were deleted after the
migration completed; what remains is the AI-agent migration guide.

## Files

- `CANDIDATES.md` — phase-by-phase content inventory + image checksums
  from `boholz-haus.de`. Useful as a guide for future agents importing
  or auditing content. Contains:
  - URL patterns of the live WP site
  - Image placement logic (exterior / interior / floorplan classification)
  - Decision tree for news dedup and showhouse content
  - DB-pivot conventions (`location_media`, `floor_media`, `news_media`)

## Useful WP URLs (live source)

- Site: https://boholz-haus.de/
- REST API: https://boholz-haus.de/wp-json/wp/v2/
- Pages list: https://boholz-haus.de/wp-json/wp/v2/pages
- Posts list: https://boholz-haus.de/wp-json/wp/v2/posts
- Media: https://boholz-haus.de/wp-json/wp/v2/media
