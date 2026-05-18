<script setup lang="ts">
/**
 * GermanyFlag — minimal inline SVG. 3 stripes (black / red / gold), 5:3 ratio.
 *
 * Height-driven: width is computed from the aspect-ratio so a single
 * `height` value (or CSS sizing on the root) gives the correct mark.
 * No external fetch, no <use href>, no gradients — keep payload trivial.
 */
withDefaults(
  defineProps<{
    /** Visual height in px. Width is derived from the 5:3 flag ratio. */
    height?: number;
  }>(),
  { height: 16 },
);
</script>

<template>
  <svg
    class="flag"
    :height="height"
    viewBox="0 0 5 3"
    role="img"
    aria-label="Deutschland"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect x="0" y="0" width="5" height="1" fill="#000" />
    <rect x="0" y="1" width="5" height="1" fill="#DD0000" />
    <rect x="0" y="2" width="5" height="1" fill="#FFCE00" />
  </svg>
</template>

<style scoped>
.flag {
  display: block;
  /* Width tracks height via the viewBox; height is the prop, so no auto-grow. */
  width: auto;
  /* Hairline edge so the gold band doesn't dissolve on light surfaces. */
  border: 1px solid color-mix(in srgb, var(--clr-content-primary) 10%, transparent);
  border-radius: 1px;
}
</style>
