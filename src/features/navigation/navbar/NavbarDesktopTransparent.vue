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
    <div class="leading">
      <NavbarLogo tone="mono" />
      <NavbarLinks
        :routes="TRANSPARENT_NAV"
        :current-path="currentPath"
        :categories="categories"
        :showhouses="showhouses"
      />
    </div>

    <div class="trailing">
      <a class="cta" :href="ROUTES.onsite">Vor Ort Beratung</a>
    </div>
  </div>
</template>

<style scoped>
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: var(--spacing-4);
  height: 100%;
  color: var(--clr-pure-white);
}

.leading {
  display: flex;
  gap: var(--spacing-4);
}

.trailing {
  justify-self: end;
}

.cta {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  background: var(--clr-pure-white);
  color: var(--clr-accent-secondary);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  backdrop-filter: blur(8px);
  transition:
    background 160ms ease,
    border-color 160ms ease;
}

.cta:hover {
  background: var(--clr-accent-secondary);
  color: var(--clr-pure-white);
}

.cta:focus-visible {
  outline: 2px solid var(--clr-accent-secondary);
  outline-offset: 2px;
}
</style>
