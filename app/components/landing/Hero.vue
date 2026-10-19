<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'
import { ref, onMounted, onUnmounted } from 'vue'
import VanillaTilt from 'vanilla-tilt'

const { global } = useAppConfig()

const props = defineProps<{
  page: IndexCollectionItem
}>()

const heroTitle = computed(
  () =>
    (props.page as any).heroTitle as
    | undefined
    | {
      prefix?: string
      name?: string
      suffix?: string
    }
)

const titlePrefix = computed(() => heroTitle.value?.prefix ?? 'Hey, I\'m')
const titleName = computed(() => heroTitle.value?.name ?? 'Bruce')
const titleSuffix = computed(
  () => heroTitle.value?.suffix ?? '- Software Engineer'
)

const tiltRef = ref<HTMLElement | null>(null)

onUnmounted(() => {
  (tiltRef.value as any)?.vanillaTilt?.destroy()
})

onMounted(() => {
  VanillaTilt.init((tiltRef.value as any), {
    max: 60, // max tilt degrees
    speed: 400, // transition speed
    perspective: 400,
    // react to phone tilt as well
    gyroscope: true,
    gyroscopeMinAngleX: -45,
    gyroscopeMaxAngleX: 45,
    gyroscopeMinAngleY: -45,
    gyroscopeMaxAngleY: 45
  })
})
</script>

<template>
  <UPageHero
    :ui="{
      headline: 'flex items-center justify-center',
      title: 'text-shadow-md max-w-lg mx-auto',
      links: 'mt-4 flex-col justify-center items-center'
    }"
  >
    <template #headline>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        <div
          ref="tiltRef"
          class="tilt-wrapper mb-7"
        >
          <img
            src="/ProfilePic.png"
            :alt="global.picture?.alt!"
            class="w-full max-w-[170px] object-cover animated-glow"
          >
        </div>
      </Motion>
    </template>

    <template #title>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        {{ titlePrefix }} {{ titleName }}
        <!-- <AnimatedText
          as="span"
          class="font-extrabold"
        > -->
        <!-- </AnimatedText> -->
        {{ ' ' + titleSuffix }}
      </Motion>
    </template>

    <template #description>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.3
        }"
      >
        {{ page.description }}
      </Motion>
    </template>

    <template #links>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.5
        }"
      >
        <div
          v-if="page.hero.links"
          class="flex items-center gap-2"
        >
          <UButton v-bind="page.hero.links[0]" />
          <UButton
            color="success"
            variant="ghost"
            class="gap-2"
            label="Based in Melbourne"
          >
            <template #leading>
              <span class="relative flex size-2">
                <span
                  class="absolute inline-flex size-full rounded-full opacity-75 bg-success animate-ping"
                />
                <span
                  class="relative inline-flex size-2 scale-90 rounded-full bg-success"
                />
              </span>
            </template>
          </UButton>
        </div>
      </Motion>

      <div class="gap-x-4 inline-flex mt-4">
        <Motion
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.6
          }"
        >
          <UButton
            icon="i-simple-icons-linkedin"
            to="https://linkedin.com/in/brucewonghh"
            target="_blank"
            aria-label="LinkedIn"
            size="md"
            color="neutral"
            variant="ghost"
          />
        </Motion>
        <Motion
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.7
          }"
        >
          <UButton
            icon="i-simple-icons-github"
            to="https://github.com/BruceHuangQQ"
            target="_blank"
            aria-label="GitHub"
            size="md"
            color="neutral"
            variant="ghost"
          />
        </Motion>
        <Motion
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.8
          }"
        >
          <UButton
            icon="i-simple-icons-devpost"
            to="https://devpost.com/BruceHuangQQ"
            target="_blank"
            aria-label="Devpost"
            size="md"
            color="neutral"
            variant="ghost"
          />
        </Motion>
      </div>

      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.9
        }"
        class="mt-6"
      >
        <NuxtLink
          to="/sim"
          class="group inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-default bg-muted/60 backdrop-blur-sm px-4 py-1.5 text-sm text-toned hover:border-primary/50 transition-colors"
        >
          <UBadge
            label="Latest"
            size="sm"
            variant="subtle"
          />
          <span>Investment Sim: an Excel model turned into a web game.</span>
          <span class="inline-flex items-center gap-0.5 font-medium text-primary">
            Try it
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </NuxtLink>
      </Motion>
    </template>
  </UPageHero>
</template>

<style scoped>
.animated-glow {
  filter: drop-shadow(0 0 4px hsl(0, 0%, 60%))
          drop-shadow(0 0 8px hsl(0, 0%, 60%))
}
/* .animated-glow {
  animation: glowCycle 3s linear infinite alternate;
}
@keyframes glowCycle {
  0%, 100% {
    filter: drop-shadow(0 0 4px hsl(0, 0%, 60%))
            drop-shadow(0 0 8px hsl(0, 0%, 60%));
  }
} */
/* @keyframes glowCycle {
  0% {
    filter: drop-shadow(0 0 4px hsl(172, 66%, 50%))
            drop-shadow(0 0 8px hsl(172, 66%, 50%));
  }
  33% {
    filter: drop-shadow(0 0 4px hsl(27, 96%, 61%))
            drop-shadow(0 0 8px hsl(27, 96%, 61%));
  }
  66% {
    filter: drop-shadow(0 0 4px hsl(210, 95%, 62%))
            drop-shadow(0 0 8px hsl(210, 95%, 62%));
  }
  100% {
    filter: drop-shadow(0 0 4px hsl(172, 66%, 50%))
            drop-shadow(0 0 8px hsl(172, 66%, 50%));
  }
} */
</style>
