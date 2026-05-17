# Project Design Work State

> Read this file first before doing any design work.

## Objective
Coordinate design work across multiple agents without overlap, force explicit user decisions at major milestones, and keep one shared source of truth for status.

## Team Orchestration

### Agent roster
- **A1 — Design System Agent**
  - Owns tokens, typography scale, spacing scale, color usage in `src/style/design-system.css`.
- **A2 — Navigation & Header Agent**
  - Owns navbar visual behavior and transitions in `src/layouts/Navbar/**`.
- **A3 — Page Layout Agent**
  - Owns shared page structure and section rhythm (`src/layouts/**`, `src/pages/**`).
- **A4 — Feature Visual Consistency Agent**
  - Owns feature-level visual consistency in `src/features/**`.
- **A5 — Content & Editorial Agent**
  - Owns heading/line-break style rules and content presentation.
- **A6 — QA & Conflict Guard Agent**
  - Verifies no style/UX conflicts across all streams before sign-off.

### Collaboration protocol (must follow)
1. Agent takes the next unchecked task from the checklist below.
2. Agent updates only files in its ownership scope.
3. Agent marks task done and links touched files.
4. If task is a **Decision Gate**, stop and ask user before proceeding.
5. A6 validates cross-stream conflicts before the next phase starts.

## Decision Gates (user input required)

- [x] **DG-1 Brand direction lock:** `premium-contrast`.
- [x] **DG-2 Navbar behavior:** `slide+fade-200ms`.
- [x] **DG-3 Heading treatment:** `single-line`.
- [x] **DG-4 Image treatment:** `natural`.
- [ ] **DG-5 Final QA sign-off:** approve full-page visual review.

## Master Design Checklist

### Phase 0 — Setup
- [x] Create shared design work-state file and orchestration rules. _(Done: this file)_
- [ ] Confirm scope of pages/components included in this design cycle.

### Phase 1 — Foundation (A1)
- [ ] Audit and normalize token usage in `src/style/design-system.css` and shared CSS files.
- [ ] Propose token deltas (if needed) and pause for **DG-1**.
- [ ] Apply approved token updates.

### Phase 2 — Navigation (A2)
- [ ] Audit navbar transition/glitch behavior in `src/layouts/Navbar/**`.
- [ ] Present 2–3 transition options and pause for **DG-2**.
- [ ] Implement approved navbar behavior.

### Phase 3 — Page-level rhythm (A3)
- [ ] Audit spacing, section rhythm, and wrappers across main pages.
- [ ] Identify inconsistent heading blocks and pause for **DG-3**.
- [ ] Apply approved heading/layout updates.

### Phase 4 — Feature consistency (A4 + A5)
- [ ] Align cards, buttons, image blocks, and text hierarchy across `src/features/**`.
- [ ] Propose media/image treatment and pause for **DG-4**.
- [ ] Implement approved consistency updates.

### Phase 5 — QA & sign-off (A6)
- [ ] Run visual conflict pass across navbar/pages/features.
- [ ] Verify no token regressions, no spacing drift, no transition conflicts.
- [ ] Prepare final review package and pause for **DG-5**.

## Conflict Prevention Matrix

| Area | Single Owner | Blocking Dependencies | Conflict Rule |
|---|---|---|---|
| Tokens & typography | A1 | None | Nobody else edits design tokens in same step |
| Navbar transitions | A2 | DG-2 | A2 changes transitions only after DG-2 |
| Page spacing rhythm | A3 | DG-1 | A3 must consume A1 token outputs only |
| Feature visuals | A4 | DG-1, DG-3, DG-4 | A4 cannot override global tokens/layout primitives |
| Content presentation | A5 | DG-3 | A5 edits copy/line-break treatment, not component internals |
| Final integration | A6 | All above | A6 blocks merge if overlap/conflicts are unresolved |

## Decision Log
- 2026-05-17: DG-1 approved — `premium-contrast`.
- 2026-05-17: DG-2 approved — `slide+fade-200ms`.
- 2026-05-17: DG-3 approved — `single-line`.
- 2026-05-17: DG-4 approved — `natural`.

## Change Log
- 2026-05-16: Initialized design orchestration plan and task checklist.
- 2026-05-17: Recorded DG-1..DG-4 decisions from stakeholder feedback.
