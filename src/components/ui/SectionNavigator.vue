<script setup lang="ts">
import { computed, ref, watch } from "vue";
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
// Scroll-spy activation line: navbar + rail height — the section flips
// active as its top slides under the rail's bottom edge.
const spyOffset = computed(() => navbarHeight.value + 44);
const ids = computed(() => props.sections.map((s) => s.id));
const activeId = useScrollSpy(ids, { topOffset: spyOffset });

// Mirror the navbar's hide-on-scroll: when the navbar slides away, the
// rail follows it up to `top: 0` so there's never a blank strip where
// the navbar used to be. Same threshold as Navbar.vue so they move in sync.
const scrollDir = useScrollDirection({ threshold: 80 });
const railTop = computed(() =>
  scrollDir.value === "down" ? 0 : navbarHeight.value,
);

const pillsRef = ref<HTMLElement | null>(null);

const scrollTo = (id: string, e: Event): void => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - spyOffset.value + 1;
  window.scrollTo({ top, behavior: "smooth" });
};

// Horizontally centre the active pill inside the rail WITHOUT touching the
// page scroll. `scrollIntoView` walks every scrollable ancestor — even with
// `block: "nearest"` it can yank the document by a pixel or two when the
// sticky rail sits flush against the navbar, which reads as a jitter on the
// way back up. Scrolling the pills container directly avoids that entirely.
watch(activeId, (id) => {
  const pills = pillsRef.value;
  if (!id || !pills) return;
  const pill = pills.querySelector<HTMLElement>(
    `[data-id="${CSS.escape(id)}"]`,
  );
  if (!pill) return;
  const left = pill.offsetLeft - (pills.clientWidth - pill.offsetWidth) / 2;
  pills.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
});
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
    position: sticky;
    top: var(--rail-top);
    z-index: 9;
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
