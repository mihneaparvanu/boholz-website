<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";
import { ref, computed } from "vue";
import type { HeroSlide } from "./hero.types";
import Button from "@/ui/primitives/Button.vue";
import { ArrowRight, ChevronDown } from "lucide-vue-next";
import { ROUTES } from "@/features/navigation/routes";
import { getMediaURL } from "@/lib/media";

const heroIMG = getMediaURL("/images/brand/hero.webp");

const props = defineProps<{
  slides: HeroSlide[];
}>();
</script>

<template>
  <section class="hero subgrid">
    <div class="layout">
      <div class="heading">
        <h1>Fertighäuser in Zimmermannsqualität. Für Generationen.</h1>
        <p>
          Unsere barrierefreien Fertighäuser aus Holz vereinen höchste
          Energieeffizienz mit meisterhaftem Handwerk. So sparen Sie
          Energiekosten und gewinnen wertvolle Lebensqualität für die ganze
          Familie.
        </p>
      </div>
      <div class="action">
        <Button :href="ROUTES.wohnen.uebersicht">
          Häuser entdecken
          <template #trailing> <ArrowRight /> </template>
        </Button>
      </div>
    </div>
    <img
      :src="heroIMG"
      alt="barrierefreien Fertighäuser"
      width="1200"
      height="800"
      class="background full-width"
    />
    <div class="tint-overlay full-width"></div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 90dvh;
  /* Pull the hero up under the sticky navbar; the absolute background
     image fills the whole box (incl. behind the navbar), while padding-top
     keeps the headline + CTA below the bar. */
  margin-top: calc(-1 * var(--navbar-height));
  padding-top: var(--navbar-height);
  color: var(--clr-pure-white);

  /* Landscape phones (any width, max-height 500px) — 90dvh becomes ~350px
     on a 390-tall viewport, which swallows the whole screen and pushes
     the CTA below the fold. Cap at a fixed range using `svh` (smallest
     viewport height — stable when the URL bar toggles, which matters
     much more in landscape than portrait). Aim: headline visible AND
     CTA visible without scrolling. */
  @media (--short) {
    height: clamp(320px, 78svh, 440px);
  }

  @media (--from-desktop) {
    height: 100dvh;
  }
}

.tint-overlay {
  position: absolute;
  bottom: 0;
  height: 40%;
  left: 0;
  right: 0;
  z-index: -1;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 10%,
    rgba(0, 0, 0, 0) 100%
  );

  @media (--from-desktop) {
    height: 15%;
  }
}

.layout {
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: start;
  height: 100%;
  /* Cap the layout column so the full-width CTA below has a sane visual
     width and doesn't read as a banner spanning the entire hero. The
     button takes 100% of THIS column, not the full hero. */
  max-width: 45rem;
  gap: var(--spacing-4);
  padding-block-end: var(--spacing-5);

  /* Landscape phones — trim vertical rhythm so headline + lede + CTA all
     fit inside the clamped hero height without the CTA hugging the
     bottom edge. */
  @media (--short) {
    gap: var(--spacing-2);
    padding-block-end: var(--spacing-3);
  }
}

.heading {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  width: 100%;

  h1 {
    font-size: var(--fs-h2);
    font-weight: var(--font-weight-medium);
  }

  p {
    font-size: var(--fs-body-lg);
    font-weight: var(--font-weight-regular);
    color: var(--clr-surface-secondary);
    opacity: 0.9;
  }
}

/* Two stacked .background IMGs persist for the page's lifetime; the
   one with [data-active] is opaque, the other is invisible. Swapping
   the attribute drives the crossfade purely via CSS — no element
   replacement, no Transition wrapper, no orphaned DOM nodes. */
.background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-position: 70%;
  object-fit: cover;
  z-index: -1;
  transition: opacity 800ms ease;
}

.action {
  display: flex;
  width: 100%;
  /* Truncate long slide titles inside the label rather than wrapping —
     a wrap would re-stack the column and visibly shift everything above
     when the auto-rotate fires every 5s. */
  &:deep(.btn-label) {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
  /* Full-width inside .layout's capped column at every breakpoint. The
     parent .layout max-width caps the visual width so the button reads
     as a CTA, not a banner. Label nowrap+ellipsis above handles any
     overflow from variable slide-title length. */
  &:deep(.btn) {
    width: 100%;
  }
  @media (--from-desktop) {
    justify-content: start;
  }
}

@keyframes scroll-cue-bounce {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: translateY(3px);
    opacity: 0.95;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-cue {
    animation: none;
  }
}

/* Mobile: stack proof above action so the badge row stops colliding with
   the CTA at 390px. Cap badges at 4 — the brand carries with iso/bdf/gdf/ral. */
@media (--mobile) {
  .bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }

  .bottom .action {
    align-items: flex-start;
  }

  .bottom .badges :nth-child(n + 5) {
    display: none;
  }
}
</style>
