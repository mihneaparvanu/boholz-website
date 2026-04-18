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
  gap: 2rem;

  .text-content {
    position: absolute;
    text-align: center;
    max-width: 600px;
  }

  .model-image {
    width: 100%;
    object-fit: cover;
  }
}
</style>
