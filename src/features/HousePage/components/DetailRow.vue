<script setup lang="ts">
import Separator from "./Separator.vue";

const props = defineProps<{
  label: string;
  value: string;
}>();
</script>

<template>
  <div class="detail-wrapper">
    <div class="label">
      <div class="icon-text">
        <slot name="icon" />
        <span>{{ label }}</span>
      </div>
      <span>{{ value }}</span>
    </div>
    <Separator />
  </div>
</template>

<style scoped>
.detail-wrapper {
  display: flex;
  flex-direction: column;
  .label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: var(--spacing-2);

    .icon-text {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
    }
  }
}
</style>
