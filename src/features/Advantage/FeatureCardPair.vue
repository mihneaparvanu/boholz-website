<script setup lang="ts">
import { computed } from "vue";
import { Check } from "lucide-vue-next";
import { getIcon } from "@/utils/icons";
import type { FeatureCard } from "./advantage.types";

const props = defineProps<{
  left: FeatureCard;
  right: FeatureCard;
  /**
   * Optional accent on one card — "left" or "right" tints the title and
   * elevates that card subtly. "none" (default) treats both as equal.
   * Use when one option is the recommended upgrade (e.g. ECO Nature Plus).
   */
  accent?: "none" | "left" | "right";
}>();

const accent = computed(() => props.accent ?? "none");

const cards = computed(() => [
  { card: props.left, side: "left" as const },
  { card: props.right, side: "right" as const },
]);
</script>

<template>
  <div class="pair" :data-accent="accent">
    <article
      v-for="{ card, side } in cards"
      :key="side"
      class="card"
      :data-active="accent === side"
    >
      <figure class="frame">
        <img
          :src="card.imageURL"
          :alt="card.imageAlt"
          loading="lazy"
        />
      </figure>

      <div class="body">
        <header class="head">
          <component
            v-if="card.icon"
            :is="getIcon(card.icon)"
            :size="14"
            :stroke-width="2"
            aria-hidden="true"
          />
          <span class="eyebrow">{{ card.eyebrow }}</span>
        </header>

        <h3 class="title">{{ card.title }}</h3>
        <p v-if="card.lede" class="lede">{{ card.lede }}</p>

        <ul class="bullets">
          <li v-for="point in card.bullets" :key="point">
            <Check
              class="check"
              :size="16"
              :stroke-width="2"
              aria-hidden="true"
            />
            <span>{{ point }}</span>
          </li>
        </ul>
      </div>
    </article>
  </div>
</template>

<style scoped>
.pair {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
  width: 100%;
}

@media (--from-tablet) {
  .pair {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-4);
  }
}

.card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--clr-surface-primary);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-lg);
  min-width: 0;
  height: 100%;
  transition:
    border-color 200ms ease,
    background 200ms ease;
}

/* Accent card — borrows the secondary accent (deeper blue) for the border tint
   so it's recognisable as "the upgrade" without screaming. Per project rule,
   secondary accent on smaller elements (the card chrome). */
.card[data-active="true"] {
  border-color: color-mix(in srgb, var(--clr-accent-secondary) 28%, var(--clr-border-secondary));
  background: color-mix(in srgb, var(--clr-accent-secondary) 3%, var(--clr-surface-primary));
}

.frame {
  position: relative;
  margin: 0;
  width: 100%;
  /* Wider than 4:5 so two cards side by side don't dominate the page
     vertically; matches BauphasenStrip's 4:3 rhythm. */
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
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  min-width: 0;
}

.head {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  color: var(--clr-content-tertiary);
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: var(--tracking-eyebrow);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-tertiary);
}

.card[data-active="true"] .head,
.card[data-active="true"] .eyebrow {
  color: var(--clr-accent-secondary);
}

.title {
  margin: 0;
  font-family: var(--font-primary);
  font-size: var(--fs-h5);
  font-weight: var(--font-weight-medium);
  line-height: var(--lh-heading);
  letter-spacing: var(--ls-heading);
  color: var(--clr-content-primary);
}

.lede {
  margin: 0;
  font-size: var(--fs-body);
  color: var(--clr-content-secondary);
  line-height: var(--lh-body);
}

.bullets {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-block-start: var(--spacing-1);
}

.bullets li {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: var(--spacing-2);
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
  line-height: var(--lh-body);
}

.check {
  /* Optical alignment with the first line of body text. */
  margin-block-start: 0.18em;
  color: var(--clr-content-tertiary);
  flex-shrink: 0;
}

.card[data-active="true"] .check {
  color: var(--clr-accent-secondary);
}
</style>
