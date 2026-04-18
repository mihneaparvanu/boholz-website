<script setup lang="ts">
import type { NavRoute } from "../../utils/routes";
import NavbarSheetItem from "./NavbarSheetItem.vue";

const { routes } = defineProps<{
  routes: NavRoute[];
}>();
</script>

<template>
  <div class="navbar-sheet">
    <ul class="nav-content">
      <NavbarSheetItem
        v-for="route in routes"
        :key="route.path"
        :route="route"
      />
    </ul>
  </div>
</template>

<style scoped>
.navbar-sheet {
  width: 100%;
  min-height: 20vh;
  background-color: var(--clr-surface-primary);
  padding-block: 0 var(--spacing-4);

  .nav-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-4);
    height: 100%;
  }
}
</style>
