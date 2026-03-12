<script setup lang="ts">
type AnimatedTextTag = keyof HTMLElementTagNameMap

const props = withDefaults(
  defineProps<{
    text?: string
    as?: AnimatedTextTag
    class?: unknown
    durationMs?: number
  }>(),
  {
    as: 'span',
    durationMs: 2200
  }
)

const durationSeconds = computed(() => props.durationMs / 1000)
</script>

<template>
  <Motion
    :as="props.as"
    :class="['animated-gradient-text', props.class]"
    :initial="{
      backgroundPosition: '0% 50%'
    }"
    :animate="{
      backgroundPosition: ['0% 50%', '100% 50%']
    }"
    :transition="{
      duration: durationSeconds,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'linear'
    }"
  >
    <slot>{{ props.text }}</slot>
  </Motion>
</template>

<style scoped>
.animated-gradient-text {
  background-image: linear-gradient(
    90deg,
    hsl(172 66% 50%),
    hsl(27 96% 61%),
    hsl(210 95% 62%),
    hsl(172 66% 50%)
  );
  background-size: 300% 100%;
  background-position: 0% 50%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  will-change: background-position;
}
</style>
