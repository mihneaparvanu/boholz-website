<script setup lang="ts">
import { Scan } from "lucide-vue-next";
import type { DisplayItemConfig } from "./house-page.types";
import type { HouseModel } from "@/types/models";
import StatCard from "./StatCard.vue";
import { formatSquareMeters } from "@/utils/format";

const props = defineProps<{
  model: HouseModel;
}>();

// Per client (2026-05): hide Schlafzimmer / Zimmer / Badezimmer from the
// front-end. Data stays in the DB; only the visible stats grid trims down to
// the single area figure. Restore the full config to re-expose room counts.
const statsConfig: DisplayItemConfig[] = [
  {
    label: "Fläche",
    icon: Scan,
    resolve: (m) => m.livingArea,
    format: formatSquareMeters,
  },
];

const stats = statsConfig
  .map((cfg) => {
    const raw = cfg.resolve(props.model);
    if (raw == null) return null;
    return {
      label: cfg.label,
      icon: cfg.icon,
      value: cfg.format ? cfg.format(raw) : String(raw),
    };
  })
  .filter((s) => s !== null);
</script>

<template>
  <div class="items-grid">
    <StatCard
      v-for="stat in stats"
      :key="stat.label"
      :label="stat.label"
      :value="stat.value"
    >
      <component :is="stat.icon" />
    </StatCard>
  </div>
</template>

<style scoped>
/* auto-fill keeps the grid graceful whether there's one stat or four —
   single card spans whatever room it needs without sitting awkwardly in a
   half-width column. */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-3);
  width: 100%;
}
</style>
