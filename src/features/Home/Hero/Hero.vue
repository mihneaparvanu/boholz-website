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

// View-transition name for the morph into /haus/[slug].
// Bound via the current slide's slug — slugs are globally unique, so the
// leaving image (kept briefly in the DOM by <Transition name="crossfade">)
// and the entering image always carry *different* names. No collision is
// possible, and Astro's ClientRouter captures the entering image as the
// shared element when the CTA is clicked.
const heroImgName = computed(() => `hero-img-${slide.value.slug}`);
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
        :style="{ viewTransitionName: heroImgName }"
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
  width: 100%;
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
