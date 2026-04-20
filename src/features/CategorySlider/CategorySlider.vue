<script setup lang="ts">
import { ref } from "vue";
import type { HouseCategory } from "../../types/models";

import CategoryThumbnail from "./components/CategoryThumbnail.vue";
import CategoryHero from "./components/CategoryHero.vue";

const props = defineProps<{
  categories: HouseCategory[];
}>();

const selectedCategory = ref<HouseCategory | null>(props.categories[0] || null);

const selectCategory = (category: HouseCategory) => {
  selectedCategory.value = category;
};
</script>

<template>
  <div class="category-slider">
    <CategoryHero v-if="selectedCategory" :category="selectedCategory" />

    <div class="category-thumbnails">
      <CategoryThumbnail
        v-for="category in categories"
        :key="category.slug"
        :category="category"
        :data-is-selected="category.id === selectedCategory?.id"
        @click="selectCategory(category)"
      />
    </div>
  </div>
</template>

<style scoped>
.category-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;

  .category-thumbnails {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    gap: var(--spacing-4);

    @media (--mobile) {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-2);
    }
  }
}
</style>
