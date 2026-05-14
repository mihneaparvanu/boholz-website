<script setup lang="ts">
import type { NavRoute } from "@/utils/routes";
import { ChevronRight } from "lucide-vue-next";

const props = defineProps<{
  route: NavRoute;
}>();
</script>

<template>
  <li class="navbar-sheet-item">
    <a :href="route.path">{{ route.label }}</a>
    <ChevronRight class="chevron-icon" />
  </li>
</template>

<style scoped>
.navbar-sheet-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    color: var(--clr-text-primary);
  }
  .chevron-icon {
    size: var(--sz-base);
    color: var(--clr-content-secondary);
    width: var(--sz-base);
    height: var(--sz-base);
  }
}
</style>
