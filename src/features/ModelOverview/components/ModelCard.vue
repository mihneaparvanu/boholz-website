<script setup lang="ts">
import { computed } from "vue";
import { getMediaURL } from "../../../utils/media";
import type { HouseModel } from "../../../types/models";

const props = defineProps<{
  model: HouseModel;
}>();

const heroImage = computed(
  () =>
    props.model.media.find((m) => m.isHero)?.media.path ??
    props.model.media[0]?.media.path,
);

const pricePlaceholder: string = "150.000 €"; // Placeholder, as price is not in the model type
</script>

<template>
  <div class="card-wrapper">
    <img
      v-if="heroImage"
      class="image"
      :src="getMediaURL(heroImage)"
      :alt="model.title"
    />
    <div v-else class="image image-placeholder" />
    <div class="content-wrapper">
      <div class="title-surface">
        <h2 class="title">{{ model.title }}</h2>
        <div class="surface-wrapper">
          <p>{{ model.livingArea }} m²</p>
        </div>
      </div>
      <div class="price-rooms">
        <p>{{ pricePlaceholder }}</p>
        <p>{{ model.roofPitch }}°</p>
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
