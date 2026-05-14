<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  title: string;
  value?: string | number;
  icon?: Component;
}>();
</script>

<template>
  <article class="card">
    <component v-if="icon" :is="icon" class="card-icon" aria-hidden="true" />
    <span v-if="value !== undefined" class="card-value">{{ value }}</span>
    <h4 class="card-title">{{ title }}</h4>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background: var(--clr-surface-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--clr-border-secondary);
  min-width: 0;
}

.card-icon {
  width: var(--sz-2xl);
  height: var(--sz-2xl);
  color: var(--clr-accent-primary);
}

.card-value {
  font-family: var(--font-secondary);
  font-size: var(--fs-h1);
  line-height: var(--lh-tight);
  color: var(--clr-content-primary);
}

.card-title {
  font-size: var(--fs-h6);
  color: var(--clr-content-secondary);
  font-weight: 400;
}
</style>
