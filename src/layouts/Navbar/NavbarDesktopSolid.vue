<script setup lang="ts">
import type { HouseCategory, Location } from "@/types/models";
import { ROUTES } from "@/utils/routes";

import Button from "@/components/ui/Button.vue";
import NavbarLogo from "./parts/NavbarLogo.vue";
import NavbarLinks from "./parts/NavbarLinks.vue";

import { PRIMARY_NAV } from "./navbar.content";

defineProps<{
  categories: HouseCategory[];
  showhouses: Location[];
  bestsellerHero?: string | null;
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
        :bestseller-hero="bestsellerHero"
      />
    </div>

    <div class="cta">
      <Button variant="tertiary" :href="ROUTES.contact">Katalog</Button>
      <Button variant="primary" :href="ROUTES.contact">Beratung finden</Button>
    </div>
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
  display: flex;
  gap: var(--spacing-2);
}
</style>
