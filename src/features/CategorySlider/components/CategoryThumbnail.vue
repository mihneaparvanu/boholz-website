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
  --size: var(--fs-h2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: var(--size);
  height: var(--size);
  border: 2px solid var(--clr-border-primary);
  overflow: hidden;
}
</style>
