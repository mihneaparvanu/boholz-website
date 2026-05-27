<script setup lang="ts">
/**
 * HouseModelCard — single house-model card.
 *
 * Shape: photo-first 4:3 image, small uppercase "code" overline (e.g.
 * "BUNGALOW · 22-134"), model name (regular weight, generous size), 2–3 spec
 * chips rendered as quiet icon+value rows separated by a hairline (no pill
 * containers — beats the old-design's chunky boxed chips), optional price-hint
 * line, and a circular arrow-icon CTA that lifts and tints on hover.
 *
 * Used by HouseModelsGrid (static layout) and HouseModelsCarousel (snap row).
 * It's Vue not Astro so the hover micro-interaction (image zoom + arrow
 * translate + colour shift) hydrates as a single component.
 */
import { computed } from "vue";
import { ArrowUpRight, Ruler, Home as HomeIcon, Zap } from "lucide-vue-next";

export type HouseModelSpec = {
  /** e.g. "134 m²", "4 Zimmer", "KfW 40" — kept as a pre-formatted string so
   *  the card stays presentation-only (the loader formats m²/Zimmer/effizienz). */
  value: string;
  /** Icon hint — small set, matches the most common spec axes. */
  kind: "area" | "rooms" | "efficiency";
};

export type HouseModelCardProps = {
  /** Slug used for the detail-page href. */
  id: string;

  slug: string;
  /** Display name, e.g. "Bungalow 22-134". */
  name: string;
  /** Model code overline. Typically "{CATEGORY} · {NUMBER}". */
  code: string;
  /** Image URL — already-resolved (loaders run getMediaURL). */
  image: string;
  /** Two- or three-line photo alt. Use the building, not the brand. */
  imageAlt: string;
  /** Spec chips — up to 3, rendered inline with hairline separators. */
  specs: HouseModelSpec[];

  categoryID: string;
  /** True if the model is marked `isFeatured` in the DB — used by the
   *  carousel to resolve the virtual "Bestseller" category. */
  isFeatured?: boolean;
  /** Optional "ab 290.000 €" hint. */
  priceHint?: string;
  /** Small note rendered under the price — e.g. "inkl. Bodenplatte". */
  priceCaveat?: string;
  /** Detail-page link override; defaults to `/haus/${slug}`. */
  href?: string;
  /** Suppress the bestseller star badge — set true when the card is rendered
   *  inside a bestseller listing (where every card would otherwise be starred). */
  hideStarBadge?: boolean;
};

const props = withDefaults(defineProps<HouseModelCardProps>(), {
  priceHint: undefined,
  priceCaveat: undefined,
  href: undefined,
});

const linkHref = computed(() => props.href ?? `/haus/${props.slug}`);

const iconFor = (kind: HouseModelSpec["kind"]) => {
  switch (kind) {
    case "area":
      return Ruler;
    case "rooms":
      return HomeIcon;
    case "efficiency":
      return Zap;
  }
};
</script>

<template>
  <article class="card">
    <a :href="linkHref" class="link" :aria-label="`${name} ansehen`">
      <figure class="media">
        <img :src="image" :alt="imageAlt" loading="lazy" decoding="async" />
        <span
          v-if="isFeatured && !hideStarBadge"
          class="featured-badge"
          aria-label="Bestseller"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </span>
      </figure>

      <div class="body">
        <header class="head">
          <p class="code">{{ code }}</p>
          <h3 class="name">{{ name }}</h3>
        </header>

        <ul class="specs" :aria-label="`${name} Eckdaten`">
          <li v-for="spec in specs" :key="spec.kind" class="spec">
            <component
              :is="iconFor(spec.kind)"
              class="spec-icon"
              :size="16"
              :stroke-width="1.75"
              aria-hidden="true"
            />
            <span class="spec-value">{{ spec.value }}</span>
          </li>
        </ul>

        <footer class="foot">
          <div class="price-stack">
            <span v-if="priceHint" class="price">{{ priceHint }}</span>
            <span
              v-else
              class="price price-placeholder"
              aria-hidden="true"
            ></span>
            <span v-if="priceCaveat" class="price-caveat">{{ priceCaveat }}</span>
          </div>
          <span class="cta" aria-hidden="true">
            <ArrowUpRight :size="18" :stroke-width="1.75" />
          </span>
        </footer>
      </div>
    </a>
  </article>
