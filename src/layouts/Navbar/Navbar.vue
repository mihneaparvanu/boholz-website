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
  /** Office locations (showhouses excluded) — feeds the Kontakt subnav. */
  officeLocations?: Location[];
  /** Fallback hero image URL for the virtual Bestseller category. */
  bestsellerHero?: string | null;
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
      <NavbarMobile :current-path="pathname" :office-locations="props.officeLocations" />
    </div>

    <div class="shell desktop">
      <component
        :is="DesktopVariant"
        :categories="props.categories"
        :showhouses="props.showhouses"
        :office-locations="props.officeLocations"
        :bestseller-hero="props.bestsellerHero"
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

/* Mobile is always solid — never transparent. The cross-fade between
   transparent and solid as the user scrolled past the hero felt jarring
   on phones. Default below, then desktop opts into the transparent state
   when over a hero. */
.navbar {
  background: var(--clr-surface-primary);
}

/* Desktop honours `data-variant`. The transparent state lives only at
   desktop+ — scope the rule inside the media query so its specificity
   doesn't leak below `--from-desktop`. */
@media (--from-desktop) {
  .navbar[data-variant="transparent"] {
    background: transparent;
  }
  .navbar[data-variant="solid"] {
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
