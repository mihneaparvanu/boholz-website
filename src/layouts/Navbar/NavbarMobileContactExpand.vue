<script setup lang="ts">
import { CalendarCheck, MapPin, ChevronRight } from "lucide-vue-next";
import type { Location } from "@/types/models";

/* Mobile expand block rendered nested under the "Kontakt" row in
   `NavbarMobile.vue`'s sheet. The parent owns the open/close state —
   this component just renders the sub-items when shown.

   Wiring (for the parent agent reconciling with NavbarMobile.vue):
   - keep a `const kontaktExpanded = ref(false)` in the sheet
   - on the Kontakt <li>, render a button that toggles it instead of
     the plain <a>; OR render both the link and a toggle affordance
   - mount this component below that <li> with `v-if="kontaktExpanded"`
   - pass `:locations="officeLocations"` (the prop already lifted to
     the Navbar root by this branch — pull it through NavbarMobile too)
   - bind @navclick="(href) => handleNavClick($event, href)" to reuse
     the sheet's existing fade-then-navigate handler.
*/
defineProps<{
  locations: Location[];
}>();

const emit = defineEmits<{ navclick: [href: string, event: MouseEvent] }>();

function onClick(event: MouseEvent, href: string) {
  emit("navclick", href, event);
}
</script>

<template>
  <div class="expand" role="group" aria-label="Kontakt Unterpunkte">
    <a
      class="primary-row"
      href="/vor-ort-beratung"
      @click="onClick($event, '/vor-ort-beratung')"
    >
      <span class="icon" aria-hidden="true">
        <CalendarCheck :size="18" :stroke-width="1.75" />
      </span>
      <span class="body">
        <span class="title">Vor-Ort-Beratung</span>
        <span class="lede">In unseren Musterhäusern</span>
      </span>
      <ChevronRight class="chev" :size="16" :stroke-width="1.75" aria-hidden="true" />
    </a>

    <div v-if="locations.length" class="locations">
      <p class="locations-title">
        <MapPin :size="12" :stroke-width="2" aria-hidden="true" />
        <span>Standorte</span>
      </p>
      <ul class="links">
        <li v-for="loc in locations" :key="loc.id">
          <a
            :href="`/vor-ort-beratung#${loc.slug}`"
            @click="onClick($event, `/vor-ort-beratung#${loc.slug}`)"
          >
            {{ loc.title }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.expand {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  /* Pull slightly to the inside so the block reads as a nested branch
     under "Kontakt", not a peer of the top-level items. */
  margin-inline-start: var(--spacing-3);
  padding-inline-start: var(--spacing-3);
  border-inline-start: 1px solid var(--clr-border-secondary);
}

.primary-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) 0;
  color: var(--clr-content-primary);
  transition: color 160ms ease;
}

.primary-row:hover,
.primary-row:focus-visible {
  color: var(--clr-accent-secondary);
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
  gap: 1px;
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
}

.locations-title {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-0);
  margin: 0 0 var(--spacing-1);
  font-size: var(--fs-body-sm);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--clr-content-tertiary);
  font-weight: var(--font-weight-medium);
}

.links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.links a {
  display: block;
  padding-block: var(--spacing-0);
  color: var(--clr-content-secondary);
  font-size: var(--fs-body);
  transition: color 160ms ease;
}

.links a:hover,
.links a:focus-visible {
  color: var(--clr-accent-secondary);
}
</style>
