<script setup lang="ts"></script>

<template>
  <div class="proof">
    <span>Geprüfte Qualität · Zertifizierte Sicherheit</span>
    <div class="badges" aria-label="Qualitätssiegel">
      <svg class="badge" aria-hidden="true">
        <use href="#badge-iso" />
      </svg>
      <svg class="badge" aria-hidden="true">
        <use href="#badge-bdf" />
      </svg>
      <svg class="badge" aria-hidden="true">
        <use href="#badge-gdf" />
      </svg>
      <svg class="badge" aria-hidden="true">
        <use href="#badge-qdf" />
      </svg>
      <svg class="badge" aria-hidden="true">
        <use href="#badge-gdf-shield" />
      </svg>
      <svg class="badge" aria-hidden="true">
        <use href="#badge-ral" />
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
  height: 36px;
  width: auto;
  aspect-ratio: var(--badge-aspect, auto);
  color: inherit;
  fill: currentColor;
}
.badge :where(use, path) {
  fill: currentColor;
}

/* per-symbol aspect ratios so the SVG reserves the right horizontal slot */
.badge:nth-child(1) {
  aspect-ratio: 34.7 / 31.7;
} /* iso       */
.badge:nth-child(2) {
  aspect-ratio: 29.4 / 31.7;
} /* bdf       */
.badge:nth-child(3) {
  aspect-ratio: 43.9 / 31.7;
} /* gdf       */
.badge:nth-child(4) {
  aspect-ratio: 29.1 / 31.7;
} /* qdf       */
.badge:nth-child(5) {
  aspect-ratio: 23.9 / 31.7;
} /* gdf-shield*/
.badge:nth-child(6) {
  aspect-ratio: 100 / 70;
} /* ral       */
</style>
