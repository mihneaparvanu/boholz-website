<script setup lang="ts">
import { Scan, Grid2X2, BedDouble, ShowerHead } from "lucide-vue-next";
import type { DisplayItemConfig } from "./house-page.types";
import type { HouseModel } from "@/types/models";
import StatCard from "./StatCard.vue";
import { formatSquareMeters } from "@/utils/format";

const props = defineProps<{
  model: HouseModel;
}>();

const statsConfig: DisplayItemConfig[] = [
  {
    label: "Fläche",
    icon: Scan,
    resolve: (m) => m.livingArea,
    format: formatSquareMeters,
  },
  {
    label: "Schlafzimmer",
    icon: BedDouble,
    resolve: (m) => m.details?.bedroomCount,
  },
  {
    label: "Zimmer",
    icon: Grid2X2,
    resolve: (m) => m.details?.levelCount,
  },
  {
    label: "Badezimmer",
    icon: ShowerHead,
    resolve: (m) => m.details?.bathroomCount,
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
.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
  width: 100%;

  @media (--mobile) {
    grid-template-columns: 1fr;
  }
}
</style>
