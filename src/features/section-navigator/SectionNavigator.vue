<script setup lang="ts">
import { computed } from "vue";
import { ChevronRight } from "lucide-vue-next";
import { useScrollDirection } from "@/features/section-navigator/useScrollDirection";

export type Section = { id: string; label: string; eyebrow?: string };

const props = defineProps<{
  pageTitle: string;
  sections: Section[];
  stickyOffset?: number;
}>();

const navbarHeight = computed(() => props.stickyOffset ?? 64);

// Where a section's top lands after a click. Kept close to the navbar so a
// tap doesn't visually overshoot.
const scrollTarget = computed(() => navbarHeight.value + 16);

// The rail follows the navbar's hide-on-scroll: when the navbar slides
// away on scroll-down, the rail moves up to top: 0 so there's never a
// blank strip where the navbar used to be. Same threshold as Navbar so
// they move in sync.
const scrollDir = useScrollDirection({ threshold: 80 });
const railTop = computed(() =>
  scrollDir.value === "down" ? 0 : navbarHeight.value,
);

const scrollTo = (id: string, e: Event): void => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - scrollTarget.value + 1;
  window.scrollTo({ top, behavior: "smooth" });
};

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
    <ul class="pills" role="list">
      <li v-for="s in sections" :key="s.id">
        <a
          :href="`#${s.id}`"
          :data-id="s.id"
          class="pill"
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


.pill:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}
</style>
