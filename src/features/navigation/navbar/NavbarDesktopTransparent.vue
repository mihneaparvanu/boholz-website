<script setup lang="ts">
import type { HouseCategory, Location } from "@/db/models";

import NavbarLogo from "./parts/NavbarLogo.vue";
import NavbarLinks from "./parts/NavbarLinks.vue";

import { TRANSPARENT_NAV } from "./navbar.content";
import { ROUTES } from "@/features/navigation/routes";

defineProps<{
  categories: HouseCategory[];
  showhouses: Location[];
  currentPath: string;
}>();
</script>

<template>
  <div class="content">
    <NavbarLogo tone="mono" />

    <NavbarLinks
      :routes="TRANSPARENT_NAV"
      :current-path="currentPath"
      :categories="categories"
      :showhouses="showhouses"
    />

    <div class="trailing">
      <a class="cta" :href="ROUTES.onsite">Vor Ort Beratung</a>
    </div>
  </div>
</template>

<style scoped>
.content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--spacing-4);
  padding-inline: var(--spacing-4);
  height: 100%;
  color: var(--clr-pure-white);
}

.trailing {
  justify-self: end;
}

.cta {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  background: rgba(255, 255, 255, 0.15);
  color: var(--clr-pure-white);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition:
    background 160ms ease,
    border-color 160ms ease;
}

.cta:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.35);
}

.cta:focus-visible {
  outline: 2px solid var(--clr-pure-white);
  outline-offset: 2px;
}
</style>
