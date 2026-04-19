<script setup lang="ts">
import type { HouseModel, HouseCategory } from "../../types/models";
import { ref, computed } from "vue";
import ModelCard from "../../features/ModelOverview/components/ModelCard.vue";
import CategoryThumbnail from "../../features/CategorySlider/components/CategoryThumbnail.vue";
import { ROUTES } from "../../utils/routes";

const props = defineProps<{
  models: HouseModel[];
  categories: HouseCategory[];
}>();

let categories = props.categories;

const selectedCategory = ref<HouseCategory | null>(categories[0] || null);

const selectCategory = (category: HouseCategory) => {
  selectedCategory.value = category;
};

const displayModels = computed(() => {
  return props.models.filter((model) => {
    return model.category?.id === selectedCategory.value?.id;
  });
});
</script>

<template>
  <div class="houses-page-wrapper">
    <div class="categories-wrapper">
      <CategoryThumbnail
        v-for="category in categories"
        :key="category.id"
        :category="category"
        @click="selectCategory(category)"
        :data-is-selected="category.id === selectedCategory?.id"
      />
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

  .categories-wrapper {
    display: flex;
    gap: var(--spacing-4);
    padding-block: var(--spacing-4);
  }

  .content-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-4);
    row-gap: var(--spacing-4);
    width: 100%;
  }
}
</style>
