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
  height: 56px;
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
  height: 88px;
} /* holz-klima — Holz Rettet Klima 2030, oversized per client request */
</style>
