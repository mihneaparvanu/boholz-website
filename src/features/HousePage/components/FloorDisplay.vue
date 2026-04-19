<script setup lang="ts">
import type { HouseFloor } from "../../../types/models";
import { getMediaURL } from "../../../utils/media";

const props = defineProps<{
  floor: HouseFloor;
}>();
</script>

<template>
  <div class="floor-display">
    <h3>{{ floor.title }}</h3>
    <div class="image-wrapper">
      <img :src="getMediaURL(floor.media.path)" :alt="floor.media.alt" />
    </div>
  </div>
</template>

<style scoped>
.floor-display {
  display: flex;
  padding-block: var(--spacing-5);
  flex-direction: column;
  align-items: start;
  gap: var(--spacing-2);

  h3 {
    font-size: var(--fs-h5);
    font-weight: 500;
  }

  .image-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;

    img {
      width: 100%;
      height: auto;
      object-fit: cover;

      @media (--tablet) {
        width: 80%;
      }
      @media (--from-desktop) {
        width: 60%;
      }
    }
  }
}
</style>
