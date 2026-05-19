<script setup lang="ts">
import OverviewCard from "./OverviewCard.vue";
import type { OverviewCardData } from "./overview.types";

defineProps<{
  featured: OverviewCardData;
  cards: OverviewCardData[];
}>();
</script>

<template>
  <div class="grid">
    <OverviewCard :data="featured" />
    <OverviewCard v-for="card in cards" :key="card.heading" :data="card" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
  width: 100%;
}

.grid :deep(.card[data-featured]) {
  grid-column: span 2;
  width: 100%;
}

/* Mobile: collapse to a single column and let the featured card sit on its
   own row at full width (rather than the implicit "span 2 of 1" which is a
   no-op but reads as confusing intent). */
@media (--mobile) {
  .grid {
    grid-template-columns: 1fr;
  }
  .grid :deep(.card[data-featured]) {
    grid-column: auto;
  }
  .stack :deep(.icon svg) {
    width: 24px;
    height: 24px;
  }
}
</style>
