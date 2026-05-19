<script setup lang="ts">
import type { OverviewCardData } from "./overview.types";

defineProps<{
  data: OverviewCardData;
}>();
</script>

<template>
  <div class="card" :data-featured="data.featured || null">
    <div class="text">
      <h3>{{ data.heading }}</h3>
      <p v-if="data.subheading">{{ data.subheading }}</p>
    </div>
    <div v-if="data.image" class="img-wrapper">
      <img
        :src="data.image.url"
        :alt="data.image.alt"
        :width="data.image.width"
        :height="data.image.height"
      />
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--clr-surface-primary);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  width: 100%;
  min-height: 300px;
  max-height: 50dvh;
  display: flex;
  flex-direction: column;
}

.text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  h3 {
    font-size: var(--fs-h6);
    font-weight: 500;
  }
}

.img-wrapper {
  margin-top: var(--spacing-4);
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex: 1;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
