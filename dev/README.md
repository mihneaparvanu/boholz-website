# /dev — development-only content

Everything in this folder lives on the dev branch and is blocked from
reaching main by `.githooks/pre-push`.

## Rules

- One commit = one concern. Don't mix `/dev/` and `src/` changes.
- Use `dev:` prefix in commit messages for `/dev/`-only commits.
- To promote work from `/dev/` to production: move the file to `src/`, commit, cherry-pick to main.

## Subfolders

- `planning/` — launch checklists, content gaps, internal todos
- `sandbox/` — old layouts, component playgrounds, design references
- `wp-import/` — WordPress migration AI guide + useful URLs

## First-time setup (every cloner)

```bash
git config core.hooksPath .githooks
```

This enables the pre-push hook that blocks `/dev/**` from reaching main.
