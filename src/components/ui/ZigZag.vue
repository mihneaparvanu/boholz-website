<script setup lang="ts">
/**
 * Two-column "zig-zag" section: copy (optional eyebrow, heading, free body)
 * next to a media slot. Alternate per row in a stack by flipping `mediaSide`.
 *
 *   mediaSide="end"   → copy left,  media right (default)
 *   mediaSide="start" → media left, copy right
 *
 * SLOTS — back-compat is preserved. Old call sites passing `copy`, `actions`
 * and the default `media` slot continue to work. New optional slots:
 *
 *   #eyebrow  → small-caps label above the heading (use kit <Eyebrow />)
 *   #heading  → the H2/H3 — keeps the heading shape with the copy column
 *   #copy     → body paragraphs / lists / lede (existing)
 *   #actions  → CTAs, callouts (existing)
 *   #media    → the right (or left) column — image, video, embed (existing)
 *
 * PROPS
 *   mediaSide      "start" | "end"                — which side media sits on at split
 *   split          "tablet" | "desktop"          — when to flip from stack to 2-col
 *   gap            "default" | "wide"            — column gap at the split point
 *   dense          boolean                        — tighter vertical rhythm; for
 *                                                   stacks of ZigZags
 *   mobileMediaFirst  boolean                     — on stacked layouts, place media
 *                                                   above copy (default copy-first)
 *
 * Mobile collapses to a single column. The file is intentionally short —
 * one component, two breakpoints, no abstractions.
 */
withDefaults(
  defineProps<{
    mediaSide?: "start" | "end";
    split?: "tablet" | "desktop";
    gap?: "default" | "wide";
    dense?: boolean;
    mobileMediaFirst?: boolean;
  }>(),
  {
    mediaSide: "end",
    split: "desktop",
    gap: "default",
    dense: false,
    mobileMediaFirst: false,
  },
);
</script>

<template>
  <section
    class="zigzag"
    :data-media-side="mediaSide"
    :data-split="split"
    :data-gap="gap"
    :data-dense="dense ? 'true' : null"
    :data-mobile-media-first="mobileMediaFirst ? 'true' : null"
  >
    <div class="copy">
      <slot name="eyebrow" />
      <slot name="heading" />
      <slot name="copy" />
      <slot name="actions" />
    </div>
    <div class="media">
      <slot name="media" />
    </div>
  </section>
</template>

<style scoped>
.zigzag {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
  align-items: center;
}

/* Tighter rhythm for stacked-ZigZag pages — Wave 2 polish convention. */
.zigzag[data-dense="true"] {
  gap: var(--spacing-3);
}

/* Mobile media-first: explicit order on the stacked layout. */
.zigzag[data-mobile-media-first="true"] > .copy {
  order: 2;
}
.zigzag[data-mobile-media-first="true"] > .media {
  order: 1;
}

@media (--from-tablet) {
  .zigzag[data-split="tablet"] {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--spacing-5);
  }
  .zigzag[data-split="tablet"][data-gap="wide"] {
    gap: var(--spacing-6);
  }
  .zigzag[data-split="tablet"][data-dense="true"] {
    gap: var(--spacing-4);
  }
  .zigzag[data-split="tablet"] > .copy,
  .zigzag[data-split="tablet"] > .media {
    grid-row: 1;
    order: 0;
  }
  .zigzag[data-split="tablet"][data-media-side="end"] .copy { grid-column: 1; }
  .zigzag[data-split="tablet"][data-media-side="end"] .media { grid-column: 2; }
  .zigzag[data-split="tablet"][data-media-side="start"] .copy { grid-column: 2; }
  .zigzag[data-split="tablet"][data-media-side="start"] .media { grid-column: 1; }
}

@media (--from-desktop) {
  .zigzag[data-split="desktop"] {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--spacing-5);
  }
  .zigzag[data-split="desktop"][data-gap="wide"] {
    gap: var(--spacing-6);
  }
  .zigzag[data-split="desktop"][data-dense="true"] {
    gap: var(--spacing-4);
  }
  .zigzag[data-split="desktop"] > .copy,
  .zigzag[data-split="desktop"] > .media {
    grid-row: 1;
    order: 0;
  }
  .zigzag[data-split="desktop"][data-media-side="end"] .copy { grid-column: 1; }
  .zigzag[data-split="desktop"][data-media-side="end"] .media { grid-column: 2; }
  .zigzag[data-split="desktop"][data-media-side="start"] .copy { grid-column: 2; }
  .zigzag[data-split="desktop"][data-media-side="start"] .media { grid-column: 1; }
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  min-width: 0;
}

.zigzag[data-dense="true"] .copy {
  gap: var(--spacing-2);
}

.media {
  min-width: 0;
}
</style>
