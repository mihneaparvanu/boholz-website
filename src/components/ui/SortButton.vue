<script setup lang="ts">
import { computed } from "vue";
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "reka-ui";
import {
  ArrowDownUp,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
} from "lucide-vue-next";
import { type SortOption } from "@/features/FilterPanel/filter-panel.types";

const props = defineProps<{ options: SortOption[] }>();
const sort = defineModel<string | null>("sort");

// Group by field so each field shows ↑ / ↓ pair instead of duplicating the
// field name with arrow glyphs in the label string.
type Field = { value: string; label: string };
const fields = computed<Field[]>(() => {
  const seen = new Set<string>();
  const out: Field[] = [];
  for (const opt of props.options) {
    const base = opt.value.replace(/-(asc|desc)$/, "");
    if (seen.has(base)) continue;
    seen.add(base);
    out.push({ value: base, label: opt.label.replace(/\s+[↑↓]$/, "") });
  }
  return out;
});

const activeOption = computed(() =>
  props.options.find((o) => o.value === sort.value) ?? null,
);
</script>

<template>
  <SelectRoot v-model="sort">
    <SelectTrigger class="trigger" aria-label="Sortierung wählen">
      <ArrowDownUp
        class="leading-icon"
        :size="14"
        :stroke-width="2"
        aria-hidden="true"
      />
      <SelectValue
        class="value"
        :placeholder="'Sortieren'"
      >
        <template v-if="activeOption">{{ activeOption.label }}</template>
      </SelectValue>
      <ChevronDown
        class="chevron"
        :size="14"
        :stroke-width="2"
        aria-hidden="true"
      />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="content"
        position="popper"
        side="bottom"
        align="end"
        :side-offset="6"
      >
        <SelectViewport class="viewport">
          <template v-for="field in fields" :key="field.value">
            <div class="group-label">{{ field.label }}</div>
            <SelectItem
              class="item"
              :value="`${field.value}-asc`"
            >
              <SelectItemIndicator class="indicator">
                <Check :size="12" :stroke-width="2.5" aria-hidden="true" />
              </SelectItemIndicator>
              <ArrowUp
                class="dir-icon"
                :size="12"
                :stroke-width="2"
                aria-hidden="true"
              />
              <SelectItemText>Aufsteigend</SelectItemText>
            </SelectItem>
            <SelectItem
              class="item"
              :value="`${field.value}-desc`"
            >
              <SelectItemIndicator class="indicator">
                <Check :size="12" :stroke-width="2.5" aria-hidden="true" />
              </SelectItemIndicator>
              <ArrowDown
                class="dir-icon"
                :size="12"
                :stroke-width="2"
                aria-hidden="true"
              />
              <SelectItemText>Absteigend</SelectItemText>
            </SelectItem>
          </template>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style scoped>
.trigger {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  min-width: 11ch;
  height: var(--control-height-md);
  padding-inline: var(--spacing-2) var(--spacing-2);
  border: 1px solid var(--clr-border-secondary);
  background: var(--clr-surface-primary);
  color: var(--clr-content-primary);
  border-radius: var(--radius-md);
  font: inherit;
  font-weight: 400;
  font-size: var(--fs-body-sm);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.trigger:hover {
  border-color: var(--clr-border-tertiary);
  color: var(--clr-content-primary);
}

.trigger[data-state="open"] {
  border-color: var(--clr-border-quaternary);
}

.trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 28%, transparent);
}

.leading-icon {
  color: var(--clr-content-tertiary);
  flex-shrink: 0;
}

.value {
  flex: 1;
  text-align: start;
}

.chevron {
  color: var(--clr-content-tertiary);
  flex-shrink: 0;
  transition: transform 180ms cubic-bezier(0.32, 0.72, 0, 1);
}

.trigger[data-state="open"] .chevron {
  transform: rotate(180deg);
}
</style>

<style>
/* Portal'd content — unscoped */
.content {
  overflow: hidden;
  pointer-events: auto;
  min-width: var(--reka-select-trigger-width);
  background-color: var(--clr-surface-primary);
  border: 1px solid var(--clr-border-primary);
  border-radius: var(--radius-md);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 8px 24px -8px rgba(0, 0, 0, 0.12);
  z-index: 40;
}

.viewport {
  padding: var(--spacing-1);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.group-label {
  font-size: var(--fs-body-sm);
  font-weight: 500;
  color: var(--clr-content-tertiary);
  padding: var(--spacing-1) var(--spacing-2) calc(var(--spacing-0) / 2);
  text-transform: none;
  letter-spacing: 0;
}

.group-label:not(:first-child) {
  margin-block-start: var(--spacing-1);
  border-block-start: 1px solid var(--clr-border-primary);
  padding-block-start: var(--spacing-2);
}

.item {
  font-size: var(--fs-body-sm);
  line-height: 1;
  color: var(--clr-content-primary);
  border-radius: var(--radius-sm);
  display: grid;
  grid-template-columns: 14px 14px 1fr;
  align-items: center;
  gap: var(--spacing-1);
  height: var(--control-height-sm);
  padding-inline: var(--spacing-2);
  position: relative;
  user-select: none;
  cursor: pointer;
  outline: none;
}

.dir-icon {
  color: var(--clr-content-tertiary);
}

.indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--clr-accent-primary);
}

.item[data-highlighted] {
  background: color-mix(
    in srgb,
    var(--clr-accent-primary) 6%,
    var(--clr-surface-primary)
  );
  color: var(--clr-content-primary);
}

.item[data-state="checked"] .dir-icon {
  color: var(--clr-accent-primary);
}
</style>
