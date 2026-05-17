<script setup lang="ts">
import { computed, ref } from "vue";
import type { HouseCategory, Location } from "@/types/models";

import NavbarDesktopTransparent from "./NavbarDesktopTransparent.vue";
import NavbarDesktopSolid from "./NavbarDesktopSolid.vue";
import NavbarMobile from "./NavbarMobile.vue";

import { useScrolledPast } from "@/composables/useScrolledPast";
import { useScrollDirection } from "@/composables/useScrollDirection";
import { useIsHeroPage } from "@/composables/useIsHeroPage";
import { usePathname } from "@/composables/usePathname";

const props = defineProps<{
  categories: HouseCategory[];
  showhouses: Location[];
}>();

const isHero = useIsHeroPage();
const hasScrolled = useScrolledPast(10);
const scrollDir = useScrollDirection({ threshold: 80 });
const pathname = usePathname();
const mobileSheetOpen = ref(false);

// Mobile only: hide the bar on scroll-down past the threshold, but ONLY on
// pages without a hero (static pages). Never hide while the mobile sheet is
// open — the bar carries the close button.
const hidden = computed(
  () => !isHero.value && scrollDir.value === "down" && !mobileSheetOpen.value,
);

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
    :data-hidden="hidden || undefined"
    aria-label="Hauptnavigation"
  >
    <div class="shell mobile">
      <NavbarMobile
        :current-path="pathname"
        @open-change="mobileSheetOpen = $event"
      />
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
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.navbar[data-variant="transparent"] {
  background: transparent;
}
.navbar[data-variant="solid"] {
  background: var(--clr-surface-primary);
}

/* Mobile: slide the bar fully out of view on scroll-down. Desktop ignores
   the flag — navigation should never hide on a pointer device. */
@media (--below-desktop) {
  .navbar[data-hidden] {
    transform: translateY(-100%);
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
