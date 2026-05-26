<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "reka-ui";
import { FileText, Download } from "lucide-vue-next";
import type { HouseFloor } from "@/db/models";

const props = defineProps<{
  floors: HouseFloor[];
}>();

// === Variant toggle ===
// floor_media.variant differentiates layout/roof/ELW options:
//   null              → "Standard"
//   "alternative"     → "Alternative" (different layout of the same plan)
//   "elw"             → "mit ELW"      (with Einliegerwohnung)
//   "elw_alternative" → "ELW Alternative"
//   "flachdach"       → "Flachdach"    (flat-roof variant)
const VARIANT_LABELS: Record<string, string> = {
  __default__: "Standard",
  alternative: "Alternative",
  elw: "mit ELW",
  elw_alternative: "ELW Alternative",
  flachdach: "Flachdach",
};
const variantKey = (v: string | null | undefined) => v ?? "__default__";

const availableVariants = computed<string[]>(() => {
  const set = new Set<string>();
  for (const f of props.floors) set.add(variantKey(f.variant));
  // Stable order: default first, then alphabetical
  return [...set].sort((a, b) => {
    if (a === "__default__") return -1;
    if (b === "__default__") return 1;
    return a.localeCompare(b);
  });
});

const showVariantToggle = computed(() => availableVariants.value.length >= 2);

// Default variant priority:
//   1. Standard (null) if any floor has it
//   2. Otherwise the most-common variant (so an ELW-only model lands on ELW)
function pickDefaultVariant(floors: HouseFloor[]): string {
  if (floors.some((f) => f.variant == null)) return "__default__";
  const counts = new Map<string, number>();
  for (const f of floors) {
    const k = variantKey(f.variant);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  let best = "__default__";
  let max = -1;
  for (const [k, n] of counts) {
    if (n > max) { max = n; best = k; }
  }
  return best;
}

const activeVariant = ref<string>(pickDefaultVariant(props.floors));

watch(
  () => props.floors,
  () => {
    if (!availableVariants.value.includes(activeVariant.value)) {
      activeVariant.value = availableVariants.value[0] ?? "__default__";
    }
  },
);

const visibleFloors = computed<HouseFloor[]>(() =>
  props.floors.filter((f) => variantKey(f.variant) === activeVariant.value),
);

// Re-pin the etage tab when the variant set changes (or shrinks past current pin).
const activeKey = ref<string>(visibleFloors.value[0]?.title ?? "");
watch(visibleFloors, (next) => {
  if (!next.find((f) => f.title === activeKey.value)) {
    activeKey.value = next[0]?.title ?? "";
  }
});
</script>

<template>
  <div class="wrap">
    <div class="card">
      <div v-if="showVariantToggle" class="variants" role="tablist" aria-label="Grundriss-Variante">
        <button
          v-for="v in availableVariants"
          :key="v"
          type="button"
          role="tab"
          :aria-selected="v === activeVariant"
          class="variant"
          :data-state="v === activeVariant ? 'active' : 'inactive'"
          @click="activeVariant = v"
        >
          {{ VARIANT_LABELS[v] ?? v }}
        </button>
      </div>

      <TabsRoot
        v-if="visibleFloors.length > 1"
        v-model="activeKey"
        :default-value="visibleFloors[0].title"
        class="root"
      >
        <TabsList class="tabs" aria-label="Etagen">
          <TabsTrigger
            v-for="floor in visibleFloors"
            :key="floor.title"
            :value="floor.title"
            class="tab"
          >
            {{ floor.title }}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          v-for="floor in visibleFloors"
          :key="floor.title"
          :value="floor.title"
          class="panel"
        >
          <div class="plan">
            <img
              :src="floor.media.path"
              :alt="floor.media.alt || floor.title"
              :width="floor.media.width ?? undefined"
              :height="floor.media.height ?? undefined"
            />
          </div>
        </TabsContent>
      </TabsRoot>

      <div v-else-if="visibleFloors.length === 1" class="single">
        <span class="caption">{{ visibleFloors[0].title }}</span>
        <div class="plan">
          <img
            :src="visibleFloors[0].media.path"
            :alt="visibleFloors[0].media.alt || visibleFloors[0].title"
            :width="visibleFloors[0].media.width ?? undefined"
            :height="visibleFloors[0].media.height ?? undefined"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.card {
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-lg);
  background: var(--clr-surface-primary);
  padding: var(--spacing-3);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.variants {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 2px;
  padding: 3px;
  background: var(--clr-surface-secondary);
  border-radius: var(--radius-full);
}

.variant {
  appearance: none;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-secondary);
  padding-block: var(--spacing-2);
  padding-inline: var(--spacing-4);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition:
    background 200ms ease,
    color 200ms ease,
    box-shadow 200ms ease;
}

.variant:hover {
  color: var(--clr-content-primary);
}

.variant[data-state="active"] {
  background: var(--clr-surface-primary);
  color: var(--clr-content-primary);
  box-shadow: var(--shadow-1);
}

.variant:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

.root {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.tabs {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  align-self: flex-start;
  background: transparent;
}

.tab {
  appearance: none;
  background: transparent;
  border: 0;
  font: inherit;
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-tertiary);
  padding-block: var(--spacing-2);
  padding-inline: var(--spacing-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background 220ms ease,
    color 220ms ease;
}

.tab:hover {
  color: var(--clr-content-primary);
}

.tab[data-state="active"] {
  background: var(--clr-surface-secondary);
  color: var(--clr-content-primary);
}

.tab:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

.panel {
  display: flex;
}

.panel[data-state="inactive"] {
  display: none;
}

.single {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.caption {
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-secondary);
}

.plan {
  width: 100%;
  background: var(--clr-surface-tertiary);
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 360px;
}

.plan img {
  max-width: 100%;
  max-height: 70vh;
  width: auto;
  height: auto;
  object-fit: contain;
}

@media (--mobile) {
  .plan {
    min-height: 280px;
    padding: var(--spacing-2);
  }
  .plan img {
    max-height: 60vh;
  }
}

.download {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-lg);
  background: var(--clr-surface-primary);
  text-decoration: none;
  color: var(--clr-content-primary);
  transition: border-color 160ms ease;
}

.download:hover {
  border-color: var(--clr-accent-primary);
}

.download:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

.dl-icon {
  display: inline-flex;
  color: var(--clr-content-secondary);
  flex-shrink: 0;
}

.dl-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.dl-title {
  font-weight: var(--font-weight-medium);
}

.dl-sub {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-tertiary);
}

.dl-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-accent-primary);
  flex-shrink: 0;
}

@media (--mobile) {
  .dl-cta .dl-cta-label {
    display: none;
  }
}
</style>
