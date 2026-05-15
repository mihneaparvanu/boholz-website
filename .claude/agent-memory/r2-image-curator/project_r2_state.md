---
name: R2 Bucket State and URL Convention
description: R2 bucket public URL, established key prefixes, and confirmed existing paths
type: project
---

R2 public base URL: `https://pub-47ece1c9a40d42ad8886561941b959b5.r2.dev`

**Why:** This is `PUBLIC_ASSETS_URL` from `.env`. `getMediaURL()` in `src/utils/media.ts` prepends it to all DB media paths and static asset paths.

**Established key prefix convention** (already live in R2):
- `images/pages/<page-slug>/<filename>` — static page-level content images (NOT `brand/` prefix)
- Confirmed live paths:
  - `images/pages/dein-zuhause/hero-bauen.jpg`
  - `images/pages/dein-zuhause/foerderung.jpg`
  - `images/pages/dein-zuhause/ausbaustufen.jpg`
  - `images/pages/unser-versprechen/hero-gruende.jpg`
  - `images/pages/unser-versprechen/qualitaet.jpg`
  - `images/pages/unser-versprechen/16-gruende.jpg`
  - `images/pages/unser-versprechen/nachhaltigkeit.jpg`
  - `images/pages/unser-versprechen/wandaufbau.jpg`
  - `images/pages/uber-uns/hero-werte.png`
  - `images/pages/uber-uns/value-1.jpg`
  - `images/pages/uber-uns/value-2.jpg`
  - `images/pages/uber-uns/value-3.jpg`

**R2 endpoint:** Account ID not present in `.env`. The dev credentials (`AWS_ACCESS_KEY_ID=c1fed6b...`) are for R2 but no `endpoint_url` is documented in `.env`. A `[cloudflare]` profile exists in `~/.aws/credentials` with a different key pair. Bucket name is unknown — must be provided by human or inferred from Cloudflare dashboard.

**How to apply:** When proposing new R2 keys for brand assets, continue using the `images/pages/<page-slug>/` pattern for page-scoped images. Use `brand/images/`, `brand/icons/`, `brand/certificates/` for shared brand library assets not tied to a specific page.
