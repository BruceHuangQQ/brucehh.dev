<script setup lang="ts">
import DotBackground from '~/components/DotBackground.vue'
</script>

<template>
  <div class="min-h-screen">
    <DotBackground />
    <div
      class="min-h-screen w-full bg-default sm:mx-auto sm:max-w-[var(--ui-container)] sm:border-x sm:border-default"
    >
      <UContainer class="pt-10">
        <AppHeader :links="navLinks" />
        <slot />
        <AppFooter />
      </UContainer>
    </div>
  </div>
</template>
