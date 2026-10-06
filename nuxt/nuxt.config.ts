// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt'
  ],

  css: [
    '~/assets/scss/main.scss'
  ],

  app: {
    head: {
      title: 'Susi Air - Pilot Crew App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'Susi Air Pilot Mobile Application for Schedule, Flight Hours, and Regulatory Limits tracking.' },
        { name: 'theme-color', content: '#0E2138' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap' },
        { rel: 'icon', type: 'image/png', href: '/susiair-logo.png' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:3001'
    }
  }
})
