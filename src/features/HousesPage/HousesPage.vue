<script setup lang="ts">
import type { HouseModel, HouseCategory } from "@/types/models";
import { ref, computed, onMounted, watch } from "vue";
import ModelCard from "@/features/ModelOverview/components/ModelCard.vue";
import CategoryThumbnail from "@/features/CategorySlider/components/CategoryThumbnail.vue";
import SortButton from "@/components/ui/SortButton.vue";
import { ROUTES } from "@/utils/routes";
import FilterPanel from "@/features/FilterPanel/FilterPanel.vue";
import {
  type SortOption,
  type ActiveFilter,
  type FilterState,
  type FilterOption,
} from "@/features/FilterPanel/filter-panel.types";
import {
  sortOptions,
  filterOptions,
} from "@/features/FilterPanel/filter-panel.options";
import { BESTSELLER_CATEGORY_ID } from "@/data/constants";
import { parseLivingArea } from "@/utils/parseLivingArea";

const props = defineProps<{
  models: HouseModel[];
  categories: HouseCategory[];
}>();

const selectedCategory = ref<HouseCategory | null>(props.categories[0] ?? null);
const isPanelOpen = ref(false);
const activeSort = ref<string | null>(null);
const filterState = ref<FilterState>({ status: "inactive", filters: [] });

// Snapshot the filters that were on screen *before* the panel was opened,
// so we can revert if the user closes the panel without confirming.
let snapshotBeforeOpen: FilterState | null = null;

const activeSortOption = computed<SortOption | null>(
  () => sortOptions.find((o) => o.value === activeSort.value) ?? null,
);

const categoryModels = computed<HouseModel[]>(() => {
  if (selectedCategory.value?.id === BESTSELLER_CATEGORY_ID) {
    return props.models.filter((m) => m.isFeatured);
  }
  return props.models.filter(
    (m) => m.category?.id === selectedCategory.value?.id,
  );
});

const applyFilters = (filters: ActiveFilter[], models: HouseModel[]) =>
  filters.reduce((acc, filter) => filterModels(acc, filter), models);

const filteredModels = computed<HouseModel[]>(() =>
  filterState.value.status === "inactive"
    ? categoryModels.value
    : applyFilters(filterState.value.filters, categoryModels.value),
);

// `displayModels` is what the grid actually renders:
//   inactive | pending → show last *committed* result (category models for
//     inactive; for pending we deliberately do NOT churn the grid under the
//     user — the FilterPanel button shows the live preview count instead).
//   confirmed         → show the filtered result.
const displayModels = computed(() => {
  switch (filterState.value.status) {
    case "inactive":
    case "pending":
      return sortModels(categoryModels.value, activeSortOption.value);
    case "confirmed":
      return sortModels(filteredModels.value, activeSortOption.value);
    default:
      return sortModels(categoryModels.value, activeSortOption.value);
  }
});

// Live preview count for the panel button — reflects pending state.
const modelsCount = computed(() => filteredModels.value.length);

// ---------- Filtering ----------

const filterModels = (
  models: HouseModel[],
  f: ActiveFilter | null,
): HouseModel[] => {
  if (f === null) return models;
  const { option, value } = f;

  switch (option.kind) {
    case "boolean":
      return models.filter((m) => option.resolve(m) === true);
    case "count":
      return models.filter((m) => {
        const resolved = option.resolve(m);
        return resolved !== null && resolved >= (value as number);
      });
    case "enum":
      return models.filter((m) => option.resolve(m) === (value as string));
    default:
      return models;
  }
};

// ---------- Sorting ----------
//
// Comparator contract:
//   - null values are pushed to the end regardless of direction. Rationale:
//     "missing data shouldn't pollute the top of results" — a model without
//     a price shouldn't appear first under "Preis ↑" or "Preis ↓".
//   - When both sides are non-null and types match, compare numerically or
//     via locale-compare with numeric: true.
//   - Default (no sort option) sorts by livingArea asc, nulls last. We use
//     parseLivingArea to coerce the numeric-string DB value, then a
//     stable comparator (preserve original order on tie).

const compareValues = (
  a: string | number | null,
  b: string | number | null,
  direction: "asc" | "desc",
): number => {
  if (a === null && b === null) return 0;
  if (a === null) return 1; // nulls last
  if (b === null) return -1; // nulls last
  const dir = direction === "asc" ? 1 : -1;
  if (typeof a === "number" && typeof b === "number") {
    return dir * (a - b);
  }
  return dir * String(a).localeCompare(String(b), "de", { numeric: true });
};

// Decorate-sort-undecorate: keeps the sort stable (preserves original
// order on tie) and avoids re-running `resolve` inside the comparator.
const sortModels = (models: HouseModel[], option: SortOption | null) => {
  if (option === null) {
    const decorated = models.map((m, i) => ({
      m,
      i,
      key: parseLivingArea(m.livingArea),
    }));
    decorated.sort((a, b) => {
      const c = compareValues(a.key, b.key, "asc");
      return c !== 0 ? c : a.i - b.i;
    });
    return decorated.map((d) => d.m);
  }
  const decorated = models.map((m, i) => ({
    m,
    i,
    key: option.resolve(m),
  }));
  decorated.sort((a, b) => {
    const c = compareValues(a.key, b.key, option.direction);
    return c !== 0 ? c : a.i - b.i;
  });
  return decorated.map((d) => d.m);
};

