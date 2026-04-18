<script setup lang="ts">
import type { NavRoute } from "../../utils/routes";

const props = defineProps<{
  route: NavRoute;
}>();
</script>

<template>
  <li class="navbar-sheet-item">
    <a :href="route.path">{{ route.label }}</a>
  </li>
</template>

<style scoped>
.navbar-sheet-item {
  display: flex;

  a {
    font-size: var(--fs-h2);
    color: var(--clr-text-primary);
    transition: color 0.3s ease;

    &:hover {
      color: var(--clr-primary);
    }
  }
}
</style>
