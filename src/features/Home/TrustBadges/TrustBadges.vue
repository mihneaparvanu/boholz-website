<script setup lang="ts">
import TrustStatCard from "./TrustStatCard.vue";
import type { TrustBadge } from "./trust-badges.content";

defineProps<{
  badges: TrustBadge[];
}>();
</script>

<template>
  <div class="row">
    <TrustStatCard
      v-for="b in badges"
      :key="b.label"
      :value="b.value"
      :label="b.label"
      :caption="b.caption"
      :icon="b.icon"
      :flag="b.flag"
      align="start"
    />
  </div>
</template>

<style scoped>
/* Three columns from tablet up — three proof points, three slots. Single
   column on mobile is correct for the StatBlock typographic stack; the
   denser layout still drops ~40% of the vertical real estate the old
   Card grid took. */
.row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-5);
  width: 100%;
}

@media (--from-tablet) {
  .row {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-4);
  }
}

/* Desktop only — center each stat card inside its column so the trio reads
   visually centered across the band. Mobile (single column, already centered
   via TrustStatCard's own @media rule) and tablet (left-aligned by design)
   stay untouched. */
@media (--from-desktop) {
  .row :deep(.stat) {
    align-items: center;
    text-align: center;
  }
}
</style>
