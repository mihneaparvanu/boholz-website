<script setup lang="ts">
import { ref } from "vue";
import { Motion, AnimatePresence } from "motion-v";

import BoholzLogo from "../../components/BoholzLogo.vue";
import NavbarMobileMenu from "./NavbarMobileMenu.vue";
import NavbarDrop from "./NavbarDrop.vue";
import NAV_ROUTES from "../../utils/routes";
import { Menu } from "lucide-vue-next";
import type { HouseCategory, Showhouse } from "../../types/models";

const props = defineProps<{
  categories: HouseCategory[];
  showhouses: Showhouse[];
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
</script>

<template>
  <nav class="navbar wrapper">
    <div class="nav-content">
      <div class="logo-links">
        <a class="logo" href="/"> <BoholzLogo class="logo-svg" /></a>

        <ul class="links">
          <li
            v-for="route in NAV_ROUTES"
            :key="route.path"
            @mouseenter="
              route.path === '/hauser' && props.currentPath !== '/hauser'
                ? openDrop()
                : scheduleDrop()
            "
          >
            <a :href="route.path" :data-is-current="currentPath === route.path"
              >{{ route.label }}
            </a>
          </li>
        </ul>
      </div>
      <div class="cta"></div>
      <button class="sheet-trigger" @click="isSheetOpen = !isSheetOpen">
        <Menu />
      </button>
    </div>
    <NavbarMobileMenu :routes="NAV_ROUTES" :data-is-open="isSheetOpen" />
    <div
      class="drop-container"
      v-if="isDropOpen"
      @mouseenter="openDrop"
      @mouseleave="scheduleDrop"
    >
      <AnimatePresence>
        <Motion
          tag="div"
          :initial="{ opacity: 0, y: -3 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: -3 }"
          :transition="{ duration: 0.2, ease: 'easeOut' }"
        >
          <NavbarDrop
            :categories="props.categories"
            :showhouses="props.showhouses"
          />
        </Motion>
      </AnimatePresence>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  margin-top: 30px;
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

      a[data-is-current="true"] {
        color: var(--clr-accent-secondary);
      }

      @media (--from-desktop) {
        display: flex;
      }
    }

    .sheet-trigger {
      color: var(--clr-content-secondary);
      display: block;

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
