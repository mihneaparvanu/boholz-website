<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useScrollSpy } from "@/composables/useScrollSpy";

export type HausSection = { id: string; label: string };

const props = defineProps<{
  sections: HausSection[];
}>();

const desktopOffset = 84 + 16;
const mobileOffset = 64 + 8;

const spyOffset = computed(() =>
  typeof window !== "undefined" && window.innerWidth < 1024
    ? mobileOffset
    : desktopOffset,
);

const ids = computed(() => props.sections.map((s) => s.id));
const activeId = useScrollSpy(ids, { topOffset: spyOffset });

const pillsRef = ref<HTMLElement | null>(null);

const scrollTo = (id: string, e: Event): void => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - spyOffset.value + 1;
  window.scrollTo({ top, behavior: "smooth" });
};

// Mirror SectionNavigator: keep the active pill horizontally centred inside
// the floating bar without yanking the document scroll.
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
  <nav class="nav full-width" aria-label="Hausseiten-Navigation">
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
}

.pills {
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
  background: var(--clr-accent-secondary);
  color: var(--clr-pure-white);
}

.pill:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
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
