<script setup lang="ts">
import { ref } from "vue";
import type { HouseCategory } from "../../types/models";

import CategoryThumbnail from "./components/CategoryThumbnail.vue";
import CategoryHero from "./components/CategoryHero.vue";

const props = defineProps<{
  categories: HouseCategory[];
}>();

const selectedCategory = ref<HouseCategory | null>(props.categories[0] || null);
</script>

<template>
  <div class="category-slider">
    <CategoryHero v-if="selectedCategory" :category="selectedCategory" />

    <div class="category-thumbnails">
      <CategoryThumbnail
        v-for="category in categories"
        :key="category.slug"
        :category="category"
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
    gap: 1rem;
  }
}
</style>
