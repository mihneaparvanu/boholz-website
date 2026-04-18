<script setup lang="ts">
import { computed } from "vue";

import type { HouseCategory } from "../../../types/models";
import { getMediaURL } from "../../../utils/media";

const props = defineProps<{
  category: HouseCategory;
}>();

const imageURL = computed(() => {
  const thumbnail = props.category.media.find((m) => m.isThumbnail);
  return getMediaURL(thumbnail?.media.path ?? "");
});
</script>
<template>
  <div class="house-model-circle">
    <img :src="imageURL" :alt="category.name" class="model-image" />
  </div>
</template>
<style scoped>
.house-model-circle {
  cursor: pointer;
  --size: var(--fs-h2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
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
