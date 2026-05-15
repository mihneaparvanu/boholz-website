<script setup lang="ts">
import type { NavLink } from "../nav.types";
import NavbarMobileMenuItem from "./NavbarMobileMenuItem.vue";

const { routes } = defineProps<{
  routes: NavLink[];
}>();
</script>

<template>
  <div class="navbar-mobile-menu" role="dialog" aria-label="Navigation">
    <ul class="nav-content">
      <NavbarMobileMenuItem
        v-for="route in routes"
        :key="route.path"
        :route="route"
      />
    </ul>

    <button type="button" class="cta">Beratung finden</button>
  </div>
</template>

<style scoped>
.navbar-mobile-menu {
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: var(--spacing-6);
  width: 100%;
  min-height: 10vh;
  background-color: var(--clr-surface-primary);
  padding-block: var(--spacing-2) var(--spacing-3);
  padding-inline: var(--spacing-4);
  border-bottom-left-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);

  .nav-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-4);
  }

  .cta {
    background-color: var(--clr-accent-primary);
    color: var(--clr-surface-primary);
    height: var(--control-height-md);
    padding-inline: var(--spacing-3);
    font-weight: 500;
    border-radius: var(--radius-sm);
    transition: background 160ms ease;

    &:hover {
      background-color: var(--clr-accent-secondary);
    }

    &:focus-visible {
      outline: 2px solid var(--clr-accent-secondary);
      outline-offset: 2px;
    }
  }
}
</style>
