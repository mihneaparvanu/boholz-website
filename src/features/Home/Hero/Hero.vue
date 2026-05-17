<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";
import { ref, computed } from "vue";
import type { HeroSlide } from "./hero.types";
import Button from "@/components/ui/Button.vue";
import { ArrowRight, ChevronDown } from "lucide-vue-next";
import { ROUTES } from "@/utils/routes";

const props = defineProps<{
  slides: HeroSlide[];
}>();

const index = ref(0);

useIntervalFn(() => {
  index.value = (index.value + 1) % props.slides.length;
}, 5000);

const slide = computed(() => props.slides[index.value]);
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
        <Button :href="ROUTES.house(slide.slug)">
          {{ slide.title }}
          <template #trailing> <ArrowRight /> </template>
        </Button>
      </div>
    </div>
    <Transition name="crossfade">
      <img
        :key="slide.id"
        :src="slide.heroImgURL ?? undefined"
        :alt="slide.title"
        width="1200"
        height="800"
        class="background full-width"
      />
    </Transition>
    <div class="tint-overlay full-width"></div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 75dvh;
  /* Pull the hero up under the sticky navbar; the absolute background
     image fills the whole box (incl. behind the navbar), while padding-top
     keeps the headline + CTA below the bar. */
  margin-top: calc(-1 * var(--navbar-height));
  padding-top: var(--navbar-height);
  color: var(--clr-pure-white);

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
  gap: var(--spacing-4);
  padding-block-end: var(--spacing-5);
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

.background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: var(--clr-content-secondary);
  z-index: -1;
}

/* <Transition name="crossfade"> hooks */
.crossfade-enter-active,
.crossfade-leave-active {
  transition: opacity 800ms ease;
}
.crossfade-enter-from,
.crossfade-leave-to {
  opacity: 0;
}
/* keep both images stacked during the swap */
.crossfade-leave-active {
  position: absolute;
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
  &:deep(.btn) {
    /* Lock the rendered height so a one-line label of any length keeps
       a stable vertical box across the slide rotation. Matches the md
       control height so the resting shape doesn't change visually. */
    min-height: var(--control-height-md);
    /* Desktop keeps the prior full-width button (visually a deliberate
       block CTA in the lower-left of the hero). */
    width: 100%;
  }
  /* Below desktop: constrain the button so it sizes to its content with
     a thumb-friendly floor instead of stretching edge-to-edge (which
     read more like a banner than a CTA). Crossfades between slides with
     different title lengths now grow/shrink the *button*, not the
     whole layout column. */
  @media (--below-desktop) {
    &:deep(.btn) {
      width: auto;
      min-width: clamp(220px, 60vw, 360px);
    }
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
