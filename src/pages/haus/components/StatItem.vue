<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: string;
}>();
</script>

<template>
  <div class="item">
    <div class="label">
      <slot /> <span class="label">{{ label }}</span>
    </div>

    <span class="value">{{ value }}</span>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  justify-content: start;
  border: 2px solid var(--clr-border-primary);
  padding: var(--spacing-3);

  .label {
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: var(--spacing-0);

    svg {
      --size: var(--sz-base);
      width: var(--size);
      height: var(--size);
    }
  }
}
</style>
