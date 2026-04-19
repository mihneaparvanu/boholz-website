<script setup lang="ts">
import { computed } from "vue";
import { getMediaURL } from "../../../utils/media";
import {
  formatSquareMeters,
  formatCurrency,
  formatDegrees,
} from "../../../utils/format";
import type { HouseModel } from "../../../types/models";

const props = defineProps<{
  model: HouseModel;
}>();

const heroMediaItem = computed(
  () =>
    props.model.media.find((m) => m.isHero)?.media ??
    props.model.media[0]?.media,
);

const heroImage = computed(() => heroMediaItem.value?.path);
</script>

<template>
  <div class="card-wrapper">
    <img
      v-if="heroImage"
      class="image"
      :src="getMediaURL(heroImage)"
      :alt="model.title"
      :width="heroMediaItem?.width"
      :height="heroMediaItem?.height"
    />
    <div v-else class="image image-placeholder" />
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
}

.image {
  width: 100%;
  height: 80%;
  object-fit: cover;

  &.image-placeholder {
    background-color: var(--clr-surface-secondary);
  }
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
