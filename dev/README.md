# /dev — development-only content

Everything in this folder lives on the dev branch and must stay off main.
Keep it out by hand: commit production work on `main` (or cherry-pick from
`dev`), and never merge `dev → main` wholesale — that would drag `dev/` over.

## Rules

- One commit = one concern. Don't mix `/dev/` and `src/` changes.
- Use `dev:` prefix in commit messages for `/dev/`-only commits.
- To promote work from `/dev/` to production: move the file to `src/`, commit, cherry-pick to main.

## Subfolders

- `planning/` — launch checklists, content gaps, internal todos
- `sandbox/` — old layouts, component playgrounds, design references
- `wp-import/` — WordPress migration AI guide + useful URLs
