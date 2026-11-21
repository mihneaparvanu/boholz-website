<script setup lang="ts">
import { ref } from "vue";
import type { ModelCategory } from "@/domain/categories/categories.types";

import CategoryThumbnail from "./components/CategoryThumbnail.vue";
import CategoryHero from "./components/CategoryHero.vue";

const props = defineProps<{
  categories: ModelCategory[];
}>();

const selected = ref(props.categories[0]);
const select = (category: ModelCategory) => (selected.value = category);
</script>

<template>
  <div class="category-slider">
    <CategoryHero v-if="selected" :category="selected" />

    <div class="category-thumbnails">
      <CategoryThumbnail
        v-for="category in categories"
        :key="category.slug"
        :category="category"
        :data-is-selected="category.slug === selected?.slug"
        @click="select(category)"
      />
    </div>
  </div>
</template>

<style scoped>
.category-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  width: 100%;

  /*
   * On mobile, the hero loses its overlay and shrinks vertically — we want
   * a clearer rhythmic break between the hero image and the thumbnail strip
   * so the eye reads them as two distinct layers.
   */
  @media (--mobile) {
    gap: var(--spacing-5);
  }
}
</style>
