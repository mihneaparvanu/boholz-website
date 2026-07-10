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

// Month kicker above the headline, derived from publishedAt so it always
// matches the article's date without editors hand-typing it in the title.
// Evergreen posts (not tied to a month, e.g. the KfW funding notice) opt
// out via slug so they don't get a misleading month label.
const EVERGREEN_SLUGS = new Set(["foerdertoepfe"]);

const monthLabel = computed(() =>
  props.article.publishedAt && !EVERGREEN_SLUGS.has(props.article.slug)
    ? new Intl.DateTimeFormat("de-DE", { month: "long" }).format(
        new Date(props.article.publishedAt),
      )
    : null,
);
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
      <span v-if="monthLabel" class="kicker">{{ monthLabel }}</span>
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

.kicker {
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-tertiary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-eyebrow);
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
