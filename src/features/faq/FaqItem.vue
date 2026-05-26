<script setup lang="ts">
import type { Question } from "@/features/faq/qa";

defineProps<{
  q: Question;
}>();
</script>

<template>
  <li class="item">
    <details>
      <summary>
        <h4>{{ q.question }}</h4>
        <span class="chevron" aria-hidden="true">+</span>
      </summary>
      <!-- Trusted internal content sourced from src/content/qa.ts -->
      <div class="answer" v-html="q.answer" />
    </details>
  </li>
</template>

<style scoped>
.item {
  border-bottom: 1px solid var(--clr-border, rgba(0, 0, 0, 0.1));
}

summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  padding: var(--spacing-2) 0;
  cursor: pointer;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

h4 {
  font-size: var(--fs-h6);
  margin: 0;
  color: var(--clr-content-primary);
}

.chevron {
  font-size: 1.25rem;
  line-height: 1;
  color: var(--clr-content-secondary);
  transition: transform 150ms ease;
}

details[open] .chevron {
  transform: rotate(45deg);
}

p {
  margin: 0 0 var(--spacing-3);
  color: var(--clr-content-secondary);
  max-width: 60ch;
}

.answer {
  color: var(--clr-content-secondary);
  max-width: 60ch;
  padding-bottom: var(--spacing-2);

  :deep(p) {
    margin: 0 0 var(--spacing-2);
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(ul) {
    margin: 0 0 var(--spacing-2);
    padding-left: var(--spacing-3);
    list-style: disc;
  }

  :deep(li) {
    margin-bottom: var(--spacing-0);
  }

  :deep(strong) {
    color: var(--clr-content-primary);
    font-weight: 500;
  }

  :deep(a) {
    color: var(--clr-accent-primary);
    text-decoration: underline;
  }
}
</style>
