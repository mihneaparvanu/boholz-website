<script setup lang="ts">
import { computed } from "vue";
import type { NewsArticle } from "@/db/models";
import { ROUTES } from "@/features/navigation/routes";
import ImagePlaceholder from "@/ui/primitives/ImagePlaceholder.vue";

const props = defineProps<{
  article: NewsArticle;
}>();

const heroMedia = computed(
  () => props.article.media.find((m) => m.isHero)?.media,
);

const formattedDate = computed(() => {
  const date = props.article.publishedAt;
  if (!date) return null;
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
});
</script>

<template>
  <a class="news-card" :href="ROUTES.newsArticle(article.slug)">
    <div class="image-wrapper">
      <img
        v-if="heroMedia"
        :src="heroMedia.path"
        :alt="heroMedia.alt ?? article.title"
        :width="heroMedia.width ?? undefined"
        :height="heroMedia.height ?? undefined"
      />
      <ImagePlaceholder v-else />
    </div>
    <div class="content">
      <time v-if="formattedDate" class="date">{{ formattedDate }}</time>
      <h3 class="title">{{ article.title }}</h3>
      <p v-if="article.excerpt" class="excerpt">{{ article.excerpt }}</p>
    </div>
  </a>
</template>

<style scoped>
.news-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  text-decoration: none;
  color: inherit;

  &:hover .image-wrapper img {
    transform: scale(1.03);
  }
}

.image-wrapper {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--radius-md);
  background-color: var(--clr-surface-secondary);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.date {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-tertiary);
}

.title {
  font-size: var(--fs-h5);
}

.excerpt {
  font-size: var(--fs-body);
  color: var(--clr-content-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
