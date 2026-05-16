import { onMounted, onUnmounted, ref, type Ref } from "vue";

/**
 * Reads `<html data-hero="true">` and stays in sync across Astro view
 * transitions. Hero-bearing pages set the attribute in their frontmatter via
 * `<Layout isHero>`; persisted Vue islands (the navbar) read it here.
 *
 * Returning a `Ref<boolean>` (vs. a one-shot read) is what makes the persisted
 * navbar correctly switch modes when navigating between hero and non-hero pages.
 */
export function useIsHeroPage(): Ref<boolean> {
  const isHero = ref(false);

  const sync = () => {
    isHero.value =
      document.documentElement.dataset.hero === "true";
  };

  onMounted(() => {
    sync();
    document.addEventListener("astro:after-swap", sync);
  });

  onUnmounted(() => {
    document.removeEventListener("astro:after-swap", sync);
  });

  return isHero;
}
