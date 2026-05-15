<script setup lang="ts">
import { ref } from "vue";
import { Motion, AnimatePresence } from "motion-v";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder.vue";
import type { BuildingStage } from "./building-stages.types";

const props = defineProps<{
  stages: BuildingStage[];
}>();

const selected = ref<BuildingStage>(props.stages[0]);

// Strong, decelerating ease — quartic out. Matches the precision feel:
// fast settle, no overshoot, no bounce. Same family used in NavbarDrop.
const EASE = [0.22, 1, 0.36, 1];
</script>

<template>
  <div class="wrapper">
    <div class="slider">
      <div class="options" role="tablist">
        <h3
          v-for="stage in stages"
          :key="stage.slug"
          role="tab"
          :aria-selected="stage.slug === selected.slug"
          :class="{ active: stage.slug === selected.slug }"
          @click="selected = stage"
        >
          {{ stage.title }}
        </h3>
      </div>

      <div class="showcase">
        <figure class="cell hero">
          <div class="frame">
            <AnimatePresence mode="popLayout">
              <Motion
                v-if="selected?.imageURL"
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
            <ImagePlaceholder v-if="!selected?.imageURL" />
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
              {{ selected?.description }}
            </Motion>
          </AnimatePresence>
        </figure>

        <div class="cell">
          <ImagePlaceholder />
        </div>
        <div class="cell">
          <ImagePlaceholder />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.options {
  display: flex;
  gap: var(--spacing-3);
  justify-content: center;
}

.options h3 {
  cursor: pointer;
  font-size: var(--fs-h6);
  color: var(--clr-content-secondary);
  transition: color 200ms ease;
}

.options h3:hover,
.options h3.active {
  color: var(--clr-accent-secondary);
}

.showcase {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
}

.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 400px;
}

.cell > * {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero {
  grid-column: 1 / -1;
  flex-direction: column;
  gap: var(--spacing-3);
  margin: 0;
}

.hero .frame {
  position: relative;
  width: 100%;
  height: 70dvh;
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

@media (--below-desktop) {
  .showcase {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .frame img {
    will-change: auto;
  }
}
</style>
