<script setup lang="ts">
import { computed } from "vue";
import { getMediaURL } from "../../../utils/media";

import type { HouseCategory } from "../../../types/models";

const props = defineProps<{
  category: HouseCategory;
}>();

const imageURL = computed(() => {
  const thumbnail = props.category.media.find((m) => m.isHero);
  return getMediaURL(thumbnail?.media.path ?? "");
});
</script>

<template>
  <div class="content-wrapper">
    <div class="text-content">
      <h4>{{ category.name }}</h4>
      <p>{{ category.description }}</p>
    </div>
    <img :src="imageURL" :alt="category.name" class="model-image" />
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
    padding: var(--spacing-2) 0;
    color: var(--clr-surface-primary);
    text-align: center;
    max-width: 600px;
  }

  .model-image {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;

    @media (--from-tablet) {
      aspect-ratio: 16 / 9;
    }
  }
}
</style>
