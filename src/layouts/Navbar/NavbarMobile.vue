<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Menu, X, ChevronRight } from "lucide-vue-next";

import Button from "@/components/ui/Button.vue";
import NavbarLogo from "./parts/NavbarLogo.vue";

import { useScrolledPast } from "@/composables/useScrolledPast";

import { PRIMARY_NAV } from "./navbar.content";
import { ROUTES } from "@/utils/routes";

const hasScrolled = ref(useScrolledPast(10));

defineProps<{
  currentPath: string;
}>();

const emit = defineEmits<{
  (e: "open-change", value: boolean): void;
}>();

const isOpen = ref(false);

function setOpen(value: boolean) {
  isOpen.value = value;
  emit("open-change", value);
}

function close() {
  setOpen(false);
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
  <div class="bar" :data-open="isOpen" :data-scrolled="hasScrolled">
    <div class="logo-slot">
      <NavbarLogo tone="brand" />
    </div>

    <div class="actions">
      <Button :href="ROUTES.contact" variant="primary" size="sm" class="cta">
        Katalog
      </Button>

      <button
        type="button"
        class="trigger"
        :aria-label="isOpen ? 'Menü schließen' : 'Menü öffnen'"
        :aria-expanded="isOpen"
        aria-controls="navbar-mobile-sheet"
        @click="setOpen(!isOpen)"
      >
        <X v-if="isOpen" aria-hidden="true" />
        <Menu v-else aria-hidden="true" />
      </button>
    </div>
  </div>

  <div
    id="navbar-mobile-sheet"
    class="sheet"
    role="dialog"
    aria-label="Navigation"
    :data-open="isOpen"
    :inert="!isOpen || undefined"
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
  padding-block-start: var(--spacing-2);
  height: 100%;
  color: var(--clr-content-primary);

  &[data-scrolled="true"] {
    .trigger {
      display: grid;
    }
  }
}

.logo-slot {
  display: inline-flex;
}

.logo-slot :deep(.logo) {
  width: var(--sz-3xl);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.cta {
  white-space: nowrap;
}

.trigger {
  display: none;
  place-items: center;
  width: var(--control-height-md);
  height: var(--control-height-md);
  color: var(--clr-content-secondary);
  border-radius: var(--radius-sm);
  transition:
    background 160ms ease,
    color 160ms ease;
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
  /* Absolute overlay anchored to the bottom of the bar — keeps the navbar
     a fixed-height box and avoids pushing layout when toggling. */
  position: absolute;
  inset-inline: 0;
  top: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-4) var(--spacing-4);
  background: var(--clr-surface-primary);
  border-block-end: 1px solid var(--clr-border-primary);
  /* Animate opacity + a small vertical offset only — never animate height
     from 0 to auto, that's the source of the previous jump-glitch. */
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 180ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    visibility 0s linear 0s;
}

.sheet[data-open="false"] {
  opacity: 0;
  transform: translateY(-8px);
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 160ms ease,
    transform 200ms ease,
    visibility 0s linear 200ms;
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
