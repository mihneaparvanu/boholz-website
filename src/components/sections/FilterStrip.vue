<script setup lang="ts">
/**
 * FilterStrip — quiet horizontal filter rail.
 *
 * Pattern (the stretch): segmented category chips on the leading edge, a
 * thin vertical hairline, then size + budget range chips on the trailing
 * edge. Single row on desktop; wraps on mobile.
 *
 * The strip is presentation-only — it emits the active filter state via
 * `update` events and the parent decides what to do with it (filter a grid,
 * navigate, push to a query string). Range chips open a small inline
 * popover-style menu on click (not a full select — overkill for two ranges).
 *
 * Why this section over the alternatives: the homepage and the Hauser page
 * already do category-as-tabs higher up the tree (CategorySlider). What
 * BoHolz is missing is a sit-above-the-grid rail that *acts on the grid the
 * user is currently looking at*, with budget as a first-class peer of
 * category — and budget is what real buyers ask first.
 */
import { computed, ref } from "vue";
import { Check, X, ChevronDown } from "lucide-vue-next";

export type CategoryOption = {
  value: string;
  label: string;
  /** Optional count badge — "Bungalow (12)". Quietly muted. */
  count?: number;
};

export type RangeOption = {
  value: string;
  label: string;
};

const props = withDefaults(
  defineProps<{
    categories: CategoryOption[];
    sizes: RangeOption[];
    budgets: RangeOption[];
    /** Initial active category — defaults to first ("Alle"). */
    activeCategory?: string;
    /** Initial active size range. */
    activeSize?: string;
    /** Initial active budget range. */
    activeBudget?: string;
  }>(),
  {
    activeCategory: undefined,
    activeSize: undefined,
    activeBudget: undefined,
  },
);

const emit = defineEmits<{
  (e: "update:category", value: string | undefined): void;
  (e: "update:size", value: string | undefined): void;
  (e: "update:budget", value: string | undefined): void;
}>();

const category = ref<string | undefined>(
  props.activeCategory ?? props.categories[0]?.value,
);
const size = ref<string | undefined>(props.activeSize);
const budget = ref<string | undefined>(props.activeBudget);

const sizeOpen = ref(false);
const budgetOpen = ref(false);

const sizeLabel = computed(
  () => props.sizes.find((s) => s.value === size.value)?.label ?? "Wohnfläche",
);
const budgetLabel = computed(
  () => props.budgets.find((b) => b.value === budget.value)?.label ?? "Budget",
);

const selectCategory = (value: string) => {
  category.value = value;
  emit("update:category", value);
};

const selectSize = (value: string | undefined) => {
  size.value = value;
  sizeOpen.value = false;
  emit("update:size", value);
};

const selectBudget = (value: string | undefined) => {
  budget.value = value;
  budgetOpen.value = false;
  emit("update:budget", value);
};

const closeMenus = (skip?: "size" | "budget") => {
  if (skip !== "size") sizeOpen.value = false;
  if (skip !== "budget") budgetOpen.value = false;
};
</script>

<template>
  <div class="strip" role="toolbar" aria-label="Modellfilter">
    <div class="cats" role="radiogroup" aria-label="Kategorie">
      <button
        v-for="opt in categories"
        :key="opt.value"
        type="button"
        class="chip cat"
        role="radio"
        :aria-checked="category === opt.value"
        :data-active="category === opt.value"
        @click="selectCategory(opt.value)"
      >
        <span class="chip-label">{{ opt.label }}</span>
        <span v-if="opt.count !== undefined" class="chip-count">{{ opt.count }}</span>
      </button>
    </div>

    <div class="rule" aria-hidden="true"></div>

    <div class="ranges">
      <!-- SIZE -->
      <div class="menu" :data-open="sizeOpen">
        <button
          type="button"
          class="chip range"
          :data-active="!!size"
          :aria-expanded="sizeOpen"
          aria-haspopup="listbox"
          @click="closeMenus('size'); sizeOpen = !sizeOpen"
        >
          <span class="chip-label">{{ sizeLabel }}</span>
          <ChevronDown
            class="chip-chev"
            :size="14"
            :stroke-width="1.75"
            aria-hidden="true"
          />
        </button>
        <button
          v-if="size"
          type="button"
          class="chip-clear"
          aria-label="Wohnfläche zurücksetzen"
          @click="selectSize(undefined)"
        >
          <X :size="12" :stroke-width="2" aria-hidden="true" />
        </button>
        <ul v-if="sizeOpen" class="menu-list" role="listbox" aria-label="Wohnfläche">
          <li v-for="opt in sizes" :key="opt.value">
            <button
              type="button"
              class="menu-item"
              role="option"
              :aria-selected="size === opt.value"
              @click="selectSize(opt.value)"
            >
              <span>{{ opt.label }}</span>
              <Check
                v-if="size === opt.value"
                :size="14"
                :stroke-width="2"
                aria-hidden="true"
              />
            </button>
          </li>
        </ul>
      </div>

      <!-- BUDGET -->
      <div class="menu" :data-open="budgetOpen">
        <button
          type="button"
          class="chip range"
          :data-active="!!budget"
          :aria-expanded="budgetOpen"
          aria-haspopup="listbox"
          @click="closeMenus('budget'); budgetOpen = !budgetOpen"
        >
          <span class="chip-label">{{ budgetLabel }}</span>
          <ChevronDown
            class="chip-chev"
            :size="14"
            :stroke-width="1.75"
            aria-hidden="true"
          />
        </button>
        <button
          v-if="budget"
          type="button"
          class="chip-clear"
          aria-label="Budget zurücksetzen"
          @click="selectBudget(undefined)"
        >
          <X :size="12" :stroke-width="2" aria-hidden="true" />
        </button>
        <ul v-if="budgetOpen" class="menu-list" role="listbox" aria-label="Budget">
          <li v-for="opt in budgets" :key="opt.value">
            <button
              type="button"
              class="menu-item"
              role="option"
              :aria-selected="budget === opt.value"
              @click="selectBudget(opt.value)"
            >
              <span>{{ opt.label }}</span>
              <Check
                v-if="budget === opt.value"
                :size="14"
                :stroke-width="2"
                aria-hidden="true"
              />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-3);
  width: 100%;
  padding-block: var(--spacing-2);
  border-block-end: 1px solid var(--clr-border-secondary);
}

