<script setup lang="ts">
import { ref, watch } from "vue";
import { Motion, AnimatePresence } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import type { NavLink } from "../../nav.types";
import type { HouseCategory, Location } from "@/types/models";
import { ROUTES } from "@/utils/routes";
import NavbarDrop from "../NavbarDrop.vue";
import NavbarKontaktDrop from "../NavbarKontaktDrop.vue";

const props = defineProps<{
  routes: NavLink[];
  currentPath: string;
  /** When true, hovering "Häuser" reveals the NavbarDrop and hovering
      "Kontakt" reveals the NavbarKontaktDrop. Pass `categories`,
      `showhouses` and `locations` alongside. */
  enableDropdown?: boolean;
  categories?: HouseCategory[];
  showhouses?: Location[];
  bestsellerHero?: string | null;
  /** Office locations (showhouses excluded) for the Kontakt subnav. */
  locations?: Location[];
}>();

/* One drop is open at a time. The string identifies which route's panel
   is showing; null = nothing. A single shared close-timer keeps
   transitions across the two panels clean. */
type DropKey = "houses" | "kontakt" | null;
const openDrop = ref<DropKey>(null);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function open(key: Exclude<DropKey, null>) {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  openDrop.value = key;
}

function scheduleClose() {
  closeTimer = setTimeout(() => {
    openDrop.value = null;
  }, 150);
}

function dropForRoute(route: NavLink): DropKey {
  if (!props.enableDropdown) return null;
  if (route.path === ROUTES.houses && props.currentPath !== ROUTES.houses) {
    return "houses";
  }
  if (route.path === ROUTES.contact && props.currentPath !== ROUTES.contact) {
    return "kontakt";
  }
  return null;
}

function handleEnter(route: NavLink) {
  const key = dropForRoute(route);
  if (key) {
    open(key);
  } else {
    scheduleClose();
  }
}

/* When the user lands on the corresponding page mid-hover, dismiss the
   panel — it would otherwise sit open after navigation. */
watch(
  () => props.currentPath,
  (p) => {
    if (p === ROUTES.houses && openDrop.value === "houses") {
      openDrop.value = null;
    }
    if (p === ROUTES.contact && openDrop.value === "kontakt") {
      openDrop.value = null;
    }
  },
);

const EASE = [0.22, 1, 0.36, 1] as const;

function hasDropdown(route: NavLink): boolean {
  return dropForRoute(route) !== null;
}
</script>

<template>
  <ul class="primary-nav">
    <li
      v-for="route in routes"
      :key="route.path"
      @mouseenter="handleEnter(route)"
      @mouseleave="scheduleClose"
    >
      <a
        :href="route.path"
        :data-is-current="currentPath === route.path"
        :data-has-drop="hasDropdown(route)"
      >
        <span>{{ route.label }}</span>
        <ChevronDown
          v-if="hasDropdown(route)"
          class="chev"
          :size="14"
          :stroke-width="2"
          aria-hidden="true"
        />
      </a>
    </li>
  </ul>

  <AnimatePresence v-if="enableDropdown">
    <!-- Häuser drop — same component and motion shape as before. -->
    <Motion
      v-if="openDrop === 'houses' && categories && showhouses"
      key="drop-houses"
      tag="div"
      class="drop-container wrapper"
      :initial="{ opacity: 0, y: -6 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: -6 }"
      :transition="{ duration: 0.28, ease: EASE }"
      @mouseenter="open('houses')"
      @mouseleave="scheduleClose"
    >
      <NavbarDrop
        :categories="categories"
        :showhouses="showhouses"
        :bestseller-hero="bestsellerHero"
      />
    </Motion>

    <!-- Kontakt drop — narrower panel anchored under the Kontakt item. -->
    <Motion
      v-if="openDrop === 'kontakt' && locations"
      key="drop-kontakt"
      tag="div"
      class="drop-container wrapper"
      :initial="{ opacity: 0, y: -6 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: -6 }"
      :transition="{ duration: 0.28, ease: EASE }"
      @mouseenter="open('kontakt')"
      @mouseleave="scheduleClose"
    >
      <NavbarKontaktDrop :locations="locations" />
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
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-0);
    padding-block: var(--spacing-0);
    color: inherit;
    transition:
      color 160ms ease,
      opacity 160ms ease;
  }

  /* Chevron settles into place under hover — small, restrained.
     Rotates by ~180° when the parent drop is open so the affordance
     reads. We can't easily target "this li's drop is open" without
     more wiring, so we hover-rotate the chevron only — the Motion
     entry of the panel itself carries the rest of the visual cue. */
  .chev {
    color: currentColor;
    opacity: 0.6;
    transition:
      transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 160ms ease;
  }

  li:hover > a .chev {
    transform: rotate(180deg);
    opacity: 1;
  }
}

.drop-container {
  position: absolute;
  inset-inline: 0;
  top: 100%;
}
</style>
