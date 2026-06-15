<script setup lang="ts"></script>

<template>
  <div class="text">
    <h4 class="title">Cookies &amp; Privatsphäre</h4>
    <p class="disclaimer">
      Wir verwenden Cookies, um unsere Website zu betreiben, Ihr Erlebnis zu
      verbessern und anonyme Statistiken zu erfassen. Sie können selbst
      entscheiden, welche Kategorien Sie zulassen möchten. Weitere Informationen
      finden Sie in unserer
      <a href="/datenschutz">Datenschutzerklärung</a>.
    </p>
  </div>
</template>

<style scoped>
.text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-0);
  margin-block-end: var(--spacing-4);

  .title {
    font-family: var(--font-secondary);
    font-style: italic;
    font-size: var(--fs-h5);
    line-height: var(--lh-body);
  }

  .disclaimer {
    color: var(--clr-content-tertiary);
  }
}
</style>
