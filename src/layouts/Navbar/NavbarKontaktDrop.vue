<script setup lang="ts">
import { Motion } from "motion-v";
import { MapPin, CalendarCheck, ChevronRight } from "lucide-vue-next";
import type { Location } from "@/types/models";

/* Kontakt subnav — restrained single-column variant.
   We pattern-match NavbarDrop's outer shape (border, padding, b-radius,
   surface) but keep contents intentionally sparse: a primary affordance
   (Vor-Ort-Beratung with one-line lede) plus the Standorte list, each
   row linking into the existing #anchor on /vor-ort-beratung. Two items
   + a list doesn't earn a second column. */
const props = defineProps<{
  locations: Location[];
}>();

const EASE = [0.22, 1, 0.36, 1] as const;

/* Locations come pre-filtered (`exceptKind: "showhouse"`) from the parent.
   Sorted by title in the loader. */
const offices = props.locations;
</script>

<template>
  <div class="drop-panel">
    <Motion
      tag="a"
      class="primary-row"
      href="/vor-ort-beratung"
      :initial="{ opacity: 0, y: 4 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.28, ease: EASE }"
    >
      <span class="icon" aria-hidden="true">
        <CalendarCheck :size="20" :stroke-width="1.75" />
      </span>
      <span class="body">
        <span class="title">Vor-Ort-Beratung</span>
        <span class="lede">
          Persönliche Beratung in unseren Musterhäusern
        </span>
      </span>
      <ChevronRight class="chev" :size="18" :stroke-width="1.75" aria-hidden="true" />
    </Motion>

    <div v-if="offices.length" class="locations">
      <p class="locations-title">
        <MapPin :size="14" :stroke-width="2" aria-hidden="true" />
        <span>Standorte</span>
      </p>
      <ul class="links">
        <Motion
          v-for="(loc, i) in offices"
          :key="loc.id"
          tag="li"
          :initial="{ opacity: 0, x: -6 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.28, delay: 0.06 + i * 0.03, ease: EASE }"
        >
          <a :href="`/vor-ort-beratung#${loc.slug}`">{{ loc.title }}</a>
        </Motion>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.drop-panel {
  /* Outer chrome mirrors NavbarDrop so the two dropdowns feel like siblings. */
  --panel-padding: var(--spacing-2);
  --panel-b-radius: calc(var(--panel-padding) + var(--radius-md));
  border: 2px solid var(--clr-border-primary);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--panel-padding);
  position: absolute;
  top: var(--spacing-4);
  /* Narrower than NavbarDrop — the content is sparse, two items + a
     list don't earn full nav width. Anchor to the right under "Kontakt". */
  inset-inline-end: 0;
  width: min(420px, calc(100vw - 2 * var(--padding-inline)));
  background-color: var(--clr-surface-primary);
  border-radius: var(--panel-b-radius);
}

.primary-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  color: var(--clr-content-primary);
  transition:
    background 160ms ease,
    color 160ms ease;
}

.primary-row:hover,
.primary-row:focus-visible {
  background: var(--clr-surface-secondary);
  color: var(--clr-content-primary);
  opacity: 1;
}

.primary-row .icon {
  display: grid;
  place-items: center;
  width: var(--control-height-sm);
  height: var(--control-height-sm);
  border-radius: var(--radius-sm);
  background: color-mix(
    in srgb,
    var(--clr-accent-secondary) 10%,
    var(--clr-surface-primary)
  );
  color: var(--clr-accent-secondary);
  flex-shrink: 0;
}

.primary-row .body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-0);
  min-width: 0;
}

.primary-row .title {
  font-size: var(--fs-body);
  font-weight: var(--font-weight-medium);
}

.primary-row .lede {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-tertiary);
  line-height: var(--lh-body);
}

.primary-row .chev {
  color: var(--clr-content-quaternary);
  transition: transform 160ms ease, color 160ms ease;
}
.primary-row:hover .chev,
.primary-row:focus-visible .chev {
  color: var(--clr-accent-secondary);
  transform: translateX(2px);
}

.locations {
  padding: var(--spacing-3);
  padding-block-start: var(--spacing-2);
  border-block-start: 1px solid var(--clr-border-secondary);
}

.locations-title {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  margin: 0 0 var(--spacing-2);
  font-size: var(--fs-body-sm);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--clr-content-tertiary);
  font-weight: var(--font-weight-medium);
}

.links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-0);
}

.links a {
  display: block;
  padding-block: var(--spacing-0);
  padding-inline: var(--spacing-0);
  color: var(--clr-content-secondary);
  font-size: var(--fs-body);
  transition: color 160ms ease;
}

.links a:hover,
.links a:focus-visible {
  color: var(--clr-accent-secondary);
  opacity: 1;
}
</style>