.cats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-1);
  flex: 1 1 auto;
  min-width: 0;
}

/* Vertical hairline between category cluster and ranges cluster.
   Hidden on mobile (the wrap makes it ugly), shown from tablet up. */
.rule {
  display: none;
  width: 1px;
  height: 1.2em;
  background: var(--clr-border-secondary);
  flex-shrink: 0;
}

@media (--from-tablet) {
  .rule {
    display: block;
  }
}

.ranges {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-shrink: 0;
}

/* Chip — the unit. Two roles: category radio, range trigger. Visually one
   shape, two states. */
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  height: var(--control-height-sm);
  padding-inline: var(--spacing-2);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  color: var(--clr-content-secondary);
  font: inherit;
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-regular);
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition:
    background 140ms ease,
    color 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease;
}

.chip:hover {
  color: var(--clr-content-primary);
  background: var(--clr-surface-secondary);
}

.chip:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

/* Active states:
   - Category active = secondary accent on small fill (per project rule:
     small element → accent-secondary). White text on solid deep-blue.
   - Range active   = same treatment; consistency over novelty.
   The pattern is identical so users learn "filled chip = active filter". */
.chip[data-active="true"] {
  background: var(--clr-accent-secondary);
  color: var(--clr-pure-white);
  border-color: var(--clr-accent-secondary);
}

.chip[data-active="true"]:hover {
  background: var(--clr-accent-secondary);
  color: var(--clr-pure-white);
  filter: brightness(1.08);
}

.chip-label {
  display: inline-block;
}

.chip-count {
  display: inline-block;
  font-variant-numeric: tabular-nums;
  font-size: 0.85em;
  color: var(--clr-content-tertiary);
  /* When the chip is active, the count needs to read as white-soft so it
     doesn't disappear into the fill. */
}

.chip[data-active="true"] .chip-count {
  color: var(--clr-pure-white-soft);
}

.chip-chev {
  color: var(--clr-content-tertiary);
  transition: transform 160ms ease, color 140ms ease;
}

.chip[data-active="true"] .chip-chev {
  color: var(--clr-pure-white-soft);
}

.menu[data-open="true"] .chip-chev {
  transform: rotate(180deg);
}

/* Inline clear pill that lives next to an active range chip. */
.menu {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-0);
}

.chip-clear {
  display: inline-grid;
  place-items: center;
  width: calc(var(--control-height-sm) * 0.7);
  height: calc(var(--control-height-sm) * 0.7);
  border-radius: var(--radius-full);
  background: transparent;
  border: 1px solid var(--clr-border-tertiary);
  color: var(--clr-content-tertiary);
  cursor: pointer;
  transition: color 140ms ease, border-color 140ms ease;
}

.chip-clear:hover {
  color: var(--clr-content-primary);
  border-color: var(--clr-border-quaternary);
}

.chip-clear:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

/* Popover-style menu list. Positioned below the trigger. Mobile keeps it
   left-anchored; desktop right-anchors so it doesn't overflow viewport. */
.menu-list {
  position: absolute;
  top: calc(100% + var(--spacing-1));
  inset-inline-start: 0;
  z-index: 20;
  min-width: 12rem;
  margin: 0;
  padding: var(--spacing-1);
  list-style: none;
  background: var(--clr-surface-primary);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2);
}

@media (--from-tablet) {
  .menu-list {
    inset-inline-start: auto;
    inset-inline-end: 0;
  }
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  width: 100%;
  padding: var(--spacing-2) var(--spacing-2);
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--clr-content-primary);
  font: inherit;
  font-size: var(--fs-body-sm);
  text-align: start;
  cursor: pointer;
  transition: background 120ms ease;
}

.menu-item:hover {
  background: var(--clr-surface-secondary);
}

.menu-item:focus-visible {
  outline: none;
  background: var(--clr-surface-secondary);
  box-shadow: var(--focus-ring);
}

.menu-item[aria-selected="true"] {
  color: var(--clr-accent-secondary);
}

@media (--mobile) {
  .strip {
    gap: var(--spacing-2);
  }
  .ranges {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
