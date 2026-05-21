---
name: wp-import-pipeline
description: End-to-end pipeline path from WP REST candidate list to staged WebPs and the upload script
metadata:
  type: reference
---

The Phase 2/3 pipeline files live at `design-audit/wp-inventory/`:

- `CANDIDATES.md` — user-annotated `[x]/[ ]` candidate list. Authoritative source-of-truth for selection.
- `MANIFEST.json` — Phase 2 deliverable. Every approved item: `source_url`, `r2_key`, `r2_url`, `classification`, `destination`, `filename`.
- `import-pipeline.mjs` — Phase 3a script. Downloads originals, transcodes to WebP via sharp (q=85 photos, q=92 diagrams), strips EXIF GPS, writes to `staging-webp/<r2_key>` and `staging/<original-name>`. Idempotent: skips if WebP exists.
- `staging-webp/` — local mirror of the future R2 layout. AWS sync targets the contents of this dir directly.
- `MANIFEST-RESULT.json` — output of pipeline run with sha256+bytes per file.
- `r2-upload.mjs` — Phase 3b. Manual SigV4 + fetch upload. Idempotent via HEAD + `x-amz-meta-sha256` custom metadata check. Requires `R2_ACCOUNT_ID`, `R2_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.
- `MANIFEST-UPLOADED.json` — written by `r2-upload.mjs` with final upload status + ETags.

To re-run end-to-end after candidate changes:
```
node design-audit/wp-inventory/import-pipeline.mjs
R2_ACCOUNT_ID=294d3965b7100cc2d62ccf8cd24c588a R2_BUCKET=boholz node design-audit/wp-inventory/r2-upload.mjs
```

Both scripts are idempotent — cached files skip download/upload work.
