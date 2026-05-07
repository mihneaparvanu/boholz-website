<script setup lang="ts">
import type { HouseModel, HouseCategory } from "../../types/models";
import { ref, computed, onMounted } from "vue";
import ModelCard from "../../features/ModelOverview/components/ModelCard.vue";
import CategoryThumbnail from "../../features/CategorySlider/components/CategoryThumbnail.vue";
import { ROUTES } from "../../utils/routes";
import FilterPanel from "../../features/FilterPanel/FilterPanel.vue";
import type { SortOption } from "../FilterPanel/filter-panel.types";

const props = defineProps<{
  models: HouseModel[];
  categories: HouseCategory[];
}>();

let categories = props.categories;
const selectedCategory = ref<HouseCategory | null>(categories[0] || null);
const isPaneOpen = ref(false);
const sortOption = ref<SortOption | null>(null);

const displayModels = computed(() => {
  const filtered = props.models.filter((model) => {
    return model.category?.id === selectedCategory.value?.id;
  });
  return sortModels(filtered, sortOption.value);
});

const selectCategory = (category: HouseCategory) => {
  selectedCategory.value = category;
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
    const aVal = option?.resolveFromModel(a);
    const bVal = option?.resolveFromModel(b);

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
        v-model:isOpen="isPaneOpen"
        v-model:sortOption="sortOption"
      ></FilterPanel>
      <div class="categories-wrapper">
        <CategoryThumbnail
          v-for="category in categories"
          :key="category.id"
          :category="category"
          @click="selectCategory(category)"
          :data-is-selected="category.id === selectedCategory?.id"
        />
      </div>
      <div class="filter-wrapper">
        <button @click="isPaneOpen = true">Filtern & Sortieren</button>
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

    .filter-wrapper {
      button {
        display: inline-flex;
        align-items: center;
        padding: var(--spacing-1) var(--spacing-3);
        border: 2px solid var(--clr-accent-secondary);
        color: var(--clr-accent-secondary);
        text-decoration: none;
        border-radius: var(--radius-sm);
        font-weight: 400;
        transition: background 0.2s;
      }

      button :hover {
        background: var(--clr-accent-secondary);
        color: var(--clr-surface-primary);
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
