<script setup lang="ts">
import { computed } from "vue";
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

// `variant` drives the desktop component swap (transparent over a hero,
// solid otherwise) and the desktop background. Mobile ignores this and
// is always rendered solid via the CSS override below — the cross-fade
// from transparent to solid as the user scrolled past the hero felt
// jarring on phones.
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
  view-transition-name: site-nav;
  height: var(--navbar-height);
}

.navbar[data-variant="transparent"] {
  background: transparent;
}
.navbar[data-variant="solid"] {
  background: var(--clr-surface-primary);
}

/* Mobile is always solid — the variant attribute still drives the desktop
   component swap, but the cross-fade between transparent and solid as the
   user scrolled past the hero felt jarring on phones. Override regardless
   of data-variant. */
@media (--below-desktop) {
  .navbar {
    background: var(--clr-surface-primary);
  }
}

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
