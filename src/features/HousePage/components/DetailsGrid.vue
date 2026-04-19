<script setup lang="ts">
import type { DetailConfig } from "./house-page.types";
import type { HouseModel } from "../../../types/models";
import DetailRow from "./DetailRow.vue";
import {
  formatMeters,
  formatDegrees,
  formatBoolean,
} from "../../../utils/format";
import {
  MoveVertical,
  MoveHorizontal,
  Ruler,
  TriangleRight,
  Car,
  Layers,
} from "lucide-vue-next";

const props = defineProps<{
  model: HouseModel;
}>();

const detailConfig: DetailConfig[] = [
  {
    label: "Breite",
    icon: MoveHorizontal,
    resolve: (m) => m.details?.width,
    format: formatMeters,
  },
  {
    label: "Länge",
    icon: Ruler,
    resolve: (m) => m.details?.length,
    format: formatMeters,
  },
  {
    label: "Höhe",
    icon: MoveVertical,
    resolve: (m) => m.details?.ridgeHeight,
    format: formatMeters,
  },
  { label: "Etagen", icon: Layers, resolve: (m) => m.details?.levelCount },
  {
    label: "Dachneigung",
    icon: TriangleRight,
    resolve: (m) => m.roofPitch,
    format: formatDegrees,
  },
  {
    label: "Garage",
    icon: Car,
    resolve: (m) => m.details?.hasGarage,
    format: formatBoolean,
  },
];

const details = detailConfig
  .map((cfg) => {
    const raw = cfg.resolve(props.model);
    if (raw == null) return null;
    return {
      label: cfg.label,
      icon: cfg.icon,
      value: cfg.format ? cfg.format(raw) : String(raw),
    };
  })
  .filter((d) => d !== null);
</script>

<template>
  <div class="details-grid">
    <DetailRow
      v-for="detail in details"
      :key="detail!.label"
      :label="detail!.label"
      :value="detail!.value"
    >
      <template #icon>
        <component :is="detail!.icon" />
      </template>
    </DetailRow>
  </div>
</template>

<style scoped>
.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
}
</style>