// ---------- Category / panel interactions ----------

const handleCategorySelect = (category: HouseCategory) => {
  if (category.id === selectedCategory.value?.id) return;
  selectedCategory.value = category;
  // Clamp filters to the new category. A precision-brand UX prefers a clean
  // slate per category over surfacing a 0-results state that the user has
  // to debug. They can re-apply filters intentionally.
  if (filterState.value.status !== "inactive") {
    filterState.value = { status: "inactive", filters: [] };
  }
};

const handleClearFilters = () => {
  filterState.value = { status: "inactive", filters: [] };
};

const handleFilterConfirmed = () => {
  isPanelOpen.value = false;
  snapshotBeforeOpen = null;
};

// Closing the panel without confirming reverts to the last confirmed state.
// This keeps the contract: "what's on screen is what the user opted into".
watch(isPanelOpen, (open, wasOpen) => {
  if (open && !wasOpen) {
    snapshotBeforeOpen = {
      status: filterState.value.status,
      filters: [...filterState.value.filters],
    } as FilterState;
    return;
  }
  if (!open && wasOpen) {
    if (
      filterState.value.status === "pending" &&
      snapshotBeforeOpen !== null
    ) {
      filterState.value = snapshotBeforeOpen;
    }
    snapshotBeforeOpen = null;
  }
});

// ---------- URL state ----------
//
// Bidirectional sync of:
//   ?category=<slug>
//   ?sort=<sortOption.value>             (e.g. "price-desc")
//   ?filter=<id>:<value>,<id>:<value>... (URL-encoded value)
// We use history.replaceState so toggling filters doesn't pile up history.

const filterById = new Map<string, FilterOption>(
  filterOptions.map((o) => [o.id, o]),
);

const serializeFilters = (filters: ActiveFilter[]): string =>
  filters
    .map(
      (f) =>
        `${encodeURIComponent(f.option.id)}:${encodeURIComponent(String(f.value))}`,
    )
    .join(",");

const parseFilters = (raw: string | null): ActiveFilter[] => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair): ActiveFilter | null => {
      const idx = pair.indexOf(":");
      if (idx === -1) return null;
      const id = decodeURIComponent(pair.slice(0, idx));
      const rawValue = decodeURIComponent(pair.slice(idx + 1));
      const option = filterById.get(id);
      if (!option) return null;
      switch (option.kind) {
        case "boolean":
          if (rawValue !== "true" && rawValue !== "false") return null;
          return { option, value: rawValue === "true" } as ActiveFilter;
        case "count": {
          const n = Number(rawValue);
          if (!Number.isFinite(n) || !option.values.includes(n)) return null;
          return { option, value: n } as ActiveFilter;
        }
        case "enum":
          if (!option.options.includes(rawValue)) return null;
          return { option, value: rawValue } as ActiveFilter;
        default:
          return null;
      }
    })
    .filter((f): f is ActiveFilter => f !== null);
};

const writeURL = () => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (selectedCategory.value) {
    url.searchParams.set("category", selectedCategory.value.slug);
  } else {
    url.searchParams.delete("category");
  }
  if (activeSort.value) {
    url.searchParams.set("sort", activeSort.value);
  } else {
    url.searchParams.delete("sort");
  }
  // Only serialize *committed* filters — pending drafts shouldn't appear
  // in the URL (otherwise a shared link would carry unconfirmed state).
  const committed =
    filterState.value.status === "confirmed" ? filterState.value.filters : [];
  if (committed.length > 0) {
    url.searchParams.set("filter", serializeFilters(committed));
  } else {
    url.searchParams.delete("filter");
  }
  window.history.replaceState(null, "", url.toString());
};

let didInitURL = false;

onMounted(() => {
  const params = new URLSearchParams(window.location.search);

  const slug = params.get("category");
  if (slug) {
    const match = props.categories.find((c) => c.slug === slug);
    if (match) selectedCategory.value = match;
  }

  const sortParam = params.get("sort");
  if (sortParam && sortOptions.some((o) => o.value === sortParam)) {
    activeSort.value = sortParam;
  }

  const parsed = parseFilters(params.get("filter"));
  if (parsed.length > 0) {
    filterState.value = { status: "confirmed", filters: parsed };
  }

  didInitURL = true;
});

// Re-write URL whenever any of the three pieces of state changes (after
// initial hydration). We watch the *committed* filter set only — pending
// changes are a draft and shouldn't pollute the URL.
const committedFilterKey = computed(() => {
  if (filterState.value.status === "confirmed") {
    return serializeFilters(filterState.value.filters);
  }
  if (filterState.value.status === "inactive") return "";
  return null; // pending — sentinel, skipped below
});

watch(
  [selectedCategory, activeSort, committedFilterKey],
  ([, , filtersKey]) => {
    if (!didInitURL) return;
    if (filtersKey === null) return; // pending draft → don't pollute URL
    writeURL();
  },
);
</script>

