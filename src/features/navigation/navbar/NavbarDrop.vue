<script setup lang="ts">
import { computed, ref } from "vue";
import { Motion, AnimatePresence } from "motion-v";
import { Star } from "lucide-vue-next";
import type { HouseCategory, Location } from "@/db/models";
import { ROUTES } from "@/features/navigation/routes";
import { useCategoryGallery } from "@/lib/useCategoryGallery";
import { isBestsellerCategory } from "@/lib/bestseller";
import TitleLinks from "./TitleLinks.vue";
import {
  HOUSE_DROP_EXTRA_LINKS,
  type HouseDropExtraLink,
} from "./navbar.content";

const props = defineProps<{
  categories: HouseCategory[];
  showhouses: Location[];
}>();

const { selected, select, showcaseImage } = useCategoryGallery(
  props.categories,
);

const EASE = [0.22, 1, 0.36, 1] as const;
const ctaLinks = [
  { label: "Vor-Ort-Beratung", href: "/vor-ort-beratung" },
  { label: "Kontakt", href: ROUTES.contact },
];
const extraLinks = HOUSE_DROP_EXTRA_LINKS;

// When the user is hovering an extra link (e.g. Mehrfamilienhäuser), the
// showcase image mirrors another category's hero, but the title and click
// destination stay tied to the extra link itself.
const hoveredExtraLink = ref<HouseDropExtraLink | null>(null);

function hoverCategory(category: HouseCategory) {
  hoveredExtraLink.value = null;
  select(category);
}

function hoverExtraLink(link: HouseDropExtraLink) {
  hoveredExtraLink.value = link;
  if (link.mirrorCategorySlug) {
    const mirror = props.categories.find(
      (c) => c.slug === link.mirrorCategorySlug,
    );
    if (mirror) select(mirror);
  }
}

const showcaseTitle = computed(
  () => hoveredExtraLink.value?.label ?? selected.value.name,
);
const showcaseHref = computed(
  () =>
    hoveredExtraLink.value?.path ??
    `/hauser?category=${selected.value.slug}`,
);
const showcaseKey = computed(
  () => hoveredExtraLink.value?.path ?? selected.value.id,
);
</script>

<template>
  <div class="drop-panel">
    <div class="drop-panel-nav">
      <ul class="links category">
        <Motion
          v-for="(category, i) in props.categories"
          :key="category.id"
          tag="li"
          :data-bestseller="isBestsellerCategory(category) ? 'true' : null"
          :initial="{ opacity: 0, x: -8 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.32, delay: 0.05 + i * 0.035, ease: EASE }"
          @mouseenter="hoverCategory(category)"
        >
          <a :href="`/hauser?category=${category.slug}`">
            <span class="label">{{ category.name }}</span>
            <span
              v-if="isBestsellerCategory(category)"
              class="badge"
              aria-label="Beliebteste Auswahl"
              title="Beliebteste Auswahl"
            >
              <Star
                :size="10"
                :stroke-width="0"
                fill="currentColor"
                aria-hidden="true"
              />
            </span>
          </a>
        </Motion>
        <Motion
          v-for="(link, j) in extraLinks"
          :key="link.path"
          tag="li"
          :initial="{ opacity: 0, x: -8 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{
            duration: 0.32,
            delay: 0.05 + (props.categories.length + j) * 0.035,
            ease: EASE,
          }"
          @mouseenter="hoverExtraLink(link)"
        >
          <a :href="link.path">{{ link.label }}</a>
        </Motion>
      </ul>
      <Motion
        tag="div"
        class="additional-links-list"
        :initial="{ opacity: 0, y: 6 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.12, ease: EASE }"
      >
        <TitleLinks :showhouses="props.showhouses" />
        <div class="links cta">
          <!-- Motion's `tag="a"` was rendering as `<div tag="a" href="…">`
               in motion-v's current build, so clicks went nowhere. Plain
               anchors here; the panel's slide-in already covers the entrance
               motion, and the staggered link reveal isn't worth a broken
               navigation. -->
          <a v-for="link in ctaLinks" :key="link.label" :href="link.href">{{
            link.label
          }}</a>
        </div>
      </Motion>
    </div>
    <AnimatePresence mode="wait">
      <Motion
        :key="showcaseKey"
        tag="a"
        class="category-showcase"
        :href="showcaseHref"
        :initial="{ opacity: 0, scale: 1.02 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0, scale: 1.02 }"
        :transition="{ duration: 0.32, ease: EASE }"
      >
        <div class="text-content">
          <h3 class="title">{{ showcaseTitle }}</h3>
          <p>{{ `Entdecken Sie alle ${showcaseTitle}` }}</p>
        </div>
        <div class="image-wrapper">
          <img
            v-if="showcaseImage"
            :src="showcaseImage.path"
            :alt="showcaseImage.alt"
          />
        </div>
      </Motion>
    </AnimatePresence>
  </div>
</template>

<style scoped>
.drop-panel {
  --panel-padding: var(--spacing-2);
  --panel-b-radius: calc(var(--panel-padding) + var(--radius-md));
  border: 2px solid var(--clr-border-primary);
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  padding: var(--panel-padding);
  position: absolute;
  top: var(--spacing-4);
  width: 100%;
  background-color: var(--clr-surface-primary);
  border-radius: var(--panel-b-radius);

  @media (--below-desktop) {
    grid-template-columns: 1fr;
  }
}

.drop-panel-nav {
  padding: var(--spacing-4);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-0);
  font-size: var(--fs-body-lg);

  @media (--mobile) {
    grid-template-columns: 1fr;
  }

  .links {
    display: flex;
    width: fit-content;
    flex-direction: column;
    align-items: start;
    gap: var(--spacing-2);

    li {
      width: fit-content;
    }

    a {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-1);
      transition: color 160ms ease;
    }

    a:hover,
    a:focus-visible {
      opacity: 1;
      color: var(--clr-accent-secondary);
    }

    .badge {
      display: inline-grid;
      place-items: center;
      width: 16px;
      height: 16px;
      border-radius: var(--radius-full);
      background: var(--clr-accent-secondary);
      color: var(--clr-pure-white);
      flex: none;
    }
  }

  .additional-links-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    .links {
      font-size: var(--fs-body);
    }
  }
}

.category-showcase {
  display: flex;
  flex-direction: column;
  justify-content: end;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  gap: var(--spacing-4);
  align-items: start;
  height: 100%;

  &:hover,
  &:focus {
    opacity: 1;
  }

  .text-content {
    z-index: 1;
    padding: var(--spacing-3);
    color: var(--clr-surface-primary);

    .title {
      font-size: var(--fs-h6);
    }

    width: 100%;
    background: linear-gradient(
      360deg,
      rgba(0, 0, 0, 0.75) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    backdrop-filter: blur(1px);
  }

  .image-wrapper {
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 100%;
    height: 100%;

    img {
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }
  }
}
</style>
