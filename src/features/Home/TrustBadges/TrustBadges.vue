<script setup lang="ts">
import StatBlock from "@/components/ui/StatBlock.vue";
import type { TrustBadge } from "./trust-badges.content";

defineProps<{
  badges: TrustBadge[];
}>();
</script>

<template>
  <div class="row">
    <StatBlock
      v-for="b in badges"
      :key="b.label"
      :value="b.value"
      :label="b.label"
      :caption="b.caption"
      :icon="b.icon"
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
</style>