<template>
  <div class="houses-page-wrapper">
    <div class="controls-wrapper">
      <FilterPanel
        :modelsCount="modelsCount"
        @filter-confirmed="handleFilterConfirmed"
        v-model:isOpen="isPanelOpen"
        v-model:filterState="filterState"
      ></FilterPanel>
      <div class="categories-wrapper">
        <CategoryThumbnail
          v-for="category in props.categories"
          :key="category.id"
          :category="category"
          @click="handleCategorySelect(category)"
          :data-is-selected="category.id === selectedCategory?.id"
        />
      </div>
      <div class="filter-buttons-wrapper">
        <SortButton
          v-model:sort="activeSort"
          :options="sortOptions"
        ></SortButton>
        <button
          class="filter-trigger"
          type="button"
          @click="isPanelOpen = true"
          :aria-label="
            filterState.filters.length > 0
              ? `Filtern (${filterState.filters.length} aktiv)`
              : 'Filtern'
          "
        >
          <span>Filtern</span>
          <span
            v-if="
              filterState.status === 'confirmed' &&
              filterState.filters.length > 0
            "
            class="trigger-count"
            aria-hidden="true"
            >{{ filterState.filters.length }}</span
          >
        </button>
      </div>
    </div>

    <div class="content-grid">
      <a
        v-for="model in displayModels"
        :key="model.id"
        :href="ROUTES.house(model.slug)"
      >
        <ModelCard :model="model" />
      </a>
    </div>

    <div v-if="displayModels.length === 0" class="empty">
      <p class="empty-title">Keine Häuser gefunden.</p>
      <p class="empty-body">
        Mit den aktuellen Filtern sind keine Modelle in dieser Kategorie
        verfügbar.
      </p>
      <button
        v-if="filterState.filters.length > 0"
        class="empty-action"
        @click="handleClearFilters"
      >
        Filter zurücksetzen
      </button>
    </div>
  </div>
</template>

<style scoped>
.houses-page-wrapper {
  grid-column: content;

  .controls-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    gap: var(--spacing-1);
    padding-block: var(--spacing-3);

    @media (--from-wide) {
      flex-direction: row;
      align-items: stretch;
    }

    .categories-wrapper {
      width: 100%;
      display: grid;
      gap: var(--spacing-4);
      grid-template-columns: repeat(2, 1fr);

      @media (--from-tablet) {
        display: flex;
        gap: var(--spacing-3);
      }

      padding-block: var(--spacing-4);
    }

    .filter-buttons-wrapper {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);

      /* Mobile: the filter+sort pair feels heavy at lg control height when
         it's the lone row above the category circles. Shrink to md and pin
         to the trailing edge so the visual gravity sits on the right where
         the thumb expects it. */
      @media (--mobile) {
        align-self: flex-end;
      }

      .filter-trigger {
        all: unset;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-2);
        /* Bumped from `--control-height-md` + `--spacing-2` to the lg
           control floor + `--spacing-4` so the chip reads as a deliberate
           CTA rather than a compact toolbar control. */
        height: var(--control-height-lg);
        padding-inline: var(--spacing-4);
        border: 1px solid var(--clr-border-secondary);
        background: var(--clr-surface-primary);
        color: var(--clr-content-primary);
        border-radius: var(--radius-md);
        font: inherit;
        font-weight: 400;
        font-size: var(--fs-body);
        cursor: pointer;
        white-space: nowrap;
        transition:
          background-color 160ms ease,
          border-color 160ms ease,
          color 160ms ease;

        @media (--mobile) {
          height: var(--control-height-md);
          padding-inline: var(--spacing-3);
          font-size: var(--fs-body-sm);
          gap: var(--spacing-1);
        }

        .trigger-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.4em;
          padding-inline: 0.4em;
          height: 1.4em;
          border-radius: var(--radius-full);
          background: var(--clr-accent-primary);
          color: var(--clr-surface-primary);
          font-size: var(--fs-body-sm);
          line-height: 1;
          margin-inline-start: var(--spacing-0);
        }
      }

      .filter-trigger:hover {
        border-color: var(--clr-border-tertiary);
      }

      .filter-trigger:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px
          color-mix(in srgb, var(--clr-accent-primary) 28%, transparent);
      }
    }
  }

  .content-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-4);
    row-gap: var(--spacing-4);
    width: 100%;

    @media (--tablet) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (--mobile) {
      grid-template-columns: 1fr;
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--spacing-2);
    padding: var(--spacing-6) 0;
    color: var(--clr-content-primary);
  }

  .empty-title {
    font-weight: 500;
  }

  .empty-body {
    color: var(--clr-content-secondary, currentColor);
  }

  .empty-action {
    all: unset;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    height: var(--control-height-md);
    padding: 0 var(--spacing-3);
    border: 1px solid var(--clr-accent-secondary);
    color: var(--clr-accent-secondary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    margin-top: var(--spacing-1);
  }

  .empty-action:hover {
    background: var(--clr-surface-secondary);
  }
}
</style>
