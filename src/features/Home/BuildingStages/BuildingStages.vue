<script setup lang="ts">
import { ref } from "vue";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder.vue";
import type { BuildingStage } from "./building-stages.types";

const props = defineProps<{
  stages: BuildingStage[];
}>();

const selected = ref<BuildingStage>(props.stages[0]);
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
          <img
            v-if="selected?.imageURL"
            :src="selected.imageURL"
            :alt="selected.title"
          />
          <ImagePlaceholder v-else />
          <figcaption>{{ selected?.description }}</figcaption>
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
  gap: var(--spacing-6);
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
  transition: color 150ms ease;
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
  min-height: 220px;
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

.hero img {
  width: 100%;
  height: 320px;
  object-fit: cover;
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
</style>
