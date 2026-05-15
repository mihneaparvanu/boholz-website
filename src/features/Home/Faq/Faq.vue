<script setup lang="ts">
import { ref } from "vue";
import type { QuestionCategory } from "@/content/qa";
import FaqItem from "./FaqItem.vue";

const props = defineProps<{
  categories: QuestionCategory[];
}>();

const selected = ref<QuestionCategory>(props.categories[0]);
</script>

<template>
  <div class="faq">
    <nav class="categories" role="tablist">
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        role="tab"
        :aria-selected="cat.id === selected.id"
        :class="{ active: cat.id === selected.id }"
        @click="selected = cat"
      >
        {{ cat.title }}
      </button>
    </nav>
    <ul class="questions">
      <FaqItem v-for="q in selected.questions" :key="q.id" :q="q" />
    </ul>
  </div>
</template>

<style scoped>
.faq {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-5);
}

.categories {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  align-items: flex-start;
}

.categories button {
  background: none;
  border: none;
  padding: var(--spacing-1) 0;
  font-weight: 500;
  font-size: var(--fs-h6);
  cursor: pointer;
  text-align: left;
  transition: color 150ms ease;
}

.categories button:hover,
.categories button.active {
  color: var(--clr-accent-secondary);
}

.questions {
  width: 65ch;
  list-style: none;
  padding: 0;
  margin: 0;
}

@media (--below-desktop) {
  .faq {
    grid-template-columns: 1fr;
  }

  .questions {
    width: 100%;
  }
}
</style>
