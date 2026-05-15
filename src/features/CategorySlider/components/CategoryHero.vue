<script setup lang="ts">
import { computed } from "vue";

import type { HouseCategory } from "@/types/models";

const props = defineProps<{
  category: HouseCategory;
}>();

const heroMedia = computed(() => {
  return props.category.media.find((m) => m.isHero);
});

const imageURL = computed(() => {
  return heroMedia.value?.media.path ?? "";
});
</script>

<template>
  <div class="content-wrapper">
    <div class="text-content">
      <h3>{{ category.name }}</h3>
      <p>{{ category.description }}</p>
    </div>
    <img
      :src="imageURL"
      :alt="category.name"
      :width="heroMedia?.media.width"
      :height="heroMedia?.media.height"
      class="model-image"
    />
  </div>
</template>

<style scoped>
.content-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);

  .text-content {
    position: absolute;
    margin-block: var(--spacing-4) 0;
    color: var(--clr-surface-primary);
    text-align: center;
    max-width: 600px;

    @media (--mobile) {
      max-width: 100%;
      padding-inline: var(--spacing-3);
    }
  }

  .model-image {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border-radius: var(--radius-lg);

    @media (--from-tablet) {
      aspect-ratio: 16 / 9;
    }
  }
}
</style>
