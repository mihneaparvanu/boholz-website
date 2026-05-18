<script setup lang="ts">
import { computed } from "vue";
import { getIcon, type IconName } from "@/utils/icons";
import { useCountUp, parseCountTarget } from "@/composables/useCountUp";
import GermanyFlag from "@/icons/GermanyFlag.vue";

const props = withDefaults(
  defineProps<{
    /** The big number / value (string so units like "100%" work). */
    value: string;
    /** Short label below the value. */
    label: string;
    /** Optional caption further down. */
    caption?: string;
    /** Optional Lucide icon name. */
    icon?: IconName;
    align?: "start" | "center";
    /** Render the Germany flag above the value (Made-in-Germany anchor). */
    flag?: boolean;
  }>(),
  { align: "start", flag: false },
);

const IconComponent = computed(() => (props.icon ? getIcon(props.icon) : null));

// Parse once at setup — props.value is static content here, not a reactive
// stream. If a number can be extracted, we animate; otherwise we render the
// string verbatim.
const parsed = parseCountTarget(props.value);
const { targetEl, display } = useCountUp(parsed?.target ?? 0);
</script>

<template>
  <article ref="targetEl" class="stat" :data-align="align">
    <GermanyFlag v-if="flag" class="flag" />
    <component
      v-if="IconComponent"
      :is="IconComponent"
      class="icon"
      :size="20"
      :stroke-width="1.75"
      aria-hidden="true"
    />
    <p class="value" :aria-label="value">
      <template v-if="parsed">
        <span aria-hidden="true">{{ display }}{{ parsed.suffix }}</span>
      </template>
      <template v-else>{{ value }}</template>
    </p>
    <p class="label">{{ label }}</p>
    <p v-if="caption" class="caption">{{ caption }}</p>
  </article>
</template>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  min-width: 0;
}

.stat[data-align="center"] {
  align-items: center;
  text-align: center;
}

/* On mobile every stat centers — the row is single-column and the visual
   gravity should sit in the middle of the screen, not against the left edge. */
@media (--mobile) {
  .stat {
    align-items: center;
    text-align: center;
  }
}

.icon {
  /* Primary accent on the icon — larger visual element per the project rule. */
  color: var(--stat-icon-color, var(--clr-accent-primary));
  margin-block-end: var(--spacing-1);
}

/* Germany-flag visual sits above the icon; subtle on desktop, slightly
   larger on mobile so the made-in-Germany meaning lands at a glance. */
.flag {
  height: 24px;
  margin-block-end: var(--spacing-0);
}
@media (--mobile) {
  .flag {
    height: 32px;
  }
}

.value {
  font-family: var(--font-primary);
  /* Headline beat of the section. On mobile we use the H1 token. On larger
     viewports we scale beyond H1 via a fluid clamp — there's no `--fs-display`
     in the system today; flagged for codification. Min hugs --fs-h1 at desktop;
     max is a tuned display ceiling that feels deliberate at ≥1440px. */
  font-size: var(--fs-h1);
  font-weight: var(--font-weight-light);
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-heading);
  color: var(--clr-content-primary);
  /* Tabular numerals — digits stay the same width during the count-up so the
     baseline doesn't shift each frame. */
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  margin: 0;
}

/* On mobile the count-up is the section's anchor — push it well past --fs-h1
   so the number lands as a true display beat at 360–430px widths. */
@media (--mobile) {
  .value {
    font-size: clamp(3rem, 2rem + 8vw, 4rem);
  }
}

@media (--from-tablet) {
  .value {
    font-size: clamp(3.5rem, 2.5rem + 4vw, 6.5rem);
  }
}

.label {
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--tracking-eyebrow);
  color: var(--clr-content-secondary);
  margin: 0;
}

.caption {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
  margin: 0;
  margin-block-start: var(--spacing-1);
  line-height: var(--lh-body);
  max-width: 32ch;
}
</style>
