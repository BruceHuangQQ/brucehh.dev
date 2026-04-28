<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl
const canonicalUrl = `${siteUrl}${route.path}`
const seoTitle = page.value?.seo?.title || page.value?.title || 'Bruce Huang - Software Engineer'
const seoDescription = page.value?.seo?.description || page.value?.description || 'Portfolio of Bruce Huang, a software engineer based in Melbourne.'
const seoImage = typeof page.value?.seo?.image === 'string' ? page.value.seo.image : '/favicon.ico'
const absoluteSeoImage = seoImage.startsWith('http') ? seoImage : `${siteUrl}${seoImage}`

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  robots: 'index, follow',
  ogType: 'profile',
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: canonicalUrl,
  ogImage: absoluteSeoImage,
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: absoluteSeoImage
})

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      key: 'ld-home-profile',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        'mainEntity': {
          '@type': 'Person',
          'name': 'Bruce Huang',
          'jobTitle': 'Software Engineer',
          'url': siteUrl
        }
      })
    }
  ]
})

const pageContent = computed(() => page.value?.miscellaneous?.content)
</script>

<template>
  <UPage v-if="page">
    <LandingHero :page />
    <UPageSection
      :ui="{
        container: '!pt-0 -mt-10 lg:grid lg:grid-cols-2 lg:gap-8'
      }"
    >
      <LandingAbout :page />
      <LandingWorkExperience :page />
    </UPageSection>
    <UPageSection
      v-if="pageContent"
      id="contact-me"
      :ui="{
        container: '!pt-1 !pb-1 -mt-20'
      }"
    >
      <MDC
        :value="pageContent"
      />
    </UPageSection>
  </UPage>
</template>
