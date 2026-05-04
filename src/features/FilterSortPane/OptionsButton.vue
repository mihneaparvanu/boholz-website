<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>

<template>
  <button>{{ title }}</button>
</template>

<style scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--clr-border-quaternary);
  background-color: none;
  padding: var(--spacing-1);
}
</style>
