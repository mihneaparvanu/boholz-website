<script setup lang="ts">
import { computed } from "vue";
import { Check } from "lucide-vue-next";
import { getIcon, type IconName } from "@/utils/icons";

const props = defineProps<{
  title: string;
  eyebrow?: string;
  icon?: IconName;
  description?: string;
  image?: { src: string; alt: string };
  /** When set, an italic-serif ordinal renders in the header (01, 02…). */
  step?: number;
  /** Optional supporting bullet list — checkmark each. */
  bullets?: string[];
  /** Accent treatment for the "recommended" variant (e.g. ECO Nature Plus). */
  accent?: boolean;
}>();

const IconComponent = computed(() =>
  props.icon ? getIcon(props.icon) : null,
);

const stepLabel = computed(() =>
  props.step != null ? String(props.step).padStart(2, "0") : null,
);
</script>

<template>
  <article class="card" :data-accent="accent || undefined">
    <figure v-if="image" class="frame">
      <img :src="image.src" :alt="image.alt" loading="lazy" />
    </figure>

    <div class="body">
      <header class="head">
        <span v-if="stepLabel" class="num" aria-hidden="true">{{ stepLabel }}</span>
        <span v-if="eyebrow && !stepLabel" class="eyebrow">
          <component
            v-if="IconComponent"
            :is="IconComponent"
            :size="14"
            :stroke-width="2"
            aria-hidden="true"
          />
          {{ eyebrow }}
        </span>
        <component
          v-if="IconComponent && stepLabel"
          :is="IconComponent"
          class="icon"
          :size="18"
          :stroke-width="1.75"
          aria-hidden="true"
        />
      </header>

      <h3 class="title">{{ title }}</h3>
      <p v-if="description" class="desc">{{ description }}</p>

      <ul v-if="bullets && bullets.length" class="bullets">
        <li v-for="point in bullets" :key="point">
          <Check class="check" :size="16" :stroke-width="2" aria-hidden="true" />
          <span>{{ point }}</span>
        </li>
      </ul>

      <div v-if="$slots.default" class="extra"><slot /></div>
    </div>
  </article>
</template>

<style scoped>
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

.card[data-accent] {
  border-color: color-mix(in srgb, var(--clr-accent-secondary) 28%, var(--clr-border-secondary));
  background: color-mix(in srgb, var(--clr-accent-secondary) 3%, var(--clr-surface-primary));
}

.frame {
  position: relative;
  margin: 0;
  width: 100%;
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
  /* Center-align — the italic serif numeral and the Lucide icon have
     different metrics; baseline alignment ends up looking offset. */
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  margin-block-end: var(--spacing-1);
  color: var(--clr-content-tertiary);
}

.num {
  font-family: var(--font-secondary);
  font-style: italic;
  font-weight: var(--font-weight-regular);
  font-size: var(--fs-h3);
  line-height: 1;
  color: var(--clr-content-tertiary);
  font-feature-settings: "tnum";
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  text-transform: uppercase;
  letter-spacing: var(--tracking-eyebrow);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-tertiary);
}

.card[data-accent] .head,
.card[data-accent] .eyebrow {
  color: var(--clr-accent-secondary);
}

.icon {
  color: var(--clr-content-secondary);
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

.desc {
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

.card[data-accent] .check {
  color: var(--clr-accent-secondary);
}

.extra {
  color: var(--clr-content-secondary);
}
</style>
