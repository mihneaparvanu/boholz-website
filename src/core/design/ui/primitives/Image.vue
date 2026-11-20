<script setup lang="ts">
import { computed } from "vue";

import { getMediaURL } from "@/lib/media";

/**
 * The one place a stored media path becomes a URL.
 *
 * Domain files store the bare `/images/...` path. Resolving it here rather
 * than in the data keeps the path available — a responsive `srcset` has to
 * build `/m/img/w=600/<path>` variants, which is impossible once the value is
 * already a host-prefixed URL.
 *
 * It also makes four attributes impossible to forget. Before this component,
 * 43 of 59 `<img>` tags carried no intrinsic size, so every photograph
 * reflowed the page as it arrived.
 *
 * `alt` is required and not nullable. `media.alt` is null for over half the
 * library, so the caller has to decide what the image means — usually the
 * title of whatever it illustrates. An empty string is a valid answer for a
 * decorative image; silence is not.
 *
 * Rendered from `.astro` without a `client:` directive this ships no
 * JavaScript. Every page already hydrates Vue for the navbar, so there is no
 * runtime cost either way.
 */
const props = withDefaults(
  defineProps<{
    path: string;
    alt: string;
    width?: number | null;
    height?: number | null;
    /** The single above-the-fold image on a page should be "eager". */
    loading?: "lazy" | "eager";
  }>(),
  { loading: "lazy", width: null, height: null },
);

const src = computed(() => getMediaURL(props.path));
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :width="width ?? undefined"
    :height="height ?? undefined"
    :loading="loading"
    decoding="async"
  />
</template>
