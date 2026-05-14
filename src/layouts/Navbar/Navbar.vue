<script setup lang="ts">
import { ref } from "vue";
import { Motion, AnimatePresence } from "motion-v";

import BoholzLogo from "@/components/brand/BoholzLogo.vue";
import NavbarMobileMenu from "./NavbarMobileMenu.vue";
import NavbarDrop from "./NavbarDrop.vue";
import NAV_ROUTES from "@/utils/routes";
import { Menu } from "lucide-vue-next";
import type { HouseCategory, Location } from "@/types/models";

const props = defineProps<{
  categories: HouseCategory[];
  showhouses: Location[];
  currentPath: string;
}>();

const isSheetOpen = ref(false);
const isDropOpen = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const openDrop = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  isDropOpen.value = true;
};

const scheduleDrop = () => {
  closeTimer = setTimeout(() => {
    isDropOpen.value = false;
  }, 150);
};

const EASE = [0.22, 1, 0.36, 1] as const;
</script>

<template>
  <nav class="navbar wrapper">
    <Motion
      tag="div"
      class="nav-content"
      :initial="{ opacity: 0, y: -12 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, ease: EASE }"
    >
      <div class="logo-links">
        <a class="logo" href="/" aria-label="BoHolz Haus – Startseite">
          <BoholzLogo class="logo-svg" aria-hidden="true" />
        </a>

        <ul class="links">
          <Motion
            v-for="(route, i) in NAV_ROUTES"
            :key="route.path"
            tag="li"
            :initial="{ opacity: 0, y: -6 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.35, delay: 0.15 + i * 0.04, ease: EASE }"
            @mouseenter="
              route.path === '/hauser' && props.currentPath !== '/hauser'
                ? openDrop()
                : scheduleDrop()
            "
          >
            <a :href="route.path" :data-is-current="currentPath === route.path"
              >{{ route.label }}
            </a>
          </Motion>
        </ul>
      </div>
      <div class="cta"></div>
      <button
        type="button"
        class="sheet-trigger"
        aria-label="Menü öffnen"
        :aria-expanded="isSheetOpen"
        aria-controls="navbar-mobile-menu"
        @click="isSheetOpen = !isSheetOpen"
      >
        <Menu aria-hidden="true" />
      </button>
    </Motion>
    <NavbarMobileMenu
      id="navbar-mobile-menu"
      :routes="NAV_ROUTES"
      :data-is-open="isSheetOpen"
    />
    <AnimatePresence>
      <Motion
        v-if="isDropOpen"
        tag="div"
        class="drop-container"
        :initial="{ opacity: 0, y: -6 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: -6 }"
        :transition="{ duration: 0.28, ease: EASE }"
        @mouseenter="openDrop"
        @mouseleave="scheduleDrop"
      >
        <NavbarDrop
          :categories="props.categories"
          :showhouses="props.showhouses"
        />
      </Motion>
    </AnimatePresence>
  </nav>
</template>

<style scoped>
.navbar {
  margin-top: var(--navbar-offset);
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;

  @media (--below-desktop) {
    &:has(.navbar-mobile-menu[data-is-open="true"]) .nav-content {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .nav-content {
    grid-column: content;
    background-color: var(--clr-surface-primary);
    display: flex;
    align-items: center;
    height: var(--spacing-6);
    padding: 0 var(--spacing-4);
    border-radius: var(--radius-lg);

    justify-content: space-between;

    .logo-links {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }

    .logo {
      width: var(--sz-3xl);
    }

    .links {
      display: none;
      gap: var(--spacing-2);

      li > a {
        position: relative;
        padding-block: var(--spacing-0);
        color: var(--clr-content-primary);
        transition: color 160ms ease;
      }

      li > a::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -2px;
        height: 1px;
        background: currentColor;
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      li > a:hover,
      li > a:focus-visible {
        color: var(--clr-accent-secondary);
      }

      li > a:hover::after,
      li > a:focus-visible::after,
      li > a[data-is-current="true"]::after {
        transform: scaleX(1);
      }

      li > a[data-is-current="true"] {
        color: var(--clr-accent-secondary);
      }

      li > a:focus-visible {
        outline: none;
      }

      @media (--from-desktop) {
        display: flex;
      }
    }

    .sheet-trigger {
      color: var(--clr-content-secondary);
      display: grid;
      place-items: center;
      width: var(--control-height-md);
      height: var(--control-height-md);
      border-radius: var(--radius-sm);
      transition: background 160ms ease, color 160ms ease;

      &:hover {
        background: var(--clr-surface-secondary);
        color: var(--clr-content-primary);
      }

      &:focus-visible {
        outline: 2px solid var(--clr-accent-primary);
        outline-offset: 2px;
      }

      @media (--from-desktop) {
        display: none;
      }
    }
  }

  &[data-sheet-open="true"] .nav-content {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .navbar-mobile-menu {
    &[data-is-open="false"] {
      display: none;
    }

    @media (--from-desktop) {
      display: none;
    }
  }

  .drop-container {
    grid-column: content;
    position: relative;
  }
}
</style>
