import { computed, ref, type Ref } from 'vue';

import type { HouseCategory } from "@/db/models";

/**
 * Hero-image gallery state shared by `CategorySlider` and `NavbarDrop`.
 *
 * Both surfaces render a `HouseCategory[]` list, pick a selected category,
 * and show its hero photo. Bestseller is now a real DB row carrying its
 * own `category_media` pivot, so there's no special-case branch — every
 * category resolves its hero the same way.
 */
export interface CategoryGalleryShowcase {
  path: string;
  alt: string;
}

export interface UseCategoryGallery {
  selected: Ref<HouseCategory>;
  select(category: HouseCategory): void;
  showcaseImage: Ref<CategoryGalleryShowcase | null>;
}

export function useCategoryGallery(
  categories: HouseCategory[],
): UseCategoryGallery {
  const selected = ref<HouseCategory>(categories[0]) as Ref<HouseCategory>;

  function select(category: HouseCategory): void {
    selected.value = category;
  }

  const showcaseImage = computed<CategoryGalleryShowcase | null>(() => {
    const current = selected.value;
    if (!current) return null;
    const hero = current.media.find((m) => m.isHero)?.media;
    if (!hero) return null;
    return { path: hero.path, alt: hero.alt ?? current.name };
  });

  return { selected, select, showcaseImage };
}
