<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Menu, X, ChevronRight } from "lucide-vue-next";

import Button from "@/components/ui/Button.vue";
import NavbarLogo from "./parts/NavbarLogo.vue";

import { PRIMARY_NAV } from "./navbar.content";
import { ROUTES } from "@/utils/routes";

defineProps<{
  currentPath: string;
}>();

const isOpen = ref(false);

function close() {
  isOpen.value = false;
}

/* Close the sheet on any Astro page swap — otherwise the panel stays open
   under a persisted navbar across navigations. */
onMounted(() => {
  document.addEventListener("astro:after-swap", close);
});
onUnmounted(() => {
  document.removeEventListener("astro:after-swap", close);
});
</script>

<template>
  <div class="bar" :data-open="isOpen">
    <NavbarLogo tone="brand" />

    <button
      type="button"
      class="trigger"
      :aria-label="isOpen ? 'Menü schließen' : 'Menü öffnen'"
      :aria-expanded="isOpen"
      aria-controls="navbar-mobile-sheet"
      @click="isOpen = !isOpen"
    >
      <X v-if="isOpen" aria-hidden="true" />
      <Menu v-else aria-hidden="true" />
    </button>
  </div>

  <div
    id="navbar-mobile-sheet"
    class="sheet"
    role="dialog"
    aria-label="Navigation"
    :data-open="isOpen"
  >
    <ul class="items">
      <li v-for="route in PRIMARY_NAV" :key="route.path">
        <a :href="route.path" :data-is-current="currentPath === route.path">
          <span>{{ route.label }}</span>
          <ChevronRight class="chevron" aria-hidden="true" />
        </a>
      </li>
    </ul>
    <Button variant="primary" :href="ROUTES.contact">Beratung finden</Button>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--spacing-4);
  height: 100%;
  color: var(--clr-content-primary);
}

.trigger {
  display: grid;
  place-items: center;
  width: var(--control-height-md);
  height: var(--control-height-md);
  color: var(--clr-content-secondary);
  border-radius: var(--radius-sm);
  transition: background 160ms ease, color 160ms ease;
}
.trigger:hover {
  background: var(--clr-surface-secondary);
  color: var(--clr-content-primary);
}
.trigger:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

.sheet {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-4) var(--spacing-4);
  background: var(--clr-surface-primary);
  border-block-end: 1px solid var(--clr-border-primary);
  transform-origin: top;
  transition:
    opacity 200ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.sheet[data-open="false"] {
  opacity: 0;
  transform: scaleY(0);
  height: 0;
  padding-block: 0;
  pointer-events: none;
  overflow: hidden;
}

.items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.items a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--clr-content-primary);
  transition: color 160ms ease;
}

.items a[data-is-current="true"],
.items a:hover,
.items a:focus-visible {
  color: var(--clr-accent-secondary);
}

.chevron {
  width: var(--sz-base);
  height: var(--sz-base);
  color: var(--clr-content-tertiary);
}
</style>
