<script setup lang="ts">
import { ref, computed } from "vue";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder.vue";
import type { BuildingStage } from "./home.types";

const props = defineProps<{
  stages: BuildingStage[];
}>();

const selectedSlug = ref(props.stages.at(-1)?.slug ?? "");

const selected = computed(
  () =>
    props.stages.find((s) => s.slug === selectedSlug.value) ?? props.stages[0],
);
</script>

<template>
  <div class="wrapper">
    <div class="slider">
      <div class="options" role="tablist">
        <h3
          v-for="stage in stages"
          :key="stage.slug"
          role="tab"
          :aria-selected="stage.slug === selectedSlug"
          :class="{ active: stage.slug === selectedSlug }"
          @click="selectedSlug = stage.slug"
        >
          {{ stage.title }}
        </h3>
      </div>

      <div class="hero-showcase">
        <img
          v-if="selected?.imageURL"
          :src="selected.imageURL"
          :alt="selected.title"
        />
        <ImagePlaceholder v-else />
        <p>{{ selected?.description }}</p>
      </div>

      <div class="second-showcase">
        <ImagePlaceholder />
        <ImagePlaceholder />
      </div>
    </div>
  </div>
</template>

<style scoped>
.options {
  display: flex;
  gap: var(--spacing-3);
}

.options h3 {
  cursor: pointer;
  color: var(--clr-content-secondary);
  transition: color 150ms ease;
}

.options h3:hover {
  color: var(--clr-content-primary);
}

.options h3.active {
  color: var(--clr-accent);
}
</style>
