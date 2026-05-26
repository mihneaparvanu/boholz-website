<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string;
  }>(),
  { size: 30 },
);
</script>

<template>
  <svg
    :width="size"
    :height="(Number(size) / 30) * 14"
    viewBox="0 0 30 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    class="privacy-btn"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M22.2 0H7C3.1 0 0 3.1 0 7C0 10.9 3.1 14 7 14H22.2C26.1 14 29.2 10.9 29.2 7C29.2 3.1 26 0 22.2 0ZM1.2 7C1.2 3.8 3.8 1.2 7 1.2H16.9L13.8 12.8H7C3.8 12.8 1.2 10.2 1.2 7Z"
      fill="currentColor"
    />
    <path
      d="M24.2 4.0001C24.4 4.2001 24.4 4.6001 24.2 4.8001L22.1 7.0001L24.3 9.2001C24.5 9.4001 24.5 9.8001 24.3 10.0001C24.1 10.2001 23.7 10.2001 23.5 10.0001L21.3 7.8001L19.1 10.0001C18.9 10.2001 18.5 10.2001 18.3 10.0001C18.1 9.8001 18.1 9.4001 18.3 9.2001L20.4 7.0001L18.2 4.8001C18 4.6001 18 4.2001 18.2 4.0001C18.4 3.8001 18.8 3.8001 19 4.0001L21.2 6.2001L23.4 4.0001C23.6 3.8001 24 3.8001 24.2 4.0001Z"
      fill="var(--clr-surface-primary, #fff)"
    />
    <path
      d="M12.3 4.09995C12.5 4.29995 12.6 4.69995 12.4 4.89995L8.19998 9.79995C8.09998 9.89995 7.99998 9.99995 7.89998 9.99995C7.69998 10.1 7.39998 10.1 7.19998 9.89995L4.99998 7.69995C4.79998 7.49995 4.79998 7.09995 4.99998 6.89995C5.19998 6.69995 5.59998 6.69995 5.79998 6.89995L7.59998 8.59995L11.4 4.09995C11.6 3.89995 12 3.89995 12.3 4.09995Z"
      fill="currentColor"
    />
  </svg>
</template>

<style scoped>
.privacy-btn {
  display: inline-block;
  color: var(--clr-accent-primary);
  vertical-align: middle;
}
</style>
