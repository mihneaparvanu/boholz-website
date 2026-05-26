<script setup lang="ts">
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionHeader,
} from "reka-ui";
import { ChevronDown } from "lucide-vue-next";

defineProps<{
  value: string;
  title: string;
  activeCount?: number;
}>();
</script>

<template>
  <AccordionItem class="section" :value="value">
    <AccordionHeader class="header">
      <AccordionTrigger class="trigger">
        <span class="title">
          {{ title }}
          <span v-if="activeCount" class="count">{{ activeCount }}</span>
        </span>
        <ChevronDown
          class="chevron"
          :size="16"
          :stroke-width="2"
          aria-hidden="true"
        />
      </AccordionTrigger>
    </AccordionHeader>
    <AccordionContent class="content">
      <div class="content-inner">
        <slot />
      </div>
    </AccordionContent>
  </AccordionItem>
</template>

<style scoped>
.header {
  display: flex;
  margin: 0;
}

.trigger {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-block: var(--spacing-3);
  font-size: var(--fs-body);
  font-weight: 400;
  color: var(--clr-content-primary);
  cursor: pointer;
  text-align: start;
  transition: color 160ms ease;
}

.trigger:hover {
  color: var(--clr-accent-secondary);
}

.trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 28%, transparent);
  border-radius: var(--radius-sm);
}

.title {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
}

.count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.4em;
  padding-inline: 0.4em;
  height: 1.4em;
  border-radius: var(--radius-full);
  background: var(--clr-accent-primary);
  color: var(--clr-surface-primary);
  font-size: var(--fs-body-sm);
  line-height: 1;
}

.chevron {
  flex-shrink: 0;
  color: var(--clr-content-tertiary);
  transition:
    transform 220ms cubic-bezier(0.32, 0.72, 0, 1),
    color 160ms ease;
}

.trigger[data-state="open"] .chevron {
  transform: rotate(180deg);
  color: var(--clr-content-secondary);
}

.content {
  overflow: hidden;
}

.content[data-state="open"] {
  animation: open 220ms cubic-bezier(0.32, 0.72, 0, 1);
}

.content[data-state="closed"] {
  animation: close 180ms cubic-bezier(0.32, 0.72, 0, 1);
}

.content-inner {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
  padding-block: 0 var(--spacing-3);
}

@keyframes open {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--reka-accordion-content-height);
    opacity: 1;
  }
}

@keyframes close {
  from {
    height: var(--reka-accordion-content-height);
    opacity: 1;
  }
  to {
    height: 0;
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chevron,
  .content {
    transition: none;
    animation: none;
  }
}
</style>
