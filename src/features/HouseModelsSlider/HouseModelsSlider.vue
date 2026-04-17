<script setup lang="ts">
import { ref } from "vue";

import HouseModelSelector from "./components/HouseModelSelector.vue";
import SelectedModel from "./components/SelectedModel.vue";

const props = defineProps<{
  models: any[];
}>();

const selectedModel = ref<any>(null);
selectedModel.value = props.models[0] || null;
</script>

<template>
  <div class="houses-slider">
    <SelectedModel :model="selectedModel" />

    <div class="house-model-wrapper">
      <HouseModelSelector
        v-for="model in props.models"
        :key="model.name"
        :model="model"
      />
    </div>
  </div>
</template>

<style scoped>
.houses-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  .house-model-wrapper {
    display: flex;
    gap: 1rem;
  }
}
</style>
