<script setup lang="ts">
import {
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "reka-ui";

import { LucideChevronDown } from "lucide-vue-next";

import { type SortOption } from "../../features/FilterPanel/filter-panel.types";

const props = defineProps<{ options: SortOption[] }>();
const sort = defineModel<string | null>("sort");
</script>

<template>
  <SelectRoot v-model="sort">
    <SelectTrigger class="trigger">
      <SelectValue placeholder="Sortieren" />
      <LucideChevronDown :size="16" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="select-content"
        position="popper"
        side="bottom"
        align="start"
        :side-offset="4"
      >
        <SelectViewport class="select-viewport">
          <SelectItem
            class="select-item"
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            <SelectItemText>{{ option.label }}</SelectItemText>
          </SelectItem>
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
  justify-content: space-between;
  gap: var(--spacing-2);
  min-width: 160px;
  height: var(--control-height-md);
  padding: 0 var(--spacing-3);
  border: 1px solid var(--clr-accent-secondary);
  color: var(--clr-accent-secondary);
  border-radius: var(--radius-sm);
  font: inherit;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.trigger:hover {
  background: var(--clr-surface-secondary);
}

.trigger[data-state="open"] {
  background: var(--clr-surface-secondary);
}
</style>

<style>
.select-content {
  overflow: hidden;
  pointer-events: auto;
  background-color: var(--clr-surface-primary);
  border-radius: var(--radius-sm);
}

.select-viewport {
  padding: var(--spacing-1);
}

.select-item {
  font-size: var(--fs-body-sm);
  line-height: 1;
  color: var(--clr-content-primary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  height: var(--control-height-sm);
  padding: 0 var(--spacing-3);
  position: relative;
  user-select: none;
  cursor: pointer;
  outline: none;
}

.select-item[data-highlighted] {
  background: var(--clr-surface-secondary);
  color: var(--clr-accent-secondary);
}
</style>
