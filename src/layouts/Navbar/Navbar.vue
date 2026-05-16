<script setup lang="ts">
import type { HouseCategory, Location } from "@/types/models";

import NavbarDesktopTransparent from "./NavbarDesktopTransparent.vue";
import NavbarDesktopSolid from "./NavbarDesktopSolid.vue";
import NavbarMobile from "./NavbarMobile.vue";

import { useScrolledPast } from "@/composables/useScrolledPast";
import { useIsHeroPage } from "@/composables/useIsHeroPage";
import { usePathname } from "@/composables/usePathname";

const props = defineProps<{
  categories: HouseCategory[];
  showhouses: Location[];
}>();

const isHero = useIsHeroPage();
const hasScrolled = useScrolledPast(10);
const pathname = usePathname();

const variant = computed<"transparent" | "solid">(() =>
  isHero.value && !hasScrolled.value ? "transparent" : "solid",
);

const DesktopVariant = computed(() =>
  variant.value === "transparent"
    ? NavbarDesktopTransparent
    : NavbarDesktopSolid,
);
</script>

<template>
  <nav
    class="navbar wrapper"
    :data-variant="variant"
    aria-label="Hauptnavigation"
  >
    <div class="shell mobile">
      <NavbarMobile :current-path="pathname" />
    </div>
    <div class="shell desktop">
      <component
        :is="DesktopVariant"
        :categories="props.categories"
        :showhouses="props.showhouses"
        :current-path="pathname"
      />
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
.shell {
  height: 100%;
}

.mobile {
  display: block;
}
.desktop {
  display: none;
}

@media (--from-desktop) {
  .mobile {
    display: none;
  }

  .desktop {
    display: block;
  }
}
</style>
