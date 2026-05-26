<script setup lang="ts">
import { computed } from "vue";
import {
  Info,
  Lightbulb,
  AlertCircle,
  AlertTriangle,
} from "lucide-vue-next";

type Tone = "note" | "tip" | "important" | "warning";

const props = withDefaults(
  defineProps<{
    tone?: Tone;
    title?: string;
  }>(),
  {
    tone: "note",
  },
);

const IconComponent = computed(() => {
  switch (props.tone) {
    case "tip":
      return Lightbulb;
    case "important":
      return AlertCircle;
    case "warning":
      return AlertTriangle;
    default:
      return Info;
  }
});
</script>

<template>
  <aside
    class="callout"
    :data-tone="tone"
    :role="tone === 'warning' || tone === 'important' ? 'alert' : 'note'"
  >
    <span class="icon" aria-hidden="true">
      <component :is="IconComponent" :size="18" :stroke-width="2" />
    </span>
    <div class="body">
      <p v-if="title" class="title">{{ title }}</p>
      <div class="content">
        <slot />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.callout {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  column-gap: var(--spacing-2);
  padding-block: var(--spacing-3);
  /* Asymmetric — the leading border absorbs the start gutter visually. */
  padding-inline: var(--spacing-3) var(--spacing-4);
  border-inline-start: 2px solid var(--tone-color, var(--clr-content-tertiary));
  background: color-mix(
    in srgb,
    var(--tone-color, var(--clr-content-tertiary)) 4%,
    var(--clr-surface-primary)
  );
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.icon {
  display: inline-grid;
  place-items: center;
  color: var(--tone-color, var(--clr-content-tertiary));
  /* Optical alignment with the first line of body text. */
  padding-block-start: 0.1em;
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  min-width: 0;
}

.title {
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-primary);
  font-size: var(--fs-body);
  line-height: var(--lh-heading);
  margin: 0;
}

.content {
  color: var(--clr-content-secondary);
  font-size: var(--fs-body-sm);
  line-height: var(--lh-body);
}

.content :slotted(p) {
  margin: 0;
}

.content :slotted(p + p) {
  margin-block-start: var(--spacing-2);
}

/* Tone → colour mapping via a single CSS variable hop. */
.callout[data-tone="note"] {
  --tone-color: var(--clr-status-info);
}
.callout[data-tone="tip"] {
  --tone-color: var(--clr-status-success);
}
.callout[data-tone="important"] {
  --tone-color: var(--clr-status-warning);
}
.callout[data-tone="warning"] {
  --tone-color: var(--clr-status-error);
}
</style>
