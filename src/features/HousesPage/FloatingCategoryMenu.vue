<script setup lang="ts">
/**
 * FloatingCategoryMenu — Apple-style floating pill bar for category
 * selection on /hauser mobile. Pinned to the bottom of the viewport so
 * the catalog scrolls behind it and the active category stays one tap
 * away regardless of scroll position.
 *
 * Same click-lock + horizontal-scroll-on-active mechanics as
 * HausPageNav so behaviour is consistent across both floating bars.
 * Active pill uses accent-primary (the brand's foreground signal on
 * /hauser, per client direction); HausPageNav defaults to
 * accent-secondary on /haus.
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import type { HouseCategory } from "@/types/models";

const props = defineProps<{
  categories: HouseCategory[];
  /** Currently selected category id (driven by the parent). */
  selectedId: string | null | undefined;
}>();

const emit = defineEmits<{
  select: [category: HouseCategory];
}>();

const pillsRef = ref<HTMLElement | null>(null);

// 2s click-lock so the pressed pill stays visually selected long enough
// to read as "your tap registered" before the parent's state propagates
// back. Avoids flicker if the parent does any async work on select.
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

const activeId = computed(() => lockedId.value ?? props.selectedId ?? null);

const handleSelect = (category: HouseCategory) => {
  lockedId.value = category.id;
  if (lockTimer !== null) window.clearTimeout(lockTimer);
  lockTimer = window.setTimeout(() => {
    lockedId.value = null;
    lockTimer = null;
  }, LOCK_MS);
  emit("select", category);
};

// Keep the active pill horizontally centred inside the floating bar
// when selection changes, without yanking the document scroll.
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
  <nav class="menu" aria-label="Kategorie wählen">
    <ul ref="pillsRef" class="pills" role="list">
      <li v-for="cat in categories" :key="cat.id">
        <button
          type="button"
          :data-id="cat.id"
          :class="['pill', { active: activeId === cat.id }]"
          :aria-pressed="activeId === cat.id"
          @click="handleSelect(cat)"
        >
          {{ cat.name }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.menu {
  position: fixed;
  inset-block-end: calc(var(--spacing-3) + env(safe-area-inset-bottom, 0px));
  inset-inline: var(--padding-inline);
  z-index: 9;
  display: flex;
  justify-content: center;
  /* Wrapper itself is pointer-transparent so taps outside the pill cluster
     fall through to whatever's beneath; the .pills element re-enables. */
  pointer-events: none;
}

.pills {
  /* position: relative so pill.offsetLeft resolves against this scroll
     container, keeping the active-pill centering math accurate (see
     HausPageNav / SectionNavigator for the same pattern). */
  position: relative;
  display: flex;
  gap: var(--spacing-1);
  align-items: center;
  margin: 0;
  padding: var(--spacing-1);
  list-style: none;
  pointer-events: auto;
  /* Frosted surface — translucent base + blur so the catalog reads
     through the bar. Falls back to a near-opaque surface where backdrop
     filter isn't supported (older Firefox/iOS). */
  background: color-mix(in srgb, var(--clr-surface-primary) 82%, transparent);
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-2);
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  /* Soft edge fade so pills scrolling off the side don't truncate
     against a hard border. */
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 var(--spacing-2),
    #000 calc(100% - var(--spacing-2)),
    transparent 100%
  );
}

.pills::-webkit-scrollbar {
  display: none;
}

.pill {
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding-block: var(--spacing-2);
  padding-inline: var(--spacing-3);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-secondary);
  white-space: nowrap;
  border-radius: var(--radius-full);
  transition:
    background 160ms ease,
    color 160ms ease;
}

.pill:hover {
  color: var(--clr-content-primary);
}

.pill.active {
  background: var(--clr-accent-primary);
  color: var(--clr-pure-white);
}

.pill:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

@supports not (backdrop-filter: blur(1px)) {
  .pills {
    background: var(--clr-surface-primary);
  }
}
</style>
