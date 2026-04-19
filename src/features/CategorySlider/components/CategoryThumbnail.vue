<script setup lang="ts">
import { computed } from "vue";

import type { HouseCategory } from "../../../types/models";
import { getMediaURL } from "../../../utils/media";

const props = defineProps<{
  category: HouseCategory;
}>();

const thumbnail = computed(() => {
  return props.category.media.find((m) => m.isThumbnail);
});

const imageURL = computed(() => {
  return getMediaURL(thumbnail.value?.media.path ?? "");
});
</script>
<template>
  <div class="house-model-circle">
    <img
      :src="imageURL"
      :alt="category.name"
      :width="thumbnail?.media.width"
      :height="thumbnail?.media.height"
      class="model-image"
    />
  </div>
</template>
<style scoped>
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
  &[data-is-selected="true"] {
    border-color: var(--clr-accent-primary);
  }

  @media (--from-tablet) {
    width: var(--size);
  }
}
</style>
