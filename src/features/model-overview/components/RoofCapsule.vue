<script setup lang="ts">
import { computed } from "vue";
import { TriangleRight } from "lucide-vue-next";
import { formatDegrees } from "@/lib/format";

export type RoofEntry = {
  /** Roof type label, e.g. "Walmdach", "Flachdach", "Flachdach, Attika". */
  type: string;
  /** Pitch in degrees. Null/undefined for flat roofs — capsule renders icon + label only. */
  pitch?: number | null;
};

const props = defineProps<{
  /** One or two roof entries. Two are rendered side-by-side as separate capsules. */
  entries: RoofEntry[];
}>();

// Filter out malformed entries so callers can pass raw DB rows safely.
const items = computed(() =>
  props.entries.filter((e): e is RoofEntry => Boolean(e?.type)),
);
</script>

<template>
  <div v-if="items.length" class="row">
    <span v-for="(entry, i) in items" :key="`${entry.type}-${i}`" class="capsule">
      <TriangleRight :size="12" :stroke-width="2" aria-hidden="true" />
      <span class="type">{{ entry.type }}</span>
      <span v-if="entry.pitch != null" class="pitch">{{ formatDegrees(entry.pitch) }}</span>
    </span>
  </div>
</template>

<style scoped>
.row {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
}

.capsule {
  display: inline-flex;
  align-items: center;
  /* "Spacing 0" between icon and label — tight optical pairing. */
  gap: 4px;
  padding-block: 4px;
  /* Asymmetric inline padding: less on the icon side. */
  padding-inline: 8px 10px;
  background: var(--clr-surface-secondary);
  color: var(--clr-content-secondary);
  border-radius: var(--radius-full);
  font: var(--font-weight-regular) var(--fs-body-sm) / 1 var(--font-primary);
  white-space: nowrap;
}

.type {
  /* No extra gap — pitch sits just after, separated by its own margin. */
}

.pitch {
  margin-inline-start: var(--spacing-1);
  color: var(--clr-content-tertiary);
  font-variant-numeric: tabular-nums;
}
</style>
