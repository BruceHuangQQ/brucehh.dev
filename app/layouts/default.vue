<script setup lang="ts"></script>

<template>
  <div
    class="min-h-screen"
    style="
      background-image: radial-gradient(
        circle,
        rgba(120, 120, 120, 0.4) 1px,
        transparent 1px
      );
      background-size: 24px 24px;
    "
  >
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
