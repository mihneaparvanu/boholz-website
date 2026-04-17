<script setup lang="ts">
const props = defineProps<{
  model: any;
}>();
</script>
<template>
  <div class="house-model-circle">
    <img :src="model.house_model_images[0].url" :alt="model.name" />
  </div>
</template>
<style scoped>
.house-model-circle {
  --size: var(--fs-h2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: var(--size);
  height: var(--size);
  border: 2px solid var(--clr-border-primary);
  overflow: hidden;
}
</style>
