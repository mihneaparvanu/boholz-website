<script setup lang="ts">
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "reka-ui";
import { Plus } from "lucide-vue-next";
import type { Question } from "@/content/qa";

/**
 * Homepage-local FAQ accordion. Mirrors the kit `<FAQAccordion>` visual
 * spec (Reka primitives, Plus→×, min-height: 44px, focus-visible ring,
 * reduced-motion guard) but renders the answer via `v-html` because the
 * shared `Question.answer` payloads ship trusted HTML from
 * `src/content/qa.ts` (lists, strong, paragraphs).
 *
 * The kit `<FAQAccordion>` interpolates `{{ item.answer }}` as text, which
 * would print raw markup on the page. Convergence with the kit is tracked
 * as Phase 3 cleanup.
 */
defineProps<{
  items: Question[];
}>();
</script>

<template>
  <AccordionRoot type="single" collapsible class="root">
    <AccordionItem
      v-for="(item, i) in items"
      :key="item.id ?? i"
      :value="item.id ?? String(i)"
      class="item"
    >
      <AccordionHeader as-child>
        <h3 class="header">
          <AccordionTrigger class="trigger">
            <span class="q">{{ item.question }}</span>
            <span class="ind" aria-hidden="true">
              <Plus :size="18" :stroke-width="2" />
            </span>
          </AccordionTrigger>
        </h3>
      </AccordionHeader>
      <AccordionContent class="content">
        <!-- v-html is intentional — see component header. Content is
             authored in src/content/qa.ts and never user-supplied. -->
        <div class="answer" v-html="item.answer" />
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>

<style scoped>
.root {
  display: flex;
  flex-direction: column;
  border-block-start: 1px solid var(--clr-border-secondary);
  width: 100%;
}

.item {
  border-block-end: 1px solid var(--clr-border-secondary);
}

.header {
  margin: 0;
  font-size: inherit;
}

.trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
  padding-block: var(--spacing-3);
  padding-inline: 0;
  min-height: 44px;
  background: transparent;
  border: 0;
  text-align: start;
  cursor: pointer;
  color: var(--clr-content-primary);
  font: inherit;
  transition: color 160ms ease;
}

.trigger:hover {
  color: var(--clr-accent-secondary);
  opacity: 1;
}

.trigger:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 4px;
  border-radius: var(--radius-sm);
}

.q {
  font-size: var(--fs-body-lg);
  font-weight: var(--font-weight-medium);
  line-height: var(--lh-heading);
  letter-spacing: var(--ls-heading);
  min-width: 0;
}

.ind {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  color: var(--clr-content-tertiary);
  transition:
    transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
    color 160ms ease;
}

.trigger[data-state="open"] .ind {
  transform: rotate(45deg);
  color: var(--clr-accent-secondary);
}

.trigger:hover .ind {
  color: var(--clr-accent-secondary);
}

.content {
  overflow: hidden;
  font-size: var(--fs-body);
  color: var(--clr-content-secondary);
}

.content[data-state="open"] {
  animation: open 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.content[data-state="closed"] {
  animation: close 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.answer {
  padding-block-end: var(--spacing-3);
  padding-inline-end: var(--spacing-5);
  line-height: var(--lh-body);
  max-width: 64ch;
}

.answer :deep(p) {
  margin: 0 0 var(--spacing-2);
}
.answer :deep(p:last-child) {
  margin-bottom: 0;
}
.answer :deep(ul) {
  margin: 0 0 var(--spacing-2);
  padding-inline-start: var(--spacing-3);
  list-style: disc;
}
.answer :deep(li) {
  margin-block-end: var(--spacing-0);
}
.answer :deep(strong) {
  color: var(--clr-content-primary);
  font-weight: var(--font-weight-medium);
}
.answer :deep(a) {
  color: var(--clr-accent-secondary);
  text-decoration: underline;
}

@keyframes open {
  from {
    height: 0;
  }
  to {
    height: var(--reka-accordion-content-height);
  }
}

@keyframes close {
  from {
    height: var(--reka-accordion-content-height);
  }
  to {
    height: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .content[data-state="open"],
  .content[data-state="closed"] {
    animation: none;
  }
  .ind {
    transition: none;
  }
}
</style>
