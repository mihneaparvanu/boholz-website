<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ChevronRight } from "lucide-vue-next";
import { useScrollSpy } from "@/composables/useScrollSpy";
import { useScrollDirection } from "@/composables/useScrollDirection";

export type Section = { id: string; label: string; eyebrow?: string };

const props = defineProps<{
  pageTitle: string;
  sections: Section[];
  stickyOffset?: number;
}>();

const navbarHeight = computed(() => props.stickyOffset ?? 64);

// Two distinct offsets:
//   - detectionOffset is where the scroll-spy flips a section to "active".
//     Pushed deeper into the viewport (~120 px past the navbar) so the
//     active link reflects what the user is ABOUT to read, not what's
//     already scrolled away. Per user feedback: the indicator should
//     update 50–100 px before the section's top crosses the navbar.
//   - scrollTarget is where a section's top lands after a click. Kept
//     close to the navbar so a tap doesn't visually overshoot.
const SPY_BUFFER = 120;
const detectionOffset = computed(() => navbarHeight.value + SPY_BUFFER);
const scrollTarget = computed(() => navbarHeight.value + 16);

const ids = computed(() => props.sections.map((s) => s.id));
const trackedId = useScrollSpy(ids, { topOffset: detectionOffset });

// Click-lock — the tapped pill stays active for 2s regardless of what
// scroll-spy reports during the smooth scroll. Avoids the active-pill
// flicker as the page passes intermediate sections en route.
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

// The rail follows the navbar's hide-on-scroll: when the navbar slides
// away on scroll-down, the rail moves up to top: 0 so there's never a
// blank strip where the navbar used to be. Same threshold as Navbar so
// they move in sync.
const scrollDir = useScrollDirection({ threshold: 80 });
const railTop = computed(() =>
  scrollDir.value === "down" ? 0 : navbarHeight.value,
);

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

// Centre the active pill in the rail's horizontal scroll. .pills carries
// position: relative so pill.offsetLeft is reported relative to the
// scroll container (without that, offsetLeft walks up to the rail or
// body and the centering math drifts — that's the "active pill stays
// hidden" report).
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
// in view from the first paint, not only after the first scroll event.
onMounted(() => centerActivePill(activeId.value, true));
</script>

<template>
  <nav
    class="rail full-width"
    :aria-label="pageTitle"
    :style="{ '--rail-top': `${railTop}px` }"
  >
    <span class="title">
      {{ pageTitle }}
      <ChevronRight :size="14" :stroke-width="2" aria-hidden="true" />
    </span>
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
.rail {
  display: none;
}

@media (--below-desktop) {
  .rail {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    /* position: fixed (not sticky) so the rail stays pinned to the viewport
       forever — sticky stops once the parent's bottom edge is reached, which
       caused the rail to scroll away into the footer on tall pages. */
    position: fixed;
    top: var(--rail-top);
    inset-inline: 0;
    z-index: 9;
    isolation: isolate;
    background-color: var(--clr-surface-primary);
    border-block-end: 1px solid var(--clr-border-secondary);
    padding-block: var(--spacing-2);
    padding-inline: var(--padding-inline);
    /* Match the navbar's slide easing so the two move as one strip. */
    transition: top 220ms cubic-bezier(0.22, 1, 0.36, 1);
  }
}

.title {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  flex-shrink: 0;
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-primary);
}

.title :deep(svg) {
  color: var(--clr-content-tertiary);
}

.pills {
  /* position: relative makes .pills the offsetParent for its children, so
     pill.offsetLeft is reported relative to this scroll container. Without
     this, offsetLeft walks up the tree to the rail (or body), the centering
     math drifts by the rail's leading padding + title width, and the active
     pill ends up off-screen — the "active link stays hidden" report. */
  position: relative;
  display: flex;
  gap: var(--spacing-4);
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: auto;
  scrollbar-width: none;
  mask-image: linear-gradient(
    to right,
    #000 0,
    #000 calc(100% - var(--spacing-4)),
    transparent 100%
  );
}

.pills::-webkit-scrollbar {
  display: none;
}

.pill {
  display: inline-block;
  padding-block: var(--spacing-2);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-tertiary);
  white-space: nowrap;
  text-decoration: none;
  border-block-end: 2px solid transparent;
  transition:
    color 160ms ease,
    border-color 160ms ease;
}

.pill.active {
  color: var(--clr-accent-primary);
  border-block-end-color: var(--clr-accent-primary);
}

.pill:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}
</style>
