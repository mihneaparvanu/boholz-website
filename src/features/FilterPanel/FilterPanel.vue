<script setup lang="ts">
import { computed } from "vue";
import { Motion, AnimatePresence } from "motion-v";
import { X } from "lucide-vue-next";
import { AccordionRoot } from "reka-ui";
import {
  type ActiveFilter,
  type FilterOption,
  type FilterState,
} from "./filter-panel.types";
import { filterOptions } from "./filter-panel.options";
import OptionsButton from "./OptionsButton.vue";
import FilterSection from "./FilterSection.vue";
import FilterChip from "./FilterChip.vue";

defineProps<{ modelsCount: number }>();

const emit = defineEmits<{
  "filter-confirmed": [];
}>();

const filterState = defineModel<FilterState>("filterState", { required: true });
const isOpen = defineModel<boolean>("isOpen", { required: true });

type Primitive = boolean | number | string;

// Identity = (option.id, value). Never `value` alone — two `count` options
// (bedrooms vs. bathrooms) share a value space and would collapse silently.
const isSameFilter = (
  a: ActiveFilter,
  option: FilterOption,
  value: Primitive,
): boolean => a.option.id === option.id && a.value === value;

const isSelected = (option: FilterOption, value: Primitive): boolean =>
  filterState.value.filters.some((f) => isSameFilter(f, option, value));

const sectionActiveCount = (option: FilterOption): number =>
  filterState.value.filters.filter((f) => f.option.id === option.id).length;

const totalActive = computed(() => filterState.value.filters.length);

const updateFilters = (filters: ActiveFilter[]) => {
  filterState.value =
    filters.length === 0
      ? { status: "inactive", filters: [] }
      : { status: "pending", filters };
};

// Toggle / replace semantics per kind:
//   boolean → present ? remove : append
//   count   → single-select per option; clicking the same value deselects
//   enum    → same single-select semantics as count
const handleOptionSelect = (option: FilterOption, value: Primitive) => {
  const filters = filterState.value.filters;
  const exists = filters.find((f) => isSameFilter(f, option, value));
  if (exists) {
    updateFilters(filters.filter((f) => !isSameFilter(f, option, value)));
    return;
  }
  const cleared = filters.filter((f) => f.option.id !== option.id);
  updateFilters([...cleared, { option, value } as ActiveFilter]);
};

const handleRemoveFilter = (filter: ActiveFilter) => {
  updateFilters(
    filterState.value.filters.filter(
      (f) => !isSameFilter(f, filter.option, filter.value as Primitive),
    ),
  );
};

const handleFilterConfirmed = () => {
  // Confirming on an empty state is a close-and-emit, not a transition.
  if (filterState.value.status === "inactive") {
    emit("filter-confirmed");
    return;
  }
  filterState.value = {
    status: "confirmed",
    filters: filterState.value.filters,
  };
  emit("filter-confirmed");
};

const handleReset = () => {
  filterState.value = { status: "inactive", filters: [] };
};

const chipLabel = (f: ActiveFilter): string => {
  if (f.option.kind === "boolean") return f.option.label;
  return `${f.option.label}: ${f.value}`;
};

const openSections = computed<string[]>(() => filterOptions.map((o) => o.id));
</script>

<template>
  <AnimatePresence>
    <Motion
      v-if="isOpen"
      key="backdrop"
      class="backdrop"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }"
      @click="isOpen = false"
    />
    <Motion
      v-if="isOpen"
      key="panel"
      class="panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-panel-title"
      :initial="{ x: '100%' }"
      :animate="{ x: '0%' }"
      :exit="{ x: '100%' }"
      :transition="{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }"
    >
      <header class="header">
        <div class="title-block">
          <h2 id="filter-panel-title" class="title">Filter</h2>
          <span v-if="totalActive > 0" class="active-count">
            {{ totalActive }} aktiv
          </span>
        </div>
        <button
          class="close"
          type="button"
          aria-label="Filter schließen"
          @click="isOpen = false"
        >
          <X :size="18" :stroke-width="2" aria-hidden="true" />
        </button>
      </header>

      <div class="body">
        <div v-if="totalActive > 0" class="active-filters">
          <FilterChip
            v-for="(f, i) in filterState.filters"
            :key="`${f.option.id}-${f.value}-${i}`"
            :label="chipLabel(f)"
            @remove="handleRemoveFilter(f)"
          />
        </div>

        <AccordionRoot
          type="multiple"
          :default-value="openSections"
          class="sections"
        >
          <FilterSection
            v-for="option in filterOptions"
            :key="option.id"
            :value="option.id"
            :title="option.label"
            :active-count="sectionActiveCount(option)"
          >
            <OptionsButton
              v-if="option.kind === 'boolean'"
              :title="option.label"
              :selected="isSelected(option, true)"
              @click="handleOptionSelect(option, true)"
            />
            <template v-if="option.kind === 'count'">
              <OptionsButton
                v-for="val in option.values"
                :key="val"
                :title="val.toString()"
                :selected="isSelected(option, val)"
                @click="handleOptionSelect(option, val)"
              />
            </template>
            <template v-if="option.kind === 'enum'">
              <OptionsButton
                v-for="opt in option.options"
                :key="opt"
                :title="opt"
                :selected="isSelected(option, opt)"
                @click="handleOptionSelect(option, opt)"
              />
            </template>
          </FilterSection>
        </AccordionRoot>
      </div>

      <footer class="footer">
        <button
          class="btn reset"
          type="button"
          :disabled="totalActive === 0"
          @click="handleReset"
        >
          Alle zurücksetzen
        </button>
        <button
          class="btn primary"
          type="button"
          @click="handleFilterConfirmed"
        >
          <span class="primary-label">
            <span class="count-box" aria-hidden="true">
              <AnimatePresence mode="wait">
                <Motion
                  :key="modelsCount"
                  :initial="{ opacity: 0, y: 8 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :exit="{ opacity: 0, y: -8 }"
                  :transition="{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }"
                  class="count"
                  >{{ modelsCount }}</Motion
                >
              </AnimatePresence>
            </span>
            <span>Häuser anzeigen</span>
          </span>
        </button>
      </footer>
    </Motion>
  </AnimatePresence>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--clr-overlay);
  z-index: 15;
}

