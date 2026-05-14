<script setup lang="ts">
import type { HouseModel } from "@/types/models";

const props = defineProps<{
  model: HouseModel;
}>();
</script>
<template>
  <div class="house-model-circle"></div>
</template>
<style scoped>
.house-model-circle {
  --size: var(--fs-h2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  width: var(--size);
  height: var(--size);
  border: 2px solid var(--clr-border-primary);
  overflow: hidden;
}
</style>
