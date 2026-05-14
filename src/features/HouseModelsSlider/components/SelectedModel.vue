<script setup lang="ts">
import type { HouseModel } from "../../../types/models";

const props = defineProps<{
  model: HouseModel;
}>();
</script>

<template>
  <div class="content-wrapper">
    <div class="text-content">
      <h3>{{ model.title }}</h3>
      <p>{{ model.livingArea }} sqm</p>
    </div>
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
    text-align: center;
    max-width: 38rem;
  }

  .model-image {
    width: 100%;
    object-fit: cover;
  }
}
</style>
