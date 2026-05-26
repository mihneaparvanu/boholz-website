<script setup lang="ts">
import Button from "@/ui/primitives/Button.vue";
</script>

<template>
  <div class="catalog-card">
    <h3>Jetzt Katalog anfordern!</h3>
    <Button variant="secondary">Bestellen Katalog</Button>
    <div class="img-wrapper"><img src="" alt="" /></div>
  </div>
</template>

<style scoped>
.catalog-card {
  position: relative;
  width: 100%;
  border-radius: var(--radius-md);

  h3 {
    font-size: var(--fs-h5);
  }

  .img-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
