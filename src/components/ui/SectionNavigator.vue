<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { motion, useReducedMotion } from "motion-v";
import { useElementVisibility, useWindowScroll } from "@vueuse/core";
import { ArrowDown } from "lucide-vue-next";
import { useScrollSpy } from "@/composables/useScrollSpy";

export type Section = {
  id: string;
  label: string;
  eyebrow?: string;
};

const props = withDefaults(
  defineProps<{
    sections: Section[];
    progress?: boolean;
    stickyOffset?: number;
  }>(),
  {
    progress: true,
    stickyOffset: 64,
  },
);

// --- Scroll-spy --------------------------------------------------------------
// Activation line sits at navbar-bottom + rail height — the active section is
// the one whose top has just slid under the rail.
const RAIL_HEIGHT = 48;
const activationOffset = computed(() => props.stickyOffset + RAIL_HEIGHT);
const ids = computed(() => props.sections.map((s) => s.id));
const activeId = useScrollSpy(ids, { topOffset: activationOffset });

// --- Sticky rail visibility --------------------------------------------------
// Rail appears once the inline overview has scrolled off-screen AND the page
// has moved past the navbar's solid-state threshold (the navbar uses
// useScrolledPast(10) — we wait until well past that so we don't pop in
// while the navbar is still mid-transition).
const overviewRef = ref<HTMLElement | null>(null);
const overviewVisible = useElementVisibility(overviewRef);
const { y: scrollY } = useWindowScroll();
const railVisible = computed(
  () => !overviewVisible.value && scrollY.value > props.stickyOffset,
);

// --- Progress (across navigated range only) ----------------------------------
const progressPct = ref(0);
const recomputeProgress = (): void => {
  if (typeof window === "undefined" || props.sections.length === 0) {
    progressPct.value = 0;
    return;
  }
  const first = document.getElementById(props.sections[0].id);
  const last = document.getElementById(
    props.sections[props.sections.length - 1].id,
  );
  if (!first || !last) {
    progressPct.value = 0;
    return;
  }
  const start = first.getBoundingClientRect().top + window.scrollY;
  const end =
    last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
  const span = Math.max(end - start, 1);
  const cur = Math.min(Math.max(window.scrollY - start, 0), span);
  progressPct.value = (cur / span) * 100;
};
watch(scrollY, recomputeProgress);

// --- Click → smooth scroll → focus section heading ---------------------------
const reduced = useReducedMotion();
const railRef = ref<HTMLElement | null>(null);

