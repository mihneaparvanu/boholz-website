<script setup lang="ts">
import type { HouseCategory, Location } from "@/db/models";

import NavbarLogo from "./parts/NavbarLogo.vue";
import NavbarLinks from "./parts/NavbarLinks.vue";

import { PRIMARY_NAV } from "./navbar.content";
import { ROUTES } from "@/features/navigation/routes";

defineProps<{
  categories: HouseCategory[];
  showhouses: Location[];
  currentPath: string;
}>();
</script>

<template>
  <div class="content">
    <div class="lead">
      <NavbarLogo tone="brand" />
      <NavbarLinks
        :routes="PRIMARY_NAV"
        :current-path="currentPath"
        enable-dropdown
        :categories="categories"
        :showhouses="showhouses"
      />
    </div>
    <a class="cta" :href="ROUTES.onsite">Vor Ort Beratung</a>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding-inline: var(--spacing-4);
  height: 100%;
  color: var(--clr-content-primary);
}

.lead {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.cta {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  background: var(--clr-accent-secondary);
  color: var(--clr-pure-white);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  transition: background 160ms ease;
}

.cta:hover {
  background: color-mix(in srgb, var(--clr-accent-secondary) 85%, #000);
}

.cta:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}
</style>
