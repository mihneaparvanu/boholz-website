<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: string;
}>();
</script>

<template>
  <div class="item">
    <slot />
    <span class="label">{{ label }}</span>
    <div class="value">
      <span>{{ value }}</span>
    </div>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  justify-content: start;
  border: 2px solid var(--clr-border-primary);
  padding: var(--spacing-3);

  .label {
    font-weight: 500;
  }
}
</style>
