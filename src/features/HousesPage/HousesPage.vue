<script setup lang="ts">
import type { HouseModel, HouseCategory } from "../../types/models";
import { ref, computed, onMounted } from "vue";
import ModelCard from "../../features/ModelOverview/components/ModelCard.vue";
import CategoryThumbnail from "../../features/CategorySlider/components/CategoryThumbnail.vue";
import SortButton from "../../components/SortButton.vue";
import { ROUTES } from "../../utils/routes";
import FilterPanel from "../../features/FilterPanel/FilterPanel.vue";
import {
  type SortOption,
  type ActiveFilter,
  type FilterState,
} from "../FilterPanel/filter-panel.types";
import { sortOptions } from "../FilterPanel/filter-panel.options";

const props = defineProps<{
  models: HouseModel[];
  categories: HouseCategory[];
}>();

let categories = props.categories;
const selectedCategory = ref<HouseCategory | null>(categories[0] || null);
const isPanelOpen = ref(false);
const activeSort = ref<string | null>(null);
const filterState = ref<FilterState>({ status: "inactive", filters: [] });

const activeSortOption = computed<SortOption | null>(
  () => sortOptions.find((o) => o.value === activeSort.value) ?? null,
);

const categoryModels = computed<HouseModel[]>(() =>
  props.models.filter((m) => m.category?.id === selectedCategory.value?.id),
);

const applyFilters = (filters: ActiveFilter[], models: HouseModel[]) =>
  filters.reduce((models, filter) => filterModels(models, filter), models);

const filteredModels = computed<HouseModel[]>(() =>
  filterState.value.status === "inactive"
    ? categoryModels.value
    : applyFilters(filterState.value.filters, categoryModels.value),
);

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

const modelsCount = computed(() => {
  return filteredModels.value.length;
});

const handleCategorySelect = (category: HouseCategory) => {
  selectedCategory.value = category;
};

const handleFilterConfirmed = () => {
  isPanelOpen.value = false;
};

const filterModels = (
  models: HouseModel[],
  f: ActiveFilter | null,
): HouseModel[] => {
  if (f === null) {
    return models;
  }
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

const sortModels = (models: HouseModel[], option: SortOption | null) => {
  const defaultSorted = [...models].sort((a, b) => {
    if (a.livingArea !== null && b.livingArea !== null) {
      return a.livingArea?.localeCompare(b.livingArea, "de", { numeric: true });
    } else {
      return 0;
    }
  });

  if (option === null) {
    return defaultSorted;
  }

  return [...models].sort((a, b) => {
    const aVal = option?.resolve(a);
    const bVal = option?.resolve(b);

    if (aVal === null && bVal !== null) {
      return 1;
    } else if (aVal !== null && bVal === null) {
      return -1;
    } else if (aVal === null && bVal === null) {
      return 0;
    }

    const dirNum = option?.direction == "asc" ? 1 : -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return dirNum * aVal.localeCompare(bVal, "de", { numeric: true });
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return dirNum * (aVal - bVal);
    }
    return 0;
  });
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("category");
  if (slug) {
    const match = categories.find((c) => c.slug === slug);
    if (match) selectedCategory.value = match;
  }
});
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
          v-for="category in categories"
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
        <button @click="isPanelOpen = true">Filtern</button>
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
  </div>
</template>

<style scoped>
.houses-page-wrapper {
  grid-column: content;

  .controls-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-3);

    @media (--mobile) {
      flex-direction: column;
      align-items: stretch;
    }

    .categories-wrapper {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-2);
      padding-block: var(--spacing-4);

      @media (--from-tablet) {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-4);
      }
    }

    .filter-buttons-wrapper {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      button {
        all: unset;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        height: var(--control-height-md);
        padding: 0 var(--spacing-3);
        border: 1px solid var(--clr-accent-secondary);
        color: var(--clr-accent-secondary);
        border-radius: var(--radius-sm);
        font: inherit;
        font-weight: 400;
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.2s;
      }
      button:hover {
        background: var(--clr-surface-secondary);
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
}
</style>
