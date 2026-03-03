<script setup lang="ts">
import type { Photo } from '../../photos/data'
import { blurhashToGradientCssObject } from '@unpic/placeholder'

defineProps<{
  photos: Photo[]
}>()
</script>

<template>
  <div class="photos grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
    <div
      v-for="(photo, idx) in photos"
      :key="photo.name"
    >
      <!-- alt omitted in grid; shown in lightbox caption when fullscreen -->
      <img
        :src="photo.url"
        alt=""
        :data-caption="photo.text || photo.name"
        :data-photo-index="idx"
        :style="
          photo.blurhash
            ? (blurhashToGradientCssObject(photo.blurhash) as any)
            : ''
        "
        loading="lazy"
        class="w-full object-cover aspect-square"
      >
    </div>
  </div>
</template>
