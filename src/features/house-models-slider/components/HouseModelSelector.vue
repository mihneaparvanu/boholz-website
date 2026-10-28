<script setup lang="ts">
import type { HouseModelRecord } from "@/domain/house-models/houseModels.types";

const props = defineProps<{
  model: HouseModelRecord;
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
