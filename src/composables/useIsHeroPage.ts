import { onMounted, ref, type Ref } from "vue";

/**
 * Reads `<html data-hero="true">`. Hero-bearing pages set the attribute in
 * their frontmatter via `<Layout isHero>`. Each navigation is a full reload
 * (MPA), so a one-shot read on mount is enough — the island re-mounts on
 * every page.
 */
export function useIsHeroPage(): Ref<boolean> {
  const isHero = ref(false);

  onMounted(() => {
    isHero.value = document.documentElement.dataset.hero === "true";
  });

  return isHero;
}
