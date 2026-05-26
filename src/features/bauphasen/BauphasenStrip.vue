<script setup lang="ts">
import { computed } from "vue";
import { getIcon } from "@/lib/icons";
import type { BuildPhase } from "./bauphasen.types";

const props = defineProps<{
  phases: BuildPhase[];
  /**
   * Optional deep-link target — when set, the strip becomes a series of
   * links to /dein-zuhause#<sectionId>-<slug>. When omitted, the cards
   * render as plain articles (the homepage uses this).
   *
   * Off by default — the homepage's surrounding CTA already routes users
   * to the full /dein-zuhause page, so the cards stay non-clickable to
   * avoid competing affordances.
   */
  linkBaseHref?: string;
}>();

// Bind once per phase so `<component :is>` swap is bookkeeping-free.
const items = computed(() =>
  props.phases.map((phase, i) => ({
    ...phase,
    index: String(i + 1).padStart(2, "0"),
    Icon: getIcon(phase.icon),
    href: props.linkBaseHref
      ? `${props.linkBaseHref}#phase-${phase.slug}`
      : null,
  })),
);
</script>

<template>
  <ol class="strip" aria-label="Drei Phasen ins eigene Zuhause">
    <li v-for="item in items" :key="item.slug" class="step">
      <component
        :is="item.href ? 'a' : 'article'"
        :href="item.href ?? undefined"
        class="card"
      >
        <figure class="frame">
          <img :src="item.imageURL" :alt="item.title" loading="lazy" />
        </figure>

        <div class="body">
          <header class="head">
            <span class="index" aria-hidden="true">{{ item.index }}</span>
            <component
              :is="item.Icon"
              class="icon"
              :size="20"
              :stroke-width="1.75"
              aria-hidden="true"
            />
          </header>
          <h3 class="title">{{ item.title }}</h3>
          <p class="teaser">{{ item.teaser }}</p>
        </div>
      </component>
    </li>
  </ol>
</template>

<style scoped>
.strip {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
  width: 100%;
}

@media (--from-tablet) {
  .strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    /* Tighter than spacing-4 — three columns are visually denser so a smaller
       gap reads as a single rhythmic group rather than three islands. */
    gap: var(--spacing-3);
  }
}

.step {
  min-width: 0;
}

.card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  text-decoration: none;
  color: inherit;
  height: 100%;
}

/* When the card is a link, give it a hover signal — image lifts, title shifts
   to the accent. Restraint over flourish; no scale, no shadow. */
a.card {
  transition: color 160ms ease;
}

a.card:hover .title {
  color: var(--clr-accent-secondary);
}

a.card:hover .frame img {
  transform: scale(1.02);
}

a.card:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 4px;
  border-radius: var(--radius-md);
}

/* ── Frame ── */
.frame {
  position: relative;
  margin: 0;
  width: 100%;
  /* Editorial 4:3 — wider than the /dein-zuhause carousel's 4:5 to keep the
     strip horizontally compact so it doesn't compete with the Overview
     section's three-pillar grid above. */
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--clr-surface-secondary);
}

.frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 320ms ease;
}

/* ── Body ── */
.body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  /* Pad-inline-start: 0 — the body sits flush under the image so the
     numerical anchor reads as the image's caption. */
}

.head {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-2);
}

.index {
  font-family: var(--font-secondary);
  font-style: italic;
  font-weight: var(--font-weight-regular);
  font-size: var(--fs-h4);
  line-height: 1;
  color: var(--clr-content-tertiary);
  font-feature-settings: "tnum";
}

.icon {
  color: var(--clr-content-secondary);
  /* Optical lift so the icon's baseline-ish midpoint sits near the
     numeral's x-height instead of trailing under it. */
  transform: translateY(0.15em);
}

/* Mobile: the strip reads as a single-column editorial sequence — push
   the numeral to display weight and bump the icon so the two together
   anchor the card. Restrained at tablet+ where three columns sit dense. */
@media (--mobile) {
  .head {
    gap: var(--spacing-3);
  }

  .index {
    font-size: var(--fs-h2);
  }

  .icon {
    /* Lucide :size sets width/height attrs — CSS wins. */
    width: 26px;
    height: 26px;
    transform: translateY(0.1em);
  }
}

.title {
  margin: 0;
  font-family: var(--font-primary);
  font-size: var(--fs-h6);
  font-weight: var(--font-weight-medium);
  line-height: var(--lh-heading);
  color: var(--clr-content-primary);
  letter-spacing: var(--ls-heading);
  transition: color 160ms ease;
}

.teaser {
  margin: 0;
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
  line-height: var(--lh-body);
}
</style>