.panel {
  position: fixed;
  inset-block: 0;
  inset-inline-end: 0;
  display: flex;
  flex-direction: column;
  width: clamp(320px, 100vw, 460px);
  background-color: var(--clr-surface-primary);
  z-index: 20;
  /* Minimal edge: hairline border only, no surrounding drop-shadow. The
     backdrop already provides the depth separation the user expected. */
  border-inline-start: 1px solid var(--clr-border-primary);
}

@media (--mobile) {
  .panel {
    width: 100vw;
    border-inline-start: 0;
    box-shadow: none;
  }
}

/* ── Header ─────────────────────────────────────── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  padding-inline: var(--spacing-4);
  padding-block: var(--spacing-3);
  border-block-end: 1px solid var(--clr-border-primary);
  background: var(--clr-surface-primary);
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
}

.title-block {
  display: inline-flex;
  align-items: baseline;
  gap: var(--spacing-2);
}

.title {
  margin: 0;
  font-size: var(--fs-h5);
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--ls-heading);
  color: var(--clr-content-primary);
}

.active-count {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-tertiary);
  line-height: 1;
}

.close {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--control-height-md);
  height: var(--control-height-md);
  border-radius: var(--radius-md);
  color: var(--clr-content-secondary);
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease;
}

.close:hover {
  background: var(--clr-surface-secondary);
  color: var(--clr-content-primary);
}

.close:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 28%, transparent);
}

/* ── Body ───────────────────────────────────────── */
.body {
  flex: 1;
  overflow-y: auto;
  padding-inline: var(--spacing-4);
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
  padding-block: var(--spacing-3);
  border-block-end: 1px solid var(--clr-border-primary);
}

.sections {
  display: flex;
  flex-direction: column;
}

/* Last section: drop the divider — footer border handles it */
.sections :deep(.section:last-child) {
  border-block-end: 0;
}

/* ── Footer ─────────────────────────────────────── */
.footer {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  padding-block-end: max(var(--spacing-3), env(safe-area-inset-bottom));
  border-block-start: 1px solid var(--clr-border-primary);
  background: var(--clr-surface-primary);
  position: sticky;
  inset-block-end: 0;
  z-index: 1;
}

.btn {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--control-height-md);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    opacity 160ms ease;
}

.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 28%, transparent);
}

.btn.reset {
  padding-inline: var(--spacing-2);
  color: var(--clr-content-tertiary);
  font-size: var(--fs-body-sm);
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 4px;
  transition:
    color 160ms ease,
    text-decoration-color 160ms ease,
    opacity 160ms ease;
}

.btn.reset:hover:not(:disabled) {
  color: var(--clr-content-primary);
  text-decoration-color: currentColor;
}

.btn.reset:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.btn.primary {
  padding-inline: var(--spacing-4);
  border-radius: var(--radius-sm);
  background: var(--clr-content-primary);
  color: var(--clr-surface-primary);
  letter-spacing: 0.01em;
}

.btn.primary:hover {
  background: color-mix(
    in srgb,
    var(--clr-content-primary) 88%,
    var(--clr-accent-secondary)
  );
}

.btn.primary:active {
  transform: translateY(0.5px);
}

.primary-label {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
}

.count-box {
  position: relative;
  display: inline-flex;
  width: 2.5ch;
  height: 1.2em;
  justify-content: center;
}

.count {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-variant-numeric: tabular-nums;
}
</style>
