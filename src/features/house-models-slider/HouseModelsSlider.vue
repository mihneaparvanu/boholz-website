<script setup lang="ts">
import { ref } from "vue";
import type { HouseModel } from "@/db/models";

import HouseModelSelector from "./components/HouseModelSelector.vue";
import SelectedModel from "./components/SelectedModel.vue";

const props = defineProps<{
  models: HouseModel[];
}>();

const selectedModel = ref<HouseModel | null>(props.models[0] || null);
</script>

<template>
  <div class="models-slider">
    <SelectedModel v-if="selectedModel" :model="selectedModel" />

    <div class="model-thumbnails">
      <HouseModelSelector
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
  gap: var(--spacing-5);

  .model-thumbnails {
    display: flex;
    gap: var(--spacing-2);
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
