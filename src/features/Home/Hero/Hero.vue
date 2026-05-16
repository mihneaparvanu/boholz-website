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
        <h1>Einfach einkommen.</h1>
        <h2>Ihr Zuhause, meisterhaft vollendet.</h2>
      </div>
      <div class="bottom">
        <div class="proof">
          <span>Bewährte Spitzenqualität</span>
          <div class="badges" aria-label="Qualitätssiegel">
            <svg class="badge" aria-hidden="true">
              <use href="#badge-iso" />
            </svg>
            <svg class="badge" aria-hidden="true">
              <use href="#badge-bdf" />
            </svg>
            <svg class="badge" aria-hidden="true">
              <use href="#badge-gdf" />
            </svg>
            <svg class="badge" aria-hidden="true">
              <use href="#badge-qdf" />
            </svg>
            <svg class="badge" aria-hidden="true">
              <use href="#badge-gdf-shield" />
            </svg>
            <svg class="badge" aria-hidden="true">
              <use href="#badge-ral" />
            </svg>
          </div>
        </div>
        <div class="action">
          <Button :href="ROUTES.house(slide.slug)">
            {{ slide.title }}
            <template #trailing> <ArrowRight /> </template>
          </Button>
          <ChevronDown
            class="scroll-cue"
            :size="16"
            :stroke-width="2"
            aria-hidden="true"
          />
        </div>
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
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100dvh;
  /* Pull the hero up under the sticky navbar; the absolute background
     image fills the whole box (incl. behind the navbar), while padding-top
     keeps the headline + CTA below the bar. */
  margin-top: calc(-1 * var(--navbar-height));
  padding-top: var(--navbar-height);
  color: var(--clr-pure-white);
}

.layout {
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: start;
  height: 100%;
  padding-block-end: var(--spacing-5);
}

.heading {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);

  h2 {
    font-size: var(--fs-h4);
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

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: end;
  width: 100%;

  .proof {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);

    span {
      text-transform: uppercase;
      font-size: var(--fs-small, 0.75rem);
      letter-spacing: 0.08em;
      opacity: 0.85;
    }
  }

  .badges {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    color: currentColor;
  }

  .badge {
    height: 28px;
    width: auto;
    aspect-ratio: var(--badge-aspect, auto);
    color: inherit;
    fill: currentColor;
  }
  .badge :where(use, path) {
    fill: currentColor;
  }

  /* per-symbol aspect ratios so the SVG reserves the right horizontal slot */
  .badge:nth-child(1) {
    aspect-ratio: 34.7 / 31.7;
  } /* iso       */
  .badge:nth-child(2) {
    aspect-ratio: 29.4 / 31.7;
  } /* bdf       */
  .badge:nth-child(3) {
    aspect-ratio: 43.9 / 31.7;
  } /* gdf       */
  .badge:nth-child(4) {
    aspect-ratio: 29.1 / 31.7;
  } /* qdf       */
  .badge:nth-child(5) {
    aspect-ratio: 23.9 / 31.7;
  } /* gdf-shield*/
  .badge:nth-child(6) {
    aspect-ratio: 44.85 / 31.7;
  } /* ral       */

  .action {
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: var(--spacing-2);
  }

  .action button {
    height: var(--control-height-md);
    padding-inline: var(--spacing-3);
    background-color: var(--clr-surface-primary);
    color: var(--clr-accent-secondary);
    border-radius: var(--radius-sm);
    font-weight: 500;
    transition:
      background 160ms ease,
      transform 160ms ease;
  }

  .action button:hover {
    background-color: var(--clr-surface-secondary);
  }

  /* Scroll-cue under the CTA — quiet, sub-CTA tier, hints at depth below
     the 100dvh photographic hero. */
  .scroll-cue {
    color: var(--clr-pure-white);
    opacity: 0.7;
    animation: scroll-cue-bounce 2400ms ease-in-out infinite;
  }
}

@keyframes scroll-cue-bounce {
  0%, 100% {
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
