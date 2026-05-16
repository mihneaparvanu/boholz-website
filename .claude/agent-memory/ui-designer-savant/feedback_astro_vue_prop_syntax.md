---
name: feedback-astro-vue-prop-syntax
description: Astro→Vue island prop binding uses Astro's expression syntax (prop={value}), never Vue's colon shorthand (:prop="value"). Caught by tsc, not visual.
metadata:
  type: feedback
---

When mounting a `.vue` component inside a `.astro` page, **always use Astro's
JSX-style expression binding** for non-string props — `prop={value}` — never
Vue's `:prop="value"` colon shorthand. Astro's type system treats `:step="1"`
as a string-valued kebab attribute called `:step`, so the actual required
prop (`step: number`) is reported missing and the value `"1"` doesn't reach
Vue as a number anyway.

**Why:** `astro check` on `dein-zuhause.astro` (2026-05-17) produced 5 type
errors all of the same shape:
> `Property 'step' is missing in type '{ ":step": string; ... }'`
> `Property 'items' is missing in type '{ ":items": IconListItem[]; ... }'`
The fix in every case was the same: `:step="1"` → `step={1}`,
`:items={array}` → `items={array}`, `:columns={2}` → `columns={2}`.

The `:` prefix is correct in `.vue` templates only. The sandbox file
`src/pages/sandbox/components.astro` also has this bug on `VideoPlaceholder`
(`slot-id`, `aspect-ratio` written kebab; Vue prop is `slotId`). Flagged but
not fixed in dein-zuhause session — out of scope.

**How to apply:** When writing or reviewing an `.astro` page that mounts a
Vue island:
- Boolean / number / object / array props → `prop={expr}` (curly braces).
- String props → `prop="literal"` (quotes; same as HTML attributes).
- Never `:prop="..."` and never kebab-case for camelCase Vue props
  (Astro doesn't auto-kebab → camel across the boundary the way Vue does).
- `client:load` / `client:visible` directives are Astro syntax and remain
  as-is.

See [[style-system-tokens]] §"Cross-island prop pattern" for the related
hydration-mismatch pitfall when passing component references as props.
