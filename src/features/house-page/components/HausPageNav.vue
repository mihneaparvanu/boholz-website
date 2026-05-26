<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useScrollSpy } from "@/lib/useScrollSpy";

export type HausSection = { id: string; label: string };

const props = withDefaults(
  defineProps<{
    sections: HausSection[];
    /**
     * Active-pill background tone. Defaults to "secondary" for the haus
     * detail (Danwood) layout. Pass "primary" on /hauser so the active pill
     * reads as the brand-primary signal there.
     */
    tone?: "primary" | "secondary";
  }>(),
  { tone: "secondary" },
);

// Read --navbar-height live from CSS so JS stays in sync with the design
// system across breakpoints. Previously this was hardcoded (84 desktop /
// 64 mobile), so any change to the token left the activation line out of
// sync with the navbar and surfaced as "the indicator highlights the
// wrong section" on mobile.
const navbarHeight = ref(64);
onMounted(() => {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--navbar-height")
    .trim();
  const parsed = parseInt(raw, 10);
  if (Number.isFinite(parsed) && parsed > 0) navbarHeight.value = parsed;
});

// Two distinct offsets — see SectionNavigator for the same pattern.
//   detectionOffset: deeper into the viewport so the active pill flips
//     ~120 px before the section's top crosses the navbar.
//   scrollTarget:    where the section's top lands after a click — close
//     to the navbar so the tap doesn't visually overshoot.
const SPY_BUFFER = 120;
const detectionOffset = computed(() => navbarHeight.value + SPY_BUFFER);
const scrollTarget = computed(() => navbarHeight.value + 16);

const ids = computed(() => props.sections.map((s) => s.id));
const trackedId = useScrollSpy(ids, { topOffset: detectionOffset });

// Click-lock: when the user taps a pill, persist that selection for 2s
// regardless of what scroll-spy reports. Gives a clear visual ack that the
// tap registered and prevents flicker as the smooth-scroll passes
// intermediate sections.
const lockedId = ref<string | null>(null);
let lockTimer: number | null = null;
const LOCK_MS = 2000;

const clearLock = (): void => {
  if (lockTimer !== null) {
    window.clearTimeout(lockTimer);
    lockTimer = null;
  }
  lockedId.value = null;
};

onBeforeUnmount(clearLock);

const activeId = computed(() => lockedId.value ?? trackedId.value);

const pillsRef = ref<HTMLElement | null>(null);

const scrollTo = (id: string, e: Event): void => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  lockedId.value = id;
  if (lockTimer !== null) window.clearTimeout(lockTimer);
  lockTimer = window.setTimeout(() => {
    lockedId.value = null;
    lockTimer = null;
  }, LOCK_MS);
  const top =
    el.getBoundingClientRect().top + window.scrollY - scrollTarget.value + 1;
  window.scrollTo({ top, behavior: "smooth" });
};

// Centre the active pill in the floating bar's horizontal scroll. .pills
// has position: relative so pill.offsetLeft is reported relative to the
// scroll container (without that, offsetLeft walks up the tree and the
// centering math drifts — the "active link stays hidden" report).
const centerActivePill = (id: string | null, instant = false) => {
  const pills = pillsRef.value;
  if (!id || !pills) return;
  const pill = pills.querySelector<HTMLElement>(
    `[data-id="${CSS.escape(id)}"]`,
  );
  if (!pill) return;
  const left = pill.offsetLeft - (pills.clientWidth - pill.offsetWidth) / 2;
  pills.scrollTo({
    left: Math.max(0, left),
    behavior: instant ? "auto" : "smooth",
  });
};

watch(activeId, (id) => centerActivePill(id));

// Centre the initial active pill instantly on mount so the indicator is
// in view from the first paint.
onMounted(() => centerActivePill(activeId.value, true));
</script>

<template>
  <nav
    class="nav full-width"
    aria-label="Hausseiten-Navigation"
    :data-tone="tone"
  >
    <ul ref="pillsRef" class="pills" role="list">
      <li v-for="s in sections" :key="s.id">
        <a
          :href="`#${s.id}`"
          :data-id="s.id"
          :class="['pill', { active: activeId === s.id }]"
          :aria-current="activeId === s.id ? 'location' : undefined"
          @click="scrollTo(s.id, $event)"
        >
          {{ s.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  justify-content: center;
  pointer-events: none;
  /* Active-pill background swaps per page via the `tone` prop. */
  --pill-active-bg: var(--clr-accent-secondary);
}

.nav[data-tone="primary"] {
  --pill-active-bg: var(--clr-accent-primary);
}

.pills {
  /* position: relative so pill.offsetLeft resolves against this scroll
     container; without it the centering math walks up to the nav (or body)
     and the active pill ends up off-screen. */
  position: relative;
  display: flex;
  gap: var(--spacing-1);
  align-items: center;
  margin: 0;
  padding: var(--spacing-1);
  list-style: none;
  pointer-events: auto;
  overflow-x: auto;
  scrollbar-width: none;
}

.pills::-webkit-scrollbar {
  display: none;
}

.pill {
  display: inline-flex;
  align-items: center;
  padding-block: var(--spacing-2);
  padding-inline: var(--spacing-3);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-secondary);
  white-space: nowrap;
  text-decoration: none;
  border-radius: var(--radius-full);
  transition:
    background 160ms ease,
    color 160ms ease;
}

.pill:hover {
  background: var(--clr-surface-tertiary);
  color: var(--clr-content-primary);
}

.pill.active {
  background: var(--pill-active-bg);
  color: var(--clr-pure-white);
}

/* Focus ring matches the active tone so a focused pill never reads as a
   different state than an active one. Previously this hardcoded
   --clr-accent-primary, which caused tapped pills on a "secondary"-tone
   page to flash in the primary accent — exactly the "sometimes primary,
   sometimes secondary" flicker reported on mobile. */
.pill:focus-visible {
  outline: 2px solid var(--pill-active-bg);
  outline-offset: 2px;
}

/* Desktop: sticky-top pill row, just under the navbar */
@media (--from-desktop) {
  .nav {
    position: sticky;
    top: var(--navbar-height);
    z-index: 9;
    background: color-mix(
      in srgb,
      var(--clr-surface-primary) 92%,
      transparent
    );
    backdrop-filter: blur(8px);
    border-block-end: 1px solid var(--clr-border-secondary);
    padding-block: var(--spacing-2);
    padding-inline: var(--padding-inline);
  }

  .pills {
    max-width: var(--content-max-width);
    width: 100%;
    justify-content: flex-start;
  }
}

/* Mobile + tablet: floating bottom pill bar */
@media (--below-desktop) {
  .nav {
    position: fixed;
    inset-block-end: var(--spacing-3);
    inset-inline: var(--padding-inline);
    z-index: 9;
  }

  .pills {
    background: var(--clr-surface-primary);
    border: 1px solid var(--clr-border-secondary);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-2);
    padding: var(--spacing-1);
    max-width: 100%;
    mask-image: linear-gradient(
      to right,
      transparent 0,
      #000 var(--spacing-2),
      #000 calc(100% - var(--spacing-2)),
      transparent 100%
    );
  }
}
</style>
