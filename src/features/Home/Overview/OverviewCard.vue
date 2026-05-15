<script setup lang="ts">
import type { OverviewCardData } from "./overview.types";

defineProps<{
  data: OverviewCardData;
}>();
</script>

<template>
  <div class="card">
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
</style>
