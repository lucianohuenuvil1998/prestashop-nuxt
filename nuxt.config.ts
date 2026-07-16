// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt'],

  imports: {
    dirs: ['composables/**'],
  },

  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  runtimeConfig: {
    prestashop: {
      baseUrl: '',   // NUXT_PRESTASHOP_BASE_URL
      apiKey: '',    // NUXT_PRESTASHOP_API_KEY
    },
    headlessApi: {
      url: '',       // NUXT_HEADLESS_API_URL
      jwtSecret: '', // NUXT_HEADLESS_JWT_SECRET
    },
  },
})