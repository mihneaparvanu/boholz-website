import { computed, ref, type Ref } from 'vue';

import type { ModelCategory } from "@/domain/categories/categories.types";

/**
 * Hero-image gallery state shared by `CategorySlider` and `NavbarDrop`.
 *
 * Both surfaces render a `ModelCategory[]` list, pick a selected category,
 * and show its hero photo. Bestseller is now a real DB row carrying its
 * own `category_media` pivot, so there's no special-case branch — every
 * category resolves its hero the same way.
 */
export interface CategoryGalleryShowcase {
  path: string;
  alt: string;
}

export interface UseCategoryGallery {
  selected: Ref<ModelCategory>;
  select(category: ModelCategory): void;
  showcaseImage: Ref<CategoryGalleryShowcase | null>;
}

export function useCategoryGallery(
  categories: ModelCategory[],
): UseCategoryGallery {
  const selected = ref<ModelCategory>(categories[0]) as Ref<ModelCategory>;

  function select(category: ModelCategory): void {
    selected.value = category;
  }

  const showcaseImage = computed<CategoryGalleryShowcase | null>(() => {
    const current = selected.value;
    if (!current) return null;
    const hero = current.media.find((m) => m.isHero);
    if (!hero) return null;
    return { path: hero.path, alt: hero.alt ?? current.name };
  });

  return { selected, select, showcaseImage };
}
