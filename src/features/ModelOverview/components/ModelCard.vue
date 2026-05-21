<script setup lang="ts">
import { computed } from "vue";
import { Star } from "lucide-vue-next";
import {
  formatSquareMeters,
  formatCurrency,
  formatDegrees,
} from "@/utils/format";
import type { HouseModel } from "@/types/models";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder.vue";

const props = defineProps<{
  model: HouseModel;
  /** Suppress the bestseller star badge — set true when the card is rendered
   *  inside a bestseller listing (where every card would otherwise be starred). */
  hideStarBadge?: boolean;
}>();

const heroMediaItem = computed(
  () => props.model.media.find((m) => m.isHero)?.media,
);

const heroImage = computed(() => heroMediaItem.value?.path);
</script>

<template>
  <div class="card-wrapper">
    <div class="image-wrapper">
      <img
        v-if="heroImage"
        class="image"
        :src="heroImage"
        :alt="model.title"
        :width="heroMediaItem?.width"
        :height="heroMediaItem?.height"
      />
      <div v-else class="image">
        <ImagePlaceholder />
      </div>
      <span
        v-if="model.isFeatured && !hideStarBadge"
        class="featured-badge"
        aria-label="Bestseller"
      >
        <Star :size="14" :stroke-width="2.25" fill="currentColor" />
      </span>
    </div>
    <div class="content-wrapper">
      <div class="title-surface">
        <h3 class="title">{{ model.title }}</h3>
        <p v-if="model.livingArea">
          {{ formatSquareMeters(model.livingArea) }}
        </p>
      </div>
      <div class="price-rooms">
        <p v-if="model.price">{{ formatCurrency(model.price) }}</p>
        <p v-if="model.roofPitch">{{ formatDegrees(model.roofPitch) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  display: flex;
  flex-direction: column;
  height: 400px;
  border: 2px solid var(--clr-border-primary);
  border-radius: var(--radius-md);
  overflow: hidden;

  @media (--mobile) {
    height: auto;
  }
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 80%;

  @media (--mobile) {
    height: auto;
    aspect-ratio: 4 / 3;
  }
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;

  @media (--mobile) {
    height: auto;
    aspect-ratio: 4 / 3;
  }
}

.featured-badge {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--clr-accent-primary);
  color: var(--clr-pure-white);
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.2);
  z-index: 1;
  pointer-events: none;
}

.content-wrapper {
  display: grid;
  grid-template-areas: "title-surface price-rooms";
  align-items: center;
  padding: var(--spacing-2) var(--spacing-3);
}

.title-surface {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-1);
  grid-area: title-surface;

  .title {
    font-weight: 400;
    font-size: var(--fs-body);
  }
}

.price-rooms {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: var(--spacing-1);
  grid-area: price-rooms;
}
</style>
