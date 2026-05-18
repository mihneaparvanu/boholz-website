<script setup lang="ts">
import type { HouseCategory } from "@/types/models";
import { useCategoryGallery } from "@/composables/useCategoryGallery";

import CategoryThumbnail from "./components/CategoryThumbnail.vue";
import CategoryHero from "./components/CategoryHero.vue";

const props = defineProps<{
  categories: HouseCategory[];
}>();

const { selected, select } = useCategoryGallery(props.categories);
</script>

<template>
  <div class="category-slider">
    <CategoryHero v-if="selected" :category="selected" />

    <div class="category-thumbnails">
      <CategoryThumbnail
        v-for="category in categories"
        :key="category.slug"
        :category="category"
        :data-is-selected="category.id === selected?.id"
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

  .category-thumbnails {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    gap: var(--spacing-2);

    @media (--below-desktop) {
      /* Native horizontal scroll, full-bleed across the section padding */
      justify-content: flex-start;
      gap: var(--spacing-3);
      width: 100vw;
      margin-inline: calc(var(--padding-inline) * -1);
      padding-inline: var(--padding-inline);
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      > * {
        scroll-snap-align: center;
        flex: 0 0 auto;
      }
    }
  }
}
</style>
