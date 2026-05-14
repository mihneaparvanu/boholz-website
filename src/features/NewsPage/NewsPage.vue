<script setup lang="ts">
import type { NewsArticle } from "@/types/models";
import NewsCard from "./components/NewsCard.vue";

const props = defineProps<{
  articles: NewsArticle[];
}>();
</script>

<template>
  <div class="news-page">
    <h1 class="page-title">News</h1>

    <div v-if="props.articles.length === 0" class="empty-state">
      <p>Noch keine Neuigkeiten verfügbar.</p>
    </div>

    <div v-else class="news-grid">
      <NewsCard
        v-for="article in props.articles"
        :key="article.id"
        :article="article"
      />
    </div>
  </div>
</template>

<style scoped>
.news-page {
  grid-column: content;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  padding-block: var(--spacing-6);
}

.page-title {
  font-size: var(--fs-h2);
}

.empty-state {
  color: var(--clr-content-secondary);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-6);

  @media (--tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (--mobile) {
    grid-template-columns: 1fr;
  }
}
</style>
