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

/* Mobile: bump the pillar icons so they hold their own next to the label.
   IconList is a frozen kit (hardcoded :size="18") — the SVG honours CSS
   width/height, so we override the rendered size at the .icon wrapper.
   Bump only on mobile; at tablet+ the two-column dense layout reads
   correctly at 18px and going larger competes with the label. */
@media (--mobile) {
  .stack :deep(.icon svg) {
    width: 24px;
    height: 24px;
  }
}
</style>