const scrollToSection = (id: string, e?: Event): void => {
  e?.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - activationOffset.value + 1;
  window.scrollTo({
    top,
    behavior: reduced.value ? "auto" : "smooth",
  });
  // After scroll settles, move focus to the section's heading.
  const moveFocus = (): void => {
    const heading = el.querySelector<HTMLElement>(
      "h1, h2, h3, h4, [data-section-heading]",
    );
    const target = heading ?? el;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  if (reduced.value) {
    nextTick(moveFocus);
  } else {
    // Heuristic: smooth scroll typically completes ≤ 700ms.
    window.setTimeout(moveFocus, 720);
  }
  // Keep the active pill in view on the rail (horizontal-only scroll).
  centerPillInRail(id);
};

const centerPillInRail = (id: string): void => {
  if (!railRef.value) return;
  const pills = railRef.value.querySelector<HTMLElement>(".pills");
  const pill = railRef.value.querySelector<HTMLElement>(
    `[data-pill-id="${CSS.escape(id)}"]`,
  );
  if (!pills || !pill) return;
  const target =
    pill.offsetLeft - pills.clientWidth / 2 + pill.offsetWidth / 2;
  pills.scrollTo({
    left: Math.max(0, target),
    behavior: reduced.value ? "auto" : "smooth",
  });
};

// --- Keyboard: arrow keys cycle pills within a surface -----------------------
const onPillKeydown = (
  e: KeyboardEvent,
  surface: "overview" | "rail",
): void => {
  if (
    e.key !== "ArrowRight" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowDown" &&
    e.key !== "ArrowUp"
  ) {
    return;
  }
  e.preventDefault();
  const root = surface === "rail" ? railRef.value : overviewRef.value;
  if (!root) return;
  const pills = Array.from(
    root.querySelectorAll<HTMLAnchorElement>("[data-pill-id]"),
  );
  const current = document.activeElement as HTMLElement | null;
  const idx = pills.findIndex((p) => p === current);
  const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
  const next = pills[(idx + dir + pills.length) % pills.length];
  next?.focus();
};

// --- When scroll-spy moves the active pill, scroll the rail to follow --------
watch(activeId, (id) => {
  if (!railVisible.value || !id) return;
  centerPillInRail(id);
});

// Also recentre when the rail first becomes visible (the user may have
// landed on a section before the rail mounted into view).
watch(railVisible, (visible) => {
  if (visible && activeId.value) {
    // Wait one frame so the rail has a non-zero layout width.
    requestAnimationFrame(() => centerPillInRail(activeId.value!));
  }
});
</script>

<template>
  <!-- Inline overview: at top of content; full section list with eyebrow + label -->
  <nav
    ref="overviewRef"
    class="overview"
    aria-label="Auf dieser Seite"
  >
    <p class="head">Auf dieser Seite</p>
    <ul class="grid" role="list">
      <li v-for="s in sections" :key="s.id">
        <a
          :href="`#${s.id}`"
          :data-pill-id="s.id"
          :class="['item', { active: activeId === s.id }]"
          :aria-current="activeId === s.id ? 'location' : undefined"
          @click="scrollToSection(s.id, $event)"
          @keydown="onPillKeydown($event, 'overview')"
        >
          <ArrowDown :size="14" :stroke-width="2" aria-hidden="true" />
          <span class="text">
            <span v-if="s.eyebrow" class="eyebrow">{{ s.eyebrow }}</span>
            <span class="label">{{ s.label }}</span>
          </span>
        </a>
      </li>
    </ul>
  </nav>

  <!-- Sticky pill rail: shown after overview scrolls off-screen -->
  <nav
    ref="railRef"
    class="rail full-width"
    aria-label="Schnellnavigation"
    :style="{ '--sticky-offset': `${stickyOffset}px` }"
    :data-visible="railVisible || undefined"
    :aria-hidden="!railVisible"
  >
    <div class="rail-inner">
      <ul class="pills" role="list">
        <li v-for="s in sections" :key="s.id">
          <a
            :href="`#${s.id}`"
            :data-pill-id="s.id"
            :tabindex="railVisible ? 0 : -1"
            :class="['pill', { active: activeId === s.id }]"
            :aria-current="activeId === s.id ? 'location' : undefined"
            @click="scrollToSection(s.id, $event)"
            @keydown="onPillKeydown($event, 'rail')"
          >
            {{ s.label }}
          </a>
        </li>
      </ul>
      <div v-if="progress" class="bar" aria-hidden="true">
        <motion.div
          class="fill"
          :animate="{ scaleX: progressPct / 100 }"
          :transition="{
            type: 'tween',
            duration: reduced ? 0 : 0.18,
            ease: 'easeOut',
          }"
        />
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* ---------- Inline overview ---------- */
.overview {
  display: flex;
  flex-direction: column;
  /* Larger gap between the section heading and the first row — the
     small-caps tracking on `.head` needs room to breathe. */
  gap: var(--spacing-4);
  padding-block: var(--spacing-5);
  border-block: 1px solid var(--clr-border-secondary);
}

.head {
  /* Aligned to the text column of each item below: items have a 14px icon
     plus a spacing-2 column gap before the text. Indenting the head by the
     same amount lines its left edge up with the labels and eyebrows. */
  margin: 0;
  margin-inline-start: calc(14px + var(--spacing-2));
  font-size: var(--fs-body-sm);
  text-transform: uppercase;
  /* Slightly tighter tracking than --tracking-eyebrow — body-sm is small
     enough that 0.12em starts looking loose. */
  letter-spacing: 0.08em;
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-tertiary);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: var(--spacing-5);
  /* Looser item-to-item rhythm — the items themselves padded tightly,
     so the rhythm comes from row-gap. */
  row-gap: var(--spacing-2);
  margin: 0;
  padding: 0;
}

@media (--from-tablet) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

.item {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: var(--spacing-2);
  /* Slightly less padding on the icon side — the leading 14px ArrowDown
     already sits inside its own visual box. */
  padding-block: var(--spacing-2);
  padding-inline: var(--spacing-1) var(--spacing-2);
  margin-inline: calc(-1 * var(--spacing-1));
  /* Tap-target floor for mobile — single-line items can otherwise drop
     below 44px. Two-line items (with eyebrow) naturally exceed it. */
  min-height: 44px;
  border-radius: var(--radius-md);
  color: var(--clr-content-primary);
  text-decoration: none;
  transition:
    background-color 160ms ease,
    color 160ms ease;
}

