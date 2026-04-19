<template>
  <div class="image-placeholder">
    <span class="placeholder-icon">?</span>
  </div>
</template>

<style scoped>
.image-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--clr-surface-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: var(--fs-h2);
  font-weight: 500;
  color: var(--clr-content-quaternary);
}
</style>
