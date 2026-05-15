<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
</script>

<template>
  <div class="popup">
    <div class="text">
      <h4 class="title">Cookies &amp; Privatsphäre</h4>
      <p class="disclaimer">
        Wir verwenden Cookies, um unsere Website zu betreiben, Ihr Erlebnis zu
        verbessern und anonyme Statistiken zu erfassen. Sie können selbst
        entscheiden, welche Kategorien Sie zulassen möchten. Weitere
        Informationen finden Sie in unserer
        <a href="/datenschutz">Datenschutzerklärung</a>.
      </p>
    </div>

    <div class="btns">
      <Button size="sm" variant="primary">Alle akzeptieren</Button>
      <Button size="sm" variant="primary">Alle ablehnen</Button>
      <Button size="sm" variant="ghost">Einstellungen</Button>
    </div>
  </div>
</template>

<style scoped>
.popup {
  position: fixed;
  bottom: 30px;
  inset-inline: var(--spacing-3);
  bottom: var(--spacing-3);
  max-width: 40%;
  margin-inline: auto;
  padding: var(--spacing-3);
  background: var(--clr-surface-primary);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 10;
}

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

.btns {
  display: flex;
  gap: var(--spacing-3);
}
</style>
