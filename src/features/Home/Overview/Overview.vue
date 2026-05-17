<script setup lang="ts">
import OverviewCard from "./OverviewCard.vue";
import IconList, { type IconListItem } from "@/components/ui/IconList.vue";
import type { OverviewCardData } from "./overview.types";
import type { OverviewPillar } from "./overview.content";

const props = defineProps<{
  featured: OverviewCardData;
  pillars: OverviewPillar[];
}>();

// Map pillars to the kit IconList's row shape (label/description/icon).
const items: IconListItem[] = props.pillars.map((p) => ({
  icon: p.icon,
  label: p.label,
  description: p.description,
}));
</script>

<template>
  <div class="stack">
    <OverviewCard :data="featured" class="featured" />
    <IconList :items="items" density="comfortable" :columns="2" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  /* Wide gap between the featured card and the IconList — the two layers
     read as distinct rhythm tiers, not as repeated rows. */
  gap: var(--spacing-5);
  width: 100%;
}

.featured {
  /* Featured card stretches full content width — pulls visual weight to
     the lead claim before the IconList drops the eye into the four
     supporting pillars below. */
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
