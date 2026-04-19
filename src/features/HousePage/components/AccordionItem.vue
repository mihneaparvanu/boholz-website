<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
import Separator from "./Separator.vue";

const props = defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="item-wrapper">
    <Separator />
    <div class="feature-item">
      <span>{{ props.label }}</span>
      <ChevronDown />
    </div>
    <slot />
  </div>
</template>

<style scoped>
.feature-item {
  padding-block: var(--spacing-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
}
</style>
