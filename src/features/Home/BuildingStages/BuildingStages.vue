<script setup lang="ts">
import { computed, ref } from "vue";
import { Motion, AnimatePresence } from "motion-v";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "reka-ui";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder.vue";
import VideoPlaceholder from "@/components/ui/VideoPlaceholder.vue";
import type { BuildingStage } from "./building-stages.types";

const props = defineProps<{
  stages: BuildingStage[];
}>();

const activeSlug = ref<string>(props.stages[0].slug);
const selected = computed(
  () => props.stages.find((s) => s.slug === activeSlug.value) ?? props.stages[0],
);

// Strong, decelerating ease — quartic out. Matches the precision feel:
// fast settle, no overshoot, no bounce.
const EASE = [0.22, 1, 0.36, 1];
</script>

<template>
  <div class="wrapper">
    <TabsRoot v-model="activeSlug" :default-value="props.stages[0].slug">
      <TabsList class="options" aria-label="Ausbaustufen">
        <TabsTrigger
          v-for="stage in stages"
          :key="stage.slug"
          :value="stage.slug"
          class="option"
        >
          {{ stage.title }}
        </TabsTrigger>
      </TabsList>

      <!-- One content panel per stage — Reka manages focus, aria-controls,
           keyboard navigation. Imagery is identical-shape across stages so
           we host the animated swap inside a single panel that reads the
           computed `selected`. -->
      <TabsContent
        v-for="stage in stages"
        :key="stage.slug"
        :value="stage.slug"
        :force-mount="true"
        as-child
      >
        <div
          class="panel"
          :hidden="stage.slug !== activeSlug"
          :aria-hidden="stage.slug !== activeSlug"
        >
          <!-- Only render the active panel's media — keeps motion clean. -->
          <template v-if="stage.slug === activeSlug">
            <figure class="hero">
              <div class="frame">
                <AnimatePresence mode="popLayout">
                  <Motion
                    v-if="selected.imageURL"
                    :key="selected.slug"
                    as="img"
                    :src="selected.imageURL"
                    :alt="selected.title"
                    :initial="{ opacity: 0 }"
                    :animate="{ opacity: 1 }"
                    :exit="{ opacity: 0 }"
                    :transition="{ duration: 0.65, ease: EASE }"
                  />
                </AnimatePresence>
                <ImagePlaceholder v-if="!selected.imageURL" />
              </div>

              <AnimatePresence mode="wait">
                <Motion
                  :key="selected.slug + '-caption'"
                  as="figcaption"
                  :initial="{ opacity: 0, y: 6 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :exit="{ opacity: 0, y: -4 }"
                  :transition="{ duration: 0.45, ease: EASE, delay: 0.08 }"
                >
                  {{ selected.description }}
                </Motion>
              </AnimatePresence>
            </figure>

            <!-- Desktop-only support media: one VideoPlaceholder for the
                 atmospheric factory loop. Hidden on mobile — empty cells
                 became dead UI in the legacy layout. -->
            <div class="support">
              <VideoPlaceholder
                slot-id="home-factory-loop"
                aspect-ratio="16/9"
                label="Werksrundgang"
                caption="Bald verfügbar — Atmosphäre aus der Vorfertigung."
              />
            </div>
          </template>
        </div>
      </TabsContent>
    </TabsRoot>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
}

/* ── Tabs ────────────────────────────────────────── */
.options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  justify-content: center;
  margin-block-end: var(--spacing-4);
}

.option {
  /* Reka renders TabsTrigger as a <button> by default — reset native chrome. */
  background: transparent;
  border: 0;
  padding-block: var(--spacing-1);
  padding-inline: var(--spacing-2);
  /* Tap-target floor for mobile — four trigger rows can't fall below 44px. */
  min-height: 44px;
  font: inherit;
  font-size: var(--fs-h6);
  font-weight: var(--font-weight-regular);
  color: var(--clr-content-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition:
    color 200ms ease,
    background-color 160ms ease;
}

.option:hover {
  color: var(--clr-accent-secondary);
}

.option[data-state="active"] {
  /* Secondary accent on this small-surface element — primary's mid-tone
     loses contrast against off-white at body-h6 size. */
  color: var(--clr-accent-secondary);
}

.option:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

@media (--mobile) {
  .options {
    gap: var(--spacing-2);
  }
}

/* ── Panel ───────────────────────────────────────── */
.panel {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
}

@media (--from-desktop) {
  .panel {
    grid-template-columns: repeat(2, 1fr);
    align-items: start;
  }
}

.hero {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin: 0;
  min-width: 0;
}

@media (--from-desktop) {
  .hero {
    /* Lead column on desktop spans both columns; support sits to the side. */
    grid-column: 1 / -1;
  }
}

.frame {
  position: relative;
  width: 100%;
  height: 60dvh;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--clr-surface-secondary);
}

.frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform, opacity;
}

.hero figcaption {
  color: var(--clr-content-secondary);
  max-width: 60ch;
}

/* Support media (VideoPlaceholder) — desktop only. The two empty
   ImagePlaceholder cells the legacy layout shipped were dead UI on
   mobile; this column simply hides. */
.support {
  display: none;
}

@media (--from-desktop) {
  .support {
    display: block;
  }
}

@media (--below-desktop) {
  .frame {
    height: 60dvh;
  }
}

@media (--mobile) {
  /* Cap mobile hero at 50dvh — was 75dvh, ate most of the viewport. */
  .frame {
    height: 50dvh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .frame img {
    will-change: auto;
  }
}
</style>
