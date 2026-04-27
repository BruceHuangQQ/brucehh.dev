// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt'
  ],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      titleTemplate: '%s | Bruce Huang',
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'robots', content: 'index, follow' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.brucehh.dev',
    name: 'Bruce Huang - Software Engineer'
  },

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral', 'navy']
    }
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.brucehh.dev',
      siteName: 'Bruce Huang - Software Engineer'
    }
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    prerender: {
      routes: [
        '/',
        '/projects',
        '/memory'
      ],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  robots: {
    credits: false,
    groups: [
      {
        userAgent: '*',
        allow: '/'
      }
    ],
    sitemap: ['/sitemap.xml']
  },

  sitemap: {
    urls: ['/', '/projects']
  }
})
