<script setup lang="ts">
import { computed } from "vue";

import type { HouseCategory } from "../../../types/models";

const props = defineProps<{
  category: HouseCategory;
}>();

const thumbnail = computed(() => {
  return props.category.media.find((m) => m.isThumbnail);
});

const imageURL = computed(() => {
  return thumbnail.value?.media.path ?? "";
});
</script>
<template>
  <div class="category-thumbnail">
    <div class="house-model-circle">
      <img
        :src="imageURL"
        :alt="category.name"
        :width="thumbnail?.media.width"
        :height="thumbnail?.media.height"
        class="model-image"
      />
    </div>
    <div class="text-wrapper">
      <span>{{ category.name }}</span>
    </div>
  </div>
</template>
<style scoped>
.category-thumbnail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-0);
  cursor: pointer;

  &[data-is-selected="true"] {
    .house-model-circle {
      border-color: var(--clr-accent-primary);
    }

    .text-wrapper span {
      color: var(--clr-content-primary);
    }
  }

  .house-model-circle {
    cursor: pointer;
    --size: var(--fs-h2);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    width: 100%;
    aspect-ratio: 1/1;
    border: 2px solid var(--clr-border-primary);
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (--from-tablet) {
      width: var(--size);
    }
  }

  .text-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
    span {
      font-size: var(--fs-small);
      font-weight: 400;
      color: var(--clr-content-tertiary);
    }
  }
}
</style>
