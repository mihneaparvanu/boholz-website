<template>
  <svg
    class="flag"
    width="40"
    height="24"
    viewBox="0 0 5 3"
    role="img"
    aria-label="Deutschland"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="5" height="1" fill="#000" />
    <rect width="5" height="1" y="1" fill="#DD0000" />
    <rect width="5" height="1" y="2" fill="#FFCE00" />
  </svg>
</template>

<style scoped>
.flag {
  display: inline-block;
  aspect-ratio: 5 / 3;
  width: auto;
  border: 1px solid color-mix(in srgb, var(--clr-content-primary) 10%, transparent);
  border-radius: 1px;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
