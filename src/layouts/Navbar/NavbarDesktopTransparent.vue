<script setup lang="ts">
import type { HouseCategory, Location } from "@/types/models";
import { ROUTES } from "@/utils/routes";

import Button from "@/components/ui/Button.vue";
import NavbarLogo from "./parts/NavbarLogo.vue";
import NavbarLinks from "./parts/NavbarLinks.vue";

import { TRANSPARENT_NAV } from "./navbar.content";

defineProps<{
  categories: HouseCategory[];
  showhouses: Location[];
  officeLocations?: Location[];
  bestsellerHero?: string | null;
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
      :bestseller-hero="bestsellerHero"
    />

    <div class="cta">
      <Button variant="secondary" :href="ROUTES.contact"
        >Beratung finden</Button
      >
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

.cta {
  justify-self: end;
  display: flex;
  gap: var(--spacing-2);
}
</style>
