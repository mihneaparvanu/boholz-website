<script setup lang="ts">
import { computed } from "vue";

import type { HouseCategory } from "@/db/models";

const props = defineProps<{
  category: HouseCategory;
}>();

const heroMedia = computed(() => {
  return props.category.media.find((m) => m.isHero);
});

const imageURL = computed(() => {
  return heroMedia.value?.media.path ?? "";
});
</script>

<template>
  <div class="content-wrapper">
    <div class="text-content">
      <h3>{{ category.name }}</h3>
      <p>{{ category.description }}</p>
    </div>
    <img
      :src="imageURL"
      :alt="category.name"
      :width="heroMedia?.media.width"
      :height="heroMedia?.media.height"
      class="model-image"
    />
  </div>
</template>

<style scoped>
.content-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);

  .text-content {
    position: absolute;
    margin-block: var(--spacing-4) 0;
    color: var(--clr-surface-primary);
    text-align: center;
    max-width: 600px;

    /*
     * On mobile the overlay competes with the house render itself —
     * the section's eyebrow/title above and the thumbnail strip below
     * already provide context, so we let the image speak.
     */
    @media (--mobile) {
      display: none;
    }
  }

  .model-image {
    width: 100%;
    /* height: auto is required to override the <img height="…"> HTML
       attribute, which the browser treats as a presentational hint and
       otherwise defeats `aspect-ratio` (image was rendering at its
       intrinsic 1080px height instead of the aspected box). */
    height: auto;
    /*
     * Mobile default: 5/4 — slightly taller than landscape so the façade
     * has presence, but no longer the portrait tower the 3/4 crop produced.
     */
    aspect-ratio: 5 / 4;
    object-fit: cover;
    border-radius: var(--radius-lg);

    @media (--from-tablet) {
      aspect-ratio: 16 / 9;
    }
  }
}
</style>
