<script setup lang="ts">
const props = defineProps<{
  model: any;
}>();
</script>

<template>
  <div class="content-wrapper">
    <div class="text-content">
      <h2>{{ model.name }}</h2>
      <p>{{ model.description }}</p>
    </div>
    <img
      class="model-image"
      :src="model.house_model_images[0].url"
      :alt="model.name"
    />
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
