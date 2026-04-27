<script setup lang="ts">
const colorMode = useColorMode()
const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl
const siteName = runtimeConfig.public.siteName
const defaultTitle = 'Software Engineer in Melbourne'
const defaultDescription = 'software engineer based in Melbourne, building full-stack applications and shipping products.'
const fallbackOgImage = `${siteUrl}/favicon.ico`

const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: defaultTitle,
  description: defaultDescription,
  applicationName: siteName,
  author: 'Bruce Huang',
  ogSiteName: siteName,
  ogType: 'website',
  ogLocale: 'en_AU',
  ogTitle: defaultTitle,
  ogDescription: defaultDescription,
  ogImage: fallbackOgImage,
  twitterCard: 'summary_large_image',
  twitterTitle: defaultTitle,
  twitterDescription: defaultDescription,
  twitterImage: fallbackOgImage
})

useHead({
  link: [
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: siteName,
      href: `${siteUrl}/sitemap.xml`
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      key: 'ld-website',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': siteName,
        'url': siteUrl,
        'inLanguage': 'en-AU'
      })
    },
    {
      type: 'application/ld+json',
      key: 'ld-person',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Bruce Huang',
        'url': siteUrl,
        'jobTitle': 'Software Engineer',
        'sameAs': [
          'https://linkedin.com/in/brucewonghh',
          'https://github.com/BruceHuangQQ',
          'https://devpost.com/BruceHuangQQ'
        ]
      })
    }
  ]
})

const [{ data: navigation }, { data: files }] = await Promise.all([
  useAsyncData('navigation', () => {
    return Promise.all([])
  }, {
    transform: data => data.flat()
  }),
  useLazyAsyncData('search', () => {
    return Promise.all([])
  }, {
    server: false,
    transform: data => data.flat()
  })
])
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UMain class="relative">
        <NuxtPage />
      </UMain>
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        shortcut="meta_k"
        :links="navLinks"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
