<script setup lang="ts">
import type { NavLink } from "../nav.types";
import NavbarMobileMenuItem from "./NavbarMobileMenuItem.vue";
import Button from "@/components/ui/Button.vue";
import { ROUTES } from "@/utils/routes";

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

    <Button variant="primary" size="md" :href="ROUTES.contact"
      >Beratung finden</Button
    >
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
}
</style>
