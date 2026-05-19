<script setup lang="ts"></script>

<template>
  <div class="proof">
    <span>Geprüfte Qualität · Zertifizierte Sicherheit</span>
    <div class="badges" aria-label="Qualitätssiegel">
      <svg class="badge" aria-hidden="true">
        <use href="#badge-iso-color" />
      </svg>
      <svg class="badge" aria-hidden="true">
        <use href="#badge-bdf-color" />
      </svg>
      <svg class="badge" aria-hidden="true">
        <use href="#badge-gdf-color" />
      </svg>
      <svg class="badge" aria-hidden="true">
        <use href="#badge-qdf-color" />
      </svg>
      <svg class="badge" aria-hidden="true">
        <use href="#badge-ral-color" />
      </svg>
      <svg class="badge" aria-hidden="true">
        <use href="#badge-holz-klima-color" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.proof {
  /* Override per usage by setting `--proof-color` on any ancestor. */
  color: var(--proof-color, var(--clr-content-primary));
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: var(--spacing-2);

  span {
    text-transform: uppercase;
    font-size: var(--fs-body-sm);

    font-weight: var(--font-weight-medium);
    color: inherit;
    opacity: 0.9;
  }
}

.badges {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  color: inherit;
  flex-wrap: wrap;
}

.badge {
  height: var(--fs-h3);
  width: auto;
  aspect-ratio: var(--badge-aspect, auto);
}

/* per-symbol aspect ratios so the SVG reserves the right horizontal slot.
   Values mirror the viewBox of each <symbol> in qualityBadgesColor.svg. */
.badge:nth-child(1) {
  aspect-ratio: 560 / 512;
} /* iso        */
.badge:nth-child(2) {
  aspect-ratio: 474 / 512;
} /* bdf        */
.badge:nth-child(3) {
  aspect-ratio: 709 / 512;
} /* gdf        */
.badge:nth-child(4) {
  aspect-ratio: 469 / 512;
} /* qdf        */
.badge:nth-child(5) {
  aspect-ratio: 256 / 120;
} /* ral — cropped to RAL Gütezeichen only (no Holzhausbau frame) */
.badge:nth-child(6) {
  aspect-ratio: 1 / 1;
  height: var(--fs-h2);
} /* holz-klima — Holz Rettet Klima 2030, oversized per client request */

@media (--below-desktop) {
  /* Eyebrow drops to tertiary tone — the proof line is supporting copy,
     not headline beat. */
  .proof span {
    color: var(--clr-content-tertiary);
    opacity: 1;
  }

  /* Six badges across a 360–430px viewport. Shrink the badge floor to
     36–40px and tighten the row gap so they hold one line. The oversize
     holz-klima badge scales down proportionally so it stays a hair larger
     than the others without dominating. */
  .badges {
    flex-wrap: nowrap;
    justify-content: space-between;
    gap: var(--spacing-4);
  }

  .badge {
    height: var(--fs-h4);
    flex-shrink: 1;
    min-width: 0;
  }
}
</style>