.item :deep(svg) {
  color: var(--clr-content-tertiary);
  transition: color 160ms ease;
}

.text {
  display: flex;
  flex-direction: column;
  /* Tight vertical rhythm inside the two-line item — eyebrow→label hug. */
  gap: calc(var(--spacing-0) * 0.5);
  min-width: 0;
}

.eyebrow {
  font-size: calc(var(--fs-body-sm) * 0.88);
  text-transform: uppercase;
  /* Tighter than --tracking-eyebrow — at body-sm × 0.88 (≈11–13px),
     0.12em looks loose; 0.06em reads precise. */
  letter-spacing: 0.06em;
  color: var(--clr-content-tertiary);
  font-weight: var(--font-weight-medium);
  line-height: 1.2;
}

.label {
  font-size: var(--fs-body);
  font-weight: var(--font-weight-medium);
  line-height: var(--lh-heading);
}

/* Rest → hover → active states */
.item:hover {
  background-color: var(--clr-surface-secondary);
  opacity: 1; /* override global a:hover */
}
.item:hover :deep(svg) {
  color: var(--clr-content-primary);
}

.item.active {
  /* Primary accent on this larger surface — accent at scale per the project rule. */
  background-color: color-mix(
    in srgb,
    var(--clr-accent-primary) 9%,
    transparent
  );
  color: var(--clr-content-primary);
}
.item.active :deep(svg) {
  color: var(--clr-accent-primary);
}

.item:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

/* ---------- Sticky pill rail ---------- */
.rail {
  position: sticky;
  top: var(--sticky-offset, var(--navbar-height));
  z-index: 9;
  background-color: var(--clr-surface-primary);
  border-block-end: 1px solid var(--clr-border-secondary);
  /* Subtle slide-in + opacity when overview leaves viewport. CSS handles it
     because the motion is trivial and `motion-v` would add weight for no win. */
  opacity: 0;
  transform: translateY(-6px);
  pointer-events: none;
  transition:
    opacity 200ms ease,
    transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.rail[data-visible] {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.rail-inner {
  /* Re-create the wrapper's content column without re-declaring the full grid. */
  position: relative;
  max-width: var(--content-max-width);
  margin-inline: auto;
  padding-inline: var(--padding-inline);
}

.pills {
  display: flex;
  gap: var(--spacing-1);
  align-items: center;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  /* Right-edge fade hint on mobile when content overflows. */
  mask-image: linear-gradient(
    to right,
    #000 0,
    #000 calc(100% - var(--spacing-4)),
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    #000 0,
    #000 calc(100% - var(--spacing-4)),
    transparent 100%
  );
  scrollbar-width: none;
  padding-block: var(--spacing-1);
  padding-inline-end: var(--spacing-4);
  list-style: none;
  margin: 0;
}
.pills::-webkit-scrollbar {
  display: none;
}

@media (--from-tablet) {
  .pills {
    mask-image: none;
    -webkit-mask-image: none;
    padding-inline-end: 0;
  }
}

.pill {
  display: inline-flex;
  align-items: center;
  /* Min-height instead of fixed height — gives the pill room to grow on
     mobile where the tap-target floor is the binding constraint. */
  min-height: var(--control-height-sm);
  padding-block: var(--spacing-1);
  padding-inline: var(--spacing-2);
  border-radius: var(--radius-full);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  color: var(--clr-content-tertiary);
  white-space: nowrap;
  scroll-snap-align: center;
  text-decoration: none;
  transition:
    color 160ms ease,
    background-color 160ms ease;
}

@media (--mobile) {
  .pill {
    /* Tap target floor — 36px is the practical minimum for a sticky-rail
       pill where pills sit in a horizontal scroller; vertical room is
       limited by the rail's height. */
    min-height: 36px;
    padding-inline: var(--spacing-3);
  }
}

.pill:hover {
  color: var(--clr-content-primary);
  opacity: 1;
}

.pill.active {
  /* Secondary accent on this smaller surface — primary's contrast is too
     light against pure white at 13px; the deeper blue holds up. */
  color: var(--clr-pure-white);
  background-color: var(--clr-accent-secondary);
}

.pill:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

/* ---------- Progress bar ---------- */
.bar {
  position: absolute;
  inset-inline: 0;
  bottom: -1px; /* sits over the hairline border-block-end */
  height: 2px;
  background-color: transparent;
  overflow: hidden;
  pointer-events: none;
}

.fill {
  height: 100%;
  width: 100%;
  background-color: var(--clr-accent-primary);
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform;
}
</style>
