<script setup lang="ts">
import OverviewCard from "./OverviewCard.vue";
import type { OverviewCardData } from "./overview.types";

defineProps<{
  cards: OverviewCardData[];
}>();
</script>

<template>
  <div class="grid">
    <OverviewCard
      v-for="card in cards"
      :key="card.heading"
      :data="card"
      :class="{ main: card.featured }"
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-2);
}

.main {
  grid-column: 1 / -1;
}

@media (--below-desktop) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
