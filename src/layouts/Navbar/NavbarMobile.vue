<script setup lang="ts">
import { ref } from "vue";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-vue-next";

import Button from "@/components/ui/Button.vue";
import NavbarLogo from "./parts/NavbarLogo.vue";
import NavbarMobileContactExpand from "./NavbarMobileContactExpand.vue";

import { PRIMARY_NAV } from "./navbar.content";
import { ROUTES } from "@/utils/routes";
import type { Location } from "@/types/models";

/* Keep in sync with the .sheet fade-out duration below. The handler
   below waits this long after closing the sheet before navigating, so
   the user perceives the menu collapsing rather than a hard cut. */
const SHEET_FADE_MS = 200;

const props = defineProps<{
  currentPath: string;
  officeLocations?: Location[];
}>();

const isOpen = ref(false);
const kontaktExpanded = ref(false);

/* Intercept link clicks inside the open sheet: close the sheet first
   so the fade-out is visible, then navigate via a full page load.
   With Astro's ClientRouter removed, navigation triggers a fresh
   document load — the sheet would otherwise disappear instantly at
   swap time. Respect modifier keys / non-primary buttons so the
   browser's open-in-new-tab affordances keep working. */
function handleNavClick(event: MouseEvent, href: string) {
  if (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  ) {
    return;
  }
  event.preventDefault();
  isOpen.value = false;
  window.setTimeout(() => {
    window.location.assign(href);
  }, SHEET_FADE_MS);
}
</script>

<template>
  <div class="bar" :data-open="isOpen">
    <div class="logo-slot">
      <NavbarLogo tone="brand" />
    </div>

    <div class="actions">
      <Button :href="ROUTES.contact" variant="primary" size="md" class="cta">
        Katalog
      </Button>

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
      <template v-for="route in PRIMARY_NAV" :key="route.path">
        <li v-if="route.path === ROUTES.contact && props.officeLocations?.length">
          <button
            type="button"
            class="row toggle"
            :data-expanded="kontaktExpanded"
            :aria-expanded="kontaktExpanded"
            @click="kontaktExpanded = !kontaktExpanded"
          >
            <span>{{ route.label }}</span>
            <ChevronDown class="chevron" aria-hidden="true" />
          </button>
          <NavbarMobileContactExpand
            v-if="kontaktExpanded"
            :locations="props.officeLocations"
            @navclick="(href, e) => handleNavClick(e, href)"
          />
        </li>
        <li v-else>
          <a
            :href="route.path"
            :data-is-current="currentPath === route.path"
            @click="handleNavClick($event, route.path)"
          >
            <span>{{ route.label }}</span>
            <ChevronRight class="chevron" aria-hidden="true" />
          </a>
        </li>
      </template>
    </ul>
    <Button
      variant="primary"
      :href="ROUTES.contact"
      @click="handleNavClick($event, ROUTES.contact)"
      >Beratung finden</Button
    >
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* No inline padding here — the .wrapper grid (via --padding-inline)
     already gives this row its edge gap. Doubling it pushed the CTA
     and trigger into overflow at 360–390px viewports. */
  padding-block-start: var(--spacing-2);
  gap: var(--spacing-2);
  height: 100%;
  color: var(--clr-content-primary);
  /* Prevent any descendant (e.g. the absolutely-positioned sheet) from
     introducing horizontal overflow at narrow viewports. `clip` doesn't
     create a scroll container (unlike `hidden`), so sticky positioning
     above still works correctly. */
  overflow-x: clip;
}

/* The inline Katalog button shouldn't stretch to the full row width —
   it sits next to the menu trigger and must hold its intrinsic size.
   The global `.btn { width: 100% }` mobile rule is opt-in for stacked
   stacks; the navbar's inline CTA opts out. */
.bar .cta {
  width: auto;
  flex-shrink: 0;
}

.logo-slot {
  display: inline-flex;
  flex-shrink: 0;
}

.logo-slot :deep(.logo) {
  width: var(--navbar-logo-mobile);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-shrink: 0;
}

.cta {
  white-space: nowrap;
}

.trigger {
  display: grid;
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

.items a,
.items .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: transparent;
  border: 0;
  padding: 0;
  font: inherit;
  color: var(--clr-content-primary);
  cursor: pointer;
  transition: color 160ms ease;
}

.items a[data-is-current="true"],
.items a:hover,
.items a:focus-visible,
.items .row:hover,
.items .row:focus-visible {
  color: var(--clr-accent-secondary);
}

.chevron {
  width: var(--sz-base);
  height: var(--sz-base);
  color: var(--clr-content-tertiary);
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

.row.toggle[data-expanded="true"] .chevron {
  transform: rotate(180deg);
  color: var(--clr-accent-secondary);
}
</style>
