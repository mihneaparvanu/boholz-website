<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>

<template>
  <button class="options-btn">{{ title }}</button>
</template>

<style scoped>
.options-btn {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--clr-border-tertiary);
  color: var(--clr-content-primary);
  font: inherit;
  padding: var(--spacing-0) var(--spacing-2);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.options-btn:hover {
  background: var(--clr-surface-secondary);
}
</style>
