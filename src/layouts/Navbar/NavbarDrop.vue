<script setup lang="ts"></script>

<template>
  <div class="drop-wrapper">
    <slot name="leading" />
    <slot name="trailing" />
  </div>
</template>

<style scoped>
.drop-wrapper {
  border: 2px solid var(--clr-border-primary);
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  padding: var(--spacing-3) var(--spacing-4);
  position: absolute;
  top: var(--spacing-4);
  width: 100%;
  background-color: var(--clr-surface-primary);
  border-radius: var(--radius-lg);
}
</style>