</template>

<style scoped>
.card {
  /* The card has no card chrome — no border, no shadow, no background.
     The photograph is the surface; type and spec rows sit on the page
     background. This is the old-design's biggest sin reversed: their cards
     were boxes-in-boxes-in-buttons. Ours: a photograph and a caption. */
  background: transparent;
  min-width: 0;
}

.link {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  text-decoration: none;
  color: inherit;
  /* Tap the whole card on touch; on desktop the arrow CTA is the visible
     affordance. */
}

.link:focus-visible {
  outline: none;
}

.link:focus-visible .media {
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 28%, transparent);
}

.media {
  position: relative;
  margin: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--clr-surface-secondary);
}

.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 600ms cubic-bezier(0.2, 0.6, 0.2, 1);
  will-change: transform;
}

.featured-badge {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--clr-accent-primary);
  color: var(--clr-pure-white);
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.2);
  z-index: 1;
  pointer-events: none;
}

.link:hover .media img,
.link:focus-visible .media img {
  transform: scale(1.03);
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  /* No padding — the card is "unboxed". The image and the caption share the
     same content column; only the arrow CTA sits at the trailing edge. */
}

.head {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-0);
}

.code {
  margin: 0;
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--clr-content-tertiary);
  line-height: 1.2;
}

.name {
  margin: 0;
  font-size: var(--fs-h5);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--ls-heading);
  line-height: var(--lh-heading);
  color: var(--clr-content-primary);
}

.specs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  /* Hairline separator via column gap + ::after pseudo on each li.
     Visual: 16px gap, 1px rule centred in the gap. */
  gap: var(--spacing-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.spec {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
  line-height: 1;
  position: relative;
}

/* Hairline divider between spec rows — sits in the gap between li elements.
   Skips the last li. Using ::after rather than border-right so it doesn't
   show when the row wraps. */
.spec + .spec::before {
  content: "";
  display: inline-block;
  width: 1px;
  height: 0.85em;
  margin-inline-end: var(--spacing-1);
  background: var(--clr-border-tertiary);
  /* Pull back by the column gap so the rule sits centred between specs. */
  margin-inline-start: calc(var(--spacing-2) * -1 - 1px + var(--spacing-1));
}

.spec-icon {
  color: var(--clr-content-tertiary);
  flex-shrink: 0;
}

.spec-value {
  font-weight: var(--font-weight-regular);
  font-variant-numeric: tabular-nums;
}

.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  margin-top: var(--spacing-1);
}

.price {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-tertiary);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.price-placeholder {
  /* Holds the row height when no price — keeps the arrow CTA visually
     aligned across mixed grids without flex reflow. */
  min-height: 1em;
}

.price-stack {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.price-caveat {
  font-size: var(--fs-body-xs, 12px);
  color: var(--clr-content-quaternary);
  line-height: 1.2;
}

.cta {
  display: inline-grid;
  place-items: center;
  width: var(--control-height-sm);
  height: var(--control-height-sm);
  border-radius: var(--radius-full);
  background: var(--clr-surface-secondary);
  color: var(--clr-content-primary);
  /* Inner radius nested correctly: card image uses radius-lg, this circle
     is full — they don't compete because the circle sits outside the image
     block. */
  transition:
    background 180ms ease,
    color 180ms ease,
    transform 180ms cubic-bezier(0.2, 0.6, 0.2, 1);
}

.link:hover .cta,
.link:focus-visible .cta {
  /* Single accent application per card: primary accent on the larger-feeling
     hover state (the whole card lifts), not on the static chrome. This is
     the one place the accent earns its place in the card. */
  background: var(--clr-accent-primary);
  color: var(--clr-pure-white);
  transform: translate(2px, -2px);
}

@media (prefers-reduced-motion: reduce) {
  .media img,
  .cta {
    transition: none;
  }
  .link:hover .media img,
  .link:focus-visible .media img {
    transform: none;
  }
  .link:hover .cta,
  .link:focus-visible .cta {
    transform: none;
  }
}

/* Mobile: tighten the body gap a touch — the spec row and price are reading
   tight on narrow viewports otherwise. */
@media (--mobile) {
  .link {
    gap: var(--spacing-2);
  }
  .name {
    font-size: var(--fs-h6);
  }
}
</style>
