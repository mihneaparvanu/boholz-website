import { computed, ref, type Ref } from "vue";
import type { HouseCategory } from "@/types/models";
import { BESTSELLER_CATEGORY_ID } from "@/data/constants";

/**
 * Hero-image gallery state shared by `CategorySlider` and `NavbarDrop`.
 *
 * Both surfaces render a `HouseCategory[]` list, pick a selected category,
 * and show its hero photo. The Bestseller category is virtual (no DB
 * media) — pass `bestsellerHero` to override its showcase when
 * available; otherwise the showcase resolves to `null` for that entry.
 */
export interface CategoryGalleryShowcase {
  path: string;
  alt: string;
}

export interface UseCategoryGalleryOptions {
  /** Optional pre-resolved hero URL for the virtual Bestseller category. */
  bestsellerHero?: string | null;
}

export interface UseCategoryGallery {
  selected: Ref<HouseCategory>;
  select(category: HouseCategory): void;
  showcaseImage: Ref<CategoryGalleryShowcase | null>;
}

export function useCategoryGallery(
  categories: HouseCategory[],
  options: UseCategoryGalleryOptions = {},
): UseCategoryGallery {
  const selected = ref<HouseCategory>(categories[0]) as Ref<HouseCategory>;

  function select(category: HouseCategory): void {
    selected.value = category;
  }

  const showcaseImage = computed<CategoryGalleryShowcase | null>(() => {
    const current = selected.value;
    if (!current) return null;

    if (current.id === BESTSELLER_CATEGORY_ID) {
      return options.bestsellerHero
        ? {
            path: options.bestsellerHero,
            alt: "Bestseller — beliebteste BoHolz Modelle",
          }
        : null;
    }

    const hero = current.media.find((m) => m.isHero)?.media;
    if (!hero) return null;
    return { path: hero.path, alt: hero.alt ?? current.name };
  });

  return { selected, select, showcaseImage };
}
