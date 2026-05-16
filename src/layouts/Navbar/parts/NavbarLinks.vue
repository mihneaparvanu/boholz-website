<script setup lang="ts">
import { ref, watch } from "vue";
import { Motion, AnimatePresence } from "motion-v";
import type { NavLink } from "../../nav.types";
import type { HouseCategory, Location } from "@/types/models";
import { ROUTES } from "@/utils/routes";
import NavbarDrop from "../NavbarDrop.vue";

const props = defineProps<{
  routes: NavLink[];
  currentPath: string;
  /** When true, hovering the "Häuser" route reveals the NavbarDrop panel.
      Pass `categories` and `showhouses` alongside. */
  enableDropdown?: boolean;
  categories?: HouseCategory[];
  showhouses?: Location[];
}>();

const isDropOpen = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function openDrop() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  isDropOpen.value = true;
}

function scheduleClose() {
  closeTimer = setTimeout(() => {
    isDropOpen.value = false;
  }, 150);
}

function shouldOpenDropdown(route: NavLink): boolean {
  return (
    !!props.enableDropdown &&
    route.path === ROUTES.houses &&
    props.currentPath !== ROUTES.houses
  );
}

watch(
  () => props.currentPath,
  (p) => {
    if (p === ROUTES.houses) {
      isDropOpen.value = false;
    }
  },
);

const EASE = [0.22, 1, 0.36, 1] as const;
</script>

<template>
  <ul class="primary-nav">
    <li
      v-for="route in routes"
      :key="route.path"
      @mouseenter="shouldOpenDropdown(route) ? openDrop() : scheduleClose()"
    >
      <a :href="route.path" :data-is-current="currentPath === route.path">
        {{ route.label }}
      </a>
    </li>
  </ul>

  <AnimatePresence v-if="enableDropdown && categories && showhouses">
    <Motion
      v-if="isDropOpen"
      tag="div"
      class="drop-container wrapper"
      :initial="{ opacity: 0, y: -6 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: -6 }"
      :transition="{ duration: 0.28, ease: EASE }"
      @mouseenter="openDrop"
      @mouseleave="scheduleClose"
    >
      <NavbarDrop :categories="categories" :showhouses="showhouses" />
    </Motion>
  </AnimatePresence>
</template>

<style scoped>
.primary-nav {
  display: flex;
  gap: var(--spacing-3);
  align-items: center;
  color: inherit;
  font-weight: 400;

  li > a {
    position: relative;
    padding-block: var(--spacing-0);
    color: inherit;
    transition:
      color 160ms ease,
      opacity 160ms ease;
  }
}

.drop-container {
  position: absolute;
  inset-inline: 0;
  top: 100%;
}
</style>
