<script setup lang="ts">
import { ref } from "vue";
import type { QuestionCategory } from "@/content/qa";
import FaqAccordion from "./FaqAccordion.vue";

const props = defineProps<{
  categories: QuestionCategory[];
}>();

const selectedId = ref<string>(props.categories[0].id);

const selectCategory = (id: string): void => {
  selectedId.value = id;
};

const selected = (): QuestionCategory =>
  props.categories.find((c) => c.id === selectedId.value) ??
  props.categories[0];
</script>

<template>
  <div class="faq">
    <!-- Category navigator — horizontal pill row on mobile/tablet, sidebar
         column on desktop. Conceptually mirrors the SectionNavigator pill
         rail (rounded pill, secondary-accent fill when active). -->
    <nav class="cats" role="tablist" aria-label="FAQ-Kategorien">
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        role="tab"
        :aria-selected="cat.id === selectedId"
        :class="['pill', { active: cat.id === selectedId }]"
        @click="selectCategory(cat.id)"
      >
        {{ cat.title }}
      </button>
    </nav>

    <div class="questions">
      <FaqAccordion :items="selected().questions" />
    </div>
  </div>
</template>

<style scoped>
.faq {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
  width: 100%;
}

/* ── Category navigator ─────────────────────────── */
/* Mobile / tablet: horizontal pill row that scrolls if it ever overflows. */
.cats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
  list-style: none;
  margin: 0;
  padding: 0;
}

.pill {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding-block: var(--spacing-1);
  padding-inline: var(--spacing-3);
  background: transparent;
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-full);
  font: inherit;
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  color: var(--clr-content-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 160ms ease,
    background-color 160ms ease,
    border-color 160ms ease;
}

.pill:hover {
  color: var(--clr-content-primary);
  border-color: var(--clr-border-tertiary);
}

.pill.active {
  /* Secondary accent (deeper blue) on this small-surface pill — primary's
     mid-tone fails contrast against pure white at body-sm. */
  background-color: var(--clr-accent-secondary);
  border-color: var(--clr-accent-secondary);
  color: var(--clr-pure-white);
}

.pill:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

@media (--from-tablet) {
  .pill {
    min-height: var(--control-height-sm);
  }
}

.questions {
  min-width: 0;
}

/* ── Desktop sidebar layout ─────────────────────── */
@media (--from-desktop) {
  .faq {
    grid-template-columns: minmax(14rem, 1fr) 2.2fr;
    column-gap: var(--spacing-5);
    align-items: start;
  }

  /* On desktop, the category list returns to a left rail — but rendered as
     a vertical stack of the same pill style. Still buttons, no second
     pattern to learn. */
  .cats {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-1);
    position: sticky;
    top: calc(var(--navbar-height) + var(--spacing-4));
  }

  .pill {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
