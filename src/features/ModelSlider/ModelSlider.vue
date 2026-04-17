<script setup lang="ts">
import { ref } from "vue";
import type { HouseModel } from "../../types/models";

import ModelThumbnail from "./components/ModelThumbnail.vue";
import ModelHero from "./components/ModelHero.vue";

const props = defineProps<{
  models: HouseModel[];
}>();

const selectedModel = ref<HouseModel | null>(props.models[0] || null);
</script>

<template>
  <div class="models-slider">
    <ModelHero v-if="selectedModel" :model="selectedModel" />

    <div class="model-thumbnails">
      <ModelThumbnail
        v-for="model in props.models"
        :key="model.slug"
        :model="model"
      />
    </div>
  </div>
</template>

<style scoped>
.models-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  
  .model-thumbnails {
    display: flex;
    gap: 1rem;
  }
}
</style>
